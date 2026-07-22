# Toolchain Selection

Choose one primary render engine before building. Record the choice and the reason in `DESIGN.md`; keep the final timing, captions, and scene transitions in that engine only.

| Need | Primary tool | Reason |
| --- | --- | --- |
| HTML/CSS/GSAP visual story, rapid local preview, animation layout inspection | HyperFrames | Native composition timeline plus `lint`, `validate`, `inspect`, snapshot, Studio preview, and MP4 render. |
| React component reuse, generated variants, frame-exact sequencing, substantial charts/data, complex audio-driven composition | Remotion | React composition model, reusable components, frame APIs, Studio, still renders, and programmatic render. |
| Editable Figma cover/deck/screen, existing Figma reference, or design-system components/tokens | Figma | Establishes the visual source and editable design artifact; it does not render the final MP4. |

## Rules

1. Use HyperFrames by default for this tutorial series. Select Remotion only when its React/frame model solves a real composition requirement.
2. Figma may precede either render engine. Start from the supplied Figma file when available; otherwise create an editable file only when the user asks for a Figma deliverable.
3. Extract Figma-approved color, type, imagery, spacing, and layout decisions into `DESIGN.md`. Recreate the resulting motion in HyperFrames or Remotion; do not attempt to synchronize a Figma prototype with a video timeline.
4. Do not mix HyperFrames and Remotion as co-equal final timelines. A secondary tool may supply a static asset, but one engine owns timing, captions, transitions, preview, and final MP4.
5. Verify the final project in its native Studio and with its native frame/snapshot tooling before render. Use FFmpeg only after render for subtitle muxing, burn-in, compression, or metadata.
