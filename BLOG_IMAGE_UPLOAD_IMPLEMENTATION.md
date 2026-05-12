# Blog Image Upload Feature - Implementation Complete

## Overview
The blog entry editing feature now supports direct image uploads from the user's device using Supabase Storage, eliminating the need to manually paste image URLs.

## What Was Implemented

### 1. Storage Infrastructure
- **Created `blog-images` Supabase Storage bucket**: Stores blog post cover images with public read access
- **Path**: `blog-images/` in Supabase Storage
- **Security**: Authenticated write access (admin only), public read access (anyone can view)

### 2. Updated Blog Post Form Components

#### New Post Creation (`/app/admin/posts/new/page.tsx`)
- Added `FileUploadField` component for image uploads
- Supports: JPG, PNG, WebP formats
- Max file size: 5MB
- Features:
  - Direct file upload button
  - Progress bar during upload
  - Image preview after upload
  - Copy URL to clipboard
  - Ability to paste URLs directly
  - Error messages if upload fails

#### Blog Post Editing (`/app/admin/posts/[id]/page.tsx`) - NEW FILE
- Full edit page created for existing blog entries
- Identical image upload functionality as new post form
- Loads existing post data on page load
- Updates image URL in database
- Maintains all other post metadata (title, content, category, etc.)

### 3. Reused Components
- **`FileUploadField`** (`/components/admin/file-upload-field.tsx`)
  - Generic component configured for blog images
  - Direct Supabase Storage upload
  - Validates file size and type
  - Generates unique filenames with UUID
  - Returns public URLs automatically

### 4. Database Integration
- **Table**: `blog_posts`
- **Column**: `image_url` (existing column reused)
- **Storage**: Stores full public URL from Supabase (e.g., `https://[project].supabase.co/storage/v1/object/public/blog-images/image-uuid.jpg`)
- **No schema changes required**: Existing column accommodates new URLs

## How to Use

### Creating a Blog Post with Image
1. Go to Admin → Entradas → "Nueva Entrada"
2. Fill in title, excerpt, content, category
3. In "Imagen de la Entrada" section:
   - Click "Subir Imagen" button
   - Select JPG/PNG/WebP file from computer (max 5MB)
   - Image uploads automatically with progress bar
   - Preview appears below upload button
4. Click "Guardar Entrada"
5. Image is now stored in Supabase and linked to the blog post

### Editing a Blog Post Image
1. Go to Admin → Entradas
2. Click the edit icon (pencil) next to the blog entry
3. Scroll to "Imagen de la Entrada" section
4. To change image:
   - Click "Subir Imagen"
   - Select new image file
   - Old image URL will be replaced
5. Click "Guardar Cambios"

### Alternative: Paste Image URL
- Instead of uploading, you can paste a public image URL directly in the text field
- Field accepts any publicly accessible image URL

## Technical Architecture

### Upload Flow
```
Admin uploads image
         ↓
FileUploadField validates (type, size)
         ↓
Supabase client (authenticated) uploads to blog-images bucket
         ↓
File gets unique name: image-{uuid}.{ext}
         ↓
Supabase returns public URL
         ↓
URL saved to formData.imageUrl state
         ↓
Admin clicks "Guardar Entrada/Cambios"
         ↓
image_url saved to blog_posts table in Supabase
         ↓
Blog page displays image from public URL
```

### File Naming Strategy
- **Pattern**: `image-{uuid}.{extension}`
- **Example**: `image-a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`
- **Benefit**: Prevents filename conflicts, auto-generates unique names
- **Library**: Uses `uuid` npm package for generation

### Security
- **Upload validation**: Client-side type and size checks
- **Server-side validation**: Supabase RLS policies enforce auth
- **Public read**: URLs are publicly accessible (needed for blog pages)
- **Write protection**: Only authenticated users can upload
- **Delete protection**: Only admins can manage their files

## Component Structure

```
/app/admin/posts/new/page.tsx
├── Form handling
├── FileUploadField
│   ├── File input
│   ├── Upload button
│   ├── Progress tracking
│   └── Preview display
└── Database write: CREATE blog post

/app/admin/posts/[id]/page.tsx
├── Load existing post data
├── Form handling
├── FileUploadField (same as above)
└── Database write: UPDATE blog post

/components/admin/file-upload-field.tsx
├── Supabase Storage client
├── File validation (type, size)
├── Upload handler
├── URL generation
└── Error handling
```

## Files Changed/Created

### Created
- `/app/admin/posts/[id]/page.tsx` - Blog post edit page with image upload

### Modified
- `/app/admin/posts/new/page.tsx` - Added FileUploadField import and component

### Reused (no changes)
- `/components/admin/file-upload-field.tsx` - Generic upload component
- `/lib/supabase/client.ts` - Supabase client initialization

## Database Storage
- **Bucket**: `blog-images`
- **Path structure**: `image-{uuid}.{extension}`
- **Public URL format**: `https://[project-id].supabase.co/storage/v1/object/public/blog-images/image-[uuid].[ext]`
- **Max upload size**: 5MB (enforced by FileUploadField)

## Error Handling
- **File too large**: Shows error "Archivo debe ser menor a 5MB"
- **Invalid file type**: Shows error "Por favor sube una imagen"
- **Upload failure**: Shows specific Supabase error message
- **Network error**: Shows "Error desconocido"
- **Database error**: Shows database error message

## Features & User Experience
✓ Progress bar shows upload percentage
✓ Image preview after successful upload
✓ "Cargado" badge shows successful upload status
✓ Copy URL button for manual use
✓ Remove URL button to clear image
✓ Helpful text explains file requirements
✓ Support for JPG, PNG, WebP formats
✓ Instant feedback on errors
✓ Mobile-friendly interface

## Next Steps (Optional Enhancements)
- Add image cropping before upload
- Support for drag-and-drop uploads
- Image compression before upload
- Multiple image gallery per post
- Image alt text field in form
- Featured image selection

## Troubleshooting

### Upload button doesn't work
- Check browser console for errors
- Verify authenticated user session
- Ensure blog-images bucket exists in Supabase Storage

### Image doesn't appear after saving
- Verify URL was correctly saved to database
- Check image URL is publicly accessible
- Verify file was uploaded to correct bucket

### Maximum file size error
- Image must be under 5MB
- Compress image and retry
- Use image editor to reduce dimensions

## Conclusion
Blog image uploads are now fully integrated with Supabase Storage, providing admins with an intuitive interface to manage blog post cover images directly from the admin panel. The solution reuses the proven `FileUploadField` component for consistency across the platform.
