# Douyin Vertical Delivery

Use this reference for Douyin and this AI explainer series unless the user explicitly requests another platform or format.

## Delivery Contract

- Build the source page at 9:16. Deliver video at 1080x1920, 30 fps, H.264, AAC, and `yuv420p`.
- Do not design in 16:9 and crop later. The vertical composition, title line breaks, cards, and subtitle position must be intentional from the page map onward.
- Use a full-canvas 9:16 HTML deck. Keep direct navigation, touch navigation, keyboard navigation, and reduced-motion behavior.

## Cover First

1. Treat page 1 as a dedicated first-frame cover, not an incidental body frame.
2. Generate the visual background without readable text. Use supplied portrait references only as identity references and keep the face unobstructed.
3. Put the exact series label and topic title in HTML or the editor. Make the topic readable at thumbnail size.
4. Export `images/00-douyin-cover.png` at exactly 1080x1920. Verify its pixels with `file`, `sips`, or equivalent.
5. Hold the cover as the first 1.2 seconds of the final MP4. Delay narration audio by the same duration so the cover is silent and usable as a selected first frame.

## Safe Composition

- Reserve the top 12% and bottom 18% for Douyin chrome and captions. Keep the focal title, face, and decisive diagram elements in the middle 70%.
- Keep the title and portrait on separate visual lanes. Never let title typography cross eyes, glasses, a face, a key workflow node, or a pricing/approval boundary.
- When the series has a recurring creator character, store one approved master asset under `images/` and place it in the lower-right lane at roughly 28%-35% of canvas width. Keep its head and body out of the title lane and its feet above the caption safe area. The recurring character is a recognisable secondary cue, never the cover's dominant subject.
- Use short, deliberate title line breaks. Rewrite copy before shrinking it. Do not let a single Chinese character wrap alone.
- Make the first slide title visually dominant. Keep explanatory copy, page number, and CTA secondary.

## Motion And Timing

- Read `short-form-motion.md` and use its beat contract. Keep one stable primary card or background while a focal group enters.
- Resolve all final beat cues from TTS word timestamps. Use temporary offsets only before narration exists.
- Give every later beat a 320-650 ms purposeful entry. Use `slide`, `pop`, `fold`, `reveal`, `roll`, or `stamp`; do not use continuous drift, bounce, or fade-only sequences.
- Record actual HTML motion for multi-beat pages. Do not assemble a final video from only settled screenshots.

## Vertical QA

1. Inspect every slide at 540x960 after animation settles.
2. Stress-test opening, densest layout, every unique card layout, and closing CTA at 375x667. Fix collisions by changing layout or copy, never by making the key text too small.
3. Capture pre-entry, midpoint, and settled frames for every distinct beat layout. Confirm the midpoint visibly differs from both endpoints.
4. Verify the exported cover is 1080x1920 and is the first frame of the MP4.
5. Inspect burned subtitles above the bottom 18% and away from faces, workflow nodes, or cover typography.
6. Restore any temporary browser viewport override after QA.
