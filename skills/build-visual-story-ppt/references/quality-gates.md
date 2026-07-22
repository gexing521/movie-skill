# Quality Gates

## P0: must pass

- Every requested slide exists exactly once and uses the intended image.
- All images load and are nonblank.
- The primary render engine is recorded in `DESIGN.md`, has one source-of-truth timeline, and owns the preview, timing, transitions, captions, and MP4 render.
- For HyperFrames: `npx hyperframes lint` and `npx hyperframes validate` pass before preview; `npx hyperframes inspect --samples 15` has no unaddressed overflow, clipping, off-canvas, or collision finding; snapshots exist for every major beat and have been visually reviewed.
- For Remotion: Remotion Studio loads the selected composition, and still frames of the hook, mid-beat, densest scene, transition midpoint, and close have been visually reviewed.
- A browser recording or static-frame concatenation is not an accepted replacement for a primary-engine render.
- Primary text is readable at the body delivery aspect ratio. For this series, inspect body pages at 1920x1080 and stress-test at 1280x720. Inspect the independent Douyin cover at 540x960 and 375x667.
- Focal content is not reduced to thin rails or tiny labels. At delivery size, meaningful body-stage text is at least 32 px, repeated modules are roughly 120 px high or larger, and the central frame is visibly occupied.
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
- Use one dominant visual event per scene. The opening must make a specific tension, contrast, or payoff visible before it explains it.
- Use generated examples and analogies, not generic AI robots or abstract circuitry.
- Keep stable target-aspect framing and verify `object-position` per slide.
- Keep body titles in a dedicated composition lane and protect faces and workflow nodes. Apply the 9:16 top and bottom cover safe areas only to the independent Douyin cover.
- Keep the title, supporting copy, and focal stage visually connected. Reject layouts with a large unused middle band between copy and the explanatory visual.
- Avoid large white caption cards floating over artwork.
- Reject dark developer dashboards, piles of same-size cards, thin information rails, generic AI imagery, floating code decoration, and large unused central space. Make color semantic and vivid when the story calls for energy.
- Keep page numbers and navigation secondary.
- Use motion to explain entry and progression, not continuous decorative movement.
- Build every scene's settled hero layout before adding its GSAP entrances. Use a consistent primary transition across related scenes; do not manually animate the outgoing scene away before the transition takes over.
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
Viewport: [delivery review size]
Slides inspected: all
Navigation: previous / next / dots
Assets: all loaded
Overlap: none found
Second viewport: [stress-test size]
Known limitations: [none or concise list]
```

Wait for entrance animation to finish before judging a screenshot. Reload after changing HTML, CSS, or assets.

## Video and subtitle gates

- Use the selected body delivery resolution, 30 fps, H.264, AAC, and `yuv420p` for broad compatibility. For this series, use 1920x1080.
- Use the selected primary composition and MP4 render path. Run the required HyperFrames or Remotion validation path before the user-requested final render.
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
- For Douyin, verify `images/00-douyin-cover.png` is 1080x1920, readable as a cover at 375x667, and kept separate from the horizontal body MP4 unless the user requests otherwise.
