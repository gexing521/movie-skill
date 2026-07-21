# AI 视频生成技能包

这是可直接迁移的视频生成技能包，含网页 PPT、旁白脚本、MiniMax 语音生成、字级时间戳字幕、浏览器动效录制、FFmpeg 成片脚本，以及 StaraiLink 生图 skill。它不含任何 API 密钥或已生成视频、音频，因此可以作为可复用源包迁移到另一台电脑。

## 首次安装

在包根目录执行：

```bash
npm install
npx playwright install chromium
```

另行安装 FFmpeg，并确认 `ffmpeg -version` 可用。

## 配置密钥

仅在当前终端会话配置，不将密钥写入包内：

```bash
export MINIMAX_API_KEY='your-minimax-api-key'
export STARAILINK_API_KEY='your-starailink-api-key'
```

也可在目标电脑的密钥管理器中保存名为 `codex-minimax-api-key` 的通用密码；脚本会在没有环境变量时读取它。

## 一键生成

```bash
npm run build:video
```

输出位置：`video/episode-04/minimax/`

- `episode-04-narrated.mp4`：无字幕版
- `episode-04-narrated-soft-subtitles.mp4`：可关闭字幕版
- `episode-04-narrated-burned-subtitles.mp4`：字幕压制版，发布默认

当前旁白为 `Chinese_playful_streamer_nv1`，情感为 `calm`，基准语速为 `1.00`。钩子、解释、清单、结论和 CTA 可在不超过三次语义切换的前提下使用小幅的速度变化；语速只能为 `1.00` 或更快，且不传递 `pitch` 或 `vol` 参数，始终保持音色原始音调和音量。完整参数与字幕合并规则见 `skills/build-visual-story-ppt/references/minimax-tts.md`。修改这些参数后，应重新执行完整的一键生成命令，避免字幕和动效节奏失配。

## 抖音竖版流程

本系列的抖音视频默认使用 `9:16 / 1080x1920 / 30fps`，从页面设计开始就是竖版，不再先做横版再裁切。每期需要额外交付 `images/00-douyin-cover.png`：它是独立设计的首帧封面，精确标题由 HTML 或编辑器叠加，成片开头静置 1.2 秒后再开始口播。

竖版页面保留顶部 12% 与底部 18% 的平台安全区；重点标题、人物脸部、关键流程图与字幕不能落入这些区域。验收至少包含：540x960 全页检查、375x667 窄屏压力检查、每种动效的入场/中间/落定三帧检查，以及封面与最终 MP4 首帧的一致性检查。完整规范在 `skills/build-visual-story-ppt/references/douyin-vertical-delivery.md`。

若本系列使用固定的创作者角色，角色主资产保存在 `assets/recurring-character.png`；新一期开始时复制到该期的 `images/` 目录再使用。封面中将角色固定在右下角，宽度约为画面 28%-35%，人物必须与左侧标题保持独立，并高于底部字幕安全区；角色用于系列识别，不得压住主题。

## 包内依赖

- `skills/build-visual-story-ppt/`：旁白、字幕、短视频关键词动效和视频质量规范。
- `skills/ffmpeg-video-editor/`：FFmpeg 输出规范。
- `skills/starailink-image-generation/`：StaraiLink 兼容图片 API 与 PNG 校验脚本。
- `tools/validate_srt.mjs`：字幕校验器。

MiniMax 和 StaraiLink 密钥均未被导出或嵌入本包。迁移时通过环境变量或目标电脑的系统密钥管理器提供它们。
