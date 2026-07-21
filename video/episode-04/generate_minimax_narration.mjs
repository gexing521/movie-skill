import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "../..");
const scriptPath = path.join(projectRoot, "scripts/episode-04-script.md");
const outputDir = path.join(here, "minimax");
const audioDir = path.join(outputDir, "audio");
const subtitleDir = path.join(outputDir, "subtitles");
const voiceId = "Chinese_playful_streamer_nv1";
const model = "speech-2.8-hd";
const speechSpeed = 1.10;
const pagePauseSeconds = 0.85;
const reuseExisting = process.argv.includes("--reuse-existing");
const manifestPath = path.join(outputDir, "manifest.json");
if (speechSpeed < 1.0 || speechSpeed > 2.0) throw new Error("Narration speed must remain within 1.00-2.00");
const beatCues = {
  1: ["又冒出 CC Switch", "不是新模型", "无人拖拉机", "智能卡槽"],
  2: ["Codex 就是", "模型是", "芯片 A", "芯片 B", "芯片 C"],
  3: ["没有 CC Switch 时", "拆开操作台", "翻旧设置", "检查线路"],
  4: ["智能卡槽", "卡 A", "卡 B", "卡 C", "不造模型"],
  5: ["Codex 是", "模型是", "配置是一张卡", "CC Switch 是"],
};

fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(subtitleDir, { recursive: true });

function parseSlides(markdown) {
  return markdown.split(/^## /m).slice(1).filter((section) => /^第 \d+ 页｜/.test(section)).map((section) => {
    const heading = section.match(/^第 (\d+) 页｜([^\n]+)/);
    const speech = section.match(/\*\*口播\*\*：\n\n([\s\S]*?)(?=\n\n\*\*(?:翻页衔接|收尾停顿)\*\*)/)?.[1] || "";
    const transition = section.match(/\*\*翻页衔接\*\*：([^\n]+)/)?.[1] || "";
    const ttsText = `${speech.trim()}${transition ? ` ${transition.trim()}` : ""}`.replace(/<\s*#([\d.]+)#>/g, "<#$1#>").replace(/\s+/g, " ").trim();
    const displayText = ttsText.replace(/<#[\d.]+#>/g, "").replace(/\s+/g, " ").trim();
    return { number: Number(heading[1]), title: heading[2].trim(), ttsText, displayText };
  });
}

function srtTime(milliseconds) {
  const value = Math.max(0, Math.round(milliseconds));
  const hours = Math.floor(value / 3600000); const minutes = Math.floor((value % 3600000) / 60000); const seconds = Math.floor((value % 60000) / 1000); const millis = value % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

function flattenWords(subtitleJson) {
  const output = [];
  for (const word of subtitleJson.flatMap((segment) => segment.timestamped_words || [])) {
    const previous = output.at(-1);
    if (previous && previous.word === word.word && previous.word_begin === word.word_begin && previous.word_end === word.word_end) previous.time_end = word.time_end;
    else output.push({ ...word });
  }
  return output;
}

function plainText(text) { return text.replace(/<#[\d.]+#>/g, "").replace(/\s+/g, " ").trim(); }

function mapIndex(source, target, sourceIndex) {
  let sourceCursor = 0; let targetCursor = 0;
  while (sourceCursor < sourceIndex && targetCursor < target.length) {
    if (source[sourceCursor] === target[targetCursor]) { sourceCursor += 1; targetCursor += 1; }
    else if (source[sourceCursor] === " ") sourceCursor += 1;
    else if (target[targetCursor] === " ") targetCursor += 1;
    else { sourceCursor += 1; targetCursor += 1; }
  }
  return targetCursor;
}

function buildTimedTokens(text, subtitleJson, synthesisText) {
  const words = flattenWords(subtitleJson).map((word) => ({
    ...word,
    word_begin: mapIndex(synthesisText, text, word.word_begin),
    word_end: mapIndex(synthesisText, text, word.word_end),
  }));
  const tokens = [];
  for (const segment of new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(text)) {
    if (!segment.segment.trim()) continue;
    const start = segment.index; const end = start + segment.segment.length;
    const overlap = words.filter((word) => word.word_end > start && word.word_begin < end);
    if (overlap.length) tokens.push({ word: segment.segment, time_begin: overlap[0].time_begin, time_end: overlap.at(-1).time_end });
  }
  if (tokens.length >= 4) {
    for (let index = 0; index < tokens.length - 1; index += 1) {
      if (/^CC$/i.test(tokens[index].word.trim()) && /^Switch$/i.test(tokens[index + 1].word.trim())) {
        tokens.splice(index, 2, { word:"CC Switch", time_begin:tokens[index].time_begin, time_end:tokens[index + 1].time_end });
      }
    }
    return tokens;
  }
  const duration = words.at(-1)?.time_end || 1;
  const characters = [...text.replace(/\s/g, "")];
  return characters.map((character, index) => ({ word: character, time_begin: duration * index / characters.length, time_end: duration * (index + 1) / characters.length }));
}

function resolveBeatOffsets(slide, subtitleJson, synthesisText) {
  const words = flattenWords(subtitleJson);
  const displayText = slide.displayText;
  const offsets = [];
  for (const cue of beatCues[slide.number] || []) {
    const displayIndex = displayText.indexOf(cue);
    if (displayIndex < 0) throw new Error(`Page ${slide.number} is missing beat cue: ${cue}`);
    const speechIndex = mapIndex(displayText, synthesisText, displayIndex);
    const timestamp = words.find((word) => word.word_end > speechIndex);
    if (!timestamp) throw new Error(`Page ${slide.number} cannot resolve beat cue: ${cue}`);
    offsets.push(Number(Math.max(0, timestamp.time_begin / 1000 - 0.10).toFixed(3)));
  }
  return offsets;
}

function chunkTimedWords(tokens, minLength = 10, maxLength = 20) {
  const chunks = []; let current = []; let length = 0;
  const flush = () => { if (current.length) { chunks.push({ text: current.map((token) => token.word).join("").replace(/\s+/g, "").replace(/CCSwitch/g, "CC Switch"), start: current[0].time_begin, end: current.at(-1).time_end }); current = []; length = 0; } };
  for (const source of tokens) {
    const word = { ...source }; const leading = word.word.match(/^([，。！？；、：]+)(.*)$/);
    if (leading) { if (current.length) current.at(-1).word += leading[1]; else if (chunks.length) chunks.at(-1).text += leading[1]; word.word = leading[2]; if (!word.word) continue; }
    const nextLength = [...word.word.replace(/\s/g, "")].length;
    if (current.length && length + nextLength > maxLength) flush();
    current.push(word); length += nextLength;
    if (/[，。！？；：]$/.test(word.word) && length >= minLength) flush();
  }
  flush();
  for (let index = 0; index < chunks.length; index += 1) {
    if (chunks[index].end - chunks[index].start >= 1500) continue;
    const neighbor = chunks[index + 1];
    if (neighbor && [...`${chunks[index].text}${neighbor.text}`].length <= maxLength + 2) { chunks[index].text += neighbor.text; chunks[index].end = neighbor.end; chunks.splice(index + 1, 1); }
  }
  return chunks;
}

async function download(url, destination) {
  const response = await fetch(url); if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
  fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
}

const slides = parseSlides(fs.readFileSync(scriptPath, "utf8"));
const apiKey = reuseExisting ? null : (process.env.MINIMAX_API_KEY || execFileSync("security", ["find-generic-password", "-a", process.env.USER, "-s", "codex-minimax-api-key", "-w"], { encoding: "utf8" }).trim());
const existing = reuseExisting ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : null;
const manifest = []; const srtBlocks = []; let timelineOffset = 0; let subtitleIndex = 1; let previousSubtitleEnd = -1;

for (const slide of slides) {
  const page = String(slide.number).padStart(2, "0"); const audioPath = path.join(audioDir, `${page}.wav`); const subtitlePath = path.join(subtitleDir, `${page}.json`);
  const synthesisText = slide.ttsText.replace(/CC Switch/g, "C C Switch");
  const plainSynthesisText = plainText(synthesisText);
  let subtitleJson; let durationMs; let usageCharacters; let traceId;
  if (reuseExisting) {
    const prior = existing.slides.find((item) => item.number === slide.number);
    if (!prior || !fs.existsSync(audioPath) || !fs.existsSync(subtitlePath)) throw new Error(`Missing existing assets for page ${page}`);
    subtitleJson = JSON.parse(fs.readFileSync(subtitlePath, "utf8")); durationMs = prior.duration_ms; usageCharacters = prior.usage_characters; traceId = prior.trace_id;
  } else {
    const requestText = `${synthesisText}<#${pagePauseSeconds.toFixed(2)}#>`;
    const response = await fetch("https://api.minimaxi.com/v1/t2a_v2", { method:"POST", headers:{ Authorization:`Bearer ${apiKey}`, "Content-Type":"application/json" }, body:JSON.stringify({ model, text:requestText, stream:false, subtitle_enable:true, subtitle_type:"word", output_format:"url", voice_setting:{ voice_id:voiceId, speed:speechSpeed }, audio_setting:{ sample_rate:44100, format:"wav", channel:1 }, pronunciation_dict:{ tone:["Codex/(ˈkoʊdɛks)","C C Switch/(siː siː swɪtʃ)","CC Switch/(siː siː swɪtʃ)"] } }) });
    const body = await response.json();
    if (!response.ok || body.base_resp?.status_code !== 0) throw new Error(`Page ${page} synthesis failed: ${body.base_resp?.status_msg ?? response.status}`);
    await download(body.data.audio, audioPath); subtitleJson = await (await fetch(body.data.subtitle_file)).json(); fs.writeFileSync(subtitlePath, `${JSON.stringify(subtitleJson, null, 2)}\n`);
    durationMs = body.extra_info.audio_length; usageCharacters = body.extra_info.usage_characters; traceId = body.trace_id;
  }
  const beatOffsets = resolveBeatOffsets(slide, subtitleJson, plainSynthesisText);
  for (const chunk of chunkTimedWords(buildTimedTokens(slide.displayText, subtitleJson, plainSynthesisText))) {
    const start = Math.max(timelineOffset + chunk.start, previousSubtitleEnd + 20);
    const end = Math.max(timelineOffset + chunk.end, start + 120);
    srtBlocks.push(`${subtitleIndex}\n${srtTime(start)} --> ${srtTime(end)}\n${chunk.text}\n`);
    previousSubtitleEnd = end; subtitleIndex += 1;
  }
  manifest.push({ number:slide.number, title:slide.title, text:slide.displayText, tts_text:slide.ttsText, synthesis_text:synthesisText, beat_cues:beatCues[slide.number], beat_offsets_seconds:beatOffsets, model, voice_id:voiceId, speed:speechSpeed, duration_ms:durationMs, usage_characters:usageCharacters, audio:audioPath, subtitle:subtitlePath, trace_id:traceId });
  timelineOffset += durationMs - pagePauseSeconds * 1000; console.log(`Page ${page}: ${(durationMs / 1000).toFixed(2)}s`);
}

const totalMs = manifest.reduce((sum, item) => sum + item.duration_ms, 0) - pagePauseSeconds * 1000 * (manifest.length - 1);
fs.writeFileSync(manifestPath, `${JSON.stringify({ model, voice_id:voiceId, speed:speechSpeed, page_pause_seconds:pagePauseSeconds, slides:manifest }, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "episode-04-minimax.srt"), `${srtBlocks.join("\n")}\n`);
const rows = manifest.map((item, index) => `| ${String(item.number).padStart(2,"0")} | ${item.title} | ${(item.duration_ms/1000).toFixed(2)}s | ${srtTime(manifest.slice(0,index).reduce((sum,value)=>sum+value.duration_ms,0)-pagePauseSeconds*1000*index).replace(",",".")} |`);
fs.writeFileSync(path.join(outputDir, "timing.md"), `# 第四期 MiniMax 真实语音时间轴\n\n- 模型：${model}\n- 音色：${voiceId}\n- 语速：${speechSpeed}\n- 页面停顿/转场重叠：${pagePauseSeconds} 秒\n- 总时长：${(totalMs/1000).toFixed(2)} 秒\n\n| 页码 | 标题 | 音频时长 | 页面开始 |\n|---|---|---:|---:|\n${rows.join("\n")}\n`);
console.log(`Total: ${(totalMs / 1000).toFixed(2)}s`);
