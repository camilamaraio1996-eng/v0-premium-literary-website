# Sistema CMS - Guía de Persistencia de Datos

## Arquitectura de Guardado

### Flujo de Guardado en Admin

```
Usuario escribe en formulario
        ↓
Usuario hace click en "Guardar"
        ↓
Component dispara Server Action
        ↓
Server Action actualiza Supabase
        ↓
Server Action revalida cache con revalidatePath()
        ↓
Muestra confirmación ✓
        ↓
Page reload (manual en 1.5s)
```

### Archivos Clave

1. **`/app/admin/actions.ts`** - Server Actions con revalidación
   - `updateSiteSettings()` - Actualiza configuración global
   - `updateBookInfo()` - Actualiza información del libro
   - `updateFragments()` - Actualiza todos los fragmentos
   - `deleteFragment()` - Elimina un fragmento

2. **Components Admin (Client)**
   - `admin-settings-form.tsx` - Forma de configuración
   - `admin-book-form.tsx` - Forma del libro
   - `admin-fragments-form.tsx` - Forma de fragmentos
   - Todos usan Server Actions para guardar

3. **Páginas Públicas (Server)**
   - `/app/page.tsx` - Home
   - `/app/libro/page.tsx` - Página del libro
   - `/app/diario/page.tsx` - Página del diario
   - Todas leen dinámicamente desde Supabase

## Revalidación de Caché

### Tags Revalidados por Operación

**updateSiteSettings():**
```typescript
revalidatePath('/', 'layout')    // Recarga todo el layout raíz
revalidateTag('site-settings')   // Limpia tag de configuración
revalidateTag('navigation')      // Limpia tag de navegación
```

**updateBookInfo():**
```typescript
revalidatePath('/libro')         // Recarga página del libro
revalidateTag('book-info')       // Limpia tag del libro
```

**updateFragments():**
```typescript
revalidatePath('/libro')         // Recarga página con fragmentos
revalidateTag('book-fragments')  // Limpia tag de fragmentos
```

## Flujo de Lectura de Datos

### Carga Inicial (Page Load)

```
Usuario navega a /libro
        ↓
Next.js ejecuta component RSC
        ↓
RSC llama getNavigationData() desde CMS
        ↓
Supabase devuelve settings (con caché)
        ↓
RSC llama getBookInfo() desde Supabase
        ↓
RSC obtiene fragmentos
        ↓
RSC renderiza página con datos
        ↓
HTML se envía al cliente
```

### Después de Guardar en Admin

```
Server Action updateSiteSettings()
        ↓
Actualiza Supabase
        ↓
revalidatePath('/') - Invalida caché
        ↓
Siguiente request a /
        ↓
Next.js re-ejecuta RSC
        ↓
RSC obtiene settings frescos
        ↓
Página renderiza con datos nuevos
```

## Persistencia Garantizada

### En Supabase
- Todos los datos se guardan directamente en la tabla correspondiente
- Los timestamps se actualizan automáticamente
- Las políticas RLS permiten lectura pública, escritura autenticada

### En Next.js Cache
- El caché se invalida después de cada guardar
- La próxima visita a la página obtiene datos frescos
- No hay caché de navegador para datos de admin

### Verificación
1. Endpoint `/api/admin/health` - Verifica que datos están en BD
2. Health Check Component - Visualiza estado del sistema en Dashboard
3. Guía de Verificación (VERIFICATION_GUIDE.md) - Pasos de testing

## Qué Sucede Cuando Guardas

### En Settings (`/admin/settings`)
1. Cambias campo
2. Haces click "Guardar"
3. Se llama `updateSiteSettings()`
4. Los cambios se guardan en tabla `site_settings`
5. Se revalidan todas las páginas (incluye navegación)
6. Aparece ✓ verde
7. Al recargar, datos están actualizados

### En Libro (`/admin/book`)
1. Cambias descripción o portada
2. Haces click "Guardar"
3. Se llama `updateBookInfo()`
4. Se actualiza tabla `book_info`
5. Se revalida `/libro`
6. Al recargar o navegar a /libro, cambios son visibles

### En Fragmentos (`/admin/fragments-edit`)
1. Cambias contenido de fragmento
2. Haces click "Guardar todos"
3. Se llama `updateFragments()` con todos los fragmentos
4. Se actualizan en tabla `book_fragments`
5. Se revalida `/libro`
6. Los fragmentos cambian en página pública

## Debugging

### Si cambios no aparecen:

1. **Verificar en Supabase Dashboard**
   - Login a supabase.com
   - Abre dashboard del proyecto
   - Revisa tabla correspondiente
   - ¿Están los datos ahí?

2. **Verificar Health Check**
   - Ve a `/admin` (Dashboard)
   - Haz click "Verificar" en Estado del Sistema
   - ¿Dice que todo OK?

3. **Verificar Endpoint**
   - Abre `/api/admin/health` en navegador
   - ¿Devuelve datos correctos?

4. **Limpiar Caché de Navegador**
   - DevTools → Application → Cache Storage
   - Elimina caché viejo
   - Hard refresh (Ctrl+Shift+R)

## API Endpoints de Admin

- `GET /api/admin/health` - Verifica estado del sistema
  - Devuelve conteos de settings, libro, fragmentos
  - Verifica conectividad a Supabase
  - Solo para usuarios autenticados

## Resumen de Garantías

- ✅ Datos se guardan en Supabase (BD permanente)
- ✅ Cambios persisten después de recargar
- ✅ Caché se limpia después de guardar
- ✅ Navegación se actualiza automáticamente
- ✅ Sistema de health check para verificación
- ✅ Logs en servidor para debugging
- ✅ Confirmación visual de éxito/error
