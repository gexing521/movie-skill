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

当前旁白为 `Chinese_playful_streamer_nv1`，语速为 `1.10`。修改音色或语速后，应重新执行完整的一键生成命令，避免字幕和动效节奏失配。

## 包内依赖

- `skills/build-visual-story-ppt/`：旁白、字幕、短视频关键词动效和视频质量规范。
- `skills/ffmpeg-video-editor/`：FFmpeg 输出规范。
- `skills/starailink-image-generation/`：StaraiLink 兼容图片 API 与 PNG 校验脚本。
- `tools/validate_srt.mjs`：字幕校验器。

MiniMax 和 StaraiLink 密钥均未被导出或嵌入本包。迁移时通过环境变量或目标电脑的系统密钥管理器提供它们。
