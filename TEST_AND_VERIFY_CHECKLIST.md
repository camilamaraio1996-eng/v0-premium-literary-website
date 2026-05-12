# Book Cover Admin Feature - Complete Test & Verification Checklist

## Pre-Launch Verification

This checklist ensures the book cover admin feature works correctly before going to production.

---

## ✅ Phase 1: Environment Verification

### 1.1 Supabase Connection
- [ ] Can connect to Supabase from admin panel
- [ ] Database tables exist: `book_info`, `book_fragments`
- [ ] Storage buckets exist: `book-images`, `book-videos`, `blog-images`
- [ ] Buckets are set to public read access
- [ ] RLS policies allow authenticated write

### 1.2 Environment Variables
In Vercel Settings → Environment Variables:
- [ ] `SUPABASE_URL` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

### 1.3 API Configuration
- [ ] `/api/upload` endpoint exists
- [ ] Runtime is set to Node.js
- [ ] Max duration is 60 seconds
- [ ] No build errors: `pnpm run build` succeeds

---

## ✅ Phase 2: Admin Panel Access

### 2.1 Login Flow
1. Go to `https://[domain]/admin/login`
   - [ ] Login page loads
   - [ ] Form displays email and password fields
   - [ ] CSS styles load correctly

2. Enter valid credentials
   - [ ] Login succeeds for valid user
   - [ ] Redirects to `/admin` dashboard
   - [ ] User info appears in navigation

3. Try invalid credentials
   - [ ] Shows error message
   - [ ] Doesn't redirect on failure
   - [ ] Can try again

### 2.2 Dashboard Navigation
1. From `/admin` dashboard
   - [ ] See "Editar Libro" button/link
   - [ ] Click leads to `/admin/book`
   - [ ] Page loads without errors

2. Direct URL access
   - [ ] Can access `/admin/book` directly
   - [ ] Redirects to login if not authenticated
   - [ ] Shows admin content after login

---

## ✅ Phase 3: Admin Book Editor Page

### 3.1 Page Layout
- [ ] Two-column layout displays (left preview, right form)
- [ ] Left panel shows "Vista Previa" card
- [ ] Right panel shows edit form
- [ ] All sections visible on desktop
- [ ] Mobile responsive (stacked layout)

### 3.2 Preview Panel
Left panel should show:
- [ ] "Vista Previa" header
- [ ] Book cover image (or placeholder)
- [ ] Book title
- [ ] Book description
- [ ] Video section (if configured)
- [ ] Book fragments section
- [ ] Smooth animations on load

### 3.3 Edit Form
Right panel should show:
- [ ] "Portada del Libro" section
  - [ ] "Subir Imagen" button
  - [ ] Current image URL (if exists)
  - [ ] Help text about specs
- [ ] "Título del Libro" input
- [ ] "Subtítulo (Opcional)" input
- [ ] "Nombre del Autor" input
- [ ] "Sinopsis del Libro" textarea
  - [ ] Character counter shows
  - [ ] Min/max validation visible
- [ ] "Video del Libro" section
- [ ] "Guardar Cambios" button at bottom

---

## ✅ Phase 4: Image Upload Functionality

### 4.1 File Selection
1. Click "Subir Imagen" button
   - [ ] File input dialog opens
   - [ ] Can browse file system

2. Select JPG image
   - [ ] File loads into component
   - [ ] Preview displays (thumbnail)
   - [ ] File info shows (name, size)

3. Select PNG image
   - [ ] Works same as JPG
   - [ ] PNG format handled correctly

4. Select WebP image
   - [ ] Works same as JPG
   - [ ] WebP format handled correctly

### 4.2 File Validation (Client-Side)
1. Try selecting GIF file
   - [ ] Shows error: "Formato de imagen no permitido"
   - [ ] File is not accepted
   - [ ] Can try again

2. Try selecting BMP file
   - [ ] Shows error message
   - [ ] File is rejected

3. Try selecting file > 5MB
   - [ ] Shows error: "El archivo debe ser menor a 5MB"
   - [ ] File is rejected before upload
   - [ ] Can try with smaller file

### 4.3 Upload Process
1. Select valid JPG (< 5MB)
   - [ ] File selected successfully
   - [ ] "Subir" button appears (or auto-uploads)
   - [ ] Progress bar shows
   - [ ] Progress reaches 30% during upload
   - [ ] Progress reaches 100% on complete

2. Monitor upload
   - [ ] No console errors
   - [ ] Network tab shows POST /api/upload
   - [ ] Response status: 200
   - [ ] Response contains URL

3. After upload completes
   - [ ] Preview displays new image
   - [ ] No page refresh occurred
   - [ ] Success message shows
   - [ ] Image appears in live preview (left panel)

### 4.4 Upload Error Handling
1. Simulate network error
   - [ ] Shows error message
   - [ ] Can retry upload
   - [ ] No data corruption

2. Upload with invalid bucket
   - [ ] Server returns error
   - [ ] User sees: "Bucket not found"
   - [ ] Can try again

---

## ✅ Phase 5: Live Preview Updates

### 5.1 Real-Time Preview
1. Upload new image
   - [ ] Preview panel updates instantly
   - [ ] No page refresh needed
   - [ ] BookHero component re-renders

2. Change book title
   - [ ] Preview title updates instantly
   - [ ] Edit form still visible
   - [ ] Changes reflected in preview

3. Change description
   - [ ] Preview description updates
   - [ ] Character count shows
   - [ ] Error if < 20 or > 1000 chars

### 5.2 Preview Sections
After uploading image, verify preview shows:
- [ ] Updated book cover image
- [ ] Book title
- [ ] Subtitle (if set)
- [ ] Author name
- [ ] Description
- [ ] Video section (if video_url set)
- [ ] Book fragments (if any exist)
- [ ] All sections have correct styling

---

## ✅ Phase 6: Form Submission

### 6.1 Save Button State
1. On page load
   - [ ] "Guardar Cambios" button visible
   - [ ] Button enabled (clickable)

2. After making changes
   - [ ] Button remains enabled
   - [ ] Button shows loading state when saving

3. While saving
   - [ ] Button text changes to "Guardando..."
   - [ ] Button is disabled
   - [ ] User cannot click again

### 6.2 Form Validation
1. Try to save with empty title
   - [ ] Button is disabled
   - [ ] Tooltip shows: "Título mínimo 3 caracteres"

2. Try to save with short description
   - [ ] Button is disabled
   - [ ] Error shows: "Sinopsis mínimo 20 caracteres"

3. Try to save with long description (> 1000)
   - [ ] Button is disabled
   - [ ] Error shows: "Sinopsis máximo 1000 caracteres"

### 6.3 Successful Save
1. Fill form with valid data
   - [ ] Title: "El Libro de los Sueños"
   - [ ] Description: 20+ characters
   - [ ] At least cover image set

2. Click "Guardar Cambios"
   - [ ] Button shows loading state
   - [ ] No page refresh
   - [ ] Success message appears: "Libro actualizado correctamente"
   - [ ] Message stays for 2-3 seconds
   - [ ] Button returns to normal

3. After success
   - [ ] Data is saved to database
   - [ ] Can close admin panel
   - [ ] Changes persist on refresh

---

## ✅ Phase 7: Database Persistence

### 7.1 Data Storage
After saving in admin panel:
1. Check Supabase Database
   - [ ] `book_info` table updated
   - [ ] `cover_image_url` has new URL
   - [ ] `title` field updated
   - [ ] `description` field updated
   - [ ] All fields correctly formatted

2. Verify URL format
   - [ ] URL is public (not signed)
   - [ ] Format: `https://[project].supabase.co/storage/v1/object/public/book-images/...`
   - [ ] Image accessible via URL

3. Check file in Storage
   - [ ] File exists in `book-images` bucket
   - [ ] Filename is UUID-based
   - [ ] File size is correct
   - [ ] File is readable

---

## ✅ Phase 8: Public Site Display

### 8.1 Public Book Page
1. Go to `https://[domain]/libro`
   - [ ] Page loads successfully
   - [ ] No console errors
   - [ ] All sections render

2. Book cover displays
   - [ ] New image is visible
   - [ ] Image has correct dimensions
   - [ ] No broken image (404) errors
   - [ ] Image loads fast

3. Other book info displays
   - [ ] Title shows correctly
   - [ ] Description is readable
   - [ ] Author name displays
   - [ ] Video plays (if configured)

### 8.2 Cache Revalidation
1. After admin update
   - [ ] Public page reflects changes
   - [ ] May need refresh (Ctrl+R)
   - [ ] Cache is updated within 1 minute
   - [ ] No stale data displayed

2. Multiple page visits
   - [ ] Image consistent across visits
   - [ ] Reload shows same image
   - [ ] No cache inconsistencies

---

## ✅ Phase 9: Error Scenarios

### 9.1 Network Errors
1. Simulate network disconnect
   - [ ] Upload shows error
   - [ ] Error message is clear
   - [ ] User can retry

2. Slow internet
   - [ ] Upload takes longer but completes
   - [ ] Progress bar updates
   - [ ] No timeout before 60 seconds

### 9.2 Invalid Data
1. Corrupted file selected
   - [ ] Server rejects with error
   - [ ] User sees helpful message
   - [ ] No system crash

2. Malicious file (e.g., .exe renamed to .jpg)
   - [ ] Server validates MIME type
   - [ ] File is rejected
   - [ ] User notified

### 9.3 Supabase Errors
1. Bucket doesn't exist
   - [ ] Server returns error: "Bucket not found"
   - [ ] User sees friendly message
   - [ ] Contact support is suggested

2. Quota exceeded
   - [ ] Upload fails with size error
   - [ ] User can reduce file size
   - [ ] Or contact support

---

## ✅ Phase 10: Performance Testing

### 10.1 Upload Performance
1. Upload 1MB image
   - [ ] Time: 500ms - 1s
   - [ ] User experience: Smooth
   - [ ] No UI freezing

2. Upload 5MB image
   - [ ] Time: 2-3 seconds
   - [ ] Progress bar shows
   - [ ] User can see progress

3. Upload large video (50MB)
   - [ ] Time: 30-60 seconds
   - [ ] No timeout (max 60s)
   - [ ] Progress updates continuously

### 10.2 Page Performance
1. Admin panel load time
   - [ ] Page loads in < 2 seconds
   - [ ] All assets load
   - [ ] No layout shift

2. Preview panel render
   - [ ] Updates instantly on state change
   - [ ] No lag when typing
   - [ ] Smooth animations

---

## ✅ Phase 11: Security Testing

### 11.1 Authentication
1. Without login
   - [ ] Cannot access `/admin/book`
   - [ ] Redirects to `/admin/login`
   - [ ] Cannot access API endpoints

2. With login
   - [ ] Can access `/admin/book`
   - [ ] Can upload files
   - [ ] API calls work

3. Different user
   - [ ] Only can access if admin
   - [ ] Regular users blocked
   - [ ] Redirected to appropriate page

### 11.2 File Upload Security
1. Check browser Network tab
   - [ ] SERVICE_ROLE_KEY not exposed
   - [ ] No secrets in request headers
   - [ ] Upload uses HTTPS

2. Check server logs
   - [ ] No sensitive data logged
   - [ ] Errors don't leak info
   - [ ] Audit trail maintained

### 11.3 Authorization
1. Try to access /admin/book without auth
   - [ ] Access denied
   - [ ] Redirected to login

2. Try to upload without admin role
   - [ ] Upload fails (if implemented)
   - [ ] Appropriate error shown

---

## ✅ Phase 12: Cross-Browser Testing

Test in multiple browsers:

### 12.1 Chrome/Chromium
- [ ] Upload works
- [ ] Preview updates
- [ ] Save succeeds
- [ ] Public page displays

### 12.2 Firefox
- [ ] File selection works
- [ ] Upload progresses
- [ ] No browser-specific errors
- [ ] Performance acceptable

### 12.3 Safari
- [ ] Form inputs work
- [ ] Upload completes
- [ ] Images display correctly
- [ ] No WebKit issues

### 12.4 Mobile Browsers
- [ ] Mobile layout responsive
- [ ] File picker works
- [ ] Buttons are tap-friendly
- [ ] Preview is readable

---

## ✅ Phase 13: Mobile Responsiveness

### 13.1 Tablet (iPad size)
- [ ] Layout adapts properly
- [ ] Preview stacks above form
- [ ] All controls accessible
- [ ] No horizontal scroll

### 13.2 Mobile Phone (iPhone)
- [ ] Single column layout
- [ ] Buttons are touch-sized
- [ ] Text is readable
- [ ] Upload still works

---

## ✅ Phase 14: Accessibility

### 14.1 Keyboard Navigation
- [ ] Can tab through form
- [ ] Can focus on buttons
- [ ] Can submit with Enter
- [ ] Tab order is logical

### 14.2 Screen Readers
- [ ] Labels are associated with inputs
- [ ] Buttons have descriptive text
- [ ] Error messages are announced
- [ ] Form structure is semantic

### 14.3 Color Contrast
- [ ] Text is readable
- [ ] Error messages visible
- [ ] Success messages visible
- [ ] Meets WCAG AA standards

---

## ✅ Phase 15: Final Integration Test

### 15.1 Complete Workflow
1. Admin logs in
2. Goes to `/admin/book`
3. Uploads new book cover image
4. Sees image in preview (left panel)
5. Updates book title
6. Updates book description
7. Clicks "Guardar Cambios"
8. Gets success message
9. Refreshes page
10. Data persists
11. Goes to public `/libro` page
12. Sees updated image
13. Logs out

**All steps should work without errors**

---

## ✅ Phase 16: Monitoring & Logs

### 16.1 Server Logs
Check Vercel Functions logs for:
- [ ] [v0-upload] messages appear
- [ ] No ERROR level messages
- [ ] Successful uploads logged
- [ ] Failed uploads have error details

### 16.2 Database Logs
- [ ] Update queries logged
- [ ] No failed queries
- [ ] Response times reasonable
- [ ] No N+1 queries

### 16.3 Console Warnings
- [ ] No console errors
- [ ] No console warnings (ideally)
- [ ] No CORS warnings
- [ ] No deprecation warnings

---

## Launch Verification Checklist

Before marking as "Production Ready":

- [ ] All Phase 1 checks pass
- [ ] All Phase 2 checks pass
- [ ] All Phase 3 checks pass
- [ ] All Phase 4 checks pass
- [ ] All Phase 5 checks pass
- [ ] All Phase 6 checks pass
- [ ] All Phase 7 checks pass
- [ ] All Phase 8 checks pass
- [ ] All Phase 9 checks pass
- [ ] All Phase 10 checks pass (performance acceptable)
- [ ] All Phase 11 checks pass (security verified)
- [ ] All Phase 12 checks pass (browsers tested)
- [ ] All Phase 13 checks pass (mobile works)
- [ ] All Phase 14 checks pass (accessibility good)
- [ ] All Phase 15 checks pass (complete workflow works)
- [ ] All Phase 16 checks pass (logs clean)

---

## Sign-Off

### QA Sign-Off
- [ ] Feature tested thoroughly
- [ ] All acceptance criteria met
- [ ] No critical bugs found
- [ ] Ready for production

**Tested by**: ________________
**Date**: ________________
**Sign**: ________________

### Deployment
- [ ] Deployed to production
- [ ] Environment variables verified
- [ ] Monitoring alerts set up
- [ ] Documentation shared

**Deployed by**: ________________
**Date**: ________________
**Monitoring**: Enabled ✓

---

## Post-Launch Monitoring (First 24 Hours)

After deployment, monitor for:
- [ ] Error rates in `/api/upload`
- [ ] Upload success rates
- [ ] Database update times
- [ ] Public page load times
- [ ] User feedback

If any issues occur, have rollback plan ready.

