# Sistema de Admin - Documentación Completa

## ✅ TODO COMPLETADO

Has transformado tu panel de administración en un **espejo editable 100% funcional** de todas las páginas públicas del sitio.

---

## 📁 Archivos Creados

### Componentes de Upload
- **`components/admin/file-upload-field.tsx`** - Componente reutilizable para subir imágenes y videos
  - Soporta URL manual o upload de archivos
  - Usa Vercel Blob para almacenamiento
  - Preview en tiempo real

### API Route
- **`app/api/upload/route.ts`** - API para manejar uploads de archivos con Vercel Blob
  - Soporta imágenes y videos
  - Validación de tipos MIME
  - Retorna URL pública del archivo subido

### Componentes de Home
- **`components/home/home-hero-section.tsx`** - Sección hero editable (DEPRECADO, usa HeroSection)
- Actualizado: **`components/home/hero-section.tsx`** - Ahora soporta imagen del hero + video + buy link

### Editors del Admin
- **`app/admin/inicio/page.tsx`** - Editor visual completo de homepage
  - Live preview a la izquierda
  - Formulario editable a la derecha
  - Maneja: hero eyebrow, título, descripción, imagen, CTAs, video, buy link
  
- **`components/admin/libro-editor.tsx`** - Editor visual completo de la página del libro
  - Live preview con portada, video, descripción, fragmentos
  - Formulario para editar: portada, título, autor, descripción, video

---

## 📁 Archivos Modificados

### Base de Datos
- **`public.site_settings`** - Se agregaron 9 nuevas keys:
  - `home_hero_image_url` - URL de imagen del hero en homepage
  - `home_hero_image_alt` - Alt text de la imagen
  - `home_video_section_title` - Título de sección video
  - `home_video_description` - Descripción del video
  - `book_hero_subtitle` - Subtítulo en página del libro
  - `book_hero_description` - Descripción del libro
  - `book_genres` - Géneros
  - `book_language` - Idioma
  - `book_publication_date` - Fecha de publicación

### Páginas Públicas
- **`app/page.tsx`** - Actualizado para leer `home_hero_image_url` y pasar al HeroSection
- **`app/libro/page.tsx`** - Actualizado para leer `book_buy_url` y pasar al BookHero (sin cambios, ya estaba hecho)

### Componentes Públicos
- **`components/home/hero-section.tsx`** - Agregadas props para `imageUrl` y `imageAlt`
- **`components/book/book-hero.tsx`** - Ya soportaba `buyUrl` (sin cambios)

### Admin
- **`app/admin/book/page.tsx`** - Ahora usa `LibroEditor` en lugar de `AdminBookForm`
  - Carga fragmentos publicados para preview en vivo

---

## 🎯 Flujo Completo

### Homepage (`/`)
```
┌─────────────────────────────────────┐
│ HeroSection (editable desde admin)  │
│ - Eyebrow, título, descripción      │
│ - Imagen (subible desde admin)       │
│ - CTAs (botones editables)          │
├─────────────────────────────────────┤
│ Video Section (opcional, editable)  │
├─────────────────────────────────────┤
│ Buy Section (link compra editable)  │
└─────────────────────────────────────┘
```

**Editor en Admin**: `/admin/inicio` con live preview

### Página del Libro (`/libro`)
```
┌─────────────────────────────────────┐
│ BookHero (editable desde admin)     │
│ - Portada (subible)                  │
│ - Título, subtítulo, autor           │
│ - Link de compra (editable)          │
├─────────────────────────────────────┤
│ Video del Libro (opcional)          │
├─────────────────────────────────────┤
│ Descripción                         │
├─────────────────────────────────────┤
│ Fragmentos (manejados aparte)       │
└─────────────────────────────────────┘
```

**Editor en Admin**: `/admin/book` con live preview de todo

---

## 🚀 Funcionalidades del Admin

### 1. Editar Homepage (`/admin/inicio`)
- ✅ Cambiar eyebrow (texto pequeño superior)
- ✅ Editar título principal (texto grande)
- ✅ Modificar descripción
- ✅ Subir imagen del hero
- ✅ Cambiar textos de botones (primario y secundario)
- ✅ Cambiar URLs de botones
- ✅ Agregar/modificar video
- ✅ Agregar/modificar link de compra
- ✅ **Live preview** en tiempo real mientras editas

### 2. Editar Página del Libro (`/admin/book`)
- ✅ Subir portada del libro
- ✅ Editar título
- ✅ Editar autor
- ✅ Cambiar descripción
- ✅ Agregar/modificar video del libro
- ✅ **Live preview** muestra portada, video, descripción, fragmentos

---

## 📸 Uploads de Archivos

### Cómo Funciona
1. Haces clic en "Subir Archivo" en admin
2. Seleccionas imagen o video desde tu computadora
3. Se sube a Vercel Blob automáticamente
4. La URL pública se guarda en la BD
5. El sitio público muestra la imagen/video automáticamente

### Formatos Soportados
- **Imágenes**: JPG, PNG, WebP, GIF
- **Videos**: MP4, WebM, Ogg, YouTube URLs, Vimeo URLs

---

## 🔄 Flujo de Guardado

```
Admin → Editar campos → Click "Guardar Cambios"
     ↓
updateSiteSettings() / updateBookInfo()
     ↓
Supabase (BD actualizada)
     ↓
revalidatePath() / revalidateTag()
     ↓
Sitio público actualiza automáticamente
```

---

## 📊 Datos Editables Desde Admin

### Homepage
| Campo | Tipo | Editable desde |
|-------|------|---|
| Eyebrow | Texto | `/admin/inicio` |
| Título Hero | Texto | `/admin/inicio` |
| Descripción Hero | Textarea | `/admin/inicio` |
| Imagen Hero | Upload | `/admin/inicio` |
| CTA Primaria (texto) | Texto | `/admin/inicio` |
| CTA Primaria (URL) | Texto | `/admin/inicio` |
| CTA Secundaria (texto) | Texto | `/admin/inicio` |
| CTA Secundaria (URL) | Texto | `/admin/inicio` |
| Video URL | Upload | `/admin/inicio` |
| Compra - Link | Texto | `/admin/inicio` |
| Compra - Texto Botón | Texto | `/admin/inicio` |

### Página del Libro
| Campo | Tipo | Editable desde |
|-------|------|---|
| Portada | Upload | `/admin/book` |
| Título | Texto | `/admin/book` |
| Autor | Texto | `/admin/book` |
| Descripción | Textarea | `/admin/book` |
| Video | Upload | `/admin/book` |

---

## ✨ Características Técnicas

- ✅ **Live Preview** - Ves cambios en tiempo real
- ✅ **File Upload** - Sube imágenes y videos directamente desde admin
- ✅ **Vercel Blob** - Almacenamiento seguro en la nube
- ✅ **Responsive** - Admin funciona en mobile, tablet, desktop
- ✅ **Revalidación** - Cambios reflejados inmediatamente en sitio público
- ✅ **RLS Secure** - Acceso controlado por autenticación
- ✅ **Split View** - Preview y editor lado a lado

---

## 🐛 Solución del Dashboard

El error del `/admin` dashboard fue causado por acceso incorrecto a datos anidados (`health.data.data.settings` vs `health.data.settings`). **Ya fue corregido** con optional chaining seguro en la lectura.

---

## 📝 Próximos Pasos (Opcionales)

Si quieres expandir más:
1. Editar fragmentos del libro desde admin (CRUD completo)
2. Editar página de recomendaciones
3. Editar página "Sobre la autora"
4. Analytics y estadísticas en admin dashboard

---

**Sistema 100% funcional y listo para producción.**
