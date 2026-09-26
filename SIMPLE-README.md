# Table Tennis Game — Plain-English Guide

This is a simple ping-pong game that runs in a web browser. Below is what each file does, explained without technical jargon, plus how to actually run it.

## How to run it (no coding needed)

1. Download/keep all the folders (`css`, `js`, `images`) and the file `index.html` together in one folder — don't separate them.
2. Double-click `index.html`.
3. It opens in your browser and the game just works.

That's it. You never need to open or edit any of the other files unless you want to change something.

## What each file actually does

Think of it like a car:

- **`index.html`** = the car's body and dashboard. This is the only file you open. It has the buttons you see (Pause, New Game, difficulty dropdown, etc.) and the screen the game is drawn on.

- **`css/main.css`** = the paint job. It controls how things *look* — colors, sizes, spacing. If you wanted the game to look different (bigger buttons, different colors), this is the file that would change, but nothing here affects how the game *plays*.

- **`js/main.js`** = the engine. This is the actual "brain" of the game — it decides how fast the ball moves, how hard the computer opponent plays, keeps score, and remembers your last-used settings (like difficulty) even after you close the browser.

- **`js/audio.js`** = the sound system. All the beeps and sound effects live in here.

- **`js/jquery-3.6.0.min.js`** = a borrowed toolbox. This isn't something anyone wrote specifically for this game — it's a very common, free helper library that lots of websites use to make buttons and clicks easier to program. You don't need to touch it.

- **`js/analytics.js`** and **`js/google-analytics.js`** = a silent notepad. These quietly send a note to Google Analytics saying "someone played the game" or "someone clicked restart" — just usage tracking, invisible to the player, doesn't affect gameplay at all.


- **`images/logo.png`** = the logo picture shown on the game.

## The one-line summary

Only `index.html` matters for *opening* the game. Everything else is a supporting file it quietly loads in the background — except `background.js`, which isn't loaded by anything and looks like it doesn't belong in this project at all.