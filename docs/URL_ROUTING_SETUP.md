# URL Routing Setup for Pegas Website

## Overview
Your website now supports clean URLs for navigation:
- `pegas.lk/home` → Home section
- `pegas.lk/about` → About section
- `pegas.lk/team` → Our Team section
- `pegas.lk/it-division` → IT Solutions
- `pegas.lk/manufacturing` → Manufacturing
- `pegas.lk/distribution` → Distribution
- `pegas.lk/services` → Services
- `pegas.lk/contact` → Contact

## How It Works

### 1. **Client-Side (JavaScript)**
The `js/script.js` file contains:
- `handlePageNavigation()` - Reads the current URL path and scrolls to the correct section
- Updated nav link click handlers that use `window.history.pushState()` to change the URL

### 2. **Netlify Configuration (netlify.toml)**
The `netlify.toml` file contains redirect rules that:
- Redirect all route requests to `index.html` (Single Page Application behavior)
- Preserve the URL in the browser
- Load the correct section based on the URL

## Deployment Steps

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Add URL routing support for clean navigation"
git push origin main
```

### Step 2: Netlify Auto-Deploy
- Netlify will automatically detect the push to your `main` branch
- It will redeploy your site
- The new routing will be active immediately

### Step 3: Test the URLs
Visit these URLs on your live site:
- `https://pegas.lk/home`
- `https://pegas.lk/about`
- `https://pegas.lk/team`
- `https://pegas.lk/services`
- `https://pegas.lk/contact`

Each URL should:
1. Keep the clean URL in the browser address bar
2. Automatically scroll to the correct section
3. Allow browser back/forward navigation

## Files Modified

1. **js/script.js**
   - Added `handlePageNavigation()` function
   - Updated nav link click handlers
   - URL changes on navigation

2. **netlify.toml**
   - Added redirect rules for all pages
   - Added catch-all redirect for 404 handling
   - Redirects show content with HTTP 200 (not 301/302 redirects)

## Important Notes

⚠️ **The netlify.toml changes will only work when deployed to Netlify!**

- ✅ On `localhost` during development, you may see the URL change but sections might not scroll if the routing isn't fully supported by your local server
- ✅ On Netlify (pegas.lk), the routing will work perfectly with all the redirect rules

## How Visitors Experience It

1. **Visitor clicks "Home"** → URL becomes `pegas.lk/home`
2. **Visitor bookmarks "Services" page** → Returns to that section
3. **Visitor shares `pegas.lk/about`** → Recipients go directly to About section
4. **Browser back button** → Returns to previous page/section

## Troubleshooting

### URLs not working on Netlify?
1. Go to Netlify dashboard
2. Clear the cache: **Deploys → Trigger deploy → Deploy site**
3. Wait 1-2 minutes for changes to propagate
4. Test the URLs again

### Localhost not working?
This is expected behavior. Use the Python HTTP server or a local development server that supports client-side routing:
```bash
# Python
python -m http.server 8000

# Or install and use a package like http-server
npm install -g http-server
http-server -c-1  # Disable caching for testing
```

## Next Steps

Your website is now ready for clean URL routing! Push to GitHub and Netlify will automatically deploy with the new configuration.

Questions? Check the netlify.toml file for the redirect rules configuration.
