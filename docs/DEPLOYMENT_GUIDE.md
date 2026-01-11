# 🚀 Pegas Website Deployment Guide

## Problem Fixed
Your website wasn't showing updates on pegas.lk because of **aggressive browser and CDN caching**. This guide ensures your updates show properly.

---

## ✅ What Was Changed

### 1. **Version Numbers Updated** (v11.1)
- All CSS and JS files now use version `v11.1` 
- This forces browsers to load fresh files instead of cached ones

### 2. **Cache Settings Improved**
- **HTML files**: No caching - always fresh from server
- **CSS/JS files**: 1-hour cache (moderate, not aggressive)
- **Images**: 1-day cache (reasonable for photos)

### 3. **Files Modified**
- ✅ `index.html` - Updated to v11.1
- ✅ `.htaccess` - Better cache control for Apache servers
- ✅ `netlify.toml` - Better cache control for Netlify CDN

---

## 🔄 How to Deploy Your Updates

### **Option 1: Using Git & Netlify (Recommended)**

#### Step 1: Commit Your Changes
```bash
cd /Users/macbookpro/Desktop/new/Pegas_Website
git add .
git commit -m "Updated website design v11.1"
git push origin main
```

Or use the deployment script:
```bash
./deploy.sh
```

#### Step 2: Clear Netlify Cache
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your Pegas website
3. Click **"Deploys"** tab
4. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
5. Wait for deployment to complete (usually 1-2 minutes)

#### Step 3: Clear Your Browser Cache
**Option A - Hard Refresh:**
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + Shift + R`

**Option B - Incognito Mode:**
- Open pegas.lk in an incognito/private window
- This bypasses all browser cache

**Option C - Clear Browser Cache:**
- Chrome: Settings → Privacy → Clear browsing data → Cached images and files
- Firefox: Settings → Privacy → Clear Data → Cached Web Content
- Safari: Develop → Empty Caches

---

## 🎯 Testing Your Changes

### 1. Check Version Number
Open browser console (F12) on pegas.lk and look for:
```
✅ Version 11.1 loaded
✅ Cache cleared for fresh content
```

### 2. Verify CSS is Loading
- Check if animations are working
- Verify photos are displaying correctly
- Confirm containers fit properly

### 3. Compare with Localhost
- If it works on localhost but not on pegas.lk, it's still a cache issue
- Try clearing CDN cache again on Netlify

---

## 🔧 Future Updates - Quick Reference

When you make changes to your website:

1. **Update version number** in index.html:
   ```html
   <link rel="stylesheet" href="styles.css?v=11.2">
   <script src="script.js?v=11.2"></script>
   ```
   Change `11.1` to `11.2`, `11.3`, etc.

2. **Deploy using the script:**
   ```bash
   ./deploy.sh
   ```

3. **Clear Netlify cache** (very important!)

4. **Hard refresh** your browser on pegas.lk

---

## 🐛 Troubleshooting

### Problem: Updates still not showing

**Solution 1: Clear CDN Cache**
- Go to Netlify → Deploys → Trigger deploy → **"Clear cache and deploy site"**

**Solution 2: Update Version Number**
- Change version from `v11.1` to `v11.2` in index.html
- Commit and deploy again

**Solution 3: DNS/CDN Propagation**
- Sometimes takes 5-15 minutes for CDN to update globally
- Wait a few minutes and try again

### Problem: Only some images not loading

**Check file names:**
- Linux servers are case-sensitive
- `Director.jpeg` ≠ `director.jpeg`
- Make sure file names in HTML match exactly

**Check file paths:**
- Use relative paths: `Pegas_Logo.png` ✅
- Not absolute paths: `/Desktop/Pegas_Logo.png` ❌

### Problem: Animations not working

**CSS file not loading:**
1. Check browser console for 404 errors
2. Verify `styles.css?v=11.1` is loading
3. Clear Netlify cache and redeploy

---

## 📊 Cache Strategy Explained

### Before (Problem):
```
CSS/JS: 1 year cache
Images: 1 year cache
HTML: 0 seconds but cached by CDN
```
**Result**: Browser never checks for updates

### After (Fixed):
```
HTML: No cache, always fresh
CSS/JS: 1 hour cache with version numbers
Images: 1 day cache
```
**Result**: Updates show immediately with version bump

---

## ✨ Best Practices

1. **Always update version numbers** when you change CSS/JS
2. **Use the deployment script** for consistency
3. **Clear Netlify cache** after every deploy
4. **Test in incognito mode** first
5. **Check browser console** for errors (F12)

---

## 🆘 Quick Commands

```bash
# Check git status
git status

# Deploy everything
./deploy.sh

# Force push (use carefully)
git push -f origin main

# Check current version
grep "v=" index.html | head -5
```

---

## 📞 Support Checklist

If you're still having issues, check:

- [ ] Version number updated in index.html
- [ ] Changes committed to git
- [ ] Code pushed to GitHub/repository
- [ ] Netlify cache cleared
- [ ] Browser cache cleared (hard refresh)
- [ ] Tested in incognito mode
- [ ] Waited 5 minutes for CDN propagation
- [ ] Checked browser console for errors (F12)

---

**Last Updated**: Version 11.1 - January 2026
**Website**: https://pegas.lk
**Repository**: Pegas_Website
