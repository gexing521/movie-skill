# Douyin Cover Delivery

Use this reference for the independent 9:16 Douyin cover in this AI explainer series. The main video remains at its selected delivery ratio, normally 16:9 / 1920x1080.

## Delivery Contract

- Build the cover at 9:16 and export it as `images/00-douyin-cover.png` at 1080x1920.
- Design the cover directly at 9:16; never crop a 16:9 body page into a cover.
- Build the body deck at its own selected ratio. Do not add 9:16 safe zones, vertical subtitles, or a silent cover hold to the horizontal body video.

## Cover First

1. Treat the cover as an independent deliverable, not an incidental body frame.
2. Generate the visual background without readable text. Use supplied portrait references only as identity references and keep the face unobstructed.
3. Put the exact series label and topic title in HTML or the editor. Make the topic readable at thumbnail size.
4. Export `images/00-douyin-cover.png` at exactly 1080x1920. Verify its pixels with `file`, `sips`, or equivalent.
5. Do not require the cover to match the first frame of the body MP4 or add it to the video timeline. Only add a vertical opening frame when the user explicitly asks for one.

## Safe Composition

- Reserve the top 12% and bottom 18% for Douyin chrome and captions. Keep the focal title, face, and decisive diagram elements in the middle 70%.
- Build a continuous vertical reading path instead of separating a small title at the top from small cards at the bottom. Place the focal information stage around 38%-70% of canvas height and keep the settled gap between supporting copy and that stage under roughly 10% of canvas height.
- The focal stage must have visual mass: it should occupy at least about one third of the middle safe area. Do not leave the middle empty while attaching several thin cards or tiny labels near the caption rail.
- At 1080x1920 delivery size, use at least 22 px for meaningful text inside the focal stage and roughly 90 px minimum height for repeated action or decision modules. Decorative metadata may be smaller, but must never carry the idea of the page. Merge small labels into a larger structured block when they cannot meet this scale.
- Keep the title and portrait on separate visual lanes. Never let title typography cross eyes, glasses, a face, a key workflow node, or a pricing/approval boundary.
- When the series has a recurring creator character, store one approved master asset under `images/` and place it in the lower-right lane at roughly 28%-35% of canvas width. Keep its head and body out of the title lane and its feet above the caption safe area. The recurring character is a recognisable secondary cue, never the cover's dominant subject.
- Use short, deliberate title line breaks. Rewrite copy before shrinking it. Do not let a single Chinese character wrap alone.
- Make the first slide title visually dominant. Keep explanatory copy, page number, and CTA secondary.

## Vertical QA

1. Inspect every slide at 540x960 after animation settles.
2. Stress-test opening, densest layout, every unique card layout, and closing CTA at 375x667. Fix collisions by changing layout or copy, never by making the key text too small.
3. Capture pre-entry, midpoint, and settled frames for every distinct beat layout. Confirm the midpoint visibly differs from both endpoints.
4. Verify the exported cover is exactly 1080x1920. It is not expected to match the body MP4 first frame.
5. Restore any temporary browser viewport override after QA.
