# Pinterest Images Integration Guide

## 📸 How to Add Your Pinterest Images

### Step 1: Get Pinterest Image URLs

For each canto, find an appropriate image on Pinterest and get its direct image URL:

1. Go to Pinterest and find the image
2. Right-click on the image → "Copy image address" or "Open image in new tab"
3. Copy the full URL (should end in .jpg, .png, etc.)

### Step 2: Replace URLs in Code

Open `app/cantos/page.tsx` and replace the Unsplash URLs with your Pinterest URLs:

```typescript
const CANTOS_DATA = [
  {
    canto: 1,
    title: "Creation and Cosmology",
    image: "YOUR_PINTEREST_URL_HERE", // Replace this line
  },
  // ... repeat for all 12 cantos
]
```

### Current Image Placeholders

All 12 cantos currently have Unsplash placeholder images. Replace each one:

| Canto | Title | Theme for Image |
|-------|-------|-----------------|
| 1 | Creation and Cosmology | Universe, cosmic creation, stars |
| 2 | The Cosmic Manifestation | Brahman, spiritual light, cosmos |
| 3 | The Status Quo | Lord Brahma, creation deity |
| 4 | The Creation of the Fourth Order | Genealogy, family tree, lineage |
| 5 | Fruitive Results of Vedic Rituals | Yamaraja, justice, dharma |
| 6 | Prescribed Duties for Mankind | Righteousness, duty, path |
| 7 | The Science of God Realization | Prahlada, devotion, meditation |
| 8 | Withdrawal of Cosmic Creations | Dissolution, cosmic cycle |
| 9 | Liberation | Moksha, freedom, enlightenment |
| 10 | The Pastimes of Lord Krishna | Krishna, divine play, flute |
| 11 | The General History | Krishna teaching, Uddhava Gita |
| 12 | The Age of Deterioration | Kali Yuga, modern age, prophecy |

### Example Replacement

Before:
```typescript
{
  canto: 10,
  title: "The Pastimes of Lord Krishna",
  image: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=800&h=600&fit=crop",
}
```

After:
```typescript
{
  canto: 10,
  title: "The Pastimes of Lord Krishna",
  image: "https://i.pinimg.com/originals/xx/yy/zz/xxyyzz_krishna_image.jpg",
}
```

### Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 800x600 or larger
- **Aspect Ratio**: 16:9 or 4:3 works best
- **Quality**: High resolution for crisp display

### Testing

After adding your Pinterest URLs:
1. Save the file
2. Refresh your browser
3. Navigate to `/cantos` page
4. Images should load automatically

### Troubleshooting

**Image not loading?**
- Check if the URL is correct and accessible
- Pinterest may block hotlinking - try downloading and hosting locally
- Use browser DevTools (F12) → Network tab to see if image loads

**Alternative: Host Images Locally**
1. Download images from Pinterest
2. Place in `public/images/cantos/` folder
3. Use path: `image: "/images/cantos/canto-1.jpg"`

### Next.js Image Optimization (Optional)

For better performance, you can use Next.js Image component:

1. Update `components/canto-card.tsx`
2. Replace `<img>` with Next.js `<Image>`
3. Add width and height props

This will automatically optimize images for faster loading!
