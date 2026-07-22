# AI 视频生成技能包

这是可直接迁移的视频生成技能包，含 HyperFrames 网页视频构图与 GSAP 动效、旁白脚本、MiniMax 语音生成、字级时间戳字幕、字幕封装，以及 StaraiLink 生图 skill。HyperFrames 是构图、动效、预览、质量检查和主视频渲染的唯一链路；FFmpeg 只处理字幕封装、压制或转码。它不含任何 API 密钥或已生成视频、音频，因此可以作为可复用源包迁移到另一台电脑。

## 首次安装

在包根目录执行：

```bash
npm install
npx playwright install chromium
npx hyperframes doctor
```

另行安装 FFmpeg，并确认 `ffmpeg -version` 可用。

## 配置密钥

仅在当前终端会话配置，不将密钥写入包内：

```bash
export MINIMAX_API_KEY='your-minimax-api-key'
export STARAILINK_API_KEY='your-starailink-api-key'
```

也可在目标电脑的密钥管理器中保存名为 `codex-minimax-api-key` 的通用密码；脚本会在没有环境变量时读取它。

## HyperFrames 视频流程

```bash
npx hyperframes init episode-xx --non-interactive
cd episode-xx
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect --samples 15
npx hyperframes snapshot . --at <各个关键画面的时间点>
npx hyperframes preview --port 3017
```

通过 Studio 预览逐帧确认后，用户明确要求导出时才运行：

```bash
npx hyperframes render --output renders/episode-xx.mp4 --fps 30 --quality high
```

随后如需可关闭字幕版或字幕压制版，再使用 FFmpeg 完成。

当前旁白为 `Chinese_casual_instructor_nv1`，情感为 `calm`，基准语速为 `1.02`。钩子、解释、清单、结论和 CTA 可在不超过三次语义切换的前提下使用小幅的速度变化；语速只能为 `1.00` 或更快，且不传递 `pitch` 或 `vol` 参数，始终保持音色原始音调和音量。完整参数与字幕合并规则见 `skills/build-visual-story-ppt/references/minimax-tts.md`。修改这些参数后，应重新执行完整的一键生成命令，避免字幕和动效节奏失配。

## 抖音封面流程

本系列默认交付横版正片：`16:9 / 1920x1080 / 30fps`。每期另外交付独立的抖音封面 `images/00-douyin-cover.png`：它是直接按 `9:16 / 1080x1920` 设计的封面图，精确标题由 HTML 或编辑器叠加；封面不再拼进横版正片的首帧。

封面保留顶部 12% 与底部 18% 的平台安全区；重点标题、人物脸部与关键图形不能落入这些区域。验收包含：横版正文在 1920x1080 与 1280x720 的检查、封面在 540x960 与 375x667 的检查，以及每种动效的入场/中间/落定三帧检查。完整规范在 `skills/build-visual-story-ppt/references/douyin-vertical-delivery.md`。

若本系列使用固定的创作者角色，角色主资产保存在 `assets/recurring-character.png`；新一期开始时复制到该期的 `images/` 目录再使用。封面中将角色固定在右下角，宽度约为画面 28%-35%，人物必须与左侧标题保持独立，并高于底部字幕安全区；角色用于系列识别，不得压住主题。

横版正文采用连续的视觉动线：标题、解释与核心舞台必须彼此相连，不能把一组小卡片压在底部而让中间空着。1920x1080 成片中，核心模块文字不得小于 32px，重复的功能/判断模块高度原则上不得低于 120px；达不到尺寸时应合并内容或改成一个更大的结构块。

全系列采用高留存的编辑化短视频视觉：先用一个强烈的视觉对比建立问题，再用一个明确动作给出解决路径。每期在 `DESIGN.md` 中声明色彩、字体、动效与禁忌；可使用电蓝、酸橙、亮粉、橙色等高饱和语义色，但必须服务于信息层级。拒绝暗色开发者仪表盘、同尺寸卡片堆叠、通用机器人、漂浮代码装饰和空洞的中间留白。

## 包内依赖

- `skills/build-visual-story-ppt/`：HyperFrames 构图与动效、旁白、字幕、短视频视觉语言和视频质量规范。
- `skills/ffmpeg-video-editor/`：FFmpeg 输出规范。
- `skills/starailink-image-generation/`：StaraiLink 兼容图片 API 与 PNG 校验脚本。
- `tools/validate_srt.mjs`：字幕校验器。

MiniMax 和 StaraiLink 密钥均未被导出或嵌入本包。迁移时通过环境变量或目标电脑的系统密钥管理器提供它们。
