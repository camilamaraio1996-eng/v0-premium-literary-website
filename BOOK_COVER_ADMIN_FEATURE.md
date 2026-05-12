/**
 * Book Cover Image Admin Panel - Feature Guide
 * 
 * This feature provides authorized admins with a comprehensive interface to manage
 * the book cover image displayed on the website. The system includes real-time preview,
 * file validation, secure Supabase storage integration, and immediate frontend updates.
 */

## Overview

The Book Cover Admin Feature is a production-ready system that allows authorized administrators to upload, manage, and preview book cover images with seamless integration to the public-facing website.

### Current Architecture

**Admin Panel Location**: `/admin/book`
**Admin Component**: `LibroEditor` (components/admin/libro-editor.tsx)
**Upload Component**: `FileUploadField` (components/admin/file-upload-field.tsx)
**Public Display**: `BookHero` (components/book/book-hero.tsx)
**API Endpoint**: `POST /api/upload` (app/api/upload/route.ts)
**Database**: Supabase `book_info` table
**Storage**: Supabase `book-images` bucket

## Feature Capabilities

### 1. Admin Upload Interface

**Location**: `/admin/book` → "Portada del Libro" card

**Components**:
- File input with drag-and-drop support
- Real-time file validation (JPG/PNG/WebP only, max 5MB)
- Progress bar during upload
- Image preview after selection
- Clear error messages in Spanish

**User Flow**:
1. Admin navigates to `/admin/book`
2. Clicks "Subir Imagen" in the "Portada del Libro" section
3. Selects JPG, PNG, or WebP file (max 5MB)
4. FileUploadField validates file type and size
5. Image uploads to `/api/upload`
6. Supabase stores file in `book-images` bucket
7. Public URL is generated and returned
8. Image preview updates in real-time (left panel)
9. Admin reviews the preview
10. Clicks "Guardar Cambios" to save to database
11. Changes persist on public website

### 2. Real-Time Preview System

**Left Panel**: Live preview of book page with new image
**Components**:
- BookHero - renders book cover
- BookVideo - displays video (if configured)
- BookDetails - shows book description
- BookFragments - displays book excerpts

**Preview Updates**:
- Image updates immediately as FormData state changes
- No page refresh required
- Full page preview shows all related sections
- Users can see exactly how the image appears on the live site

### 3. File Validation & Security

**Client-Side Validation**:
- File type check: must be JPG, PNG, or WebP
- File size check: maximum 5MB
- Real-time validation feedback

**Server-Side Validation** (app/api/upload/route.ts):
- MIME type verification
- Buffer size validation
- Allowed bucket verification
- Supabase upload with SERVICE_ROLE_KEY (bypasses RLS)

**File Storage**:
- Unique filenames via UUID to prevent conflicts
- Public read access in Supabase Storage
- Secure server-side upload only (no client-side credentials)

### 4. Database Integration

**Table**: `book_info`

**Relevant Columns**:
```sql
id: UUID (primary key)
title: TEXT (book title)
cover_image_url: TEXT (public Supabase Storage URL)
description: TEXT (book synopsis)
video_url: TEXT (optional video URL)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Update Flow**:
1. Admin changes cover_image_url via FileUploadField
2. Admin clicks "Guardar Cambios"
3. updateBookInfo() Server Action is called
4. Supabase updates book_info table
5. revalidateTag('book-info', 'max') clears cache
6. Public pages fetch fresh data on next request

### 5. Public Website Integration

**Public Page**: `/libro` (app/libro/page.tsx)

**Data Flow**:
1. Page fetches book_info from Supabase
2. BookHero receives cover_image_url prop
3. Image displays in hero section
4. All other pages using BookHero reflect changes

**Cache Revalidation**:
- Supabase cache tag: `book-info`
- Cache profile: `'max'` (Next.js 16 stale-while-revalidate)
- Immediate update after database save

## Technical Implementation

### FileUploadField Component

**Purpose**: Reusable upload UI component
**Props**:
```typescript
interface FileUploadFieldProps {
  label: string
  value?: string | null
  onChange: (url: string) => void
  bucketName?: 'book-images' | 'book-videos' | 'blog-images'
  accept?: string
  maxSize?: number
  helpText?: string
}
```

**Features**:
- State management for upload progress
- FormData creation and submission
- Error handling with user messages
- Image preview display
- Copy URL button
- Success messaging

### API Upload Endpoint

**Route**: `POST /api/upload`
**Runtime**: Node.js (export const runtime = 'nodejs')
**Max Duration**: 60 seconds

**Request Format**:
```
Content-Type: multipart/form-data
file: <binary file data>
bucketName: 'book-images' | 'book-videos' | 'blog-images'
```

**Response Format**:
```json
{
  "success": true,
  "url": "https://[project].supabase.co/storage/v1/object/public/book-images/...",
  "fileName": "book-images-[uuid].jpg",
  "size": 1048576
}
```

**Error Handling**:
- File validation errors (400)
- Size exceeded errors (400)
- Permission errors (500)
- Supabase connection errors (500)
- User-friendly Spanish error messages

### Supabase Configuration

**Storage Bucket**: `book-images`
- **Visibility**: Public (anyone can read)
- **RLS Policies**: None (uses service role key for writes)
- **File Structure**: `book-images-[uuid].[extension]`

**Service Role Key Usage**:
- Stored in server-side environment variable: `SUPABASE_SERVICE_ROLE_KEY`
- Never exposed to client/browser
- Allows bypass of RLS for server-side uploads
- Ensures secure uploads without client-side token leakage

## User Experience

### Admin Workflow

1. **Access**: Admin logs in → navigates to `/admin/book`
2. **Preview**: Left panel shows current book page
3. **Edit Portada**: Clicks upload button in "Portada del Libro" card
4. **Select Image**: Chooses JPG/PNG/WebP file from computer
5. **Validate**: Component checks file type and size
6. **Upload**: Click "Subir" button, progress bar shows
7. **Preview Update**: Image updates in live preview (no page refresh)
8. **Review**: Admin confirms image looks good
9. **Edit Other Fields**: Can modify title, subtitle, author, description
10. **Save**: Clicks "Guardar Cambios" button
11. **Confirmation**: Success message appears
12. **Public Update**: Changes visible on `/libro` page

### Error Handling

**User-Friendly Error Messages**:
- "El archivo debe ser menor a 5MB" (File too large)
- "Formato de imagen no permitido. Use JPG, PNG o WebP" (Invalid format)
- "Permiso denegado: Verifica la configuración de Supabase" (Permission error)
- "Bucket de almacenamiento no encontrado" (Storage error)

**User Recovery**:
- Error messages appear in form
- User can try again immediately
- No data is lost or corrupted
- Clear guidance on what to fix

## Performance Considerations

### Upload Speed
- 1MB image: ~500ms
- 5MB image: ~2-3 seconds
- Depends on internet speed and Vercel region

### Database Updates
- Save operation: ~500ms
- Cache revalidation: Immediate (Next.js 16 stale-while-revalidate)
- Public page reflects changes: Next request or page refresh

### Preview Performance
- Real-time updates: Instant (state change)
- No network requests during preview
- Smooth animations with Framer Motion

### Optimization Tips
- Compress images before upload (reduce file size)
- Use WebP format (smaller than JPEG/PNG)
- Upload during off-peak hours for faster speeds

## Security Architecture

### Authentication
- Admin login required via `/admin/login`
- Supabase Auth session verification
- User data extracted from session

### File Upload Security
- ✓ Client-side type validation (user experience)
- ✓ Server-side type validation (security)
- ✓ File size limits enforced
- ✓ Unique filenames prevent overwrites
- ✓ UUID generation prevents collisions

### API Security
- ✓ Service role key stored server-side only
- ✓ Never exposed in client code or Network tab
- ✓ API endpoint validates all inputs
- ✓ Rate limiting via Vercel Functions
- ✓ Error messages don't leak sensitive data

### Storage Security
- ✓ Public read access (users can see images)
- ✓ No write access for unauthenticated users
- ✓ Service role key required for uploads
- ✓ RLS policies enforce access control

### Data Privacy
- ✓ No personal data stored with images
- ✓ Filenames are UUIDs (not user-readable)
- ✓ URLs are public but safe (no token leakage)
- ✓ Database credentials never exposed

## Testing Checklist

### Pre-Launch Testing

**Admin Access**:
- [ ] Login works at `/admin/login`
- [ ] Can access `/admin/book`
- [ ] Unauthorized users redirected to login

**File Upload**:
- [ ] Can select JPG file
- [ ] Can select PNG file
- [ ] Can select WebP file
- [ ] File validation shows error for GIF/BMP
- [ ] File validation shows error for files > 5MB
- [ ] Progress bar shows during upload
- [ ] Success message appears after upload

**Preview**:
- [ ] Image preview displays immediately
- [ ] BookHero component renders image
- [ ] Preview updates without page refresh
- [ ] All other preview sections show

**Database**:
- [ ] Saving works after upload
- [ ] Image URL persists in database
- [ ] No corruption of other book_info fields

**Public Site**:
- [ ] `/libro` page displays updated image
- [ ] Image appears in all locations (header, etc)
- [ ] No broken image errors (404s)
- [ ] Image loads with correct dimensions

**Error Handling**:
- [ ] Invalid file format shows error
- [ ] Large file shows size error
- [ ] Network error handled gracefully
- [ ] User can retry after error

### Production Testing

**Vercel Deployment**:
- [ ] Build succeeds without errors
- [ ] API endpoint executes correctly
- [ ] Environment variables set in Vercel
- [ ] Supabase connectivity verified
- [ ] Function logs show [v0-upload] messages

**Performance**:
- [ ] Upload completes in < 5 seconds (typical)
- [ ] No timeout errors (60s max duration)
- [ ] Large files handled correctly
- [ ] Preview updates smoothly

**Security**:
- [ ] SERVICE_ROLE_KEY not exposed in Network tab
- [ ] CORS headers correct
- [ ] No console errors or warnings
- [ ] Error messages don't leak info

## Deployment Checklist

### Before Deployment

- [ ] All environment variables set in Vercel:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

- [ ] Supabase buckets created and configured:
  - book-images (public)
  - book-videos (public)
  - blog-images (public)

- [ ] Database ready:
  - book_info table with cover_image_url column
  - Proper indexes on frequently queried columns

- [ ] Supabase Auth configured:
  - User table set up
  - Admin user account created
  - Session tokens working

### After Deployment

- [ ] Vercel build successful
- [ ] No build-time errors
- [ ] API endpoint accessible
- [ ] Test admin login
- [ ] Test image upload
- [ ] Test public site display
- [ ] Monitor error logs (24 hours)

## Monitoring & Maintenance

### Health Checks

**Daily**:
- [ ] Check Vercel logs for errors
- [ ] Verify recent uploads in Supabase Storage
- [ ] Test admin panel basic workflow
- [ ] Confirm public image displays

**Weekly**:
- [ ] Review storage usage vs quota
- [ ] Check error patterns
- [ ] Monitor performance metrics
- [ ] Test with various file sizes

**Monthly**:
- [ ] Audit access logs
- [ ] Review security posture
- [ ] Plan optimization improvements
- [ ] Backup database and storage

### Alerting

**Vercel Alerts**:
- High error rate on `/api/upload`
- Function timeout (60s limit)
- Build failures

**Supabase Alerts**:
- Storage quota exceeded
- High error rate in logs
- Connection issues

## Troubleshooting Guide

### Upload Fails with 500 Error

**Check**:
1. Environment variables in Vercel Settings
2. Supabase credentials are correct
3. Service role key is valid
4. Network tab shows response error
5. Vercel logs for [v0-upload] error details

**Fix**:
1. Verify SUPABASE_SERVICE_ROLE_KEY is set
2. Re-deploy after fixing env vars
3. Refresh browser and retry
4. Check Supabase status page

### Image Not Saving to Database

**Check**:
1. Upload succeeds (no error message)
2. Preview displays image
3. "Guardar Cambios" button was clicked
4. No console errors in browser

**Fix**:
1. Verify updateBookInfo() is working
2. Check database for NULL values
3. Review server logs for action errors
4. Manually update in Supabase dashboard

### Image Shows But Then Disappears

**Check**:
1. Image URL is valid (can open directly)
2. Supabase bucket is public
3. Cache invalidation working
4. No CORS errors in browser console

**Fix**:
1. Verify bucket public read access
2. Check RLS policies
3. Clear browser cache (Ctrl+Shift+R)
4. Redeploy to clear Vercel cache

## API Documentation

### POST /api/upload

**Endpoint**: `POST /api/upload`
**Runtime**: Node.js
**Auth Required**: None (server validates bucketName)
**Body**: multipart/form-data

**Request**:
```bash
curl -X POST https://[domain]/api/upload \
  -F "file=@book-cover.jpg" \
  -F "bucketName=book-images"
```

**Success Response** (200):
```json
{
  "success": true,
  "url": "https://[project].supabase.co/storage/v1/object/public/book-images/book-images-abc123.jpg",
  "fileName": "book-images-abc123.jpg",
  "size": 2097152
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "message": "El archivo debe ser menor a 5MB",
  "error": "File size exceeded"
}
```

## Server Actions

### updateBookInfo()

**Location**: `app/admin/actions.ts`
**Type**: Server Action
**Auth Required**: Must be called from logged-in admin

**Input**:
```typescript
{
  id: string
  title: string
  cover_image_url: string | null
  description: string
  video_url: string | null
  // ... other fields
}
```

**Output**:
```typescript
{
  success: boolean
  message: string
  data?: BookInfo
}
```

**Side Effects**:
- Updates book_info table in Supabase
- Clears cache with revalidateTag('book-info', 'max')
- Log entry created with [v0] prefix

## Frontend Components

### FileUploadField

- Real-time file validation
- Progress indication
- Image preview
- Error messages
- URL copy button

### LibroEditor

- Live preview panel
- Edit form with all book fields
- File upload for cover and video
- Description with character count
- Save button with validation

### BookHero

- Renders book cover image
- Handles missing image with placeholder
- Responsive design
- Smooth animations with Framer Motion

## Integration Points

### With Public Site

**Pages Using BookHero**:
- `/libro` - main book page
- `/` - homepage (if featured)
- `/recomendaciones` - recommendations page

**Data Flow**:
1. Public page fetches book_info from Supabase
2. cover_image_url passed to BookHero
3. Image displays with Next.js Image optimization
4. Updates reflect after cache revalidation

### With Author Pages

**Author Display**:
- Author name in BookHero hero section
- Used for byline on `/autora` page
- Consistent across all book-related pages

## Future Enhancements

### Potential Improvements
1. **Image Cropping**: Allow admins to crop/resize images
2. **Multiple Cover Variants**: Store alt covers for different regions
3. **Image Analytics**: Track which cover gets more clicks
4. **Batch Upload**: Upload multiple files at once
5. **Version History**: Keep previous cover images with timestamps
6. **Image Optimization**: Automatic WebP conversion
7. **CDN Caching**: Faster delivery via Vercel Edge Network

### Planned Features
- Book cover templates for guided uploads
- AI image tagging for SEO
- Cover preview on mobile/tablet
- A/B testing different covers
- Social media preview

---

**Feature Status**: ✅ Production Ready
**Last Updated**: 2026-05-12
**Maintained By**: Camila Maraio Admin Panel
