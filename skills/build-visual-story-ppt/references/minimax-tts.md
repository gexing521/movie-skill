# MiniMax Narration and Word-Timed Subtitles

Use this workflow when MiniMax provides narration for a presentation video.

## Security

- Never place the API key in a project file, skill, command output, or log.
- Read the key from `MINIMAX_API_KEY` or a system secret store.
- On macOS, prefer Keychain. A project may use a service such as `codex-minimax-api-key`, but keep the service name configurable.
- Stage new audio and subtitle files in a temporary run directory. Replace accepted output only after every requested page succeeds.

## Request contract

Use the current official text-to-audio endpoint and confirm its current model names before a new production. The validated request shape is:

```json
{
  "model": "speech-2.8-hd",
  "text": "APPROVED_PAGE_TEXT<#0.8#>",
  "stream": false,
  "subtitle_enable": true,
  "subtitle_type": "word",
  "output_format": "url",
  "voice_setting": {
    "voice_id": "Chinese_playful_streamer_nv1",
    "speed": 1.0,
    "emotion": "calm"
  },
  "audio_setting": {
    "sample_rate": 44100,
    "format": "wav",
    "channel": 1
  }
}
```

Use `POST https://api.minimaxi.com/v1/t2a_v2` with `Authorization: Bearer ...`. Treat the voice ID, emotion, speed, and end pause as project configuration. For this tutorial series, default to `Chinese_playful_streamer_nv1`, `calm`, and `1.00` speed. Do not send `pitch` or `vol`: preserve the selected voice's native pitch and volume. Use another voice, emotion, or speed only when the user explicitly requests it.

## Calm Tutorial Pacing

- Write one idea per sentence. Put the contrast, conclusion, or instruction in its own short sentence.
- Use Chinese punctuation to make intent audible: `。` for a thought break, `？` for a question the viewer should consider, `：` before a list, and `，` only inside one complete idea.
- Keep professional terms visible and speakable. Use pronunciation rules only after an actual mispronunciation; do not change visible spelling merely to influence speech.
- Give a page about 0.9-1.1 seconds of end pause. Use a longer pause only after the hook, a major conclusion, or the final CTA.
- Do not use artificial fillers, repeated interjections, sound effects, or music to simulate emphasis. Let wording, punctuation, and the calm delivery carry the rhythm.
- Store `voice_id`, `emotion`, `speed`, and page pause in the manifest so a later regeneration cannot silently change the delivery.

## Semantic Delivery Profiles

Use one profile per semantic segment, not one arbitrary profile per sentence. Keep at most three profile changes on a page and keep the change subtle enough that the same speaker still sounds natural.

| Segment purpose | Speed | Use for |
| --- | ---: | --- |
| Hook | 1.06 | Opening contrast or a direct question |
| Explain | 1.02 | Most normal instructional sentences |
| List | 1.00 | Professional terms, steps, criteria, or a choice list |
| Conclusion | 1.02 | A conclusion the viewer should retain |
| CTA | 1.03 | A calm closing instruction |

- Keep `calm` as the emotion for every profile. Never modify pitch or volume, and never send `pitch` or `vol` fields. `1.00` is the minimum allowed speed; use `1.00-1.06` for this series, increasing speed only when a segment needs more forward momentum.
- Generate each semantic segment separately only when its profile differs from the adjacent segment. Concatenate the resulting WAV files in order and shift word timestamps by the actual preceding segment durations.
- Keep a `segments` array in the page manifest with text, profile, speed, and duration. Use the merged page audio and shifted words as the only source of final page timing and subtitles.

Add pronunciation rules only for names that the selected voice mispronounces. Keep the approved visible spelling in the narration and subtitles. When a repeated English initial is collapsed despite the dictionary, send a speech-only tokenized form such as `C C Switch`, retain `CC Switch` for visible copy, and map the word timestamps back to the visible spelling before building subtitles or beat timing. For the standalone term `AI`, always send `A I` to MiniMax and retain `AI` for visible copy; do not use an inline phonetic dictionary rule for it.

## Page-by-page generation

1. Flatten each page's `口播` and `翻页衔接` into the exact request text.
2. Run the cross-page repetition audit before any paid request.
3. Generate one WAV and one word-timestamp JSON file per page.
4. Record the page number, title, approved text, model, voice, duration, audio path, subtitle path, usage, and request trace in `manifest.json`.
5. Download API URLs immediately because they may expire.
6. Regenerate only changed pages when the model, voice, and pronunciation configuration are unchanged.

## Subtitle mapping

Build visible subtitles from the approved narration, not by joining the API's phonetic tokens verbatim.

1. Flatten the API's `timestamped_words` in order.
2. Deduplicate entries with identical text and source offsets. Pronunciation dictionaries may repeat English names as phoneme records.
3. Segment the approved Chinese narration and map each segment to overlapping source offsets.
4. Group mapped tokens into approximately 10-20 visible characters.
5. Attach punctuation to the preceding phrase and merge isolated English product names with neighboring words.
6. Keep intervals positive and non-overlapping. Prefer 2-6 seconds, but preserve real speech timing when a short phrase is genuinely spoken quickly.
7. Convert page-relative timestamps into the global timeline using the page-start formula in `video-output.md`.

## Audio and transitions

- Append about 0.8 seconds of silence to each page except where the final delivery needs a longer closing hold.
- Place the video transition inside that pause.
- Crossfade or mix page audio over the same interval without cutting speech.
- Use actual WAV duration from the API response or `ffprobe`; never derive page timing from character count after audio exists.

## Outputs

Store provider output separately from the deck:

```text
video/<episode>/tts/
├── audio/01.wav
├── subtitles/01.json
├── manifest.json
├── timing.md
├── <episode>.srt
├── <episode>-narrated.mp4
├── <episode>-narrated-soft-subtitles.mp4
└── <episode>-narrated-burned-subtitles.mp4
```

Verify the soft-subtitle stream is `mov_text` tagged `zho`. Inspect the burned captions on the opening, relationship diagram, every example layout, transition midpoint, and closing slide.
