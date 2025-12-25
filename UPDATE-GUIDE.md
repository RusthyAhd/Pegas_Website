# How to Update Your Website Easily

## Method 1: Direct File Edit (Easiest)

### For Small Changes:
1. Edit files directly in your local folder
2. Re-zip the `pegas-lk-website` folder  
3. Drag and drop to Netlify to redeploy
4. Changes go live immediately

### Common Updates:
- **Change text**: Edit `index.html`
- **Change colors**: Edit `styles.css`
- **Add pages**: Create new `.html` files
- **Update contact**: Edit contact section in `index.html`

## Method 2: Git Integration (Best for Regular Updates)

### Initial Setup:
1. Install Git on your computer
2. Create GitHub account
3. Create repository for your website
4. Connect Netlify to GitHub repository

### Making Updates:
1. Edit files on your computer
2. Commit changes with Git
3. Push to GitHub
4. Netlify automatically deploys changes

## Method 3: Netlify CMS (Content Management)

### Setup Steps:
1. Add admin folder to your website
2. Configure Netlify CMS
3. Edit content through web interface
4. No coding required for content changes

## Quick Edit Guide

### To Change Company Information:
```html
<!-- In index.html, find and edit: -->
<h1>Welcome to Pegas</h1>  <!-- Change company name -->
<p>Your trusted partner...</p>  <!-- Change description -->
```

### To Change Colors:
```css
/* In styles.css, find and edit: */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Change these color codes */
}
```

### To Add New Services:
```html
<!-- In index.html, add new service card: -->
<div class="service-card">
    <h3>New Service</h3>
    <p>Description of new service.</p>
</div>
```

## Emergency Support
If you need help with updates:
1. Keep backup of working version
2. Use Netlify's rollback feature
3. Contact web developer if needed

## Cost: Everything Above is 100% FREE! ✅