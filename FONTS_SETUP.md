# Custom Fonts Setup

## Current Configuration

- **Body Text**: Helvetica Neue → Helvetica → Coolvetica → Arial → system-ui
- **Headings**: Zen Antique (Google Font via Next.js)

## Adding Coolvetica Custom Font (Optional)

If you want to use the actual Coolvetica font file instead of relying on system fonts:

### 1. Get the Font Files

Download Coolvetica font files (.woff2, .woff, .ttf) and place them in:
```
public/fonts/coolvetica/
```

### 2. Add Font Face Declaration

Add to `app/globals.css` at the top (after @import statements):

```css
@font-face {
  font-family: 'Coolvetica';
  src: url('/fonts/coolvetica/coolvetica.woff2') format('woff2'),
       url('/fonts/coolvetica/coolvetica.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 3. Font Stack Priority

The current font stack is:
1. **Helvetica Neue** - Modern Helvetica variant (macOS/iOS)
2. **Helvetica** - Classic Helvetica (most systems)
3. **Coolvetica** - Custom font (if added)
4. **Arial** - Universal fallback
5. **system-ui** - System default
6. **sans-serif** - Generic fallback

This ensures the site looks good even if Coolvetica isn't installed or loaded.

## Notes

- Helvetica is a system font on most devices, so no download needed
- Coolvetica is optional and will be used if available
- Zen Antique is automatically optimized by Next.js
