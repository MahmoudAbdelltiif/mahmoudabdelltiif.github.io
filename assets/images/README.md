# Image Directory Structure

This directory contains all images for the portfolio website.

## Directory Guide

```
images/
├── profile/           # Your profile photo
│   └── photo.jpg      # Main profile photo (recommended: 400x400px)
│
├── case-studies/      # Case study images
│   ├── case-01/       # Each case study gets its own folder
│   │   ├── thumb.jpg  # Thumbnail (16:9, 1200x675px)
│   │   ├── slide-1.jpg # Gallery slide 1
│   │   ├── slide-2.jpg # Gallery slide 2
│   │   └── slide-3.jpg # Gallery slide 3
│   └── case-02/       # Add more folders as needed
│
├── certifications/    # Certification badge images
│   ├── google-ads.png
│   ├── meta-blueprint.png
│   └── ...
│
├── companies/         # Company logos for experience timeline
│   ├── efadh.png
│   ├── sapaq.png
│   └── ...
│
└── platforms/         # Platform SVG icons (already using inline SVGs)
```

## Important Notes

1. **Profile Photo**: Place your photo at `profile/photo.jpg` (400x400px recommended)
2. **Case Studies**: Create a folder for each case study (`case-01`, `case-02`, etc.)
3. **Thumbnails**: Must be 16:9 ratio, minimum 1200x675px
4. **Gallery Slides**: Same ratio as thumbnails, multiple per case study
5. **Company Logos**: PNG with transparent background, 64x64px recommended
6. **Certification Badges**: PNG with transparent background, 64x64px recommended

## How to Reference Images

In `data/case-studies.js`, reference images like:
```javascript
thumbnail: "assets/images/case-studies/case-01/thumb.jpg",
images: [
  "assets/images/case-studies/case-01/slide-1.jpg",
  "assets/images/case-studies/case-01/slide-2.jpg"
]
```

In HTML pages, reference images like:
```html
<img src="assets/images/profile/photo.jpg" alt="Mahmoud Abdellatif">
```
