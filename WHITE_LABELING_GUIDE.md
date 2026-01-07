# 🎨 White Labeling Guide - Pegas Website

## Overview
This website is built with **professional white labeling** in mind, making it easy to customize for your brand while maintaining the same high-quality UI/UX and liquid animations.

---

## 🚀 Quick Start - Brand Customization

### 1. **Update Brand Colors** (5 minutes)

Edit the CSS variables in `styles.css` (lines 20-40):

```css
:root {
    /* Change these to match your brand colors */
    --primary-color: #10b981;        /* Your main brand color */
    --primary-dark: #059669;         /* Darker shade */
    --primary-light: #34d399;        /* Lighter shade */
    
    --accent-color: #22c55e;         /* Supporting color 1 */
    --accent-secondary: #16a34a;     /* Supporting color 2 */
}
```

**Popular Brand Color Examples:**
- **Blue Theme:** `--primary-color: #3b82f6;`
- **Purple Theme:** `--primary-color: #8b5cf6;`
- **Orange Theme:** `--primary-color: #f97316;`
- **Red Theme:** `--primary-color: #ef4444;`

---

### 2. **Update Company Information** (10 minutes)

#### In `index.html`:

**A. Meta Tags (Lines 9-30):**
```html
<meta name="title" content="YOUR COMPANY | IT, Manufacturing & Distribution">
<meta name="description" content="YOUR COMPANY - Description of your business...">
<meta name="keywords" content="your, keywords, here">
<meta name="company" content="YOUR COMPANY (Pvt) Ltd">
```

**B. Page Title (Line 29):**
```html
<title>YOUR COMPANY | Business Solutions | Official Website</title>
```

**C. Logo & Company Name (Lines 270-276):**
```html
<div class="logo-text">YOUR COMPANY<span class="logo-superscript">SUFFIX</span></div>
```

**D. Hero Section (Lines 310-320):**
```html
<h1 class="hero-title">
    <span class="title-line">Your Custom</span>
    <span class="title-line gradient-text">Headline</span>
    <span class="title-line">Goes Here</span>
</h1>
```

---

### 3. **Update Contact Information** (5 minutes)

In `index.html` (Contact Section - Lines 700-730):

```html
<p>Your Address Line 1,<br>Your Address Line 2</p>
<p>+XX XXX XXX XXXX<br>+XX XXX XXX XXXX</p>
<p>contact@yourcompany.com<br>info@yourcompany.com</p>
```

---

### 4. **Customize Business Divisions** (15 minutes)

#### Current Divisions:
1. **IT Solutions** (Blue theme)
2. **Manufacturing** (Orange theme)
3. **Distribution** (Green theme)

#### To Change Division Names/Content:

Find the **Business Divisions Section** in `index.html` (around line 450):

```html
<!-- IT Division -->
<div class="division-block division-it">
    <h3 class="division-title">Your Division Name</h3>
    <p class="division-description">Your division description...</p>
    
    <!-- Update features -->
    <div class="feature-card">
        <h4>Your Feature Name</h4>
        <p>Feature description</p>
    </div>
</div>
```

#### To Change Division Colors:

In `styles.css` (around line 2150):

```css
/* Division-Specific Colors */
.division-it {
    border-top: 5px solid #YOUR_COLOR;
}
.division-it .division-badge {
    background: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
}
```

---

## 🎨 Advanced Customization

### **Typography**

Change fonts in `styles.css`:

```css
:root {
    --font-primary: 'Your Font', sans-serif;
    --font-secondary: 'Your Secondary Font', sans-serif;
}
```

Don't forget to import your fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;600;700&display=swap" rel="stylesheet">
```

---

### **Spacing & Layout**

Adjust spacing in `styles.css`:

```css
:root {
    --section-padding: 100px 0;      /* Reduce/increase section spacing */
    --border-radius: 20px;           /* Adjust corner roundness */
}
```

---

### **Liquid Animation Speed**

Control animation speed in `styles.css`:

```css
.liquid-morph {
    animation: liquidMorph 20s ease-in-out infinite; /* Change 20s to adjust speed */
}

.liquid-ripple {
    animation: liquidRipple 3s ease-out infinite; /* Change 3s to adjust */
}
```

---

### **Division-Specific Customization**

You can easily add or remove divisions:

1. **To Add a 4th Division:**
   - Copy an existing `<div class="division-block">` section
   - Create new CSS class like `.division-yourname`
   - Define colors in CSS

2. **To Remove a Division:**
   - Delete the corresponding `<div class="division-block">` section
   - Remove associated CSS if desired

---

## 🌐 SEO & Schema Customization

### **Update Schema.org Data**

In `index.html` (Lines 70-120):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YOUR COMPANY",
  "legalName": "YOUR COMPANY (Pvt) Ltd",
  "url": "https://yourwebsite.com",
  "description": "Your company description...",
  "knowsAbout": [
    "Your Industry 1",
    "Your Industry 2",
    "Your Service 1"
  ]
}
</script>
```

---

## 📱 Logo & Favicon

### **Replace Logo:**
1. Replace `Pegas_Logo.png` with your logo (recommended size: 200x200px)
2. Keep the filename or update in HTML/CSS where referenced

### **Replace Favicon:**
1. Replace `favicon_image.png` with your favicon
2. Recommended size: 512x512px for best quality
3. Update `site.webmanifest` with your company details

---

## 🎯 Division Color Scheme Examples

### **Professional Blue Business:**
```css
--primary-color: #3b82f6;
--primary-dark: #2563eb;
--primary-light: #60a5fa;
```

### **Modern Purple Tech:**
```css
--primary-color: #8b5cf6;
--primary-dark: #7c3aed;
--primary-light: #a78bfa;
```

### **Bold Red Corporate:**
```css
--primary-color: #ef4444;
--primary-dark: #dc2626;
--primary-light: #f87171;
```

### **Premium Gold/Orange:**
```css
--primary-color: #f59e0b;
--primary-dark: #d97706;
--primary-light: #fbbf24;
```

---

## 🔧 Quick Checklist for White Labeling

- [ ] Update brand colors in `styles.css`
- [ ] Replace company name throughout `index.html`
- [ ] Update meta tags and SEO information
- [ ] Replace logo and favicon files
- [ ] Update contact information
- [ ] Customize business division names and content
- [ ] Update division colors to match your brand
- [ ] Change fonts if needed
- [ ] Update Schema.org structured data
- [ ] Test all animations and liquid effects
- [ ] Verify mobile responsiveness
- [ ] Update footer links and information

---

## 🎨 Maintaining Brand Consistency

The website uses **CSS variables** throughout, which means:
- ✅ Change color once, updates everywhere
- ✅ All animations automatically use your brand colors
- ✅ Dark mode adapts to your colors
- ✅ Liquid effects use your theme
- ✅ All gradients stay consistent

---

## 💡 Tips for Best Results

1. **Keep contrast ratios accessible** (use tools like WebAIM Contrast Checker)
2. **Test your color scheme in both light and dark modes**
3. **Ensure liquid animations match your brand personality**
4. **Keep the three-division structure for best UX**
5. **Test on multiple devices and screen sizes**

---

## 📞 Support

For advanced customization or questions:
- Review the commented sections in `styles.css`
- All major sections are clearly labeled
- CSS variables are grouped by category
- Animations have adjustable parameters

---

## ✨ Features That Work Out-of-the-Box

No matter what colors you choose, these features automatically adapt:
- ✅ Liquid animations and morphing effects
- ✅ Hover effects and transitions
- ✅ Gradient overlays
- ✅ Glow effects
- ✅ Card animations
- ✅ Button effects
- ✅ Navbar glassmorphism
- ✅ Dark mode

---

**Your website is now ready to be white-labeled! All liquid animations, professional UI, and responsive design will work perfectly with your brand identity.**
