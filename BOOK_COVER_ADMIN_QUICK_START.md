# Book Cover Admin Feature - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Login to Admin Panel
1. Go to `https://camilamaraio.com/admin/login` (or your domain)
2. Enter your email and password
3. You'll be redirected to `/admin` dashboard

### Step 2: Navigate to Book Cover Editor
1. Click "Editar Libro" in the admin dashboard
2. Or go directly to `https://camilamaraio.com/admin/book`
3. You'll see two panels:
   - **Left**: Live preview of how the book page looks
   - **Right**: Edit form for book details

### Step 3: Upload New Book Cover

**In the "Portada del Libro" section:**

1. Click the **"Subir Imagen"** button
2. Select a JPG, PNG, or WebP file from your computer (max 5MB)
3. The image uploads automatically
4. Wait for the upload to complete (progress bar shows)
5. See your image in the **live preview on the left**
6. The preview updates instantly - no page refresh needed

### Step 4: Review the Preview

Look at the **left panel** to see:
- How your book cover looks on the actual website
- The book title and description
- Any video if configured
- Book excerpts if available

### Step 5: Save Changes

1. Scroll down to the bottom of the form
2. Click **"Guardar Cambios"** button
3. Wait for the success message: "Libro actualizado correctamente"
4. The button will be disabled while saving

### Step 6: Verify on Public Site

1. Go to `https://camilamaraio.com/libro` (the public book page)
2. Refresh the page (Ctrl+R or Cmd+R)
3. Your new book cover should be displayed

---

## 📋 Checklist: Each Time You Upload

- [ ] File is JPG, PNG, or WebP format
- [ ] File size is less than 5MB
- [ ] Image looks good in the live preview (left panel)
- [ ] You clicked "Guardar Cambios"
- [ ] Success message appeared
- [ ] You verified on the public site

---

## ❌ If Something Goes Wrong

### "El archivo debe ser menor a 5MB"
**Problem**: File is too large
**Solution**: 
- Use image editing software to compress
- Or use an online tool: https://compressor.io
- Target: 1-3MB is ideal

### "Formato de imagen no permitido"
**Problem**: File is not JPG, PNG, or WebP
**Solution**:
- Convert the image using: https://convertio.co
- Use JPG or PNG format
- Avoid GIF, BMP, TIFF formats

### "Permiso denegado"
**Problem**: Authentication error
**Solution**:
- Log out and log back in
- Clear browser cache (Ctrl+Shift+R)
- Try a different browser
- Contact support if persists

### Preview doesn't update
**Problem**: Browser cache issue
**Solution**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Wait 5 seconds and refresh again
- Close and reopen the browser

### Image doesn't appear on public site
**Problem**: Cache or database issue
**Solution**:
- Hard refresh the public page
- Wait up to 1 minute
- Try in an incognito/private window
- Check that "Guardar Cambios" showed success

---

## 💡 Tips & Tricks

### Best Image Specs
- **Dimensions**: Aspect ratio 2:3 (portrait)
- **Size**: 300-400 pixels wide
- **File Size**: 1-3MB (web-optimized)
- **Format**: WebP is smallest, JPG/PNG are fine
- **Color**: High contrast, readable text

### Optimization Tools
- **Compress**: https://compressor.io
- **Convert to WebP**: https://convertio.co
- **Resize**: https://pixlr.com
- **Optimize**: https://imageoptim.com

### Common Tasks

**Upload a new cover:**
1. Go to `/admin/book`
2. Click "Subir Imagen"
3. Select file
4. Click "Guardar Cambios"
5. Done!

**Change the book title:**
1. Edit the "Título del Libro" field
2. Click "Guardar Cambios"
3. Changes appear everywhere

**Add/update book description:**
1. Scroll to "Sinopsis del Libro" section
2. Edit the text (min 20, max 1000 characters)
3. See preview below the text
4. Click "Guardar Cambios"

**Add a book video:**
1. Scroll to "Video del Libro" section
2. Click "Subir Video" or paste URL
3. Select MP4 or WebM (max 50MB)
4. Click "Guardar Cambios"

---

## 🔒 Security Notes

✓ Your login is secure with Supabase Auth
✓ Image files are validated before upload
✓ Uploads use encrypted connection (HTTPS)
✓ No credentials are exposed in the browser
✓ Only you can modify the book cover as admin

---

## 📞 Need Help?

If you encounter issues:

1. **Check this guide** - Most issues are covered above
2. **Hard refresh** - Ctrl+Shift+R or Cmd+Shift+R
3. **Clear browser cache** - Close all tabs and restart browser
4. **Try incognito mode** - Ctrl+Shift+N or Cmd+Shift+N
5. **Contact support** - If problem persists

---

## ⚡ Pro Tips

1. **Multiple uploads**: You can upload several times. Latest always wins.
2. **Undo**: Can't undo? Upload the old image again.
3. **Preview first**: Check left panel before saving.
4. **Mobile friendly**: Works on tablet/mobile too.
5. **Offline**: If offline, save will fail gracefully.

---

## 📊 Real-Time Preview Explained

The left panel shows your book page EXACTLY as visitors will see it:

```
┌─────────────────────────┬─────────────────────────┐
│  📱 LIVE PREVIEW        │  ✎ EDIT FORM            │
│  (Left Panel)           │  (Right Panel)          │
│                         │                         │
│  Book cover image       │  [ ] Upload new cover   │
│  Book title             │  [ ] Edit title         │
│  Book description       │  [ ] Edit author        │
│  Book details           │  [ ] Edit description   │
│  Video (if any)         │  [ ] Add video          │
│  Book excerpts          │  [SAVE]                 │
│                         │                         │
│  Updates INSTANTLY      │  Save to database       │
│  as you edit ▼          │                         │
└─────────────────────────┴─────────────────────────┘
```

**Key Point**: What you see on the left is EXACTLY what website visitors will see. No surprises!

---

## 🔄 Complete Flow Diagram

```
1. Login to Admin
   ↓
2. Go to /admin/book
   ↓
3. Click "Subir Imagen"
   ↓
4. Select JPG/PNG/WebP file
   ↓
5. Upload to Supabase Storage
   ├─ Client validates file
   ├─ Server validates file
   ├─ File uploaded to bucket
   ├─ Public URL generated
   └─ Response sent to frontend
   ↓
6. Live Preview Updates
   ├─ Image appears in left panel
   ├─ BookHero component renders
   ├─ No page refresh needed
   └─ Admin confirms it looks good
   ↓
7. Edit Other Fields (Optional)
   ├─ Title
   ├─ Author
   ├─ Description
   └─ Video URL
   ↓
8. Click "Guardar Cambios"
   ├─ Form validates
   ├─ Data sent to database
   ├─ book_info table updated
   ├─ Cache cleared
   └─ Success message shown
   ↓
9. Public Site Updates
   ├─ /libro page fetches data
   ├─ New image displays
   ├─ All book pages update
   └─ Website visitors see changes
   ↓
10. ✅ Done!
```

---

## 📝 Common Questions

**Q: How long does upload take?**
A: Usually 2-3 seconds. Depends on image size and internet speed.

**Q: Can I upload multiple times?**
A: Yes! Upload as many times as you want. Latest always wins.

**Q: What if I upload wrong image?**
A: Just upload the correct one again. Overwrites automatically.

**Q: Does the public site update immediately?**
A: Usually within 5 seconds. Might take up to 1 minute for CDN.

**Q: Can I undo a change?**
A: Upload the old image again or edit in database directly.

**Q: Is my data safe?**
A: Yes! Uses Supabase (enterprise-grade security).

**Q: Can other people upload images?**
A: No, only logged-in admins can access `/admin/book`.

---

## 🎯 Success Indicators

You've successfully uploaded when:

✅ No error message appears
✅ Image shows in left preview panel
✅ Success message: "Libro actualizado correctamente"
✅ New image appears on `/libro` page
✅ Image doesn't show as broken/404

---

**Ready to start?** Go to `https://camilamaraio.com/admin/book` and upload your first book cover!
