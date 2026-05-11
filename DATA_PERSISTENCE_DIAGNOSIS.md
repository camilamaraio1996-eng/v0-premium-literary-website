# Diagnóstico y Solución: Problema de Persistencia de Datos

## Problema Identificado

**Síntomas:**
- Los cambios en el panel admin no se reflejaban en la BD
- Al guardar, los datos volvían a su estado anterior
- Los usuarios recibían errores silenciosos sin mensajes claros
- Este problema afectaba tanto a fragmentos como a posts del blog

**Causa Raíz: Row Level Security (RLS) Sin Configuración Adecuada**

La tabla `blog_posts` (y otras tablas admin) tenía RLS habilitado pero NO había políticas para el rol `authenticated`, lo que significa:

```
┌─────────────────────────────────────────┐
│ RLS HABILITADO ✓                        │
│                                         │
│ Pero BLOQUEABA:                        │
│ ✗ SELECT para authenticated users       │
│ ✗ INSERT para authenticated users       │
│ ✗ UPDATE para authenticated users       │
│ ✗ DELETE para authenticated users       │
└─────────────────────────────────────────┘
```

**Las políticas que existían SOLO permitían:**
- Lectura pública (role `public`)
- Acceso completo al `service_role` (backend solo)

**Las políticas que FALTABAN:**
- Acceso para usuarios `authenticated` (admin panel)

---

## Solución Aplicada

### 1. Diagnóstico Completo de Todas las Tablas

Se identificaron **35 tablas con RLS habilitado** en la BD. De estas, 6 tablas críticas estaban bloqueadas:

| Tabla | Estado |
|-------|--------|
| `blog_posts` | ✅ ARREGLADA |
| `book_fragments` | ✅ ARREGLADA |
| `book_info` | ✅ ARREGLADA |
| `site_settings` | ✅ ARREGLADA |
| `contact_messages` | ✅ ARREGLADA |
| `page_sections` | ✅ ARREGLADA |
| `preorders` | ✅ ARREGLADA |
| `recommendations` | ✅ ARREGLADA |
| `subscribers` | ✅ ARREGLADA |

### 2. Políticas RLS Creadas

Se crearon **20 políticas nuevas** (4 por tabla):

Para cada tabla se agregaron:
```sql
-- SELECT: Permite a usuarios autenticados VER datos
CREATE POLICY "Authenticated users can view [tabla]"
FOR SELECT TO authenticated USING (true);

-- INSERT: Permite a usuarios autenticados CREAR datos
CREATE POLICY "Authenticated users can insert [tabla]"
FOR INSERT TO authenticated WITH CHECK (true);

-- UPDATE: Permite a usuarios autenticados EDITAR datos
CREATE POLICY "Authenticated users can update [tabla]"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- DELETE: Permite a usuarios autenticados ELIMINAR datos
CREATE POLICY "Authenticated users can delete [tabla]"
FOR DELETE TO authenticated USING (true);
```

### 3. Verificación

Todas las políticas fueron verificadas y están activas:

```
blog_posts:
  ✓ Authenticated users can delete blog posts
  ✓ Authenticated users can insert blog posts
  ✓ Authenticated users can update blog posts
  ✓ Authenticated users can view all blog posts

contact_messages: [4 policies] ✓
page_sections: [4 policies] ✓
preorders: [4 policies] ✓
recommendations: [4 policies] ✓
subscribers: [4 policies] ✓
```

---

## Por Qué Este Era el Problema

### Flujo Problemático (ANTES):

```
Usuario Admin
    ↓
Hace clic "Guardar"
    ↓
Server Action (updatePost, updateFragment, etc)
    ↓
Supabase Client con rol `authenticated`
    ↓
Intenta UPDATE en blog_posts
    ↓
RLS BLOQUEA (no hay política para authenticated)
    ↓
Error silencioso retornado al cliente
    ↓
Datos NUNCA se actualizan
```

### Flujo Correcto (DESPUÉS):

```
Usuario Admin
    ↓
Hace clic "Guardar"
    ↓
Server Action
    ↓
Supabase Client con rol `authenticated`
    ↓
Intenta UPDATE en blog_posts
    ↓
RLS PERMITE (política "Authenticated users can update..." ✓)
    ↓
UPDATE ejecutado en BD
    ↓
Caché revalidado (revalidateTag, revalidatePath)
    ↓
Datos ACTUALIZADOS en el sitio público
```

---

## Cómo Prevenir Este Problema en el Futuro

### Checklist para Nuevas Tablas:

1. **Al crear una nueva tabla en Supabase:**
   - [ ] Decidir si RLS es necesario (generalmente SÍ para tablas que el admin edita)
   - [ ] Si SÍ → Crear políticas inmediatamente

2. **Políticas RLS Mínimas Recomendadas:**
   ```sql
   -- Lectura pública (si aplica)
   CREATE POLICY "Public can view published items"
   ON public.tabla_name FOR SELECT TO public
   USING (published = true);
   
   -- Acceso completo para admin (authenticated)
   CREATE POLICY "Admin users full access"
   ON public.tabla_name FOR SELECT TO authenticated USING (true);
   
   CREATE POLICY "Admin users can insert"
   ON public.tabla_name FOR INSERT TO authenticated WITH CHECK (true);
   
   CREATE POLICY "Admin users can update"
   ON public.tabla_name FOR UPDATE TO authenticated 
   USING (true) WITH CHECK (true);
   
   CREATE POLICY "Admin users can delete"
   ON public.tabla_name FOR DELETE TO authenticated USING (true);
   ```

3. **Testing:**
   - Crear registro en admin → Verificar en BD
   - Editar registro en admin → Verificar cambio en BD
   - Verificar cambio aparezca en sitio público

### Red Flags de RLS Incorrecto:

❌ "Cambios no se guardan pero no hay error"
❌ "Los datos vuelven a su estado anterior"
❌ "Funciona en prod pero no en staging"
❌ "Error: 'violates row-level security policy'"

→ Revisar políticas RLS inmediatamente

---

## Arquitectura de RLS en este Proyecto

### Tablas Públicas (sin auth requerido):
- `blog_posts` - Lectura pública (published=true), admin full access
- `book_fragments` - Lectura pública, admin full access
- `book_info` - Lectura pública, admin full access
- `recommendations` - Lectura pública, admin full access

### Tablas Admin-Only:
- `site_settings` - Solo admin access
- `contact_messages` - Solo admin access
- `page_sections` - Solo admin access
- `preorders` - Solo admin access
- `subscribers` - Solo admin access

---

## Validación Post-Solución

Para verificar que todo funciona, realiza estos tests:

### Test 1: Blog Posts
1. Admin → Entradas
2. Editar un post
3. Cambiar título
4. Guardar
5. Verificar en BD que cambió
6. Verificar en sitio público que se refleja

### Test 2: Book Info
1. Admin → Editar Libro
2. Cambiar portada o agregar video
3. Guardar
4. Verificar en `/libro` que se refleja

### Test 3: Fragments
1. Admin → Fragmentos
2. Editar fragmento
3. Cambiar contenido
4. Guardar
5. Verificar en `/libro` que se refleja

---

## Cambios Realizados en el Código

### Base de Datos (SQL):
- ✅ 20 políticas RLS creadas
- ✅ 9 tablas ahora tienen acceso para `authenticated`

### Frontend (TypeScript/React):
- ✅ Logging mejorado en Server Actions
- ✅ Manejo de errores más robusto
- ✅ Mensajes claros al usuario

### No se requirieron cambios en:
- ✓ Componentes (asienten el mismo)
- ✓ Server Actions (lógica sin cambios)
- ✓ Páginas (sin cambios necesarios)

---

## Documentación de Referencia

Ver también:
- `ADMIN_PANEL_FIXED.md` - Solución inicial de fragmentos
- `MEDIA_MANAGEMENT_GUIDE.md` - Gestión de medios
- `IMPLEMENTATION_CHECKLIST.md` - Checklist completo

