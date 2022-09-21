"use strict";

const EMPTY = "";
const FLAG = "🚩";
const MINE = "💣";

const BEGINNER = 4;
const MEDIUM = 8;
const EXPERT = 12;

const MINE_IMAGE = `<img src="img/bomb.png" alt=""></img>`;

const MINES_BEGINNER = 2;
const MINES_MEDIUM = 14;
const MINES_EXPERT = 32;

var gGame = {
    clickedYet: false,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
};
var gLevel = {
    SIZE: 4,
    MINES: 2,
};

var gTimerInterval;
var gBoard;
var gLives;

function init(size = 4, mines = 2) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gLives = mines === 2 ? 2 : 3; // if the game is on Beginner set the lives to 2
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gGame.isOn = true;
    gGame.clickedYet = false;
    gGame.secsPassed = 0;

    document.querySelector(".timer").innerHTML = "TIMER:";
    clearInterval(gTimerInterval);
    gTimerInterval = 0;

    gBoard = buildBoard();
    renderBoard(gBoard);
    setMines(gBoard, mines);
    setMinesNegsCount(gBoard);

    document.querySelector(".restart").innerText = "😀";
    document.querySelector(".lives").innerText = `Lives: \n${gLives}`;
    document.querySelector(".flags").innerText = `flags: \n${mines}`;
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

function cellClicked(elCell, cellI, cellJ, ev) {
    // prevent menu for right click
    elCell.addEventListener("contextmenu", (e) => e.preventDefault());

    if (!gGame.isOn) return; // if the game has ended you cannot click
    if (!gGame.clickedYet) showTimer(); // timer start with the first click

    var elFlags = document.querySelector(".flags");
    var elLives = document.querySelector(".lives");
    var cell = gBoard[cellI][cellJ];

    //check if the click was the right click
    if (ev.which === 3) {
        if (cell.isShown) return; // if you already revealed it you cannot put a flag

        if (gGame.markedCount >= gLevel.SIZE) return;

        if (gGame.markedCount < gLevel.MINES) {
            // you cannot put flag if you dont have any left
            if (!cell.isMarked) {
                // if it's already flagged, remove the flag
                cell.isMarked = true;
                gGame.markedCount++;
                console.log(gGame.markedCount);
                renderCell(cellI, cellJ, FLAG);
                elCell.classList.add("marked");
                elFlags.innerHTML = `Flags: \n${gLevel.MINES - gGame.markedCount}`;
            } else if (cell.isMarked) {
                cell.isMarked = false;
                gGame.markedCount--;
                console.log(gGame.markedCount);
                renderCell(cellI, cellJ, EMPTY);
                elCell.classList.remove("marked");
                elFlags.innerHTML = `Flags: \n${gLevel.MINES - gGame.markedCount}`;
                changeSmile();
            }
        } else {
            if (cell.isMarked) {
                cell.isMarked = false;
                gGame.markedCount--;
                console.log(gGame.markedCount);
                renderCell(cellI, cellJ, EMPTY);
                elCell.classList.remove("marked");
                elFlags.innerHTML = `Flags: \n${gLevel.MINES - gGame.markedCount}`;
                changeSmile();
            }
        }
    }

    //check if the click was the left click
    if (ev.which === 1) {
        if (cell.isMarked) {
            cell.isMarked = false;
            gGame.markedCount--;
            console.log(gGame.markedCount);
            elCell.classList.remove("marked");
        }
        cell.isShown = true;
        gGame.shownCount++;

        var value = cell.minesAroundCount ? cell.minesAroundCount : EMPTY;
        renderCell(cellI, cellJ, value);
        elCell.classList.add("clicked");
        // fullExpand(cellI, cellJ, gBoard);
        changeSmile();

        if (cell.isMine) {
            gLives--;
            renderCell(cellI, cellJ, MINE);
            elLives.innerHTML = `Lives: \n${gLives}`;
            if (!gLives) gameOver(false); // game over when
        }
    }

    if (gGame.markedCount + gGame.shownCount === BEGINNER ** 2) gameOver(true);
}

function gameOver(isWin) {
    document.querySelector(".restart").innerText = isWin ? "🤩" : "😩";
    gGame.isOn = false;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) renderCell(i, j, MINE);
        }
    }
    clearInterval(gTimerInterval);
    // alert("game over");
}

// function fullExpand(cellI, cellJ, board) {
//     if (cellI < 0 || cellI >= board.length - 1 || cellJ < 0 || cellJ >= board.length - 1) return;
//     if (board[cellI][cellJ].minesAroundCount !== 0) return;
//     if (board[cellI][cellJ].isShown) return;

//     console.log("hi", board[cellI][cellJ]);
//     var value = board[cellI][cellJ].minesAroundCount ? board[cellI][cellJ].minesAroundCount : EMPTY;
//     board[cellI][cellJ].isShown = true;
//     renderCell(cellI, cellJ, value);

//     //send right
//     var newJ = cellJ + 1;
//     fullExpand(cellI, newJ, board);

//     //send left
//     newJ = cellJ - 1;
//     fullExpand(cellI, newJ, board);

//     //send up
//     var newI = cellI - 1;
//     fullExpand(newI, cellJ, board);

//     //send down
//     newI = cellI + 1;
//     fullExpand(newI, cellJ, board);
//     // renderCell({ i: cellI, j: cellJ }, board[cellI][cellJ]);
//     // elCell.classList.add("clicked");
// }

function showTimer() {
    var elTimer = document.querySelector(".timer");
    var start = Date.now();

    gTimerInterval = setInterval(function () {
        var currTs = Date.now();
        gGame.secsPassed = parseInt((currTs - start) / 1000);
        elTimer.innerText = `TIMER:\n ${gGame.secsPassed}`;
    }, 1000);
    gGame.clickedYet = true;
}
