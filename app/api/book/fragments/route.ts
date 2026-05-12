import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Revalidate every hour
export const revalidate = 3600

/**
 * GET /api/book/fragments
 * Optimized endpoint for fetching book fragments
 * - Only fetches published fragments
 * - Limits to 20 fragments max
 * - Returns minimal required columns
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: fragments, error } = await supabase
      .from('book_fragments')
      .select('id, title, chapter_number, content, sort_order')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .limit(20)

    if (error) {
      console.error('[v0] Error fetching fragments:', error)
      return NextResponse.json({ error: 'Failed to fetch fragments' }, { status: 500 })
    }

    // Set cache headers for optimal performance
    return NextResponse.json(
      { fragments: fragments || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
