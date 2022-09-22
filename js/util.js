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

function toggleFlag(cell, cellI, cellJ, mark) {
    var elFlags = document.querySelector(".flags");
    var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`);

    cell.isMarked = mark;
    mark ? gGame.markedCount++ : gGame.markedCount--;
    console.log(`want to mark?: ${mark} \nhow many flags are on the board: ${gGame.markedCount}`);

    renderCell(cellI, cellJ, mark ? FLAG : EMPTY);
    elCell.classList.toggle("marked");
    elFlags.innerHTML = `Flags: \n${gLevel.MINES - gGame.markedCount}`;
}

function renderCell(cellI, cellJ, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`);
    elCell.innerText = value;
}

function changeSmile(mood) {
    var elRestart = document.querySelector(".restart");
    elRestart.innerText = mood;
    setTimeout(() => (elRestart.innerText = HAPPY), 500);
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
