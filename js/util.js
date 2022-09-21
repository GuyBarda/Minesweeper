"use strict";

// randomly creates x amount of mines on the board based on the number given
function setMines(board, howMuchMines) {
    var rndI = getRandomInt(0, board.length);
    var rndJ = getRandomInt(0, board.length);
    for (let i = 0; i < howMuchMines; i++) {
        while (board[rndI][rndJ].isMine) {
            rndI = getRandomInt(0, board.length);
            rndJ = getRandomInt(0, board.length);
        }
        board[rndI][rndJ].isMine = true;
    }
}

// count how many mines are around 1 cell
function countMine(cellI, cellJ, board) {
    var mineCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            // if (board[i][j] === LIFE || board[i][j] === SUPER_LIFE) mineCount++;
            if (board[i][j].isMine) mineCount++;
        }
    }
    return mineCount;
}

// sets the number of mines neighbors in the cell
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = 0; j < board.length; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) continue;
            var countMines = countMine(i, j, board);
            board[i][j].minesAroundCount = countMines;
        }
    }
    renderBoard(board);
}

// check if all the cells around him are empty
// return true only if all of them aren't mine

// function checkIfLonely(cellI, cellJ, board) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= board.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= board[i].length) continue;
//             if (i === cellI && j === cellJ) continue;
//             if (board[i][j].isMine) return false;
//         }
//     }
//     return true;
// }

// function findRandomEmptyCell() {
//     var emptyCells = [];
//     for (let i = 1; i < gBoard.length - 1; i++) {
//         for (let j = 1; j < gBoard[i].length - 1; j++) {
//             if (!gBoard[i][j]) emptyCells.push({ i, j });
//         }
//     }
//     var rndIdx = getRandomIntInclusive(0, emptyCells.length - 1);
//     return emptyCells[rndIdx];
// }

function renderCell(cellI, cellJ, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`);
    elCell.innerHTML = value;
}

function changeSmile() {
    var elRestart = document.querySelector(".restart");
    elRestart.innerText = "🤨";
    setTimeout(() => (elRestart.innerText = "😀"), 500);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
