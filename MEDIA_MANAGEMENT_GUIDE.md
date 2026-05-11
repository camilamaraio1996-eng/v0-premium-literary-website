# Guía de Gestión de Medios - Panel de Admin

## Descripción General

El sistema de gestión de medios permite:
- ✅ Cambiar la portada del libro directamente desde el admin
- ✅ Agregar videos (YouTube, Vimeo, o URLs directas)
- ✅ Vista previa en tiempo real
- ✅ Gestión centralizada de todos los medios

## Ubicación en el Admin

**Ir a:** Admin Dashboard → Editar Libro

## Funcionalidades Disponibles

### 1. Gestión de Portada

**Ubicación:** Sección "Portada del Libro"

**Características:**
- Campo de entrada de URL
- Vista previa en tiempo real (32x48 píxeles)
- Botón para copiar URL
- Botón para limpiar/eliminar

**Recomendaciones:**
- Tamaño sugerido: 400x600 píxeles
- Formatos: JPG o PNG
- Hosted en: Vercel Blob, Cloudinary, o similar
- Asegura que la URL sea accesible públicamente

**Ejemplo:**
```
https://ejemplo.com/portada-libro.jpg
```

### 2. Gestión de Videos

**Ubicación:** Sección "Video del Libro"

**Formatos Soportados:**

#### YouTube
```
https://youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ
```

#### Vimeo
```
https://vimeo.com/123456789
https://player.vimeo.com/video/123456789
```

#### URL Directa
```
https://ejemplo.com/video-presentacion.mp4
https://ejemplo.com/video.webm
```

**Características:**
- Vista previa interactiva
- Autodetección de tipo de video
- Reproducción integrada con controles
- Botón para eliminar video

**Nota:** Los videos directos (MP4, WebM) deben estar alojados en un CDN accesible.

## Cómo Usar

### Cambiar Portada

1. Ve a **Admin → Editar Libro**
2. Desplázate a la sección **"Portada del Libro"**
3. Pega la URL en el campo "URL de la Imagen"
4. Observa la vista previa
5. Haz clic en **"Guardar Cambios"**

### Agregar Video

1. Ve a **Admin → Editar Libro**
2. Desplázate a la sección **"Video del Libro"**
3. Pega la URL del video (YouTube, Vimeo, o directo)
4. Observa la vista previa interactiva
5. Haz clic en **"Guardar Cambios"**

### Cambios en la Página Pública

Los cambios se reflejan automáticamente en `/libro`:
- La portada actualizada aparece en el hero section
- El video se muestra entre la portada y la sinopsis
- Con línea divisoria decorativa
- Responsive en móvil, tablet y desktop

## Localización de Medios

### Opción 1: Vercel Blob (Recomendado)
- Integración nativa con Vercel
- CDN global
- Sin configuración adicional

### Opción 2: Cloudinary
- Servicio gratuito
- Editor integrado
- Transformaciones de imagen

### Opción 3: AWS S3
- Escalable
- Altamente confiable
- Costo variable

### Opción 4: URL Local
- Para testing rápido
- No recomendado para producción

## Solución de Problemas

**Problema:** La portada no aparece en la vista previa
- Verifica que la URL sea accesible sin autenticación
- Comprueba que la URL termine en `.jpg` o `.png`
- Intenta con otra URL temporal

**Problema:** El video dice "No permutador de video"
- Asegúrate que el formato sea compatible (YouTube, Vimeo, o MP4/WebM)
- Para YouTube: copia el enlace del navegador o usa youtu.be
- Para URLs directas: confirma el tipo MIME

**Problema:** Los cambios no aparecen en el sitio público
- Espera 30 segundos para que caché se revalide
- Recarga la página con Ctrl+Shift+R (cache hard-refresh)
- Verifica que "Guardar Cambios" mostró el mensaje de éxito

## Especificaciones Técnicas

### Componente BookHero
- Muestra portada responsiva
- Línea divisoria decorativa
- Título del libro

### Componente BookVideo
- Sección entre hero y details
- Bordes suave redondeados
- Aspect-ratio 16:9
- Controles de reproducción nativos

### Componente BookDetails
- Sinopsis del libro
- Aparece después del video

## Integración en el Admin

El formulario integra:
- `MediaUploadForm`: Gestión centralizada de portada y video
- Preview en tiempo real
- Validación de URLs
- Integración con Server Actions
- Revalidación automática de caché

## Notas Importantes

- ⚠️ Las URLs deben ser **públicas** (sin autenticación)
- ⚠️ Se recomienda usar **HTTPS** para todos los medios
- ⚠️ Los videos de YouTube/Vimeo se embeben, no descargan
- ⚠️ Mantén las URLs en un lugar seguro para cambios futuros
- ℹ️ Los cambios se guardan en Supabase automáticamente
