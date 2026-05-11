import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) || 'image'

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (type === 'image' && !isImage) {
      return NextResponse.json(
        { message: 'Please upload an image file' },
        { status: 400 }
      )
    }

    if (type === 'video' && !isVideo) {
      return NextResponse.json(
        { message: 'Please upload a video file' },
        { status: 400 }
      )
    }

    // Create unique filename
    const ext = file.name.split('.').pop()
    const filename = `${type}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
      message: 'File uploaded successfully',
    })
  } catch (error: any) {
    console.error('[v0] Upload API error:', error)
    return NextResponse.json(
      { message: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
