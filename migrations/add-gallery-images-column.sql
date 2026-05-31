-- Agregar columna gallery_images a la tabla blog_posts
-- Esta columna almacenará un array de URLs de imágenes en formato JSON
-- Ejecuta este script en Supabase SQL Editor

-- Paso 1: Agregar la columna si no existe (como JSON array)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Paso 2: Si necesitas usar como TEXT[] en su lugar, usa esto:
-- ALTER TABLE blog_posts
-- ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}'::text[];

-- Comentario: Usamos JSONB porque es más flexible y mejor soportado en Supabase
-- JSONB permite arrays de objetos con metadata si es necesario en el futuro
-- Si prefieres simple array de strings, usa la segunda opción con text[]

-- Verificar que la columna fue creada correctamente
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'blog_posts' AND column_name = 'gallery_images';
