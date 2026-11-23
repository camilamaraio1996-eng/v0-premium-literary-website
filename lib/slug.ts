/**
 * Utilidades para generación y resolución de slugs únicos para entradas de blog.
 */

/**
 * Convierte un título en una cadena limpia apta para URLs (slug).
 * Maneja tildes/acentos, caracteres especiales y mayúsculas.
 */
export function generateSlug(title: string): string {
  if (!title || typeof title !== 'string') return 'entrada'

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita marcas de acentos/tildes
    .replace(/[^a-z0-9]+/g, '-')     // Reemplaza cualquier caracter no alfanumérico por un guión
    .replace(/^-+|-+$/g, '')         // Elimina guiones al principio o al final

  return slug || 'entrada'
}

/**
 * Consulta Supabase para asegurar que el slug no colisione con otra entrada existente.
 * Si 'mi-historia' ya existe, buscará 'mi-historia-2', 'mi-historia-3', etc.
 * 
 * @param supabase Cliente de Supabase
 * @param title Título del post del cual derivar el slug
 * @param excludePostId ID del post actual (útil para edición, para no colisionar consigo mismo)
 */
export async function resolveUniqueSlug(
  supabase: any,
  title: string,
  excludePostId?: string
): Promise<string> {
  const baseSlug = generateSlug(title)

  try {
    let query = supabase
      .from('blog_posts')
      .select('id, slug')
      .ilike('slug', `${baseSlug}%`)

    if (excludePostId) {
      query = query.neq('id', excludePostId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return baseSlug
    }

    const existingSlugs = new Set(
      data.map((item: { slug: string }) => item.slug?.toLowerCase().trim())
    )

    if (!existingSlugs.has(baseSlug)) {
      return baseSlug
    }

    // Buscar el siguiente número disponible: mi-slug-2, mi-slug-3...
    let counter = 2
    while (existingSlugs.has(`${baseSlug}-${counter}`)) {
      counter++
    }

    return `${baseSlug}-${counter}`
  } catch (err) {
    console.warn('[slug] Error al verificar unicidad de slug, usando fallback:', err)
    return `${baseSlug}-${Date.now().toString(36)}`
  }
}
