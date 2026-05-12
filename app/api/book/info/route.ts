import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Revalidate every hour
export const revalidate = 3600

/**
 * GET /api/book/info
 * Optimized endpoint for fetching book information
 * - Returns only essential columns
 * - Single query for book metadata
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: book, error } = await supabase
      .from('book_info')
      .select('id, title, slug, cover_image_url, description, video_url, published_at')
      .single()

    if (error) {
      console.error('[v0] Error fetching book info:', error)
      return NextResponse.json(
        {
          title: 'Lo real y lo otro',
          cover_image_url: null,
          description: null,
          video_url: 'qXAKNC4rXF0',
        },
        { status: 200 }
      )
    }

    // Set cache headers for optimal performance
    return NextResponse.json(book, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      {
        title: 'Lo real y lo otro',
        cover_image_url: null,
        description: null,
        video_url: 'qXAKNC4rXF0',
      },
      { status: 200 }
    )
  }
}
