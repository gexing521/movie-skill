---
name: starailink-image-generation
description: Generate raster images through the StaraiLink OpenAI-compatible Image API. Use when the user asks to create an image and specifically requests StaraiLink, starailink.top, this configured third-party endpoint, or an API-driven image-generation workflow.
---

# StaraiLink Image Generation

Use this skill only for the configured third-party endpoint. Treat prompts and input images as data sent to a third party.

## Required workflow

1. Use the exact requested prompt and preserve exact text requirements. Add practical image constraints only when they prevent common failures, such as `no watermark` or `no extra text`.
2. Use `gpt-image-2`, `3840x2160`, and `high` only when the user requests a detailed landscape image. Otherwise use `1024x1024` and `medium`.
3. Ensure `STARAILINK_API_KEY` is available. On this Mac, retrieve it from the `codex-starailink-api-key` macOS Keychain item. Never write or repeat a key in files, commands, logs, or responses.
4. Save the final image under `output/imagegen/`. Never overwrite an existing file without explicit authorization.
5. For requests likely to exceed a synchronous terminal window, start the script in the background, redirecting its output to `tmp/imagegen/<name>.log`, then poll until the output file exists or the script fails. Do not give an intermediate handoff or abandon a running request.
6. The script validates that the decoded output is a PNG and prints its pixel dimensions. After it succeeds, inspect the final image with `view_image`.
7. In the final user-facing response, render the image inline using `![Generated image](/absolute/path/to/image.png)`. Do not provide only a path or link.

## Run

```bash
bash scripts/generate_image.sh \
  --prompt "A quiet winter lane in the morning after a heavy snowfall" \
  --size 3840x2160 \
  --quality high \
  --out output/imagegen/winter-lane.png
```

The script sends a single request to `https://starailink.top/v1/images/generations` with `n: 1`, `response_format: b64_json`, and `output_format: png`, then decodes `data[0].b64_json`.

## Failure handling

- Report failure only after the script exits or the configured timeout expires.
- Report the HTTP status and a sanitized API error message when available. Never print authorization headers, API keys, or the image base64 payload.
- Do not switch providers, models, dimensions, or output formats without user approval.

## Script options

`scripts/generate_image.sh` accepts `--prompt`, `--out`, `--model`, `--size`, `--quality`, `--timeout`, and `--force`. Run it with `--help` for defaults.
