# Short-Form Motion

Use this for vertical social explainers and keyword-led pages. Treat every meaningful keyword as one short, readable shot. Keep the background and main card settled while the focal group enters; do not animate the whole page continuously.

## Beat Contract

Record `cue`, `group`, `verb`, `direction`, `duration`, and `settled state`. Resolve `cue` from the final TTS word timestamps. Place a beat 80-150 ms before its spoken cue. Use one emphasis beat at a time and leave at least 250 ms of settled reading time before the next beat.

## Motion Verbs

| Use for | Verb | Start to settled state |
|---|---|---|
| New statement or side point | slide | `translateX(32-56px)` plus opacity 0 to 1 |
| A selected item or priority | pop | `scale(.78)` plus opacity 0 to 1; one restrained settle only |
| A concept card opening | fold | `rotateY(-72deg)` with `transform-origin:left center`, opacity .2 to 1 |
| A cause, path, or sequence | reveal | `clip-path:inset(0 100% 0 0)` to none |
| A shift in emphasis | roll | `rotate(-6deg) translateY(18px)` to none; use once per page maximum |
| A number or decisive keyword | stamp | `scale(1.18)` to 1 after entry; never loop it |

Keep entries 320-650 ms. Use an ease-out or a short cubic-bezier settle. Do not combine more than two transforms on one group. Do not use bounce, elastic motion, continuous breathing, page-level camera drift, or generic fade-only sequencing.

## Card Choreography

- Use one stable primary card and one focal layer at a time.
- On 9:16 pages, reserve the top 12% and bottom 18% for platform chrome and captions. Keep key copy inside the middle 70%.
- Give a focal keyword a larger size, clear contrast, and a tangible shadow or edge; do not create a UI card for every sentence.
- Use 3D depth only for an intentional fold or card turn. Add `perspective` to the parent and verify the midpoint frame is legible.
- Do not add sound effects unless the user explicitly requests sound design and an approved sound asset is available. Motion must communicate without audio cues.

## QA

At each beat, capture pre-entry, midpoint, and settled frames. The midpoint must visibly differ from both endpoints. Verify that the focal group arrives within about one second of its spoken cue and that prior groups remain stable. Test reduced motion with all groups visible and no timing-dependent hidden content.

## Horizontal Motion Library

Use these as a selectable library for 16:9 body videos. Pick one primary motion and, at most, one supporting motion per page. The first beat should establish a focal object in the center before moving it to its settled lane when the narration introduces the relationship.

| Name | Use when | Start -> settled state | Duration |
|---|---|---|---:|
| `hero-pin` | A page introduces one dominant concept, then adds detail | center `scale(1.08)` -> corner or side `scale(.72)` with a stable anchor line | 520-680ms |
| `split-prism` | One source becomes several distinct outputs | one object centered -> two to seven objects radiate from a prism or seam | 480-620ms |
| `orbit-reveal` | Inputs surround a central source | surrounding objects orbit off-canvas -> enter along curved 28-56px paths | 420-580ms |
| `fold-open` | Reveal a hidden rule, layer, or page | thin closed plane `rotateY(-72deg)` -> readable open plane | 420-560ms |
| `rail-slide` | Establish a clear left-to-right workflow | object off the rail -> slides 40-72px into the next node; prior nodes stay fixed | 360-520ms |
| `branch-grow` | Show one idea becoming several angles | one trunk centered -> branches extend from the same origin with opacity and scale | 520-680ms |
| `stack-fan` | Compare repeated copies with meaningful variants | stacked identical blocks -> fan into separated forms with one accent crossing them | 440-600ms |
| `wipe-fill` | Progress through time, a calendar, or a queue | empty track -> filled track follows a visible source path | 500-680ms |
| `zoom-crop` | Move from a big concept to one concrete example | whole scene -> focal object enlarges while title settles into a safe lane | 520-700ms |
| `stamp-confirm` | Finish a decision or hand control back to a person | approval mark `scale(1.18)` and opacity 0 -> `scale(1)` with one settle | 320-440ms |

Do not combine `hero-pin` and `zoom-crop` on the same beat. Do not loop these motions, add bounce, or drift the entire page. Every option must be driven by the cue's resolved word timestamp, with a 80-150ms pre-roll and at least 250ms of settled reading time before the next beat.
