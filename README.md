# Table Tennis Game

Browser-based table tennis (pong-style) game — HTML5 canvas, vanilla JS, jQuery, with GA4 analytics tracking.

## Root

| File | Purpose |
|---|---|
| `index.html` | The single page/entry point. Contains the game header (Pause/New Game buttons, difficulty select, opponent-count select, match-points input, best-score display), the `<canvas>` element the game renders into, and a game-over overlay. Loads all CSS/JS. |

## `css/`

| File | Purpose |
|---|---|
| `main.css` | All page/game styling — layout of the header controls, score display, canvas sizing, and the game-over overlay. |

## `js/`

| File | Purpose |
|---|---|
| `main.js` | Core game logic. Defines paddle/ball movement directions, difficulty presets (ball speed / player paddle speed / robot paddle speed per difficulty level), and reads/writes user settings (`difficulty`, `opponentCount`) to `localStorage` so they persist between visits. This is where the canvas render loop, collision detection, scoring, and game-over handling live. |
| `audio.js` | Game sound effects, embedded directly as base64-encoded `data:audio/wav;base64,...` strings (paddle hits, scoring, etc.) rather than separate audio files — keeps the game self-contained with no extra asset requests. |
| `jquery-3.6.0.min.js` | Third-party library — jQuery 3.6.0 (minified), used for DOM/event handling in `main.js`. |
| `analytics.js` | Site-specific analytics glue, loaded as an ES module (`type="module"`). Fires a page-view event on load and listens globally for clicks on the restart/difficulty buttons to fire follow-up tracking events. |
| `google-analytics.js` | Wraps the GA4 Measurement Protocol — sends events directly to Google Analytics's collection endpoint using a hardcoded Measurement ID and API secret, including session/engagement-time bookkeeping. Imported by `analytics.js`. |


## Assets

| Folder | Purpose |
|---|---|
| `images/logo.png` | Site/game logo image. |

## Tech stack summary

- Plain HTML/CSS, HTML5 `<canvas>` for rendering.
- jQuery for DOM/event handling.
- Vanilla JS game loop and state (`main.js`), with settings persisted via `localStorage`.
- GA4 (Google Analytics 4) event tracking wired through `analytics.js` → `google-analytics.js`.
- No build step — files are loaded directly via `<script>`/`<link>` tags.