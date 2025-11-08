# Hume AI TTS Setup Guide

## 🔧 Setup Steps

### 1. Create Environment File

Create a file named `.env.local` in the root directory with:

```env
HUME_API_KEY=vYVBr89Kfief6nCizxI8LNzu24OduuTTImxuF9iePlxB0A8Xh
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

### 4. Test the TTS Feature

1. Open http://localhost:3000
2. Navigate to any story/chapter page
3. Click "Listen to Chapter" button
4. Select a voice from the dropdown
5. Click the play button

## 🎤 Available Voices

- **Serene Monk** - Calm, meditative, peaceful tone
- **Bhakti Narrator** - Devotional, warm, reverent voice
- **Epic Storyteller** - Grand, dramatic, authoritative narration

Voices are generated dynamically by Hume AI based on text descriptions.

## 🐛 Debugging

### Check Console Logs

The app now has detailed logging. Open browser DevTools (F12) and check:

1. **Browser Console** - Look for `[AudioPlayer]` logs
2. **Server Terminal** - Look for `[TTS]` logs

### Common Issues

#### "HUME_API_KEY not configured"
- Make sure `.env.local` exists in the root directory
- Restart the dev server after creating `.env.local`

#### "Hume API error: 401"
- Invalid API key
- Check that the key is correct in `.env.local`

#### "Hume API error: 429"
- Rate limit exceeded
- Wait a few minutes and try again

#### "No audio generated"
- Check server logs for detailed error
- Text might be too long (max 3000 characters)

#### Audio doesn't play
- Check browser console for errors
- Try a different browser
- Make sure browser allows audio playback

## 📝 What Was Fixed

1. **Enhanced Logging** - Added detailed console logs throughout the flow
2. **Better Error Messages** - Shows specific API errors to help debug
3. **Voice Names Updated** - Changed to correct Hume voice IDs (ITO, KORA, DACHER)
4. **Text Truncation** - Automatically truncates long text to 3000 chars
5. **Improved Error Display** - Audio player shows detailed error messages

## 🔍 Testing Checklist

- [ ] `.env.local` file created with API key
- [ ] Dependencies installed (`pnpm install`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Can navigate to a story page
- [ ] "Listen to Chapter" button appears
- [ ] Voice selector works
- [ ] Audio player shows loading state
- [ ] Audio plays successfully
- [ ] Can pause/resume audio
- [ ] Progress bar works

## 📞 Need Help?

Check the logs in:
1. Browser console (F12 → Console tab)
2. Terminal where `pnpm dev` is running

Look for `[TTS]` and `[AudioPlayer]` prefixed messages.
