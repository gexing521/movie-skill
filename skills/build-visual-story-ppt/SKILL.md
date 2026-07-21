---
name: build-visual-story-ppt
description: Turn source material, articles, outlines, or spoken scripts into a polished visual-story presentation and narrated explainer video with fact-checked structure, page-by-page speaker notes, AI-generated slide artwork, minimal on-screen text, real TTS narration, word-timed subtitles, restrained transitions, and browser/video QA. Use when Codex needs to create or rebuild an image-led PPT/web deck, AI or technology explainer, lecture video, short-form presentation, visual keynote, narrated MP4, or a deck that must include generated images, speaker notes, voice-over, and synchronized subtitles.
---

# Build Visual Story PPT

Create the deck as a coherent production, not as isolated slides. Keep the narration, image plan, generated assets, beat timing, and final HTML synchronized.

## Select the mode

- Use **Visual Story mode** for short videos, explainers, and image-led decks. Default to 4-8 slides, one visual beat per slide, and the bundled `assets/visual-deck-shell.html`.
- Use **Editorial Presentation mode** for longer talks, data-heavy stories, or mixed layouts. Read and follow `$guizang-ppt-skill`; select one of its supported styles and registered layouts.
- Do not force a target slide count. Remove repetitive slides before compressing several ideas onto one page.

## Platform Format

- Ask for the publishing platform only when it is genuinely unknown. For this series and for Douyin, default to a 9:16, 1080x1920 delivery; do not build a 16:9 deck and crop it afterward.
- Read `references/douyin-vertical-delivery.md` before designing, rendering, or QA-ing a Douyin vertical episode. It defines the cover, safe areas, viewport checks, and delivery contract.
- Design the first frame as an independent cover. Generate the background without readable text, place exact title typography in HTML or the editor, and export `images/00-douyin-cover.png` at 1080x1920.

## Required companion skills

- Use `$starailink-image-generation` when the user requests or has configured StaraiLink. Otherwise use `$imagegen`.
- Use `$guizang-ppt-skill` for editorial templates, navigation conventions, or longer mixed-layout decks.
- Use `$FFmpeg Video Editor` to render narration-timed MP4 files, subtitle tracks, and burned captions.
- Use `browser:control-in-app-browser` to verify the finished local deck visually.
- Use an authoritative research or documentation skill when the script contains current product claims, dates, prices, usage figures, or model capabilities.

## Short-Form Motion Language

For vertical social-video pages or when a reference uses keyword-led motion, read `references/short-form-motion.md` before writing the beat table. Use the reference's motion grammar, not its watermark, branding, or exact visual design.

## Workflow

### 1. Audit the source

1. Read all supplied scripts, outlines, and existing deck files before rewriting.
2. Identify the audience, desired duration, CTA, output mode, publishing platform, and hard constraints from available context. Record the delivery aspect ratio before making a page map. Ask only when a missing choice would materially change the result.
3. Check factual claims. Remove invented statistics, future announcements, unsupported comparisons, and promised resources that do not exist.
4. Rewrite jargon into conversational examples. Prefer normal work such as drafting an email, cleaning a CSV, organizing invoices, comparing documents, or preparing a report.
5. Make the transitions explicit. Each section must answer why the next section follows.

### 2. Build the slide map

Create a page map before generating images. For each slide record:

- slide number;
- one narrative purpose;
- short on-screen title;
- visual story or comparison, including the vertical safe placement when applicable;
- narration assigned to that page;
- transition sentence into the next page.

For a short-form Visual Story deck, default to no more than 10 Chinese characters of primary on-screen copy per slide unless the user requests otherwise. Put explanations in the narration, not on the canvas.

When a page has more than one narrated visual point, add a beat table before implementation. For every beat record the exact narration cue, element group, entrance direction, motion verb, and settled state. Use 2-4 beats per page unless the topic genuinely needs more. A beat is an explanatory reveal, not a hard replacement of the entire slide. Do not use one generic set of normalized offsets for every page: write narration that names each visual point in sequence, then derive that page's offsets from the final TTS word timestamps.

Do not generate decorative filler. Every slide image must explain a noun, relationship, action, example, contrast, or conclusion from the narration.

### 3. Write image prompts

Write every page prompt before making API calls. Read `references/visual-story-contract.md` for the prompt and file contract.

Keep a shared art direction across all prompts:

- consistent palette, medium, line quality, and recurring character;
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

1. For 16:9 Visual Story work, copy `assets/visual-deck-shell.html` to the target `index.html`. For 9:16 work, use a dedicated vertical canvas; do not stretch the horizontal shell.
2. Replace `[DECK_TITLE]`, `[ACCENT_COLOR]`, and `<!-- SLIDES_HERE -->`.
3. Create one `<section class="slide visual-slide">` per image.
4. Keep titles out of a face, logo, diagram node, or example object. For 9:16, follow the vertical safe zones rather than forcing a horizontal bottom rail.
5. Use `object-fit:cover` only after checking the crop. Adjust `object-position` per page when necessary.
6. Preserve arrow-key, touch, and dot navigation. Preserve slide movement, image zoom, and caption entrance animation.

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

### 7. Verify in the browser

Read `references/quality-gates.md` and complete every P0 check.

At minimum:

1. Serve the deck locally when relative assets or browser restrictions require it.
2. Inspect all slides at the delivery aspect ratio after animations settle. For Douyin, use 540x960 and a 375x667 stress check.
3. Check at least the opening, densest relationship diagram, every example layout type, and closing slide at a second relevant viewport.
4. Exercise next, previous, direct dot navigation, and reduced-motion behavior.
5. Fix visible overlap by changing the layout or safe area, not by merely shrinking text until it is unreadable.

### 8. Render the narration-timed video

Read `references/video-output.md` when the user requests a recording, presentation video, subtitles, or a voice-over-ready timeline.

Read `references/minimax-tts.md` when MiniMax is selected or when the user wants API-generated audio and word-level subtitle timing.

1. Prefer the real narration audio as the timing authority. If no recording exists, estimate duration at 180-220 Chinese characters per minute and state the selected rate.
2. Generate or record narration page by page so one revised page can be replaced without changing accepted pages.
3. Capture every settled slide at the declared delivery resolution and keep a stable 30 fps output. For Douyin, this is 1080x1920.
4. Keep each page completely static by default only when it has one visual point. For a multi-point page, animate each beat with 300-700 ms of `opacity` plus a purposeful motion selected from the short-form motion language, aligned to its narration cue. Use final word timestamps to schedule the cue; page percentages are only a temporary pre-TTS fallback. Do not use instant visibility toggles for content appearing after page start.
5. Record real HTML beat motion in the browser or capture a sufficiently dense frame sequence that contains intermediate transition frames. Do not concatenate only settled beat screenshots: that produces hard cuts even when the HTML preview animation looks smooth.
6. Do not apply `zoompan`, drifting crops, or decorative camera motion unless the user explicitly requests it and the result passes motion QA.
7. Use restrained 0.6-0.8 second transitions only at page boundaries and align them to a spoken pause.
8. Generate `timing.md` and an `.srt` file from the same narration source and real word timestamps whenever the TTS API provides them.
9. Keep subtitle chunks around 10-20 Chinese characters and at least 2 seconds when timing permits. Never leave punctuation or an English product name flashing alone.
10. Place burned subtitles in the platform-safe caption area with a restrained translucent background. Inspect sample frames from the opening, relationship page, example pages, transition midpoint, and closing page.
11. Output a clean narrated video, a soft-subtitle MP4, and a burned-subtitle MP4. Include a silent audio track only when narration does not exist.

### 9. Deliver

Return:

- a clickable local preview URL or HTML file;
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
