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
    "voice_id": "TalTutorialVoice20260720",
    "speed": 1.2,
    "vol": 1,
    "pitch": 0
  },
  "audio_setting": {
    "sample_rate": 44100,
    "format": "wav",
    "channel": 1
  }
}
```

Use `POST https://api.minimaxi.com/v1/t2a_v2` with `Authorization: Bearer ...`. Treat the voice ID, speed, and end pause as project configuration. For this tutorial series, default to the validated cloned voice `TalTutorialVoice20260720` at `1.20` speed. Use another voice or speed only when the user explicitly requests it.

Add pronunciation rules only for names that the selected voice mispronounces. Keep the approved visible spelling in the narration and subtitles. When a repeated English initial is collapsed despite the dictionary, send a speech-only tokenized form such as `C C Switch`, retain `CC Switch` for visible copy, and map the word timestamps back to the visible spelling before building subtitles or beat timing.

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
