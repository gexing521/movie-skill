# Visual Story Contract

## Directory layout

Use this structure unless the existing project already has an equivalent convention:

```text
project/
├── episode-01/
│   ├── index.html
│   └── images/
│       ├── 01-opening.png
│       ├── 02-relationship.png
│       └── 03-example.png
├── output/
│   └── imagegen/
├── prompts/
│   └── episode-01-image-prompts.md
├── scripts/
│   └── episode-01-script.md
└── video/
    └── episode-01/
        ├── frames/
        └── tts/
            ├── audio/
            ├── subtitles/
            ├── manifest.json
            ├── episode-01.srt
            ├── timing.md
            ├── episode-01-narrated.mp4
            ├── episode-01-narrated-soft-subtitles.mp4
            └── episode-01-narrated-burned-subtitles.mp4
```

Treat `output/imagegen/` as working output and `episode-01/images/` as accepted presentation assets.

## Page map

Create a compact table before writing prompts:

| Page | Purpose | Screen title | Visual | Narration beat |
|---|---|---|---|---|
| 01 | Hook | 都是什么？ | Names overwhelm a person | Establish confusion |
| 02 | Explain | 模型和 Codex | Engine and car analogy | Explain relationship |

Use one purpose per page. Split a page when the image would need two unrelated scenes.

## Prompt template

Use this structure for each image:

```text
Use case: presentation visual
Asset type: illustration matching the target delivery aspect ratio
Primary request: [the exact visual story]
Scene/backdrop: [environment and graphic system]
Subject: [people, objects, relationships, actions]
Style/medium: [shared art direction]
Composition/framing: target delivery aspect ratio, key subjects inside the applicable platform-safe area, reserve only the space actually needed by the deck
Lighting/mood: [tone]
Color palette: [shared palette]
Text (verbatim): [exact labels only, or no readable text]
Constraints: [human control, before/after order, file safety, brand limits]
Avoid: watermark, long text, extra logos, fake UI, generic robot, unrelated decoration
Output: match the target delivery aspect ratio; use a high-resolution PNG when the selected image provider supports it
```

Use exact brand or file labels sparingly. Generated text is a failure surface; move explanatory language into HTML or narration.

## Visual Story slide markup

Use this markup with the bundled shell:

```html
<section class="slide visual-slide active">
  <img class="visual" src="images/01-opening.png" alt="Describe the visual">
  <div class="caption">
    <h1>都是什么？</h1>
    <p class="hint">名字太多</p>
  </div>
  <div class="count">01 / 06</div>
</section>
```

Only the first slide receives `active` in source. Use a short hint or omit it. Keep the bottom rail outside the image.

## Narration mapping

For every slide write:

1. `画面`: what the audience sees;
2. `口播`: text that can be read directly;
3. `翻页衔接`: why the next slide follows.

The narration may be detailed. The visible slide must remain scannable.

Before TTS generation, flatten `口播` and `翻页衔接` exactly as the synthesizer will receive them. Audit every adjacent pair for repeated scene names or conclusions. Treat the approved flattened text as the shared source for TTS, manifest data, timing, and subtitles.
