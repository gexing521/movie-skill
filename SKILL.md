---
name: episode-04-video-generator
description: Generate the Episode 04 CC Switch narrated video from its approved script and web deck using MiniMax TTS, real word timestamps, browser-recorded page motion, and FFmpeg subtitle variants.
---

# Episode 04 Video Generator

This folder is a self-contained, portable skill and source package. Run it from the package root.

## Required tools

- Node.js 20 or later
- FFmpeg 7 or later on `PATH`
- A MiniMax API key in `MINIMAX_API_KEY`

Install the JavaScript dependency once with `npm install`, then install Chromium with `npx playwright install chromium`.

## Generate

Use the approved narration in `scripts/episode-04-script.md` and keep its five page headings aligned with `episode-04/index.html`.

```bash
export MINIMAX_API_KEY='your-minimax-api-key'
npm run build:video
```

The command synthesizes one WAV and word-timestamp JSON per page, derives timed subtitles and beat offsets, records the actual HTML motion, then outputs three files in `video/episode-04/minimax/`:

- `episode-04-narrated.mp4`
- `episode-04-narrated-soft-subtitles.mp4`
- `episode-04-narrated-burned-subtitles.mp4`

Use the burned-subtitles version as the publishing default. `Chinese_playful_streamer_nv1` at `1.10` speed is the active voice configuration in `video/episode-04/generate_minimax_narration.mjs`.

## Revision rules

- Change narration and page copy only in the script/deck, then rerun the complete `build:video` command.
- Keep `MINIMAX_API_KEY` outside this folder. Do not add it to source files, `.env` files intended for sharing, artifacts, or logs.
- Re-run `npm run validate:subtitles` after any TTS update.
- The bundled reference material under `skills/` documents the visual-story and FFmpeg workflow used by this package.
