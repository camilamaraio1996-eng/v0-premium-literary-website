# Production Deployment Checklist - Image Upload System

## Pre-Deployment

### 1. Verify Supabase Configuration

**Buckets (Supabase Dashboard → Storage):**
- [ ] `book-images` bucket exists
- [ ] `book-videos` bucket exists  
- [ ] `blog-images` bucket exists
- [ ] All buckets have public read access
- [ ] Buckets NOT exposed to internet without auth for write

**RLS Policies:**
- [ ] Storage → Policies → Select `book-images` bucket
- [ ] Should have no policies (public read via bucket settings)
- [ ] Verify policy: "Allow anyone to read public files"

### 2. Verify Environment Variables

**Vercel Settings → Environment Variables:**

Add/verify these 4 variables:

```
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[64-char secret key from Supabase API settings]
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[64-char public key from Supabase API settings]
```

**How to find keys in Supabase:**
1. Supabase Dashboard → Project Settings → API
2. Copy "Project URL" → SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL
3. Copy "service_role" key → SUPABASE_SERVICE_ROLE_KEY
4. Copy "anon" key → NEXT_PUBLIC_SUPABASE_ANON_KEY

### 3. Local Build Test

```bash
pnpm install
pnpm run build
# Should complete without errors
# ✓ Compiled successfully
# ✓ Generating static pages
```

### 4. Deploy to Vercel

**Option A: Via Git (Recommended)**
```bash
git add .
git commit -m "fix: production-ready upload system"
git push origin main
# Vercel auto-deploys
```

**Option B: Via Vercel CLI**
```bash
vercel deploy --prod
# After first deploy, always set env vars in Vercel dashboard
```

## Post-Deployment

### 1. Verify Deployment

**Check Vercel Logs:**
```bash
vercel logs [project-url]
# Should show recent deployment with ✓ Build succeeded
```

**Check Function Logs:**
- Vercel Dashboard → Functions → `/api/upload`
- Should show function is available

### 2. Test Upload Functionality

**In Production:**
1. Go to `https://your-domain.com/admin/login` (login if needed)
2. Navigate to `https://your-domain.com/admin/book`
3. Scroll to "Imagen de Portada"
4. Click "Subir Imagen"
5. Select JPG/PNG/WebP file (< 5MB)
6. Wait for upload complete
7. Verify preview displays
8. Check success message: "✓ Imagen cargado exitosamente"

**In Browser Console:**
- Open DevTools (F12)
- Console tab
- Should show logs: `[v0 UPLOAD-UI] Upload successful!`
- Should show URL: `https://[project].supabase.co/storage/v1/object/public/book-images/...`

**In Supabase Storage:**
- Supabase Dashboard → Storage → `book-images`
- Should see new files: `book-images-[uuid].[ext]`
- Click file → open in new tab
- Image should display (not 404)

### 3. Verify Database Update

**Check if image URL saved:**
1. After upload + save book
2. Supabase Dashboard → SQL Editor
3. Run: `SELECT cover_image_url FROM lib_libro LIMIT 1;`
4. Should show URL like: `https://[project].supabase.co/storage/v1/object/public/book-images/...`

### 4. Test Error Scenarios

**File too large:**
- Select file > 5MB
- Should show: "El archivo debe ser menor a 5MB"

**Invalid format:**
- Select BMP or GIF
- Should show: "Formato de imagen no permitido"

**Network error:**
- Disable internet temporarily
- Try upload
- Should show appropriate error message

## Troubleshooting

### Upload fails with 500 error

**Step 1: Check env vars**
```bash
vercel env list
# Verify all 4 variables are present
# If missing, add them:
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_URL
# ... etc
```

**Step 2: Check Vercel Logs**
```bash
vercel logs [project-url] --follow
# Look for [v0-upload] messages
# Check for error messages
```

**Step 3: Check function runtime**
- File: `/app/api/upload/route.ts`
- Should have: `export const runtime = 'nodejs'`
- Should have: `export const maxDuration = 60`

### Image URL not saving to database

**Check:**
1. Upload succeeds (no error message)
2. Preview displays
3. Success message shows
4. But URL doesn't appear in database

**Solution:**
- Check if form is properly saved after upload
- Verify `onChange` callback is updating component state
- Check database for NULL values in `cover_image_url`

### Image previews don't load

**Check:**
1. URL is valid: copy and open in new tab
2. Image loads in new tab = URL is correct
3. If 404 = file not in Supabase Storage

**If image loads in new tab but not in preview:**
- Check browser CORS settings
- Check if Image component has `unoptimized` prop
- Check if Supabase bucket is truly public

### Rate limiting issues

**If uploads timeout with 504 errors:**
- `maxDuration` is set to 60 seconds
- For larger files, may need to increase
- Edit: `/app/api/upload/route.ts` line 6
- Change: `export const maxDuration = 120` (max 300)

## Rollback Instructions

**If upload system breaks production:**

**Option 1: Revert code**
```bash
git revert HEAD
git push origin main
vercel deploy --prod
```

**Option 2: Disable upload**
- Comment out `FileUploadField` usage
- Allow URL paste-in instead
- Temporary fix while investigating

**Option 3: Use fallback**
- Keep old URL input field
- Users paste URLs directly
- No server-side upload needed

## Monitoring

### Set up alerts

**Vercel:**
- Dashboard → Settings → Monitoring
- Alert on function errors
- Alert on high error rate (> 5% errors)

**Supabase:**
- Project Settings → Monitoring
- Monitor storage usage
- Alert if storage quota exceeded

### Check health regularly

**Weekly:**
- [ ] Verify recent uploads in Supabase Storage
- [ ] Check error logs in Vercel
- [ ] Test upload on production
- [ ] Verify images display on public site

**Monthly:**
- [ ] Check storage usage vs quota
- [ ] Review error patterns
- [ ] Monitor response times
- [ ] Check for any security issues

## Performance Optimization

**If uploads are slow:**

1. **Check file size:**
   - Compress images before upload
   - Use WebP format (smaller than JPG)
   - Reduce resolution if possible

2. **Check network:**
   - Upload from closer location to Vercel region
   - Check internet speed

3. **Check Supabase:**
   - May need to upgrade for higher throughput
   - Check Supabase status page

**Expected times:**
- 1MB image: 0.5-1 seconds
- 5MB image: 2-3 seconds
- 10MB video: 5-10 seconds
- 50MB video: 30-60 seconds

## Security Audit

**Before going live, verify:**

- [ ] SERVICE_ROLE_KEY is never exposed in client code
- [ ] SERVICE_ROLE_KEY is in Vercel env vars (not in git)
- [ ] File uploads are validated server-side
- [ ] Bucket is set to public read (files not private)
- [ ] RLS policies allow public read
- [ ] No sensitive data in filenames
- [ ] Error messages don't leak system info

## Success Criteria

Upload system is production-ready when:

✅ Upload completes in < 5 seconds (for typical file size)
✅ Error messages are user-friendly
✅ Image previews display correctly
✅ URLs are saved to database
✅ Images appear on public site
✅ No 500 errors in logs
✅ Vercel function executes successfully
✅ Supabase Storage has files
✅ RLS policies are correct
✅ All env vars are set

## Support

**If issues occur:**

1. Check logs: `vercel logs [project-url]`
2. Check Supabase dashboard
3. Review this checklist
4. Check the UPLOAD_SYSTEM_COMPLETE_GUIDE.md

---

**Last Updated:** 2026-05-11
**Status:** Production Ready
