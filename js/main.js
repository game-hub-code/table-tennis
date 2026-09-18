// direction
const DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

let raf;
const speed = [11, 11, 12];
let ball = {};
let playerPaddle = {};
let robotPaddle = {};
let currentBestScore = [];
let turn;
let serve;
let isGameOver = false;
let grade;
let gradeId;
const gamePoint = 5;
let timer = 0;
let color = '#2c3e50';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 960;
canvas.style.width = (canvas.width / 2) + 'px';
canvas.style.height = (canvas.height / 2) + 'px';

const overlay = document.getElementById('overlay');
const restartButton = document.getElementById('restartButton');
const relatedGames = document.getElementById('related');

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

//function initializeNewGame(grade) {
function initializeNewGame() {
    ball = {
        width: 30,
        height: 30,
        x: (canvas.width / 2) - 13,
        y: (canvas.height / 2) - 13,
        moveX: 0,
        moveY: 0,
        speed: 6.3
    };
    playerPaddle = {
        width: 30,
        height: 200,
        x: 20,
        y: (canvas.height / 2) - 100,
        inning: 0,
        score: 0,
        move: 0,
        speed: 10
    };
    robotPaddle = {
        width: 30,
        height: 200,
        x: canvas.width - 50,
        y: (canvas.height / 2) - 100,
        inning: 0,
        score: 0,
        move: 0,
        speed: 5.5
    };
    ball.speed = speed[0];
    robotPaddle.speed = speed[2];
    /*
    switch (grade) 
    {
        case 1:
            // easy
            ball.speed = speed[0][0];
            robotPaddle.speed = speed[0][2];
            break;
        case 2:
            // medium
            ball.speed = speed[1][0];
            robotPaddle.speed = speed[1][2];
            break;
        case 3:
            // hard
            ball.speed = speed[2][0];
            robotPaddle.speed = speed[2][2];
            break;
    };
    */

    window.localStorage.setItem(
        'ball',
        JSON.stringify(ball)
    );
    window.localStorage.setItem(
        'playerPaddle',
        JSON.stringify(playerPaddle)
    );
    window.localStorage.setItem(
        'robotPaddle',
        JSON.stringify(robotPaddle)
    );
    const storageBestScore = localStorage.getItem('bestScore');
    let bestScore = JSON.parse(storageBestScore);
    // currentBestScore = bestScore[grade - 1];
    currentBestScore = bestScore;
    turn = robotPaddle;
    window.localStorage.setItem(
        'turn',
        JSON.stringify(turn)
    );
    serve = true;
    window.localStorage.setItem(
        'serve',
        JSON.stringify(serve)
    );
    timer = 0;
    color = '#2c3e50';
    isGameOver = false;
};
//function initializeContinue(grade) {
function initializeContinue() {
     const storageBall = localStorage.getItem('ball');
        if (storageBall) {
            ball = JSON.parse(storageBall);
        }
        else {
            ball = {
                width: 30,
                height: 30,
                x: (canvas.width / 2) - 15,
                y: (canvas.height / 2) - 15,
                moveX: 0,
                moveY: 0,
                //speed: speed[1][0]
                speed: speed[0]
            };
            window.localStorage.setItem(
                'ball',
                JSON.stringify(ball)
            );
        }

        const storagePlayerPaddle = localStorage.getItem('playerPaddle');
        if (storagePlayerPaddle) {
            playerPaddle = JSON.parse(storagePlayerPaddle);
        }
        else {
            playerPaddle = {
                width: 30,
                height: 200,
                x: 20,
                y: (canvas.height / 2) - 100,
                inning: 0,
                score: 0,
                move: 0,
                //speed: speed[1][1]
                speed: speed[1]
            };
            window.localStorage.setItem(
                'playerPaddle',
                JSON.stringify(playerPaddle)
            );
        }

        const storageRobotPaddle = localStorage.getItem('robotPaddle');
        if (storageRobotPaddle) {
            robotPaddle = JSON.parse(storageRobotPaddle);
        } else {
            robotPaddle = {
                width: 30,
                height: 200,
                x: canvas.width - 50,
                y: (canvas.height / 2) - 100,
                inning: 0,
                score: 0,
                move: 0,
                //speed: speed[1][2]
                speed: speed[2]
            };
            window.localStorage.setItem(
                'robotPaddle',
                JSON.stringify(robotPaddle)
            );
        }

        // bestScore
        const storageBestScore = localStorage.getItem('bestScore');
        if (storageBestScore) {
            let bestScore = JSON.parse(storageBestScore);
            // currentBestScore = bestScore[grade - 1];
            if (Array.isArray(bestScore) && Array.isArray(bestScore[0])) {
                bestScore = [0, 0];
                localStorage.setItem(
                    'bestScore',
                    JSON.stringify(bestScore)
                );
            }
            currentBestScore = bestScore;
        } else {
            const bestScore = [0, 0];
            window.localStorage.setItem(
                'bestScore',
                JSON.stringify(bestScore)
            );
            //currentBestScore = bestScore[grade - 1];
            currentBestScore = bestScore;
        }

        if (playerPaddle.score === gamePoint || robotPaddle.score === gamePoint) {
            //initializeNewGame(grade);
            initializeNewGame();
        } else {
            const storageTurn = localStorage.getItem('turn');
            if (storageTurn) {
                turn = JSON.parse(storageTurn);
            }
            else {
                turn = robotPaddle;
                window.localStorage.setItem(
                    'turn',
                    JSON.stringify(turn)
                )
            }

            const storageServe = localStorage.getItem('serve');
            if (storageServe) {
                serve = JSON.parse(storageServe);
            }
            else {
                serve = true;
                window.localStorage.setItem(
                    'serve',
                    JSON.stringify(serve)
                )
            }
        }

        timer = 0;
        color = '#2c3e50';
        isGameOver = false;
};
function drawMenu() {
    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    context.fillStyle = color;
    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    context.fillStyle = '#ffffff';
    context.fillRect(
        playerPaddle.x,
        playerPaddle.y,
        playerPaddle.width,
        playerPaddle.height
    );
    // Draw the Paddle
    context.fillRect(
        robotPaddle.x,
        robotPaddle.y,
        robotPaddle.width,
        robotPaddle.height
    );
    // Draw the Ball
    if (turnDelayIsOver.call(this)) {
        context.fillRect(
            ball.x,
            ball.y,
            ball.width,
            ball.height
        );
    };
    // Draw the line
    context.beginPath();
    context.setLineDash([7, 15]);
    context.moveTo((canvas.width / 2), canvas.height - 50);
    context.lineTo((canvas.width / 2), 50);
    context.lineWidth = 10;
    context.strokeStyle = '#ffffff';
    context.stroke();
    context.font = '100px Courier New';
    context.textAlign = 'center';
    // Draw the players score (left)
    context.fillText(
        playerPaddle.score.toString(),
        (canvas.width / 2) - 300,
        200
    );
    // Draw the paddles score (right)
    context.fillText(
        robotPaddle.score.toString(),
        (canvas.width / 2) + 300,
        200
    );
    newBestScore = currentBestScore[0] + ' : ' + currentBestScore[1];
    document.getElementById('bestScore').innerHTML = newBestScore;
};
function loop() {
    raf = undefined;  
    update();
    drawMenu();
    // If the game is not over, draw the next frame.
    if (!isGameOver) {
        start();
    }   
};
function start() {
    if (!raf) {
        raf = window.requestAnimationFrame(loop);
    }
};
function stop() {
    if (raf) {
        window.cancelAnimationFrame(raf);
        raf = undefined;
    }
};
// Update all objects
function update() {
    if (!isGameOver) {
        // collision boundary
        if (ball.x <= 0) {
            resetTurn.call(this, robotPaddle, playerPaddle);
            serve = true;
        }
        if (ball.x >= canvas.width - ball.width) {
            resetTurn.call(this, playerPaddle, robotPaddle);
            serve = true;
        }
        if (ball.y <= 0) {
            ball.moveY = DIRECTION.DOWN;
        }
        if (ball.y >= canvas.height - ball.height) {
            ball.moveY = DIRECTION.UP;
        }

        // Player moves up and down
        if (playerPaddle.move === DIRECTION.UP) {
            playerPaddle.y -= playerPaddle.speed;
        }
        else if (playerPaddle.move === DIRECTION.DOWN) {
            playerPaddle.y += playerPaddle.speed;
        }

        // new round
        if (turnDelayIsOver.call(this) && turn && serve) {
            ball.moveX = turn === playerPaddle ? DIRECTION.LEFT : DIRECTION.RIGHT;
            ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
            ball.x = turn === playerPaddle ? canvas.width - 100 : 100;
            ball.y = Math.floor(Math.random() * canvas.height - 200) + 200;
            turn = null;
            serve = false;
        }

        // Player collision boundary
        if (playerPaddle.y <= 0) {
            playerPaddle.y = 0;
        }
        else if (playerPaddle.y >= (canvas.height - playerPaddle.height)) {
            playerPaddle.y = (canvas.height - playerPaddle.height);
        }

        // Direction of ball movement
        if (ball.moveY === DIRECTION.UP) {
            ball.y -= (ball.speed / 1.5);
        }
        else if (ball.moveY === DIRECTION.DOWN) {
            ball.y += (ball.speed / 1.5);
        }
        if (ball.moveX === DIRECTION.LEFT) {
            ball.x -= ball.speed;
        }
        else if (ball.moveX === DIRECTION.RIGHT) {
            ball.x += ball.speed;
        }

        // Handle paddle (AI) UP and DOWN movement
        if (robotPaddle.y > ball.y - (robotPaddle.height / 2)) {
            if (ball.moveX === DIRECTION.RIGHT) {
                robotPaddle.y -= robotPaddle.speed / 1.7;
            }
            else {
                robotPaddle.y -= robotPaddle.speed / 4;
            }
        }
        if (robotPaddle.y < ball.y - (robotPaddle.height / 2)) {
            if (ball.moveX === DIRECTION.RIGHT) {
                robotPaddle.y += robotPaddle.speed / 1.7;
            }
            else {
                robotPaddle.y += robotPaddle.speed / 4;
            }
        }

        // Paddle (AI) collision boundary
        if (robotPaddle.y >= canvas.height - robotPaddle.height) {
            robotPaddle.y = canvas.height - robotPaddle.height;
        }
        else if (robotPaddle.y <= 0) {
            robotPaddle.y = 0;
        }

        // Handle Player-Ball collisions
        if (ball.x - ball.width <= playerPaddle.x && ball.x >= playerPaddle.x - playerPaddle.width) {
            if (ball.y <= playerPaddle.y + playerPaddle.height && ball.y + ball.height >=playerPaddle.y) {
                ball.x = (playerPaddle.x + ball.width);
                ball.moveX = DIRECTION.RIGHT;
                ball.speed *= 1.1;
                // ball.speed *= 1;
                playerPaddle.speed += 1;
                robotPaddle.speed += 0.1;
                beep1.play();
            }
        }

        // Handle paddle-ball collision
        if (ball.x - ball.width <= robotPaddle.x && ball.x >= robotPaddle.x - robotPaddle.width) {
            if (ball.y <= robotPaddle.y + robotPaddle.height && ball.y + ball.height >= robotPaddle.y) {
                ball.x = (robotPaddle.x - ball.width);
                ball.moveX = DIRECTION.LEFT;
                ball.speed *= 1.02;
                robotPaddle.speed += 0.1;
                beep1.play();
            }
        }
    }

    // Handle the end of inning transition
    if (playerPaddle.score === gamePoint) {
        currentBest();
        isGameOver = true;
        setTimeout(function () {
            endGameMenu('You Win!');
        }, 1000);
    }
    else if (robotPaddle.score === gamePoint) {
        currentBest();
        isGameOver = true;
        setTimeout(function () {
            endGameMenu('You Loss:(');
        }, 1000);
    }

    window.localStorage.setItem(
        'ball',
        JSON.stringify(ball)
    );
    window.localStorage.setItem(
        'playerPaddle',
        JSON.stringify(playerPaddle)
    );
    window.localStorage.setItem(
        'robotPaddle',
        JSON.stringify(robotPaddle)
    );
    window.localStorage.setItem(
        'serve',
        JSON.stringify(serve)
    );
    window.localStorage.setItem(
        'turn',
        JSON.stringify(turn)
    );
};
// bestScore
function currentBest() {
    const storageBestScore = localStorage.getItem('bestScore');
    let bestScore = JSON.parse(storageBestScore);
    var m = playerPaddle.score - robotPaddle.score;
    var n = currentBestScore[0] - currentBestScore[1];
    if (n === 0) {
        currentBestScore[0] = playerPaddle.score;
        currentBestScore[1] = robotPaddle.score;
    }
    else if (m > n) {
        currentBestScore[0] = playerPaddle.score;
        currentBestScore[1] = robotPaddle.score;
    }

    //bestScore[grade - 1] = currentBestScore;
    bestScore = currentBestScore;
    window.localStorage.setItem(
        'bestScore',
        JSON.stringify(bestScore)
    )
};
function endGameMenu(text) {
    gameOver.style.display = 'block';
    document.getElementById('msg').innerHTML = 'Game Over';
    isGameOver = true;
    document.getElementById('scoreGameOver').innerHTML = `${text}`;
    getRelated(3, html => {
        relatedGames.innerHTML = html;
    });
    document.getElementById('restartbtn').addEventListener('click', function () {
        gameOver.style.display = 'none';
        $('#restart').click();
    });
};
// Reset the ball location
function resetTurn(victor, loser) {
    ball = {
        width: 30,
        height: 30,
        x: (canvas.width / 2) - 15,
        y: (canvas.height / 2) - 15,
        moveX: 0,
        moveY: 0,
        //speed: speed[grade - 1][0]
        speed: speed[0]
    };
    window.localStorage.setItem(
        'ball',
        JSON.stringify(ball)
    );
    //playerPaddle.speed = speed[grade - 1][1];
    //robotPaddle.speed = speed[grade - 1][2];
    playerPaddle.speed = speed[1];
    robotPaddle.speed = speed[2];
    window.localStorage.setItem(
        'playerPaddle',
        JSON.stringify(playerPaddle)
    );
    window.localStorage.setItem(
        'robotPaddle',
        JSON.stringify(robotPaddle)
    );
    turn = loser;
    timer = (new Date()).getTime();
    victor.score++;
    beep2.play();
};
function turnDelayIsOver() {
    return ((new Date()).getTime() - timer >= 1000);
};
function listen() {
    document.addEventListener('keydown', function (key) {
        if (key.keyCode === 38 || key.keyCode === 87) // Up arrow or W
            playerPaddle.move = DIRECTION.UP;
        if (key.keyCode === 40 || key.keyCode === 83) // Down arrow or S
            playerPaddle.move = DIRECTION.DOWN;
    });
    document.addEventListener('keyup', function (key) {
        playerPaddle.move = DIRECTION.IDLE;
    });
};
//function restart(grade) {
function restart() {
    stop();
    //gradeBg(grade);
    //initializeNewGame(grade);
    //gradeBg();
    initializeNewGame();
    drawMenu();
    listen();
    raf = window.requestAnimationFrame(loop);
};

/*
function gradeBg(grade) {
    $.each($(".newGrade"), function() {
        $(this).removeClass("bgClick");
        $(this).addClass("bgDefault");
    });
    if (grade == 1) {
        gradeId = '#easy';
    }
    else if (grade == 2) {
        gradeId = '#medium';
    }
    else if (grade == 3) {
        gradeId = '#hard';
    }

    $(gradeId).removeClass("bgDefault");
    $(gradeId).addClass("bgClick");
};
*/

/*
$('#easy').click(function (e) {
    var targetId = '#easy';
    changeBg(targetId);
    $("#go").attr("class", "pause");
    document.getElementById('go').innerHTML = "Pause Game";
    grade = 1;
    window.localStorage.setItem(
        'grade',
        JSON.stringify(grade)
    )

    restart(grade);
});
$('#medium').click(function (e) {
    var targetId = '#medium';
    changeBg(targetId);
    $("#go").attr("class", "pause");
    document.getElementById('go').innerHTML = "Pause Game";
    grade = 2;
    window.localStorage.setItem(
        'grade',
        JSON.stringify(grade)
    )

    restart(grade);
});
$('#hard').click(function (e) {
    var targetId = '#hard';
    changeBg(targetId);
    $("#go").attr("class", "pause");
    document.getElementById('go').innerHTML = "Pause Game";
    grade = 3;
    window.localStorage.setItem(
        'grade',
        JSON.stringify(grade)
    )

    restart(grade);
});
*/

/*
function changeBg(targetId) {
    $.each($(".newGrade"), function() {
        $(this).removeClass("bgClick");
        $(this).addClass("bgDefault");
    });
    $(targetId).removeClass("bgDefault");
    $(targetId).addClass("bgClick");
};
*/

$('#restart').click(function () {
    $("#go").attr("class", "pause");
    document.getElementById('go').innerHTML = "Pause Game";
    //const storageGrade = localStorage.getItem('grade');
    //grade = JSON.parse(storageGrade);;
    //restart(grade);
    restart();
});
// play and pause
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

function getRandomIds(N, count) {
    let ids = Array.from({
        length: N + 1
    }, (_, i) => i);
    let randomIds = [];
    while (randomIds.length < count) {
        let randomIndex = Math.floor(Math.random() * ids.length);
        randomIds.push(ids.splice(randomIndex, 1)[0]);
    }

    return randomIds;
}

function getRelated(num, callback) {
    checkAndGetFeed().then(feedObj => {
        if (!feedObj || typeof feedObj !== 'object') {
            callback('');
            return;
        }

        const data = feedObj['data'];
        const view = feedObj['view'] || {};
        const rand = view['rand'] || {};
        const local = feedObj['type'] === 'loc';
        // Validate data is an array with items
        if (!Array.isArray(data) || data.length === 0) {
            callback('');
            return;
        }

        // Build textStyle from view fields
        let styleParts = [];
        if (view['color']) {
            styleParts.push(`color: ${view['color']}`);
        }
        if (view['fontsize']) {
            styleParts.push(`font-size: ${view['fontsize']}px`);
        }
        const textStyle = styleParts.length > 0 ? `style="${styleParts.join('; ')}"` : '';
        // Build iconStyle from view fields
        const iconStyle = view['iconsize'] ? `style="width: ${view['iconsize']}px; height: ${view['iconsize']}px"` : '';  
        // Ensure num doesn't exceed available data length
        num = Math.min(num, data.length);
        const probarr = rand['prob']
        let relatedItems = '';
        let accumu = 0;
        let i = 0;
        let randtmp = Math.random();
        // Find new rank based on probability
        while (i < rand['prob'].length) {
                accumu += parseFloat(rand['prob'][i]);
                if(accumu > randtmp) break;
                i++;
            }
            rank = rand['rank'][i].split(",");
            for(let j = 0; j < rank.length; j++){
                item = data[parseInt(rank[j])];
                const eid = item['slug'].split('/')[1];
                const imgsrc = local ? 'local/icons/' + item['id'] : 'http://cdn.gameanything.com/feeds/chrome/image/' + eid;
                const extlink = 'https://chromewebstore.google.com/detail/' + item['slug'];
                relatedItems += `<li><img src="${imgsrc}.png" ${iconStyle}><a href="${extlink}" ${textStyle} target=_blank>${item['name']}</a></li>`;
        }
        callback(relatedItems);
    }).catch(err => {
        console.error('Failed to load related feed:', err);
        callback('');
    });
}

async function checkAndGetFeed() {
    const FEED_URL = 'http://cdn.gameanything.com/feeds/chrome/d2/iibmocmonpccjkjpdgngimgdgpaeheje.json';
    const LOCAL_FEED_PATH = chrome.runtime.getURL('local/feed.json'); // bundled fallback
    const DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    // Step 1: Try to load feed_data from storage immediately
    const {
        last_check = 0, last_fetch = 0, feed_data = null
    } = await new Promise(resolve =>
        chrome.storage.local.get(['last_check', 'last_fetch', 'feed_data'], resolve)
    );
    if (feed_data && typeof feed_data === 'object') {
        // Background refresh triggered below, but return cached data now
        refreshFeedIfNeeded(FEED_URL, last_check, last_fetch);
        return feed_data;
    }

    // Step 2: fallback to bundled local feed file if storage is empty
    try {
        const fallbackResp = await fetch(LOCAL_FEED_PATH);
        const fallbackFeed = await fallbackResp.json();
        if (fallbackFeed && typeof fallbackFeed === 'object') {
            // Save the local feed to storage for future fast access
            chrome.storage.local.set({
                feed_data: fallbackFeed
            });
            // Trigger background refresh attempt as well
            refreshFeedIfNeeded(FEED_URL, last_check, last_fetch);
            return fallbackFeed;
        }
    } catch (err) {
        console.error('Failed to load default local feed:', err);
    }

    return null; // Total failure case
}

async function refreshFeedIfNeeded(FEED_URL, last_check, last_fetch) {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    console.log(now + ' ' + last_check);
    if (now - last_check < DAY_MS) return;
    // Update last_check to avoid repeated attempts
    chrome.storage.local.set({
        last_check: now
    });
    try {
        // Use GET with Range to minimize payload but still trigger CORS function
        const headResponse = await fetch(FEED_URL, {
            method: 'GET',
            headers: {
                'Range': 'bytes=0-0'
            }
        });
        const lastModHeader = headResponse.headers.get('last-modified');
        const remoteLastMod = lastModHeader ? new Date(lastModHeader).getTime() : null;
        if (remoteLastMod && remoteLastMod > last_fetch) {
            const feedResponse = await fetch(FEED_URL);
            const jsonData = await feedResponse.json();
            if (jsonData && typeof jsonData === 'object') {
                chrome.storage.local.set({
                    feed_data: jsonData,
                    last_fetch: remoteLastMod
                });
            }
        }
    } catch (err) {
        console.warn('Remote feed check failed:', err);
    }
}

$(function() {
    initializeContinue();
    drawMenu();
    listen();
    raf = window.requestAnimationFrame(loop);
});
