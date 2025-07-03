import { generateBoard, MINE } from "./guestGameLogic.js";
import { createTileElement, toggleFlag, applyBoardScaling } from "./guestGameRenderer.js";
import { startTimer, stopTimer, updateTimerDisplay, updateMineCounter } from "./guestGameUI.js";

const inputHeight = document.getElementById("height");
const inputWidth = document.getElementById("width");
const inputMines = document.getElementById("mines");
const playButton = document.querySelector("button.no-style");

const wrapper = document.querySelector(".wrapper"); 
const gameSection = document.getElementById("game");
const boardContainer = document.getElementById("board") || createBoardContainer();
const mineCounter = document.getElementById("mine-counter") || createTextDisplay("mine-counter");


let gameState = {
    board: [],
    revealed: [],
    flagsLeft: 0,
    timerStarted: false,
    firstClick: true,
    boardSize: { rows: 0, cols: 0 },
    mines: 0,
};

let currentHeight, currentWidth, currentMines;

function createBoardContainer() {
    const div = document.createElement("div");
    div.id = "board";
    document.body.appendChild(div);
    return div;
}

function createTextDisplay(id) {
    const div = document.createElement("div");
    div.id = id;
    div.textContent = "000";
    document.body.appendChild(div);
    return div;
}

function resetGameState(rows, cols, mines) {
    gameState.board = [];
    gameState.revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    gameState.flagsLeft = mines;
    gameState.timerStarted = false;
    gameState.firstClick = true;
    gameState.boardSize = { rows, cols };
    gameState.mines = mines;
    gameState.gameOver = false;

    updateMineCounter(mineCounter, mines);
    stopTimer();
    updateTimerDisplay(0); 
}

function endGame(win) {
    gameState.gameOver = true;
    stopTimer();
    updateTimerDisplay(0);

    
    for (let r = 0; r < gameState.boardSize.rows; r++) {
        for (let c = 0; c < gameState.boardSize.cols; c++) {
            const value = gameState.board[r][c];
            const tileEl = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
            if (value === MINE && tileEl && !tileEl.classList.contains("revealed")) {
                tileEl.classList.remove("hidden");
                tileEl.classList.add("revealed");
                tileEl.textContent = "💣";
            }
        }
    }

    
    const popup = document.getElementById("endgame-popup");
    const title = document.getElementById("endgame-title");
    popup.classList.remove("hidden");
    title.textContent = win ? "🎉 You Win!" : "💥 You Lose";

    
    document.getElementById("restart-button").onclick = () => {
        popup.classList.add("hidden");
        initGame(); 
    };

    document.getElementById("change-difficulty-button").onclick = () => {
        popup.classList.add("hidden");
        showMenu(); // show the menu screen
    };
}

function checkWinCondition() {
    for (let r = 0; r < gameState.boardSize.rows; r++) {
        for (let c = 0; c < gameState.boardSize.cols; c++) {
            if (gameState.board[r][c] !== MINE && !gameState.revealed[r][c]) {
                return; 
            }
        }
    }
    endGame(true); 
}

function revealTile(row, col, tileEl) {
    if (gameState.revealed[row][col] || tileEl.classList.contains("flag")) return;

    const value = gameState.board[row][col];
    if (value === MINE) {
        tileEl.classList.remove("hidden");
        tileEl.classList.add("revealed");
        tileEl.textContent = "💣";
        gameState.revealed[row][col] = true;
        endGame(false);
        return;
    }

    if (value > 0) {
        tileEl.classList.remove("hidden");
        tileEl.classList.add("revealed");
        tileEl.textContent = value;
        gameState.revealed[row][col] = true;       
    } else {
        revealAdjacentZerosIterative(row, col);
    }

    checkWinCondition();
}

function revealAdjacentZerosIterative(startRow, startCol) {
    const queue = [[startRow, startCol]];

    while (queue.length > 0) {
        const [row, col] = queue.shift();

        if (gameState.revealed[row][col]) continue;

        const tileEl = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
        if (!tileEl || tileEl.classList.contains("flag")) continue;

        gameState.revealed[row][col] = true;
        tileEl.classList.remove("hidden");
        tileEl.classList.add("revealed");

        const value = gameState.board[row][col];
        if (value > 0) {
            tileEl.textContent = value;
        }   else {
            tileEl.textContent = "";

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const r = row + dr;
                    const c = col + dc;
                    if (
                        r >= 0 && r < gameState.boardSize.rows &&
                        c >= 0 && c < gameState.boardSize.cols &&
                        !gameState.revealed[r][c]
                    ) {
                        queue.push([r, c]);
                    }
                }
            }
        }
    }
}

function bindTileEvents(tile, row, col) {
    tile.addEventListener("click", () => handleLeftClick(row, col));

    tile.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleRightClick(row, col, tile);
    });
}

function setupBoard(rows, cols, mines) {
    resetGameState(rows, cols, mines);
    boardContainer.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = createTileElement(r, c);
            bindTileEvents(tile, r, c);
            boardContainer.appendChild(tile);
        }
    }

    boardContainer.style.display = "grid";
}

function revealSafeZone(row, col) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;

            if (
                r >= 0 && r < gameState.boardSize.rows &&
                c >= 0 && c < gameState.boardSize.cols
            ) {
                const tileEl = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
                if (tileEl && !gameState.revealed[r][c] && !tileEl.classList.contains("flag")) {
                    revealTile(r, c, tileEl);
                }
            }
        }
    }
}

function handleLeftClick(row, col) {
    if (gameState.gameOver || gameState.revealed[row][col]) return;

    const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
    if (!tile || tile.classList.contains("flag")) return;

    if (gameState.firstClick) {
        initFirstClick(row, col);
    } else {
        revealTile(row, col, tile);
    }
    
}

function initFirstClick(row, col) {
    gameState.board = generateBoard(
        gameState.boardSize.rows,
        gameState.boardSize.cols,
        Date.now().toString(),
        gameState.mines,
        [row, col]
    );

    gameState.firstClick = false;
    gameState.timerStarted = true;
    startTimer();

    revealSafeZone(row, col);
}

function handleRightClick(row, col, tileEl) {
    if (gameState.revealed[row][col]) return;

    const newFlagsLeft = toggleFlag(tileEl, gameState.flagsLeft, "red");
    gameState.flagsLeft = newFlagsLeft;
    updateMineCounter(mineCounter, newFlagsLeft);
}

function startGame() {
    const height = parseInt(inputHeight.value, 10);
    const width = parseInt(inputWidth.value, 10);
    const mines = parseInt(inputMines.value, 10);

    if (isNaN(height) || isNaN(width) || isNaN(mines)) {
        alert("Invalid input values");
        return;
    }

    currentHeight = height;
    currentWidth = width;
    currentMines = mines;

    wrapper.style.display = "none";      
    gameSection.style.display = "flex";  

    boardContainer.style.setProperty('--cols', width);
    boardContainer.style.setProperty('--rows', height);

    setupBoard(height, width, mines);
}

function initGame() {
    wrapper.style.display = "none";
    gameSection.style.display = "flex";

    boardContainer.style.setProperty('--cols', currentWidth);
    boardContainer.style.setProperty('--rows', currentHeight);

    setupBoard(currentHeight, currentWidth, currentMines);
}

function showMenu() {
  wrapper.style.display = "flex";
  gameSection.style.display = "none";
}

playButton.addEventListener("click", startGame);