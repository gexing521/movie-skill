import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const minimaxDir = path.join(here, "minimax");
const recordingsDir = path.join(here, "motion-recordings");
const clipsDir = path.join(minimaxDir, "clips");
const manifest = JSON.parse(fs.readFileSync(path.join(minimaxDir, "manifest.json"), "utf8"));
const transitionDuration = manifest.page_pause_seconds;
const fps = 30;
const srtPath = path.join(minimaxDir, "episode-04-minimax.srt");
const baseVideo = path.join(minimaxDir, "episode-04-narrated.mp4");
const softVideo = path.join(minimaxDir, "episode-04-narrated-soft-subtitles.mp4");
const burnedVideo = path.join(minimaxDir, "episode-04-narrated-burned-subtitles.mp4");
const subtitleOnly = process.argv.includes("--subtitles-only");
const transitions = ["circleopen", "hlslice", "dissolve", "zoomin", "wipeleft"];

function run(args) { const result = spawnSync("ffmpeg", ["-y", "-hide_banner", ...args], { stdio:"inherit" }); if (result.status !== 0) process.exit(result.status || 1); }
const durations = manifest.slides.map((slide) => slide.duration_ms / 1000);
const starts = [0]; for (let index = 1; index < durations.length; index += 1) starts.push(starts[index - 1] + durations[index - 1] - transitionDuration);
const finalDuration = durations.reduce((sum, value) => sum + value, 0) - transitionDuration * (durations.length - 1);

if (!subtitleOnly) {
  fs.mkdirSync(clipsDir, { recursive:true });
  manifest.slides.forEach((slide, index) => {
    const number = String(slide.number).padStart(2, "0"); const clip = path.join(clipsDir, `${number}.mp4`); const recording = path.join(recordingsDir, `${number}.webm`);
    if (!fs.existsSync(recording)) throw new Error(`Missing motion recording: ${recording}`);
    const args = ["-i", recording, "-t", durations[index].toFixed(4), "-vf", `fps=${fps},format=yuv420p`, "-r", String(fps), "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", clip];
    run(args); slide.clip = clip;
  });
  const args = []; manifest.slides.forEach((slide) => args.push("-i", slide.clip)); manifest.slides.forEach((slide) => args.push("-i", slide.audio));
  const filters = []; let videoLabel = "0:v";
  for (let index = 1; index < manifest.slides.length; index += 1) { const output = index === manifest.slides.length - 1 ? "vout" : `vx${index}`; filters.push(`[${videoLabel}][${index}:v]xfade=transition=${transitions[index - 1]}:duration=${transitionDuration}:offset=${starts[index].toFixed(3)}[${output}]`); videoLabel = output; }
  let audioLabel = `${manifest.slides.length}:a`;
  for (let index = 1; index < manifest.slides.length; index += 1) { const output = index === manifest.slides.length - 1 ? "aout" : `ax${index}`; filters.push(`[${audioLabel}][${manifest.slides.length + index}:a]acrossfade=d=${transitionDuration}:c1=tri:c2=tri[${output}]`); audioLabel = output; }
  args.push("-filter_complex", filters.join(";"), "-map", `[${videoLabel}]`, "-map", `[${audioLabel}]`, "-t", finalDuration.toFixed(3), "-r", String(fps), "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", baseVideo);
  run(args);
} else if (!fs.existsSync(baseVideo)) throw new Error(`Missing base video: ${baseVideo}`);

run(["-i", baseVideo, "-i", srtPath, "-map", "0:v", "-map", "0:a", "-map", "1:0", "-c:v", "copy", "-c:a", "copy", "-c:s", "mov_text", "-metadata:s:s:0", "language=zho", "-movflags", "+faststart", softVideo]);
const subtitleFilter = `subtitles=${srtPath}:force_style='FontName=PingFang SC,FontSize=12,PrimaryColour=&H00FFFFFF,OutlineColour=&H70000000,BackColour=&HFF000000,BorderStyle=1,Outline=1.6,Shadow=0,MarginV=12,Alignment=2'`;
run(["-i", baseVideo, "-vf", subtitleFilter, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", burnedVideo]);
console.log(JSON.stringify({ voice_id:manifest.voice_id, duration_seconds:finalDuration, base_video:baseVideo, soft_subtitles:softVideo, burned_subtitles:burnedVideo, srt:srtPath }, null, 2));
