---
name: build-visual-story-ppt
description: Turn source material, articles, outlines, or spoken scripts into a polished, high-retention visual-story video using HyperFrames HTML, CSS, and GSAP. Covers fact-checked structure, page-by-page narration, generated artwork, motion choreography, TTS, word-timed subtitles, HyperFrames rendering, and visual QA. Use when Codex needs to create or rebuild an image-led PPT/web deck, AI or technology explainer, lecture video, short-form presentation, visual keynote, narrated MP4, or a deck with synchronized voice-over and captions.
---

# Build Visual Story PPT

Create the video as a coherent production, not as isolated slides. Keep the narration, image plan, generated assets, beat timing, HyperFrames composition, and final HTML synchronized.

## Select the mode

- Use **Visual Story mode** for short videos, explainers, and image-led decks. Default to 4-8 scenes, one visual beat per scene, and a HyperFrames composition.
- Use **Editorial Presentation mode** for longer talks, data-heavy stories, or mixed layouts. Read and follow `$guizang-ppt-skill`; select one of its supported styles and registered layouts.
- Do not force a target slide count. Remove repetitive slides before compressing several ideas onto one page.

## Platform Format

- Ask for the publishing platform only when it is genuinely unknown. For this series, default to a 16:9, 1920x1080 main video plus an independent Douyin cover at 9:16, 1080x1920. Do not crop a horizontal body video into vertical.
- Read `references/douyin-vertical-delivery.md` before designing the independent Douyin cover. It defines cover safe areas and viewport checks; it does not change the selected body-video ratio.
- Design an independent 9:16 cover. Generate the background without readable text, place exact title typography in HTML or the editor, and export `images/00-douyin-cover.png` at 1080x1920. Do not force the cover into the body-video timeline unless the user explicitly requests an in-video vertical intro.

## Required companion skills

- Use `$starailink-image-generation` when the user requests or has configured StaraiLink. Otherwise use `$imagegen`.
- Use `$guizang-ppt-skill` for editorial templates, navigation conventions, or longer mixed-layout decks.
- Use the `$hyperframes` and `$hyperframes-cli` plugin skills for every Visual Story composition, motion timeline, preview, QA, and primary MP4 render. HyperFrames HTML and GSAP are the source of truth; do not substitute a browser recording script or independently concatenated page clips.
- Use `$FFmpeg Video Editor` only after HyperFrames renders when subtitle muxing, subtitle burn-in, compression, or metadata work is needed.
- Use `browser:control-in-app-browser` to review the HyperFrames Studio preview when an interactive browser check adds value.
- Use an authoritative research or documentation skill when the script contains current product claims, dates, prices, usage figures, or model capabilities.

## Visual Identity Gate

Before writing any composition HTML, create or update a project-local `DESIGN.md`. It must name the audience and emotional arc, specify a 3-5 color palette with roles, typography choices, motion/transition direction, and 3-5 visual anti-patterns to avoid. Derive every scene from this file.

For this AI tutorial series, prefer an energetic editorial social-video language: a clear visual contrast, vivid semantic accents such as electric blue, lime, hot pink, and orange, and one dominant visual event per scene. Use color to explain state and priority rather than as decoration. The hook must create an immediate before/after tension, for example “a wall of low-value output” collapsing into “one decisive next action.”

Reject dashboard grids, piles of identical cards, large empty middle bands, generic robots, floating code, generic circuitry, and dark tool-console layouts. Do not reuse the older `3D minimalist / C4D render` blue-grey default unless the user explicitly asks for it.

## Short-Form Motion Language

For vertical social-video pages or when a reference uses keyword-led motion, read `references/short-form-motion.md` before writing the beat table. Use the reference's motion grammar, not its watermark, branding, or exact visual design.

For horizontal 16:9 pages, use the `Horizontal Motion Library` in that reference. Prefer a centered hero that pins to a side before the next visual enters; select the motion by the relationship being explained, not by applying one fade preset to every page.

## Workflow

### 1. Audit the source

1. Read all supplied scripts, outlines, and existing deck files before rewriting.
2. Identify the audience, desired duration, CTA, output mode, publishing platform, and hard constraints from available context. Record the delivery aspect ratio before making a page map. Ask only when a missing choice would materially change the result.
3. Check factual claims. Remove invented statistics, future announcements, unsupported comparisons, and promised resources that do not exist.
4. Rewrite jargon into conversational examples. Prefer normal work such as drafting an email, cleaning a CSV, organizing invoices, comparing documents, or preparing a report.
5. Make the transitions explicit. Each section must answer why the next section follows.
6. Write `DESIGN.md` before authoring HTML. If the user has already specified visual direction, turn it into concrete colors, type, motion, and anti-patterns instead of asking them to repeat it.

### 2. Build the slide map

Create a page map before generating images. For each slide record:

- slide number;
- one narrative purpose;
- short on-screen title;
- visual story or comparison, including the vertical safe placement when applicable;
- narration assigned to that page;
- transition sentence into the next page.

For a short-form Visual Story deck, default to no more than 10 Chinese characters of primary on-screen copy per scene unless the user requests otherwise. Put explanations in the narration, not on the canvas.

When a page has more than one narrated visual point, add a beat table before implementation. For every beat record the exact narration cue, element group, entrance direction, motion verb, and settled state. Use 2-4 beats per page unless the topic genuinely needs more. A beat is an explanatory reveal, not a hard replacement of the entire slide. Do not use one generic set of normalized offsets for every page: write narration that names each visual point in sequence, then derive that page's offsets from the final TTS word timestamps.

Do not generate decorative filler. Every slide image must explain a noun, relationship, action, example, contrast, or conclusion from the narration.

### 3. Write image prompts

Write every page prompt before making API calls. Read `references/visual-story-contract.md` for the prompt and file contract.

Keep a shared art direction across all prompts:

- consistent palette, medium, line quality, and recurring character;
- derive color, material, and composition from `DESIGN.md`; for this AI tutorial series, favor vivid, high-contrast editorial scenes that make the spoken comparison legible at a glance. Avoid dashboard chrome, generic robots, floating-code decoration, and text baked into images;
- composition matching the delivery aspect ratio, with safe margins reserved for platform UI and subtitles;
- exact allowed labels listed verbatim;
- no extra readable text, watermark, page chrome, or fake UI;
- composition tied to the spoken example rather than generic AI imagery.

Create a dedicated prompt for every important analogy. For example, if the narration says “the model is an engine and Codex is a car,” generate the engine/car visual instead of leaving the idea as text.

### 4. Generate and inspect images

1. Generate to `output/imagegen/` first. Never overwrite an existing asset without authorization.
2. Inspect every result before inserting it. Check dimensions, spelling, unwanted labels, missing subjects, unsafe cropping, and consistency with prior slides.
3. Regenerate only the failed page. Keep accepted images unchanged.
4. Copy accepted images into the deck `images/` directory with `{page}-{meaning}.png` names.
5. Keep generated secrets outside files and logs. Let the selected image skill manage credentials.

### 5. Assemble the deck

For Visual Story mode:

1. Initialize the project with `npx hyperframes init <project-name> --non-interactive`. Keep the root `index.html`, `compositions/`, narration assets, `DESIGN.md`, and snapshots together in the HyperFrames project.
2. Build the hero frame statically before adding motion. Each composition needs a unique `data-composition-id`, a declared duration and dimensions, a paused GSAP timeline registered in `window.__timelines`, and deterministic animation only.
3. Use a flex-based scene container with padding, stable dimensions, and responsive constraints. Reserve absolute positioning for decoration. In this series, meaningful body-stage text must be at least 32 px; repeated function or decision modules must be at least about 120 px high. When content does not fit, combine or rewrite it instead of shrinking it.
4. Give every scene a dominant visual event tied to the narration. Use 2-4 purposeful entrances per multi-point scene. Elements must enter with opacity plus a distinct motion; do not reveal a completed screen all at once.
5. Use transitions between scenes. Choose one primary transition for 60-70% of changes plus one or two accents. Do not add manual exit animations before a scene transition; the transition performs the handoff.
6. Keep titles out of faces, logos, diagram nodes, and example objects. For 9:16, use a dedicated composition and follow the cover safe zones rather than stretching a horizontal layout.
7. Use exact commands, filenames, and product names as HTML text, never as generated-image text.

For Editorial Presentation mode, follow the selected guizang template and its validation rules instead of the bundled shell.

### 6. Produce page-by-page narration

Create `scripts/<episode>-script.md` with one section per slide:

```markdown
## 第 1 页｜短标题

**画面**：一句话说明观众看到什么。

**口播**：

可直接朗读的内容。

**翻页衔接**：自然引出下一页。
```

Keep slide numbers, titles, images, and narration in the same order. Do not add a CTA for nonexistent downloads or materials. Use ordinary community or follow-up language when a CTA is needed.

Before generating speech, audit every page boundary using the exact flattened TTS text:

- Read the current page's `翻页衔接` together with the next page's first two sentences.
- Name an example only once. Do not say both “the first scene is writing an email” and “first, write an email.”
- Let the transition introduce a change, question, or escalation; let the next page answer it with the concrete example.
- Do not end one page with the same conclusion used to open the next page.
- Remove repeated numbering when the visuals already establish the sequence.
- Lock the approved narration before calling a paid TTS API.

### 7. Verify the HyperFrames composition

Read `references/quality-gates.md` and complete every P0 check.

At minimum:

1. Run `npx hyperframes lint`, then `npx hyperframes validate`. Fix every error, missing asset, runtime error, and contrast warning before proceeding.
2. Run `npx hyperframes inspect --samples 15` for a new composition or substantial motion change. Fix overflow, clipping, off-canvas content, and unintentional overlap; only mark intentionally overflowing entrance decoration with the documented escape attribute.
3. Capture `npx hyperframes snapshot <project-dir> --at <beat-hero-times>` after validation. Inspect every snapshot, including hook, mid-beat, densest scene, key transition midpoint, and close. Check visual hierarchy, crop, legibility, safe areas, and that the named asset is present.
4. Start `npx hyperframes preview --port <available-port>` and scrub every beat in the Studio. For this series, inspect body compositions at 1920x1080 plus a 1280x720 stress check; inspect the independent Douyin cover at 540x960 and 375x667.
5. Fix visible overlap by changing the layout or safe area, not by merely shrinking text until it is unreadable. Fix a dry scene by strengthening the comparison or visual event, not by adding more cards or copy.

### 8. Render the narration-timed video

Read `references/video-output.md` when the user requests a recording, presentation video, subtitles, or a voice-over-ready timeline.

Read `references/minimax-tts.md` when MiniMax is selected or when the user wants API-generated audio and word-level subtitle timing.

For this Chinese tutorial series, use the calm narration preset in `references/minimax-tts.md` unless the user explicitly chooses another voice direction. Rewrite dense sentences for audible thought breaks before synthesis; do not rely on speed changes alone.

1. Prefer the real narration audio as the timing authority. If no recording exists, estimate duration at 180-220 Chinese characters per minute and state the selected rate.
2. Generate or record narration page by page so one revised page can be replaced without changing accepted pages.
3. Do not render an MP4 until the user explicitly requests an export. When requested, use `npx hyperframes render --output renders/<project-name>.mp4 --fps 30 --quality high` as the primary render path. For this series, the body video is 1920x1080; export its 1080x1920 cover separately.
4. Keep each page completely static by default only when it has one visual point. For a multi-point page, animate each beat with 300-700 ms of `opacity` plus a purposeful motion selected from the short-form motion language, aligned to its narration cue. Use final word timestamps to schedule the cue; page percentages are only a temporary pre-TTS fallback. Do not use instant visibility toggles for content appearing after page start.
5. HyperFrames renders real HTML beat motion and scene transitions. Do not use a browser recording script or concatenate settled screenshots as a substitute.
6. Do not apply `zoompan`, drifting crops, or decorative camera motion unless the user explicitly requests it and the result passes motion QA.
7. Use restrained 0.6-0.8 second transitions only at page boundaries and align them to a spoken pause.
8. Generate `timing.md` and an `.srt` file from the same narration source and real word timestamps whenever the TTS API provides them.
9. Keep subtitle chunks around 10-20 Chinese characters and at least 2 seconds when timing permits. Never leave punctuation or an English product name flashing alone.
10. Place burned subtitles in the platform-safe caption area with a restrained translucent background. Inspect sample frames from the opening, relationship page, example pages, transition midpoint, and closing page.
11. Output a clean narrated video, a soft-subtitle MP4, and a burned-subtitle MP4. Include a silent audio track only when narration does not exist.

### 9. Deliver

Return:

- the HyperFrames Studio preview URL;
- the independent 9:16 cover when the project targets Douyin;
- the page-by-page narration file;
- the image-prompt plan;
- inline preview of at least the opening visual;
- narration timing, SRT subtitles, and both subtitle video variants when video is requested;
- a concise note of what was verified and any limitation.

Do not provide only image paths. Keep the local preview server running when the user needs the URL.

## Output structure

Read `references/visual-story-contract.md` before creating directories or naming files. Keep scripts, prompts, accepted slide images, generated working images, and deck code separate so later revisions only touch the affected layer.

## Iteration rules

- When a slide feels repetitive, remove it instead of padding the deck to a round number.
- When the user says the deck is dry, improve the examples and visuals before adding more text.
- When text wraps badly, rewrite the copy first; then adjust width or size.
- When a caption covers the image, move it outside the image or redesign the layout. Do not guess a new overlay position without inspecting the page.
- When one generated image fails, regenerate that image only and keep the slide map stable.
- After changing CSS or assets, reload the local page before taking verification screenshots.
- When a rendered page appears to shimmer or drift, remove page-level camera motion and verify the static intervals with `freezedetect` before delivery.
