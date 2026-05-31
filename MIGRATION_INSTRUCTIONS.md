## Instrucciones para ejecutar la migración en Supabase

### PASO 1: Acceder a Supabase SQL Editor

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú izquierdo, busca "SQL Editor" (o "SQL")
4. Haz clic en "SQL Editor"

### PASO 2: Crear nueva query

1. Haz clic en "+ New Query" (o "New")
2. Se abrirá un editor de SQL en blanco

### PASO 3: Copiar y pegar el SQL

Copia exactamente esto y pégalo en el editor:

```sql
-- Agregar columna gallery_images a blog_posts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Verificación (opcional - ver que se creó correctamente)
-- Descomenta si quieres ver la estructura de la tabla
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'blog_posts' AND column_name = 'gallery_images';
```

### PASO 4: Ejecutar la query

1. Haz clic en "▶ Run" (botón verde de play)
2. Espera a que se complete (verás un mensaje de éxito)

### PASO 5: Verificar que funcionó

Deberías ver un mensaje que dice algo como:
- "Query executed successfully"
- "No rows returned"

### PASO 6: Listo

La columna `gallery_images` ahora existe en tu tabla `blog_posts`. El código JavaScript está corregido para:
- Enviar arrays vacíos `[]` en lugar de `null`
- Cargar las imágenes existentes como `post.gallery_images || []`
- Renderizar la galería solo si hay imágenes

### Si algo falla:

Si ves un error como "column already exists", eso es normal - significa que la columna ya fue creada anteriormente.

Si ves otros errores, verifica:
1. Que el nombre de la tabla sea exactamente `blog_posts` (minúsculas)
2. Que estés en el proyecto correcto en Supabase
3. Que tengas permisos de administrador para ejecutar SQL

### Próximos pasos después de ejecutar:

1. Vuelve a tu aplicación
2. Intenta crear o editar una entrada del blog
3. Agrega imágenes a la galería
4. Guarda los cambios

¡Debería funcionar sin el error de `gallery_images column not found`!
