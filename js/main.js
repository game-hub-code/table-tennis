// direction
const DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

let raf;

// [ballSpeed, playerPaddleSpeed, robotPaddleSpeed]
const DIFFICULTY_PRESETS = {
  easy:   [9,  10, 3.5],
  medium: [11, 10, 5.5],
  hard:   [13, 10, 8.0]
};

// ── persisted settings ──────────────────────────────────────────────
let difficulty = (function () {
  const s = window.localStorage.getItem('difficulty');
  if (!s) return 'medium';
  try {
    const p = JSON.parse(s);
    return ['easy','medium','hard'].includes(p) ? p : 'medium';
  } catch(e) { return 'medium'; }
})();

let opponentCount = (function () {
  const s = window.localStorage.getItem('opponentCount');
  if (!s) return 1;
  const n = parseInt(JSON.parse(s));
  return [1,2,3].includes(n) ? n : 1;
})();

let gamePoint = (function () {
  const s = window.localStorage.getItem('gamePoint');
  if (!s) return 5;
  const n = parseInt(JSON.parse(s));
  return (Number.isInteger(n) && n >= 1 && n <= 99) ? n : 5;
})();

let speed = DIFFICULTY_PRESETS[difficulty].slice();

// ── game state ───────────────────────────────────────────────────────
let ball = {};
let playerPaddle = {};
let robots = [];          // array of AI paddles, length == opponentCount
let currentBestScore = [];
let turn;
let serve;
let isGameOver = false;
let timer = 0;
let color = '#2c3e50';

const canvas  = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width  = 1280;
canvas.height = 960;
canvas.style.width  = (canvas.width  / 2) + 'px';
canvas.style.height = (canvas.height / 2) + 'px';

// ── helpers ──────────────────────────────────────────────────────────
function makeRobots(count) {
  /*
   * Place count AI paddles on the right side.
   * Canvas right-side available space: x from ~canvas.width-250 to canvas.width-20
   * Each paddle width = 30, gap = 20 between paddles (total slot = 50px each).
   * For 1 opponent: single paddle at canonical position (canvas.width - 50).
   * For 2/3: spread them evenly in a 200px right-side zone.
   */
  const paddleW   = 30;
  const paddleH   = 200;
  const startX    = canvas.width - 50 - (count - 1) * 50;
  const result    = [];
  for (let i = 0; i < count; i++) {
    result.push({
      width:  paddleW,
      height: paddleH,
      x:      startX + i * 50,
      y:      (canvas.height / 2) - 100,
      inning: 0,
      score:  0,
      move:   0,
      speed:  speed[2]
    });
  }
  return result;
}

function turnDelayIsOver() {
  return ((new Date()).getTime() - timer >= 1000);
}

// ── init ─────────────────────────────────────────────────────────────
function initializeNewGame() {
  ball = {
    width: 30, height: 30,
    x: (canvas.width  / 2) - 15,
    y: (canvas.height / 2) - 15,
    moveX: DIRECTION.IDLE,
    moveY: DIRECTION.IDLE,
    speed: speed[0]
  };

  playerPaddle = {
    width: 30, height: 200,
    x: 20,
    y: (canvas.height / 2) - 100,
    inning: 0, score: 0, move: 0,
    speed: speed[1]
  };

  robots = makeRobots(opponentCount);

  const storageBestScore = localStorage.getItem('bestScore');
  let bestScore = JSON.parse(storageBestScore);
  currentBestScore = bestScore || [0, 0];

  // serve goes to the rightmost AI paddle
  turn  = robots[robots.length - 1];
  serve = true;
  timer = 0;
  color = '#2c3e50';
  isGameOver = false;
}

function initializeContinue() {
  // Always re-apply current difficulty speeds on load.
  const storageBall = localStorage.getItem('ball');
  if (storageBall) {
    ball = JSON.parse(storageBall);
    ball.speed = speed[0]; // re-apply current difficulty
  } else {
    ball = {
      width: 30, height: 30,
      x: (canvas.width  / 2) - 15,
      y: (canvas.height / 2) - 15,
      moveX: DIRECTION.IDLE, moveY: DIRECTION.IDLE,
      speed: speed[0]
    };
  }

  const storagePlayer = localStorage.getItem('playerPaddle');
  if (storagePlayer) {
    playerPaddle = JSON.parse(storagePlayer);
    playerPaddle.speed = speed[1];
  } else {
    playerPaddle = {
      width: 30, height: 200, x: 20,
      y: (canvas.height / 2) - 100,
      inning: 0, score: 0, move: 0, speed: speed[1]
    };
  }

  // bestScore
  const storageBestScore = localStorage.getItem('bestScore');
  if (storageBestScore) {
    let bestScore = JSON.parse(storageBestScore);
    if (Array.isArray(bestScore) && Array.isArray(bestScore[0])) {
      bestScore = [0, 0];
      localStorage.setItem('bestScore', JSON.stringify(bestScore));
    }
    currentBestScore = bestScore;
  } else {
    const bestScore = [0, 0];
    localStorage.setItem('bestScore', JSON.stringify(bestScore));
    currentBestScore = bestScore;
  }

  // On continue we always reset opponents (opponent count may have changed)
  robots = makeRobots(opponentCount);

  // If either side already hit gamePoint, start fresh
  const storedRobots = localStorage.getItem('robots');
  let anyRobotWon = false;
  if (storedRobots) {
    try {
      const saved = JSON.parse(storedRobots);
      if (Array.isArray(saved) && saved.length === opponentCount) {
        // restore scores but re-apply speed
        saved.forEach((r, i) => {
          robots[i].score = r.score || 0;
          robots[i].y     = r.y !== undefined ? r.y : robots[i].y;
          robots[i].speed = speed[2];
          if (robots[i].score >= gamePoint) anyRobotWon = true;
        });
      }
    } catch(e) {}
  }

  if (playerPaddle.score >= gamePoint || anyRobotWon) {
    initializeNewGame();
    return;
  }

  turn  = robots[robots.length - 1];
  serve = true;
  timer = 0;
  color = '#2c3e50';
  isGameOver = false;
}

// ── draw ─────────────────────────────────────────────────────────────
function drawMenu() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#ffffff';

  // player paddle
  context.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

  // all robot paddles
  robots.forEach(r => {
    context.fillRect(r.x, r.y, r.width, r.height);
  });

  // ball
  if (turnDelayIsOver()) {
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
  }

  // centre line
  context.beginPath();
  context.setLineDash([7, 15]);
  context.moveTo(canvas.width / 2, canvas.height - 50);
  context.lineTo(canvas.width / 2, 50);
  context.lineWidth   = 10;
  context.strokeStyle = '#ffffff';
  context.stroke();

  // scores
  context.font      = '100px Courier New';
  context.textAlign = 'center';
  context.fillText(playerPaddle.score.toString(), (canvas.width / 2) - 300, 200);

  // aggregate robot score (sum) – displayed on the right
  const robotTotal = robots.reduce((s, r) => s + r.score, 0);
  context.fillText(robotTotal.toString(), (canvas.width / 2) + 300, 200);

  // best score display
  const newBestScore = currentBestScore[0] + ' : ' + currentBestScore[1];
  document.getElementById('bestScore').innerHTML = newBestScore;
}

// ── game loop ─────────────────────────────────────────────────────────
function loop() {
  raf = undefined;
  update();
  drawMenu();
  if (!isGameOver) start();
}

function start() {
  if (!raf) raf = window.requestAnimationFrame(loop);
}

function stop() {
  if (raf) {
    window.cancelAnimationFrame(raf);
    raf = undefined;
  }
}

// ── update ────────────────────────────────────────────────────────────
function update() {
  if (!isGameOver) {

    // ball exits left → robot scores
    if (ball.x <= 0) {
      resetTurn(robots[robots.length - 1], playerPaddle);
      serve = true;
    }

    // ball exits right → player scores
    if (ball.x >= canvas.width - ball.width) {
      resetTurn(playerPaddle, robots[robots.length - 1]);
      serve = true;
    }

    // top/bottom bounce
    if (ball.y <= 0)                         ball.moveY = DIRECTION.DOWN;
    if (ball.y >= canvas.height - ball.height) ball.moveY = DIRECTION.UP;

    // player movement
    if (playerPaddle.move === DIRECTION.UP)   playerPaddle.y -= playerPaddle.speed;
    else if (playerPaddle.move === DIRECTION.DOWN) playerPaddle.y += playerPaddle.speed;

    // serve / new round
    if (turnDelayIsOver() && turn && serve) {
      ball.moveX = (turn === playerPaddle) ? DIRECTION.LEFT : DIRECTION.RIGHT;
      ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
      ball.x = (turn === playerPaddle) ? canvas.width - 100 : 100;
      ball.y = Math.floor(Math.random() * (canvas.height - 400)) + 200;
      turn  = null;
      serve = false;
    }

    // player boundary
    if (playerPaddle.y <= 0)                              playerPaddle.y = 0;
    else if (playerPaddle.y >= canvas.height - playerPaddle.height)
      playerPaddle.y = canvas.height - playerPaddle.height;

    // ball movement
    if      (ball.moveY === DIRECTION.UP)    ball.y -= ball.speed / 1.5;
    else if (ball.moveY === DIRECTION.DOWN)  ball.y += ball.speed / 1.5;
    if      (ball.moveX === DIRECTION.LEFT)  ball.x -= ball.speed;
    else if (ball.moveX === DIRECTION.RIGHT) ball.x += ball.speed;

    // ── AI paddle movement ───────────────────────────────────────────
    robots.forEach(robot => {
      const targetY = ball.y - (robot.height / 2);

      if (ball.moveX === DIRECTION.RIGHT) {
        // ball coming toward this paddle — track aggressively
        if (robot.y > targetY) robot.y -= robot.speed / 1.5;
        else if (robot.y < targetY) robot.y += robot.speed / 1.5;
      } else {
        // ball moving away — drift back toward centre slowly
        if (robot.y > targetY) robot.y -= robot.speed / 4;
        else if (robot.y < targetY) robot.y += robot.speed / 4;
      }

      // boundary
      if (robot.y >= canvas.height - robot.height) robot.y = canvas.height - robot.height;
      else if (robot.y <= 0) robot.y = 0;
    });

    // ── player-ball collision ────────────────────────────────────────
    if (
      ball.x - ball.width <= playerPaddle.x &&
      ball.x >= playerPaddle.x - playerPaddle.width &&
      ball.y <= playerPaddle.y + playerPaddle.height &&
      ball.y + ball.height >= playerPaddle.y
    ) {
      ball.x = playerPaddle.x + ball.width;
      ball.moveX = DIRECTION.RIGHT;
      ball.speed *= 1.1;
      playerPaddle.speed += 1;
      robots.forEach(r => r.speed += 0.1);
      beep1.play();
    }

    // ── robot-ball collisions ────────────────────────────────────────
    // Check each robot; the *leftmost* robot that intercepts wins.
    // (Ball travels right-to-left toward player after first hit.)
    for (let i = 0; i < robots.length; i++) {
      const robot = robots[i];
      if (
        ball.x - ball.width <= robot.x &&
        ball.x >= robot.x - robot.width &&
        ball.y <= robot.y + robot.height &&
        ball.y + ball.height >= robot.y
      ) {
        ball.x = robot.x - ball.width;
        ball.moveX = DIRECTION.LEFT;
        ball.speed *= 1.02;
        robot.speed += 0.1;
        beep1.play();
        break; // only one robot handles the hit per frame
      }
    }
  }

  // ── win condition ────────────────────────────────────────────────
  const robotTotal = robots.reduce((s, r) => s + r.score, 0);

  if (playerPaddle.score >= gamePoint) {
    currentBest();
    isGameOver = true;
    setTimeout(() => endGameMenu('You Win!'), 1000);
  } else if (robotTotal >= gamePoint) {
    currentBest();
    isGameOver = true;
    setTimeout(() => endGameMenu('You Lose :('), 1000);
  }

  // persist
  localStorage.setItem('ball',         JSON.stringify(ball));
  localStorage.setItem('playerPaddle', JSON.stringify(playerPaddle));
  localStorage.setItem('robots',       JSON.stringify(robots));
  localStorage.setItem('serve',        JSON.stringify(serve));
  localStorage.setItem('turn',         JSON.stringify(turn));
}

// ── bestScore ─────────────────────────────────────────────────────────
function currentBest() {
  const robotTotal = robots.reduce((s, r) => s + r.score, 0);
  const m = playerPaddle.score - robotTotal;
  const n = currentBestScore[0] - currentBestScore[1];
  if (n === 0 || m > n) {
    currentBestScore[0] = playerPaddle.score;
    currentBestScore[1] = robotTotal;
  }
  localStorage.setItem('bestScore', JSON.stringify(currentBestScore));
}

// ── game over overlay ─────────────────────────────────────────────────
function endGameMenu(text) {
  gameOver.style.display = 'block';
  document.getElementById('msg').innerHTML = 'Game Over';
  isGameOver = true;
  document.getElementById('scoreGameOver').innerHTML = text;
  // remove previous listener to prevent stacking
  const btn = document.getElementById('restartbtn');
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', function () {
    gameOver.style.display = 'none';
    $('#restart').click();
  });
}

// ── reset turn ───────────────────────────────────────────────────────
function resetTurn(victor, loser) {
  ball = {
    width: 30, height: 30,
    x: (canvas.width  / 2) - 15,
    y: (canvas.height / 2) - 15,
    moveX: DIRECTION.IDLE, moveY: DIRECTION.IDLE,
    speed: speed[0]
  };
  playerPaddle.speed = speed[1];
  robots.forEach(r => r.speed = speed[2]);
  turn = loser;
  timer = (new Date()).getTime();
  victor.score++;
  beep2.play();
}

// ── keyboard ──────────────────────────────────────────────────────────
function listen() {
  document.addEventListener('keydown', function (key) {
    if (key.keyCode === 38 || key.keyCode === 87) playerPaddle.move = DIRECTION.UP;
    if (key.keyCode === 40 || key.keyCode === 83) playerPaddle.move = DIRECTION.DOWN;
  });
  document.addEventListener('keyup', function () {
    playerPaddle.move = DIRECTION.IDLE;
  });
}

// ── restart ───────────────────────────────────────────────────────────
function restart() {
  stop();
  initializeNewGame();
  drawMenu();
  listen();
  raf = window.requestAnimationFrame(loop);
}

// ── controls wiring ───────────────────────────────────────────────────

// Sync UI selects to persisted values
document.getElementById('difficulty').value   = difficulty;
document.getElementById('opponentCount').value = opponentCount.toString();
document.getElementById('matchPoints').value   = gamePoint.toString();

// New Game button
$('#restart').click(function () {
  $('#go').attr('class', 'pause');
  document.getElementById('go').innerHTML = 'Pause Game';
  restart();
});

// Difficulty
$('#difficulty').on('change', function () {
  difficulty = this.value;
  localStorage.setItem('difficulty', JSON.stringify(difficulty));
  speed = DIFFICULTY_PRESETS[difficulty].slice();
  $('#go').attr('class', 'pause');
  document.getElementById('go').innerHTML = 'Pause Game';
  restart();
});

// Opponent count
$('#opponentCount').on('change', function () {
  const n = parseInt(this.value);
  if ([1,2,3].includes(n)) {
    opponentCount = n;
    localStorage.setItem('opponentCount', JSON.stringify(opponentCount));
    $('#go').attr('class', 'pause');
    document.getElementById('go').innerHTML = 'Pause Game';
    restart();
  }
});

// Match points
$('#matchPoints').on('change', function () {
  const n = parseInt(this.value);
  if (Number.isInteger(n) && n >= 1 && n <= 99) {
    gamePoint = n;
    localStorage.setItem('gamePoint', JSON.stringify(gamePoint));
    $('#go').attr('class', 'pause');
    document.getElementById('go').innerHTML = 'Pause Game';
    restart();
  } else {
    // Reset to last valid
    this.value = gamePoint.toString();
  }
});

// Pause / Continue
$('#go').click(function () {
  if (!isGameOver) {
    if (this.className === 'play') {
      start();
      this.className = 'pause';
      this.innerHTML = 'Pause Game';
    } else if (this.className === 'pause') {
      stop();
      this.className = 'play';
      this.innerHTML = 'Continue';
    }
  }
});

// ── boot ──────────────────────────────────────────────────────────────
$(function () {
  initializeContinue();
  drawMenu();
  listen();
  raf = window.requestAnimationFrame(loop);
});
