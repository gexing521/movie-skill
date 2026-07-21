#!/usr/bin/env bash
set -euo pipefail

endpoint="https://starailink.top/v1/images/generations"
model="gpt-image-2"
size="1024x1024"
quality="medium"
timeout=600
prompt=""
out=""
force=false

usage() {
  cat <<'EOF'
Usage: generate_image.sh --prompt TEXT --out output/imagegen/NAME.png [options]

Options:
  --model MODEL       Image model (default: gpt-image-2)
  --size WIDTHxHEIGHT Image size (default: 1024x1024)
  --quality LEVEL     low, medium, high, or auto (default: medium)
  --timeout SECONDS   Request timeout in seconds (default: 600)
  --force             Replace an existing output file
  -h, --help          Show this help

Requires STARAILINK_API_KEY, or the codex-starailink-api-key macOS Keychain item.
EOF
}

api_error() {
  local response_file="$1"
  local status="$2"
  python3 - "$response_file" "$status" <<'PY'
import json
import sys
from pathlib import Path

response_path, status = sys.argv[1:]
message = "No API error message was returned."
try:
    payload = json.loads(Path(response_path).read_text())
    error = payload.get("error", payload)
    if isinstance(error, dict):
        message = str(error.get("message") or error.get("code") or "API request failed.")
    elif isinstance(error, str):
        message = error
except (OSError, json.JSONDecodeError):
    pass
print(f"Image API request failed (HTTP {status}): {message}", file=sys.stderr)
PY
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prompt) prompt="${2:?Missing value for --prompt}"; shift 2 ;;
    --out) out="${2:?Missing value for --out}"; shift 2 ;;
    --model) model="${2:?Missing value for --model}"; shift 2 ;;
    --size) size="${2:?Missing value for --size}"; shift 2 ;;
    --quality) quality="${2:?Missing value for --quality}"; shift 2 ;;
    --timeout) timeout="${2:?Missing value for --timeout}"; shift 2 ;;
    --force) force=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

[[ "$timeout" =~ ^[1-9][0-9]*$ ]] || { printf '%s\n' '--timeout must be a positive integer.' >&2; exit 2; }
[[ -n "$prompt" ]] || { printf '%s\n' '--prompt is required.' >&2; exit 2; }
[[ -n "$out" ]] || { printf '%s\n' '--out is required.' >&2; exit 2; }
[[ "$out" == output/imagegen/* ]] || { printf '%s\n' '--out must be under output/imagegen/.' >&2; exit 2; }
[[ "$force" == true || ! -e "$out" ]] || { printf 'Output already exists: %s (use --force to replace it)\n' "$out" >&2; exit 2; }

if [[ -z "${STARAILINK_API_KEY:-}" ]] && command -v security >/dev/null 2>&1; then
  STARAILINK_API_KEY="$(security find-generic-password -a "$USER" -s "codex-starailink-api-key" -w 2>/dev/null || true)"
  export STARAILINK_API_KEY
fi
[[ -n "${STARAILINK_API_KEY:-}" ]] || { printf 'STARAILINK_API_KEY is not set.\n' >&2; exit 2; }

payload="$(PROMPT="$prompt" MODEL="$model" SIZE="$size" QUALITY="$quality" python3 - <<'PY'
import json
import os

print(json.dumps({
    "model": os.environ["MODEL"],
    "prompt": os.environ["PROMPT"],
    "size": os.environ["SIZE"],
    "quality": os.environ["QUALITY"],
    "n": 1,
    "response_format": "b64_json",
    "output_format": "png",
}, ensure_ascii=False))
PY
)"

response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT

printf 'Submitting image generation request...\n' >&2
if ! status="$(curl --silent --show-error --location --connect-timeout 30 --max-time "$timeout" \
  --header "Authorization: Bearer $STARAILINK_API_KEY" \
  --header 'Content-Type: application/json' \
  --data "$payload" \
  --output "$response_file" \
  --write-out '%{http_code}' \
  "$endpoint")"; then
  api_error "$response_file" "${status:-000}"
  exit 1
fi

if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
  api_error "$response_file" "$status"
  exit 1
fi

printf 'Image API responded with HTTP %s; validating PNG...\n' "$status" >&2
mkdir -p "$(dirname "$out")"
python3 - "$response_file" "$out" <<'PY'
import base64
import json
import struct
import sys
from pathlib import Path

response_path, output_path = map(Path, sys.argv[1:])
try:
    payload = json.loads(response_path.read_text())
    image = payload["data"][0]["b64_json"]
except (json.JSONDecodeError, KeyError, IndexError, TypeError) as exc:
    raise SystemExit("Image API response did not include data[0].b64_json.") from exc

try:
    image_bytes = base64.b64decode(image, validate=True)
except (ValueError, TypeError) as exc:
    raise SystemExit("Image API returned invalid base64 image data.") from exc

if image_bytes[:8] != b"\x89PNG\r\n\x1a\n" or image_bytes[12:16] != b"IHDR":
    raise SystemExit("Decoded image is not a valid PNG.")

width, height = struct.unpack(">II", image_bytes[16:24])
if width <= 0 or height <= 0:
    raise SystemExit("Decoded PNG has invalid dimensions.")

output_path.write_bytes(image_bytes)
print(f"Wrote {output_path} ({width}x{height} PNG)")
PY
