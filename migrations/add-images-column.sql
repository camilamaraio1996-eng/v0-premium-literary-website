-- Agregar columna images a la tabla blog_posts
-- Esta columna almacenará un array de URLs de imágenes hasta máximo 3

-- Paso 1: Agregar la columna si no existe (como TEXT array)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];

-- Comentario: Usamos text[] para un array simple de strings de URLs
-- Máximo 3 imágenes por post (enforced en la aplicación)
