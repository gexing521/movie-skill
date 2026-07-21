# Quality Gates

## P0: must pass

- Every requested slide exists exactly once and uses the intended image.
- All images load and are nonblank.
- Primary text is readable at 1280x720.
- No title, caption, page number, or navigation control covers a key subject, logo, label, face, diagram node, table, or file object.
- No text runs outside its container or wraps as a single orphan character.
- All exact labels in generated images are spelled correctly.
- Slide order matches the page-by-page narration.
- Arrow keys, touch navigation, and navigation dots work.
- Transitions settle without leaving the previous slide visible or blocking interaction.
- Secrets, authorization headers, and image base64 data are absent from project files and logs.

## P1: visual quality

- Use one visual language across the deck: palette, character, line weight, and medium.
- Use one dominant idea per page.
- Use generated examples and analogies, not generic AI robots or abstract circuitry.
- Keep stable 16:9 framing and verify `object-position` per slide.
- Keep titles in a dedicated safe region; prefer a separate bottom rail for full-image slides.
- Avoid large white caption cards floating over artwork.
- Keep page numbers and navigation secondary.
- Use motion to explain entry and progression, not continuous decorative movement.
- On every multi-point page, each later beat enters with both opacity and purposeful movement over 300-700 ms. A beat must not appear at full opacity in a single frame.
- Verify the first multi-point page, the densest diagram or list page, and every distinct beat layout at pre-beat, midpoint, and settled states. Check that the midpoint differs visibly from both endpoints.
- For each multi-point page, listen to the narration cue and confirm the named element enters within roughly one second of that cue. A visual sequence that merely progresses independently of speech fails this check.
- Do not pass motion QA by checking only the settled final state of each beat.
- Honor `prefers-reduced-motion`.

## P1: content quality

- Use everyday language and examples.
- Explain relationships before comparing products.
- Verify current claims and qualify changing product details.
- Do not claim compatibility merely because an image shows several models near one tool.
- Do not promise downloads, diagrams, prompt packs, or other resources that do not exist.
- Make the CTA relevant and modest.
- Read each `翻页衔接` together with the next page opening. Remove repeated example names, numbering, questions, and conclusions before TTS generation.

## Browser verification record

Record these checks in working notes or the final summary:

```text
Viewport: 1280x720
Slides inspected: all
Navigation: previous / next / dots
Assets: all loaded
Overlap: none found
Second viewport: [size]
Known limitations: [none or concise list]
```

Wait for entrance animation to finish before judging a screenshot. Reload after changing HTML, CSS, or assets.

## Video and subtitle gates

- Use 1920x1080, 30 fps, H.264, AAC, and `yuv420p` for broad compatibility.
- Make the video duration match the timing plan within one frame.
- Verify the soft-subtitle MP4 contains a Chinese subtitle stream.
- Keep every subtitle interval positive, ordered, and non-overlapping.
- Keep subtitle chunks near 10-20 Chinese characters; avoid intervals shorter than 2 seconds when timing permits.
- Do not begin a subtitle with orphan punctuation.
- Keep burned subtitles above the deck title rail and away from key diagram labels, faces, and logos.
- Extract and inspect frames from at least three points, including the densest slide.
- Verify transitions at their midpoint, not only on static frames.
- Keep pages static by default. Run `freezedetect` and confirm the frozen intervals cover every page outside its transition window.
- When the TTS API returns word timestamps, build subtitles from those timestamps and the approved narration instead of estimated timing.
- Confirm pronunciation rules do not create repeated English product names in the SRT.
- State clearly when the audio track is silent and intended for later voice-over replacement.
