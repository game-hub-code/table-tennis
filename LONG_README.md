# Table Tennis Game: The Complete Presenter's Guide

**Reader:** you, presenting this project to judges.
**Goal:** after reading this, you can explain it, demo it, and answer any question.

> **Honesty note (read first).** This guide comes from reading every file in the project. Nobody opened the game in a browser to test it while writing this. Claims are tagged:
> **[VERIFIED]** = seen directly in the files. **[INFERRED]** = worked out from the code. **[UNKNOWN]** = nobody can tell from the files.
> Do not tell judges an [INFERRED] item as if it were proven. Say "from reading the code, it looks like...".

---

## 1. The 20-second answer

"This is a table tennis game that runs in a web browser. You control the left paddle. A computer robot controls the right paddle. First side to reach the chosen number of points wins. You can pick Easy, Medium or Hard, pick 1 to 3 robot opponents, and pick how many points win the game."

Memorize that. Everything else in this guide backs it up.

---

## 2. The 2-minute answer

The game is built from three web languages:

- **HTML** builds the page: buttons, dropdown menus, and an empty drawing board.
- **CSS** makes the page look good: colors, rounded corners, glowing buttons.
- **JavaScript** makes the game work: it moves the ball, moves the robot, counts points, and plays sounds.

The game has **no server, no database, no app to install**. Your browser does all the work. The game remembers your settings and scores inside your own browser, so it still knows them after you close the tab.

---

## 3. Words you must know (say them with confidence)

| Word | Simple meaning | Example to say |
|---|---|---|
| **Browser** | The program you use to open websites (Chrome, Edge, Firefox). | "The game runs inside the browser." |
| **HTML** | The skeleton of a web page. It lists what is on the page. | "HTML is the bones." |
| **CSS** | The style of a web page. Colors, sizes, spacing. | "CSS is the paint and clothes." |
| **JavaScript (JS)** | The language that makes web pages do things. | "JavaScript is the brain and muscles." |
| **Canvas** | A blank rectangle on the page that code can draw on, like a whiteboard. | "The game is drawn on a canvas." |
| **jQuery** | A free toolbox of shortcuts that other programmers wrote for JavaScript. | "We used jQuery to connect buttons to actions." |
| **Pixel** | One tiny dot on the screen. | "The paddle is 30 pixels wide." |
| **Frame** | One still picture. The game draws many frames every second, like a flip book, so things look like they move. | "Each frame moves the ball a little." |
| **Collision** | When two things touch. | "A collision between ball and paddle makes the ball bounce." |
| **AI / Robot opponent** | Code that decides what the computer paddle does. | "The robot follows the ball up and down." |
| **localStorage** | A small notebook inside your browser where a website can save short notes. | "That is how the game remembers your best score." |
| **Base64** | A way to turn a file (like a sound) into plain letters and numbers so it can sit inside a code file. | "The sounds are stored as text inside audio.js." |
| **GA4 / Google Analytics** | A Google tool that counts how many people visit a site. | "The project has code to report visits to Google." |

---

## 4. What is in the project (the file map)

```
table-tennis/
├── index.html              ← the ONLY file you open. The page itself.
├── README.md               ← the project's own technical notes
├── SIMPLE-README.md        ← the project's own plain-English notes
├── css/
│   └── main.css            ← all the looks (432 lines)
├── js/
│   ├── main.js             ← the game brain (542 lines)  ★ most important
│   ├── audio.js            ← 3 sounds stored as text (47 KB)
│   ├── jquery-3.6.0.min.js ← borrowed toolbox (89 KB, not written by the team)
│   ├── analytics.js        ← visit-counting glue (13 lines)
│   └── google-analytics.js ← visit-counting sender (118 lines)
└── images/
    └── logo.png            ← 128×128 logo picture
```

**Car analogy for judges:**

| Part | Car parts |
|---|---|
| `index.html` | Body and dashboard |
| `main.css` | Paint job |
| `main.js` | Engine and driver |
| `audio.js` | Horn and radio |
| `jquery` | A borrowed toolbox |
| `analytics` | A trip counter that reports to a company |
| `logo.png` | A badge in the glovebox (never put on the car, see section 12) |

---

## 5. How to run it (and show it live)

**Easiest way:** put all folders together, then double-click `index.html`. The game opens in your browser. [VERIFIED: the game scripts load with plain `<script>` tags, no build step.]

**Better way (recommended for the demo):** run a tiny local web server.
On Windows, open a terminal inside the project folder and type:

```
py -m http.server 8000
```

Then open `http://localhost:8000` in your browser. [INFERRED: this works because Python's built-in server serves files. Test it once before the presentation.]

Why "better"? `analytics.js` is loaded as a JavaScript *module*. Browsers often block modules when a file is opened by double-clicking. The game still plays either way. [INFERRED]

**Controls:**

| Action | Keys or button |
|---|---|
| Move paddle up | `W` or `↑` |
| Move paddle down | `S` or `↓` |
| Pause / continue | `Space` bar, or the green "Pause Game" button |
| Start over | "New Game" button |
| Difficulty | Blue dropdown: Easy / Medium (default) / Hard |
| Robots | Blue dropdown: 1, 2 or 3 opponents |
| Points to win | Purple box, any whole number from 1 to 99 (default 5) |

---

## 6. How to play (the rules in kid words)

1. You are the **left** paddle. The robot(s) are on the **right**.
2. The ball flies back and forth. Hit it with your paddle to send it back.
3. If the ball gets past you and touches the left wall, **the robots get 1 point**.
4. If the ball gets past the robots and flies off the right side, **you get 1 point**.
5. After each point, the ball resets to the middle. It hides for **1 second**, then a new serve starts.
6. The first side to reach the "points to win" number wins. A "Game Over" screen says **You Win!** or **You Lose :(**.
7. With 2 or 3 robots, **all the robots' points are added together** into one number on the right side. [VERIFIED: `robots.reduce(... s + r.score ...)`]

**The game gets harder as a rally goes on.** Every time you hit the ball, it speeds up by 10%. The robot only speeds up a tiny bit. When someone scores, all speeds reset. [VERIFIED]

---

## 7. Deep dive: `index.html` (51 lines)

This file is a list of everything on the page, from top to bottom.

**The `<head>` (behind-the-scenes info):**
- Page title: "Table Tennis Game" (the text on the browser tab).
- Loads `js/analytics.js` (as a module) and `css/main.css`.

**The `<body>` (what you see):**

| Piece | ID | What it is |
|---|---|---|
| Pause button | `go` | Says "Pause Game", changes to "Continue" |
| Difficulty dropdown | `difficulty` | Easy, Medium, Hard |
| Opponents dropdown | `opponentCount` | 1, 2 or 3 |
| Points box | `matchPoints` | Number from 1 to 99, starts at 5 |
| New Game button | `restart` | Starts a fresh game |
| Best score | `bestScore` | Shows "0 : 0" until you finish a game |
| Canvas | `canvas` | The drawing board where the game appears |
| Game-over screen | `gameOver` | Hidden until the game ends. Holds the message, the score text, and a Restart button |

**The scripts at the bottom, in this order:**
1. `jquery-3.6.0.min.js` (toolbox first, because `main.js` needs it)
2. `audio.js` (sounds ready)
3. `main.js` (the game starts)

**Judge question:** *"Why does the order matter?"*
**Answer:** "Each file uses things from the file before it. `main.js` uses jQuery and the sounds, so they must load first."

---

## 8. Deep dive: `js/main.js` (542 lines) ★

This is the heart. Explain it in ten parts.

### 8.1 Directions
A small list gives names to directions: IDLE, UP, DOWN, LEFT, RIGHT. Names are easier to read than numbers.

### 8.2 Difficulty presets
Three numbers per level: **[ball speed, your paddle speed, robot paddle speed]**

| Level | Ball | You | Robot |
|---|---|---|---|
| Easy | 9 | 10 | 3.5 |
| Medium | 11 | 10 | 5.5 |
| Hard | 13 | 10 | 8.0 |

"Harder" means a faster ball and a faster robot. Your speed stays the same. [VERIFIED]

### 8.3 Saved settings
When the page opens, the game reads four saved notes from the browser's notebook (`localStorage`): `difficulty`, `opponentCount`, `gamePoint` (points to win), and `bestScore`. If a note is missing or looks wrong, it falls back to Medium, 1 opponent, 5 points. [VERIFIED]

### 8.3b Full list of things the game saves
`difficulty`, `opponentCount`, `gamePoint`, `bestScore`, `ball`, `playerPaddle`, `robots`, `serve`, `turn`. The game saves the moving parts on every frame. [VERIFIED]
Only some are read back on reload: ball, your paddle, robots' scores and positions, and best score. `serve` and `turn` are saved but never read back. [VERIFIED: `initializeContinue` does not read them]

### 8.4 The drawing board
- The canvas is **1280 × 960 pixels** inside the code, but shown on the page at **half size (640 × 480)**. Drawing big and showing small keeps lines crisp on sharp screens. [VERIFIED numbers; the "crisp" reason is INFERRED]
- Everything on the board is drawn as **rectangles**: the ball is a 30×30 square, each paddle is 30 wide and 200 tall.
- The background color is `#2c3e50` (dark blue-grey). Paddles, ball, dotted center line and scores are white.

### 8.5 The robot opponents (`makeRobots`)
- 1 opponent: one paddle near the right wall.
- 2 opponents: one at x=900 and one at x=1230.
- 3 opponents: x=700, x=970 and x=1230. [VERIFIED]
- The board's height is split into equal **zones**, one per robot. Each robot guards its own zone.

**How the robot "thinks"** (this is the AI, and it is simple):
1. If the ball is in my zone, aim my paddle's middle at the ball.
2. If the ball is not in my zone, drift back to the middle of my zone.
3. If the ball is flying toward me, move at full robot speed. Otherwise move at one quarter speed (lazy).

That's all. No learning, no magic. It is a chase rule. [VERIFIED]

**Why can you beat it?** The ball moves up and down at speed ÷ 1.5. On Medium that is about 7.3, but the robot's speed is 5.5, so the robot cannot always keep up. On Hard the ball's up-down speed is about 8.7 and the robot's is 8.0, so it is much closer. [INFERRED from the numbers]

### 8.6 The game loop (the flip book)
Three functions run again and again:
1. `update()` moves everything and checks for collisions and points.
2. `drawMenu()` erases the board and redraws everything in its new place.
3. The browser's `requestAnimationFrame` calls this whole cycle for the next picture.

This repeats until the game is over. `stop()` cancels it (that is how Pause works). `start()` begins it again (that is how Continue works). [VERIFIED]

**Tricky judge question:** *"Does the game run at the same speed on every computer?"*
**Honest answer:** "The code moves things a fixed amount per frame, not per second. So on a screen that refreshes faster than 60 times a second, the game would probably run faster." [INFERRED]

### 8.7 Collisions (touching)
The game checks if two rectangles overlap. If the ball overlaps your paddle:
- ball goes right,
- ball speed × 1.1 (10% faster),
- your paddle speed + 1,
- robot speed + 0.1,
- **paddle-hit sound plays** (`beep1`).

If the ball overlaps a robot paddle:
- ball goes left,
- ball speed × 1.02 (2% faster),
- that robot speed + 0.1,
- paddle-hit sound plays.

The ball also bounces off the top and bottom edges. [VERIFIED]

### 8.8 Scoring
- Ball reaches the left edge → a robot scores.
- Ball goes past the right robot (60 pixels beyond its back edge) → you score.
- Either way: the ball resets to the middle, speeds reset to the level's numbers, the score-sound plays (`beep2`), and a 1-second wait begins. [VERIFIED]

**Who gets the next serve?** The ball is sent toward whoever just lost the point. The very first ball of a game flies toward the robots. [INFERRED from `resetTurn` and the serve code]

### 8.9 Winning and the best score
- Game ends when your score, or the robots' combined score, reaches "points to win".
- After 1 second the Game Over screen shows.
- **Best score** is saved only when it beats the old one by a bigger winning gap (your points minus robot points). It displays as `BEST 5 : 2`. [VERIFIED: `currentBest()`]
- Small oddity: the best score is also saved when you *lose*. [INFERRED from code: `currentBest()` runs in both branches]

### 8.10 Buttons and keys
- **New Game:** stops everything, sets up fresh, starts the loop.
- **Any dropdown or the points box changes:** saves the new value and restarts the game right away.
- **Pause:** if the button says "Pause Game" it stops the loop and says "Continue". Clicking again resumes.
- **Space bar:** pretends to click the pause button (it also stops the page from scrolling).
- **Keyboard:** W/↑ sets paddle direction to up, S/↓ down. Letting go of any key stops the paddle. [VERIFIED]

**Where jQuery is used:** only to attach the button and dropdown actions (`$('#restart').click(...)`, `.on('change', ...)`) and to start the game when the page is ready (`$(function () {...})`). The game drawing and physics use plain JavaScript. [VERIFIED]

---

## 9. Deep dive: `css/main.css` (432 lines)

CSS says how things look. This file has **two layers**:

**Layer 1 (top of file):** the older look. Cream background (`#faf8ef`), teal buttons, brown score box.

**Layer 2 (a section marked "UI refresh overrides"):** the newer look. Because it comes *later* in the file, it **wins** whenever both layers style the same thing. [VERIFIED: CSS uses the later rule]

What the newer look does:

| Thing | Look |
|---|---|
| Page background | Dark blue radial gradient (glow at the top) |
| Header bar | Dark see-through rounded box with a thin border |
| Pause and New Game buttons | Bright green gradient, rounded, soft glow |
| Difficulty and opponents dropdowns | Blue gradient |
| Points box | Purple gradient, with the little up/down arrows hidden |
| Best score | Frosted, see-through pill |
| Canvas | Rounded corners and a big shadow |
| Game-over screen | Full-screen dark overlay with a slight blur, centered card, green Restart button that lifts slightly on hover |

Simple ideas to mention: **gradient** (color that fades from one shade to another), **border-radius** (rounded corners), **box-shadow** (soft glow or shadow behind a box), **flexbox** (a way to line up items neatly in a row).

Unused leftovers: styles for an element named `#featured` (a list of links) are in the file, but `index.html` has no such element. [VERIFIED]

---

## 10. Deep dive: `js/audio.js` (47 KB)

The file makes three sounds. Each sound is a giant string of letters and numbers (Base64) starting with `data:audio/wav;base64,`. The browser turns that text back into sound.

| Name | Used for | Length |
|---|---|---|
| `beep1` | Ball hits a paddle | Very short |
| `beep2` | Someone scores a point | About 0.17 seconds |
| `beep3` | **Never used** anywhere | About 0.19 seconds |

[VERIFIED: I decoded the sounds. `beep3` never appears in `main.js`.]

**Why store sounds as text?** No separate sound files to lose. The whole game works from one folder. The trade-off: the file is big (47 KB). [INFERRED reason; size VERIFIED]

Technical footnote (only say if asked): `beep1` is labelled as a WAV file, but its first bytes look like MP3 data instead. Browsers usually play it anyway. [INFERRED, not tested]

---

## 11. Deep dive: the analytics files (visit counter)

**What they are meant to do:** tell Google Analytics that someone opened the page or pressed restart.

- `analytics.js` (13 lines) says: "When the page loads, send a `page_view` message. When someone clicks something with the id `restart`, `easy`, `medium` or `hard`, send another."
- `google-analytics.js` (118 lines) builds and sends those messages to Google's collection address, with a Measurement ID and a secret key written directly in the file.

**Three honest problems a sharp judge might spot:**

1. **It probably does not work on a normal website. [INFERRED]** The file asks for `chrome.storage`, which only exists inside a **Chrome browser extension**, not a normal web page. On a normal page that would cause an error, so the message likely never reaches Google. Clues that this code came from an extension: the code comments say "extension".
2. **Only the restart click is really tracked. [VERIFIED]** There are no elements with the ids `easy`, `medium` or `hard` in `index.html`. Those words are dropdown *values*, not ids.
3. **The secret key is in public view. [VERIFIED]** Anyone who opens the file can read the key, and could send fake visits to that Google account. Safer projects keep such keys on a server. Say this as a good learning point, not as an attack.

**Say to judges:** "The analytics is an extra feature. The game does not need it, and the game plays fine without it."

---

## 12. The other files

- **`js/jquery-3.6.0.min.js`:** jQuery, version 3.6.0. Written by the open-source jQuery community, not by this project. "Min" means squashed into one long line to load faster. Do not claim you or the team wrote it. [VERIFIED from its header]
- **`images/logo.png`:** a 128 × 128 pixel picture. **No file uses it.** Searching `index.html`, the CSS and `main.js` finds no mention of it. [VERIFIED]
- **`README.md`:** the project's own technical notes (table of files, tech stack). Accurate to the code.
- **`SIMPLE-README.md`:** plain-English notes. It mentions a file called `background.js`. **That file does not exist** in the project. [VERIFIED]

---

## 13. Who made it, and how it grew

- **Who built it in real life?** [UNKNOWN from the files]. Do not guess names or dates.
- **Where the base came from:** clues suggest the project started from an older ready-made game page, possibly a Chrome-extension game: leftover analytics code, leftover unused styles, and old cream-and-brown colors. [INFERRED. The original source is UNKNOWN.]
- **What was added on top:** difficulty choice, 1 to 3 opponents, a points-to-win box, a Space bar pause, and a redesign. [INFERRED from the code]

**If a judge asks "Did you make this?"** Say the truth: "I am presenting this project on behalf of the team that built it. I studied every file and I can explain how it works and show it." Do not say you wrote it yourself.

---

## 14. Tools and technology used (the whole list)

| What | Used for |
|---|---|
| HTML5 | Page structure |
| CSS3 | Looks |
| JavaScript | Game logic |
| HTML5 Canvas | Drawing the game |
| jQuery 3.6.0 | Buttons and dropdowns |
| Browser localStorage | Remembering settings and scores |
| Base64 audio | Sounds inside a code file |
| Google Analytics 4 (Measurement Protocol) | Intended visit counting |

**Not used:** no server, no database, no game engine, no framework (like React), no build tool, no online accounts. [VERIFIED: no such files exist]

---

## 15. Known weak spots (know them before the judges do)

Being honest about limits makes you look smart.

1. **Space bar may stop working after "New Game". [INFERRED, untested]** The code adds the keyboard listener again on every restart, so after one restart there are two. One Space press then toggles pause twice, which cancels out. The arrow keys and W/S still work.
2. **Speed depends on screen refresh rate.** See section 8.6. [INFERRED]
3. **Releasing any key stops the paddle,** even if you are still holding another. [VERIFIED]
4. **Analytics likely does not work** on a normal page. See section 11. [INFERRED]
5. **Secret key visible** in a public file. [VERIFIED]
6. **Unused things:** `beep3`, `logo.png`, `#featured` styles, and a missing `background.js` mentioned in a README. [VERIFIED]
7. **No tests, no computer-versus-computer checks** in the project. [VERIFIED: none exist]
8. **The score box does not show which robot scored** when there are several, only the total. [VERIFIED]

Say: "If I could improve it, I would fix the pause key bug, make speed independent of the screen, and hide the analytics secret."

---

## 16. Your demo script (about 3 minutes)

1. **Open** the game. Say the 20-second answer (section 1).
2. **Point** at the header: "Pause, difficulty, opponents, points to win, best score."
3. **Play a few seconds** with `W` and `S`. Point out the dotted line and the score numbers.
4. **Change Difficulty to Hard.** Say: "It restarts and the ball and robot get faster."
5. **Change Opponents to 3.** Say: "Now three robots guard three zones. Their points are added together."
6. **Set points to 2.** Play until Game Over. Show "You Win!" or "You Lose :(", then click Restart.
7. **Pause** with the green button. Say: "This stops the flip-book loop."
8. **Refresh the page.** Say: "It remembers my settings and best score. That is localStorage."
9. **Show the files** (File Explorer). Say: "`index.html` is the page. `main.css` is the looks. `main.js` is the brain."

Practice this twice. Test the Space bar in advance, given weak spot 1.

---

## 17. Judge Q&A (memorize the answers)

**The basics**

**Q: What is your project?**
A table tennis game that runs in a web browser. You play against a computer robot.

**Q: What is it made with?**
HTML, CSS and JavaScript, plus a helper toolbox called jQuery. It draws on an HTML canvas.

**Q: Do you need internet or any install?**
No install. Open `index.html`. The game runs offline. Only the analytics idea wants the internet.

**Q: What does each main file do?**
`index.html` is the page. `main.css` is the looks. `main.js` is the game brain. `audio.js` holds the sounds.

**How it works**

**Q: How does the ball move?**
The game redraws the screen many times a second. Each time, it adds a small step to the ball's position. Many small steps look like smooth movement.

**Q: How does the game know the ball hit the paddle?**
It compares the ball's rectangle to the paddle's rectangle. If they overlap, it counts as a hit.

**Q: How does the robot work?**
It follows the ball up and down inside its zone. It moves fast when the ball flies toward it and slowly when the ball is elsewhere. It has no learning.

**Q: How do the difficulty levels work?**
Each level has a ball speed and a robot speed. Hard means a faster ball and a faster robot. Your paddle speed stays the same.

**Q: Why does the ball get faster?**
Each of your hits makes it 10% faster. It resets after every point.

**Q: How does it remember my best score?**
It saves it in the browser's localStorage, a small notebook inside the browser.

**Q: How does the game end?**
When you, or the robots together, reach the points-to-win number.

**Q: How do the sounds work?**
They are stored as long text strings inside `audio.js`. The browser plays them when the ball hits or someone scores.

**Q: What is the canvas?**
A blank rectangle on the page that code can draw on, like a whiteboard.

**Q: What does jQuery do here?**
It links the buttons and dropdowns to the game actions.

**Q: Why is the drawing board 1280×960 but only 640×480 on screen?**
The code draws at double size and the page shows it at half size. This is a common trick to keep images sharp. [INFERRED reason]

**Deeper questions**

**Q: What is the hardest part of this project?**
The collision and scoring logic in `main.js`, and coordinating up to three robots so they guard separate zones.

**Q: Why did you (or they) use localStorage and not a database?**
The game only needs to save a few small notes for one player. A database would be too much.

**Q: What would you improve?**
Fix the Space bar after restart, make speed the same on every screen, add touch controls for phones, and hide the analytics key. (Section 15.)

**Q: Is it safe?**
The game itself only runs in the browser and stores small notes on your own computer. One caution: a secret key for Google Analytics is visible in a public file.

**Q: How many lines of code?**
About 1,150 lines across HTML, CSS and the three project JavaScript files (not counting jQuery and the sounds). Main game file: 542 lines. [VERIFIED by line count: main.js 542, main.css 432, index.html 51, analytics.js 13, google-analytics.js 118]

**Q: Can it run on a phone?**
The page adapts a little, but the controls are keyboard-only. [VERIFIED: no touch code exists] It is not built for phones.

**Q: Does it work with two human players?**
No. One human, one to three robots.

**Q: Did you make the jQuery file?**
No. It is a free open-source library made by the jQuery community.

**Trap questions**

**Q: "Did you build it yourself?"**
No. Say so, then show what you learned (section 13).

**Q: "Does the analytics work?"**
"It is coded in, but from reading the code I believe it would not work on a normal web page. I have not tested it."

**Q: "Why is there a logo file that never shows?"**
"The code never loads it. It may be a leftover."

**Q: "Is the robot AI real artificial intelligence?"**
"It is a simple rule-based AI. It follows a fixed chase rule. It does not learn."

**Q: "What if the judge asks something not in this guide?"**
Say: "I don't know that yet, but I can tell you where I would look in the code." Then point to the file that fits. That answer earns respect.

---

## 18. One-page cheat sheet (read this just before you go on)

- **What:** browser table tennis game, you vs 1 to 3 robots.
- **Built with:** HTML (page), CSS (looks), JavaScript (brain), canvas (drawing), jQuery (buttons).
- **Key file:** `js/main.js`, 542 lines.
- **Controls:** W/S or arrows, Space to pause.
- **Options:** Easy/Medium/Hard, 1-3 robots, 1-99 points (default 5).
- **Speed rule:** each of your hits = ball 10% faster. Resets each point.
- **Memory:** browser localStorage.
- **Sounds:** text-encoded, inside `audio.js`.
- **Extras:** analytics (probably not working), logo (unused), `beep3` (unused).
- **Your role:** you present it on behalf of the team. You studied every file. Do not claim you wrote it.
- **Best line if stuck:** "I don't know yet, but I would look in `main.js`."
