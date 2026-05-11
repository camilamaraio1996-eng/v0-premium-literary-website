import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  try {
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all critical data
    const [settings, bookInfo, fragments] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('book_info').select('*'),
      supabase.from('book_fragments').select('*').eq('published', true),
    ])

    const responseData = {
      settings: settings.data ?? [],
      bookInfo: bookInfo.data ?? [],
      fragmentsCount: fragments.data?.length ?? 0,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      status: 'ok',
      user: user.email,
      data: responseData,
      checks: {
        settingsOk: responseData.settings.length > 0,
        bookInfoOk: responseData.bookInfo.length > 0,
        fragmentsOk: responseData.fragmentsCount > 0,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
