import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "../..");
const recordingsDir = path.join(here, "motion-recordings");
const manifest = JSON.parse(fs.readFileSync(path.join(here, "minimax", "manifest.json"), "utf8"));
const port = Number(process.env.EPISODE_RENDER_PORT || 4174);
fs.mkdirSync(recordingsDir, { recursive:true });
const bundledModules = process.env.CODEX_BUNDLED_NODE_MODULES || path.join(projectRoot, "node_modules");
if (!fs.existsSync(path.join(bundledModules, "playwright", "index.js"))) {
  throw new Error("Playwright is unavailable. Run npm install, then npx playwright install chromium.");
}
const playwrightModule = await import(pathToFileURL(path.join(bundledModules, "playwright", "index.js")).href);
const chromium = playwrightModule.chromium || playwrightModule.default?.chromium;
if (!chromium) throw new Error("The bundled Playwright runtime does not expose Chromium.");

const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".svg":"image/svg+xml", ".woff2":"font/woff2" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
  const normalized = path.normalize(pathname === "/" ? "/episode-04/" : pathname).replace(/^\.\.([/\\]|$)/, "");
  const local = path.join(projectRoot, normalized.endsWith("/") ? `${normalized}index.html` : normalized);
  if (!local.startsWith(projectRoot) || !fs.existsSync(local) || fs.statSync(local).isDirectory()) { response.writeHead(404); response.end("Not found"); return; }
  response.writeHead(200, { "content-type": mime[path.extname(local).toLowerCase()] || "application/octet-stream", "cache-control":"no-store" });
  fs.createReadStream(local).pipe(response);
});

await new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", resolve); });
const cachedChromium = path.join(os.homedir(), "Library", "Caches", "ms-playwright", "chromium_headless_shell-1208", "chrome-headless-shell-mac-arm64", "chrome-headless-shell");
const executablePath = process.env.CODEX_CHROMIUM_EXECUTABLE || (fs.existsSync(cachedChromium) ? cachedChromium : undefined);
const browser = await chromium.launch({ headless:true, ...(executablePath ? { executablePath } : {}) });
try {
  for (const slide of manifest.slides) {
    const pageNumber = String(slide.number).padStart(2, "0"); const context = await browser.newContext({ viewport:{ width:1920, height:1080 }, deviceScaleFactor:1, recordVideo:{ dir:recordingsDir, size:{ width:1920, height:1080 } } });
    const page = await context.newPage();
    const beats = (slide.beat_offsets_seconds || []).join(",");
    await page.goto(`http://127.0.0.1:${port}/episode-04/?slide=${slide.number}&animate=1&duration=${(slide.duration_ms / 1000).toFixed(3)}&beats=${encodeURIComponent(beats)}`, { waitUntil:"networkidle" });
    await page.waitForTimeout(slide.duration_ms);
    const recording = page.video();
    await page.close(); await context.close();
    const temporaryPath = await recording.path(); const acceptedPath = path.join(recordingsDir, `${pageNumber}.webm`);
    fs.copyFileSync(temporaryPath, acceptedPath);
    console.log(`Recorded page ${pageNumber}`);
  }
} finally {
  await browser.close(); await new Promise((resolve) => server.close(resolve));
}
