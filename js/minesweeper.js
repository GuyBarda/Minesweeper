"use strict";

const EMPTY = "";
const FLAG = "🚩";
const MINE = "💣";
const HAPPY = "🙂";
const EXCITED = "😀";
const WONDERING = "🤨";
const HIT_BOMB = "😣";
const LOSE = "😩";
const WIN = "🤩";

const BEGINNER = 4;
const MEDIUM = 8;
const EXPERT = 12;

const MINES_BEGINNER = 2;
const MINES_MEDIUM = 14;
const MINES_EXPERT = 32;

var gGame = {
    firstClick: false,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isHint: false,
    hintCount: 3,
};
var gLevel = {
    SIZE: 4,
    MINES: 2,
};

var gTimerInterval;
var gBoard;
var gLives;

function init(size = 4, mines = 2) {
    gLives = mines === 2 ? 2 : 3; // if the game is on Beginner set the lives to 2

    gLevel.SIZE = size;
    gLevel.MINES = mines;

    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gGame.isOn = true;
    gGame.firstClick = false;
    gGame.secsPassed = 0;
    gGame.isHint = false;
    gGame.hintCount = 3;

    clearInterval(gTimerInterval);
    gTimerInterval = 0;

    document.querySelector(".timer").innerHTML = "TIMER:";
    document.querySelector(".hint").classList.remove("hint-clicked");
    document.querySelector(".restart").innerText = HAPPY;
    document.querySelector(".lives").innerText = `Lives: \n${gLives}`;
    document.querySelector(".flags").innerText = `flags: \n${mines}`;

    gBoard = buildBoard();
    renderBoard(gBoard);
    setMines(gBoard, mines);
    setMinesNegsCount(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>";
        for (var j = 0; j < board[0].length; j++) {
            // const cell = board[i][j];
            const className = "cell cell-" + i + "-" + j;
            strHTML += `<td class="${className}" onMousedown="cellClicked(this, ${i}, ${j}, event)"></td>`;
            //${board[i][j].isMine ? MINE_IMAGE : board[i][j].minesAroundCount}
        }
        strHTML += "</tr>";
    }
    strHTML += "</tbody></table>";

    var elContainer = document.querySelector(".board-container");
    elContainer.innerHTML = strHTML;
}

function cellClicked(elCell, cellI, cellJ, event) {
    elCell.addEventListener("contextmenu", (e) => e.preventDefault()); // prevent menu for right click
    if (!gGame.isOn) return; // if the game has ended you cannot click
    if (!gGame.firstClick) showTimer(); // timer start with the first click

    //check if the click was the right click
    if (event.which === 3) rightClick(cellI, cellJ);

    //check if the click was the left click
    if (event.which === 1) leftCLick(elCell, cellI, cellJ);

    if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2) gameOver(true);
}

function gameOver(isWin) {
    setTimeout(() => (document.querySelector(".restart").innerText = isWin ? WIN : LOSE), 500);
    gGame.isOn = false;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) renderCell(i, j, MINE);
        }
    }
    clearInterval(gTimerInterval);
}

function showTimer() {
    var elTimer = document.querySelector(".timer");
    var start = Date.now();

    gTimerInterval = setInterval(function () {
        var currTs = Date.now();
        gGame.secsPassed = parseInt((currTs - start) / 1000);
        elTimer.innerText = `TIMER:\n ${gGame.secsPassed}`;
    }, 1000);
    gGame.firstClick = true;
}

function fullExpand(cellI, cellJ, board) {
    var outboundRow = cellI < 0 || cellI > board.length - 1;
    var outboundColumn = cellJ < 0 || cellJ > board.length - 1;
    var isNextToMine = board[cellI][cellJ].minesAroundCount > 0;
    var cell = board[cellI][cellJ];

    if (outboundRow || outboundColumn || isNextToMine || cell.isMine) return;

    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            var neighborCell = board[i][j];
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            //prettier-ignore
            if (j < 0 || j >= board.length || neighborCell.isShown || (i === cellI && j === cellJ) || neighborCell.isMarked) continue;
            neighborCell.isShown = true;
            gGame.shownCount++;
            var value = neighborCell.minesAroundCount ? neighborCell.minesAroundCount : EMPTY;
            elCell.classList.add("clicked");
            renderCell(i, j, value);
            if (neighborCell.minesAroundCount === 0) fullExpand(i, j, board);
        }
    }
}

function clickHint(elHint) {
    if (gGame.hintCount <= 0) return;
    gGame.isHint = !gGame.isHint;
    elHint.classList.toggle("hint-clicked");
}

function toggleNeighbors(cellI, cellJ, board, reveal) {
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            var neighborCell = board[i][j];
            if (j < 0 || j >= board.length || neighborCell.isShown) continue;
            if (reveal) {
                if (neighborCell.isMine) var value = MINE;
                else var value = neighborCell.minesAroundCount ? neighborCell.minesAroundCount : EMPTY;
            } else {
                var value = neighborCell.isMarked ? FLAG : EMPTY;
            }

            renderCell(i, j, value);
        }
    }
    if (!reveal) {
        var elHintBtn = document.querySelector(".hint");
        elHintBtn.classList.remove("hint-clicked");
    } else gGame.hintCount--;
}

function leftCLick(elCell, cellI, cellJ) {
    var elLives = document.querySelector(".lives");
    var cell = gBoard[cellI][cellJ];
    const revealNeighbors = toggleNeighbors.bind(this, cellI, cellJ, gBoard, true);
    const unreavealNeighbors = toggleNeighbors.bind(this, cellI, cellJ, gBoard, false);

    if (cell.isShown || cell.isMarked) return;
    if (gGame.isHint) {
        revealNeighbors();
        setTimeout(unreavealNeighbors, 1000);
        gGame.isHint = false;
        return;
    }
    cell.isShown = true;
    gGame.shownCount++;

    var value = cell.minesAroundCount ? cell.minesAroundCount : EMPTY;
    renderCell(cellI, cellJ, value);
    elCell.classList.add("clicked");
    fullExpand(cellI, cellJ, gBoard);
    // fullExpand(cellI, cellJ, gBoard);
    changeSmile(EXCITED);

    if (cell.isMine) {
        gLives--;
        renderCell(cellI, cellJ, MINE);
        elLives.innerHTML = `Lives: \n${gLives}`;
        changeSmile(HIT_BOMB);
        if (gLives <= 0) {
            gameOver(false);
            return;
        }
    }
}

function rightClick(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ];
    const markFlag = toggleFlag.bind(this, cell, cellI, cellJ, true);
    const removeFlag = toggleFlag.bind(this, cell, cellI, cellJ, false);
    if (cell.isShown) return; // if you already revealed it you cannot put a flag

    if (gGame.markedCount < gLevel.MINES) {
        if (!cell.isMarked) markFlag();
        else if (cell.isMarked) removeFlag();
    } else {
        if (cell.isMarked) removeFlag();
    }
    changeSmile(WONDERING);
}
