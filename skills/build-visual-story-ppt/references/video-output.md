# Narration-Timed Video Output

Read `douyin-vertical-delivery.md` before producing the independent Douyin cover. It governs that 1080x1920 image only; the body video keeps its selected delivery ratio.

## Contents

- Timing authority
- Frame capture
- Video assembly
- Subtitle construction
- Verification

## Timing authority

Use supplied or generated narration audio as the timing authority. Measure each page audio file and align slide changes to its final pause. Synthesize page by page rather than as one long request so a revised page can be regenerated independently.

When each page ends with a pause of `P` seconds and the transition occupies that pause:

```text
page_start[0] = 0
page_start[n] = page_start[n-1] + page_duration[n-1] - P
final_duration = sum(page_duration) - P * (page_count - 1)
```

Without audio, estimate each slide from its `口播` and `翻页衔接` text:

```text
duration = weighted_characters / speech_rate * 60 + pause
```

Default to 200 Chinese characters per minute and a 1-2 second page pause. Count an English product name as roughly 1.5 Chinese characters. Report that the result is a silent voice-over base rather than implying it contains narration.

## Frame capture

1. Set the browser viewport to the body delivery resolution: 1920x1080 for this series' horizontal work.
2. Reload the deck and wait for entrance motion to settle.
3. Capture every page, including the bottom title rail.
4. Restore the browser viewport afterward.
5. Store frames as `video/<episode>/frames/01.png` and so on.

When using Playwright video recording, account for the short interval before the local deck has loaded. Add a small render lead (about 0.5-0.7 seconds) to every CSS beat delay, record the lead plus the real page duration, then trim exactly that lead from the recorded clip before assembly. Verify that each source recording is longer than `lead + page_duration`; otherwise the final page clip can lose its last beat or begin with an unintended browser frame.

## Within-slide motion capture

For a slide that contains several narrated visual beats, a settled screenshot per beat is insufficient: the resulting delivery will jump from state to state. Treat the browser animation as the visual source of truth.

1. Store an exact spoken cue for each beat in the page map, such as `第二下，点选当前要用的那一份` rather than only `60%`.
2. After synthesis, resolve each cue to its first word timestamp and store its page-relative seconds in the manifest. Pass those measured offsets into the deck's render mode. Use a percentage only before TTS exists, then replace it before final recording.
3. Each entering group must use a 300-700 ms `opacity` plus small `translate` or `scale` transition. Keep movement under about 48 delivery pixels unless the motion represents a spatial relationship.
4. Record the rendered page directly as video, or capture frames at enough density to preserve the transition. Do not create a page clip by concatenating only its settled beat states. Do not reuse the same generic beat schedule across pages with different sentence structures.
5. Use a static endpoint mode only for screenshot QA, never as the sole motion source in the final video.
6. Keep page-level camera position fixed. Beat motion should explain sequence, hierarchy, selection, or consequence rather than add decoration.

## Video assembly

Render a static page frame or a motion-recorded page clip into constant-frame-rate H.264 before applying `xfade`. This avoids FFmpeg time-base failures.

Use the selected delivery format:

- 1920x1080 for this series' horizontal body video, or another explicitly selected body ratio;
- 30 fps;
- H.264 `yuv420p`;
- AAC at 48 kHz, preserving mono or stereo narration as appropriate;
- completely static frames during one-point page display, or real captured beat motion during multi-point page display;
- 0.6-0.8 second restrained transitions.

Export a Douyin cover separately as `images/00-douyin-cover.png`. Do not concatenate it into the horizontal body timeline unless the user explicitly requests an in-video vertical intro.

Do not apply slow `zoompan` by default. Tiny fractional crop changes on a 1920x1080 source can round to adjacent pixels and look like camera shake. Keep explanatory movement in the HTML deck and page transitions, not as continuous video drift.

Use a still-frame filter such as:

```text
fps=30,format=yuv420p
```

Only add page-level push or zoom motion when the user explicitly requests it. Render motion above delivery resolution and downsample for smoother subpixel movement, then inspect it at 100% scale.

Create three outputs:

1. `*-narrated.mp4`: clean picture with the narration audio track;
2. `*-narrated-soft-subtitles.mp4`: MP4 with a `mov_text` Chinese subtitle stream;
3. `*-narrated-burned-subtitles.mp4`: subtitles rendered into the video.

When narration is unavailable, use the `*-screen` names and include a silent AAC track so later replacement is straightforward.

## Subtitle construction

- Generate SRT from the same page narration that determines slide duration.
- Prefer word timestamps returned by the TTS API. Do not estimate subtitle timing when real timestamps exist.
- Map timestamps back to the approved narration text so pronunciation dictionaries or IPA entries do not duplicate visible English words.
- Prefer 10-20 Chinese characters per event.
- Keep an event on screen for roughly 2-6 seconds.
- Merge short English model names with neighboring text.
- Attach punctuation to the preceding text.
- Leave a short gap at slide transitions.
- Place burned captions above the deck title rail.
- Use a readable Chinese font and a compact translucent dark background.

Because libass may use a 384x288 subtitle coordinate space for SRT, test the actual rendered size at the final delivery resolution. On this macOS renderer, start with `FontSize=6`, `BorderStyle=3`, and a translucent background, then inspect a crowded page; larger nominal sizes can become oversized at 1080x1920. Keep the subtitle box above the bottom 18% safe zone and below the active diagram or card, rather than trusting the numeric margin alone.

## Verification

Use `ffprobe` to verify:

- the selected delivery resolution and 30 fps;
- expected duration;
- H.264 video and AAC audio;
- `mov_text` subtitle stream tagged `zho` in the soft-subtitle file.

Programmatically check SRT order, positive durations, non-overlap, maximum line length, and orphan punctuation. Extract frames during at least three subtitle events and one transition for visual inspection.

Run the bundled validator:

```bash
node SKILL_DIR/scripts/validate_srt.mjs VIDEO.srt
```

For one-point static-page videos, verify every non-transition interval using FFmpeg freeze detection:

```bash
ffmpeg -hide_banner -i VIDEO.mp4 -an \
  -vf "freezedetect=n=-50dB:d=2" -f null - 2>&1 \
  | rg 'freeze_(start|end|duration)'
```

The reported frozen intervals should cover each page between transitions. Encoding noise may change raw frame hashes, so use freeze detection and visual inspection rather than requiring byte-identical decoded frames.

For multi-point motion pages, instead extract frames immediately before a beat, midway through its 300-700 ms entrance, and after it settles. The mid-transition frame must show an intermediate opacity or position. Compare consecutive decoded frames around the beat and fail QA when a new element changes from absent to fully visible in one frame.
