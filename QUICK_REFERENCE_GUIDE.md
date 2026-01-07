# 🎨 Pegas Website - Quick Reference Guide

## 📋 Table of Contents
1. [Website Structure](#website-structure)
2. [Three Business Divisions](#three-business-divisions)
3. [Liquid Animation Effects](#liquid-animation-effects)
4. [White Labeling](#white-labeling)
5. [Customization Tips](#customization-tips)

---

## 🏗️ Website Structure

### **Main Sections:**
1. **Header/Navigation** - Glassmorphism navbar with smooth scrolling
2. **Hero Section** - Main headline with 3 floating division cards
3. **Stats Section** - Company statistics
4. **About Section** - Overview of three-division business model
5. **Business Divisions Section** ⭐ NEW - Detailed showcase of all three divisions
6. **Services Section** - Detailed service offerings
7. **Portfolio Section** - Project showcase
8. **Contact Section** - Contact form and information
9. **Footer** - Links organized by division

---

## 🔷 Three Business Divisions

### **Division 01: Information Technology** 
**Color:** Blue (#3b82f6)

**Features:**
- Software Development
- Cloud Services
- Cybersecurity
- AI & Automation

**Stats:**
- 100+ IT Projects
- 24/7 Support
- 99.9% Uptime

---

### **Division 02: Manufacturing Excellence**
**Color:** Orange (#f59e0b)

**Features:**
- Advanced Production
- Quality Assurance (ISO Certified)
- Sustainability
- Custom Solutions

**Stats:**
- 10K+ Units/Month
- ISO Certified
- 98% Quality Rate

---

### **Division 03: Distribution Network**
**Color:** Green (#10b981)

**Features:**
- Smart Warehousing
- Fast Delivery
- Real-Time Tracking
- Global Reach

**Stats:**
- 500+ Daily Deliveries
- 50+ Distribution Points
- 99% On-Time Rate

---

## ✨ Liquid Animation Effects

### **Animation Types:**

1. **Liquid Morph** - Organic blob backgrounds
   - Applied to: Division backgrounds
   - Duration: 20s infinite loop
   - Effect: Smooth morphing shapes

2. **Liquid Ripple** - Expanding circle effect
   - Applied to: Feature card icons
   - Duration: 3s infinite
   - Effect: Pulsing ripple from center

3. **Liquid Pulse** - Breathing animation
   - Applied to: Division icons
   - Duration: 4s infinite
   - Effect: Scale and morph combined

4. **Liquid Orbit** - Rotating rings
   - Applied to: Integration section icon
   - Duration: 10-20s variable
   - Effect: Orbital rotation with scale

5. **Liquid Arrow** - Flow animation
   - Applied to: Process flow diagram
   - Duration: 2s infinite
   - Effect: Flowing gradient through arrow

### **Performance:**
- ✅ GPU-accelerated (CSS transforms)
- ✅ 60fps smooth animations
- ✅ No JavaScript dependencies
- ✅ Optimized for all devices

---

## 🎨 White Labeling

### **5-Minute Color Change:**

1. Open `styles.css`
2. Find `:root` section (around line 20)
3. Change these variables:

```css
--primary-color: #YOUR_COLOR;
--primary-dark: #YOUR_DARK_SHADE;
--primary-light: #YOUR_LIGHT_SHADE;
```

**All animations, gradients, and effects automatically update!**

### **Quick Customization Checklist:**

```
✅ Brand Colors (5 min) - styles.css line 20-40
✅ Company Name (5 min) - Search & replace "Pegas"
✅ Logo (2 min) - Replace Pegas_Logo.png
✅ Favicon (2 min) - Replace favicon_image.png
✅ Contact Info (5 min) - Update in contact section
✅ Meta Tags (5 min) - Update SEO information
✅ Division Content (15 min) - Customize division details
```

**Total Time: ~40 minutes for complete white labeling**

---

## 💡 Customization Tips

### **Division Colors (For Reference):**

**Blue/Tech Theme:**
```css
--primary-color: #3b82f6;
--primary-dark: #2563eb;
--primary-light: #60a5fa;
```

**Purple/Creative:**
```css
--primary-color: #8b5cf6;
--primary-dark: #7c3aed;
--primary-light: #a78bfa;
```

**Red/Bold:**
```css
--primary-color: #ef4444;
--primary-dark: #dc2626;
--primary-light: #f87171;
```

**Orange/Energy:**
```css
--primary-color: #f59e0b;
--primary-dark: #d97706;
--primary-light: #fbbf24;
```

---

### **Animation Speed Control:**

**Faster Animations:**
```css
.liquid-morph {
    animation: liquidMorph 10s ease-in-out infinite; /* Was 20s */
}
```

**Slower Animations:**
```css
.liquid-morph {
    animation: liquidMorph 30s ease-in-out infinite; /* Was 20s */
}
```

---

### **Division-Specific Styling:**

Each division has unique styling that can be customized:

```css
/* IT Division - Blue Theme */
.division-it {
    border-top: 5px solid #3b82f6;
}

/* Manufacturing Division - Orange Theme */
.division-manufacturing {
    border-top: 5px solid #f59e0b;
}

/* Distribution Division - Green Theme */
.division-distribution {
    border-top: 5px solid #10b981;
}
```

---

## 📱 Responsive Breakpoints

The website automatically adapts to:

- **Desktop:** 1920px+
- **Laptop:** 1366px - 1920px
- **Tablet:** 768px - 1366px
- **Mobile:** 320px - 767px

All liquid animations are optimized for each breakpoint.

---

## 🎯 Key Features

### **What Makes This Website Special:**

1. ✨ **Liquid Animations** - Smooth, organic movements throughout
2. 🎨 **Three-Division Structure** - Clear business unit separation
3. 🔧 **White Label Ready** - Easy customization in minutes
4. 📱 **Fully Responsive** - Perfect on all devices
5. ⚡ **Performance Optimized** - Fast loading, smooth animations
6. 🔍 **SEO Enhanced** - Proper metadata and schema markup
7. 🌗 **Dark Mode** - Automatic theme switching
8. ♿ **Accessible** - Follows web accessibility standards

---

## 📂 Important Files

### **Core Files:**
- `index.html` - Main website structure
- `styles.css` - All styling and animations
- `script.js` - Interactive functionality

### **Documentation:**
- `WHITE_LABELING_GUIDE.md` - Complete customization guide
- `WEBSITE_TRANSFORMATION_SUMMARY.md` - Detailed changes made
- `QUICK_REFERENCE_GUIDE.md` - This file

### **Assets:**
- `Pegas_Logo.png` - Company logo
- `favicon_image.png` - Website favicon
- `site.webmanifest` - PWA manifest

---

## 🚀 Getting Started

### **View Your Website:**
1. Open `index.html` in a web browser
2. All animations work immediately
3. Responsive on all screen sizes

### **Customize Your Website:**
1. Read `WHITE_LABELING_GUIDE.md`
2. Follow the 5-minute color change guide
3. Update company information
4. Replace logo and favicon
5. Test on multiple devices

### **Deploy Your Website:**
1. Upload all files to your web host
2. Ensure file structure is maintained
3. Update URLs in meta tags
4. Test all functionality
5. Submit to search engines

---

## 📊 CSS Variables Reference

### **Quick Access to Main Variables:**

```css
/* Colors */
--primary-color: #10b981;
--primary-dark: #059669;
--primary-light: #34d399;

/* Spacing */
--section-padding: 120px 0;
--border-radius: 25px;

/* Fonts */
--font-primary: 'Plus Jakarta Sans', sans-serif;

/* Transitions */
--transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 🎨 Division Integration Flow

The website showcases how your three divisions work together:

```
IT Innovation → Manufacturing → Distribution
```

**Visual Elements:**
- Animated flow arrows
- Division icons with liquid effects
- Connecting elements
- Integration description

---

## ✅ Quality Checklist

Before deploying, ensure:

- [ ] All colors match your brand
- [ ] Company name updated everywhere
- [ ] Contact information correct
- [ ] Logo and favicon replaced
- [ ] Meta tags updated
- [ ] All links working
- [ ] Mobile responsive tested
- [ ] Animations smooth on all devices
- [ ] SEO information complete
- [ ] Dark mode working properly

---

## 💬 Need Help?

### **Common Questions:**

**Q: How do I change the main color?**
A: Edit `--primary-color` in `styles.css` line ~30

**Q: Can I add more divisions?**
A: Yes! Copy an existing division block and customize

**Q: How do I slow down animations?**
A: Increase animation duration values (e.g., 20s → 30s)

**Q: Is this mobile-friendly?**
A: Yes, fully responsive on all devices

**Q: Can I change fonts?**
A: Yes, update `--font-primary` and import new fonts

---

## 🌟 Pro Tips

1. **Keep division colors distinct** for easy identification
2. **Test animations on mobile** to ensure smooth performance
3. **Use consistent imagery** across all divisions
4. **Update content regularly** to keep information fresh
5. **Maintain the liquid animation theme** for brand consistency

---

**Your website is production-ready with professional liquid animations, three-division showcase, and complete white labeling support!**

---

*For detailed instructions, see WHITE_LABELING_GUIDE.md*
*For complete change summary, see WEBSITE_TRANSFORMATION_SUMMARY.md*
