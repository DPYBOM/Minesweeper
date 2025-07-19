import { generateBoard, MINE,  
    resetGameState,
    checkWinCondition,
    revealAdjacentZerosIterative,
    getSafeZoneTiles,
    getTileRevealResult } from "../gameLogic/guestGameLogic.js";
import { createTileElement, toggleFlag } from "../gameUI/guestGameRenderer.js";
import { startTimer, stopTimer, updateTimerDisplay, updateMineCounter } from "../gameUI/guestGameUI.js";

const inputHeight = document.getElementById("height");
const inputWidth = document.getElementById("width");
const inputMines = document.getElementById("mines");
const playButton = document.querySelector("button.no-style");

const wrapper = document.querySelector(".wrapper");
const gameNavbar = document.getElementById("navigation")
const gameSection = document.getElementById("game");
const boardContainer = document.getElementById("board");
const mineCounter = document.getElementById("mine-counter");


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

// this will need to change as well at some point 
function setDynamicTileSize(rows, cols, baseTileSize = 85, gapRatio = 0.15, reservedWidth = 336, reservedHeight = 30)  {
    const viewportWidth = window.innerWidth - reservedWidth;
    const viewportHeight = window.innerHeight - reservedHeight;


    const naturalBoardWidth = cols * baseTileSize + (cols - 1) * (baseTileSize * gapRatio);
    const naturalBoardHeight = rows * baseTileSize + (rows - 1) * (baseTileSize * gapRatio);

    const widthRatio = viewportWidth / naturalBoardWidth;
    const heightRatio = viewportHeight / naturalBoardHeight;

    
    const ratio = Math.min(widthRatio, heightRatio, 1);

    
    const tileSize = Math.floor(baseTileSize * ratio);

    
    document.documentElement.style.setProperty('--tile-size', `${tileSize}px`);
    document.documentElement.style.setProperty('--rows', rows);
    document.documentElement.style.setProperty('--cols', cols);

    return tileSize;
            
}


function endGame(win) {
    gameState.gameOver = true;
    stopTimer();
    
    for (let r = 0; r < gameState.boardSize.rows; r++) {
        for (let c = 0; c < gameState.boardSize.cols; c++) {
            const value = gameState.board[r][c];
            const tileEl = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
            if (value === MINE && tileEl && !tileEl.classList.contains("revealed")) {
                tileEl.classList.remove("hidden");
                tileEl.classList.add("revealed");
                tileEl.style.backgroundColor = "red";
            }
        }
    }

    
    const popup = document.getElementById("endgame-popup");
    const title = document.getElementById("endgame-title");
    popup.classList.remove("hidden");
    title.textContent = win ? "You Win!" : "You Lose";

    
    document.getElementById("restart-button").onclick = () => {
        popup.classList.add("hidden");
        initGame(); 
    };

    document.getElementById("change-difficulty-button").onclick = () => {
        popup.classList.add("hidden");
        showMenu(); 
    };
}


function revealTile(row, col, tileEl) {
    if (gameState.revealed[row][col] || tileEl.classList.contains("flag")) return;

    const result = getTileRevealResult(gameState.board, gameState.revealed, row, col, MINE);
    if (!result) return;

    if (result.type === "mine") {
        gameState.revealed[row][col] = true;
        tileEl.classList.remove("hidden");
        tileEl.classList.add("revealed");
        tileEl.textContent = "";
        tileEl.style.backgroundColor = "red";
        endGame(false);
        return;
    }

    tileEl.classList.remove("hidden");
    tileEl.classList.add("revealed");

    if (result.type === "number") {
        gameState.revealed[row][col] = true;
        tileEl.textContent = result.value;
    } else if (result.type === "expand") {
        const revealedTiles = revealAdjacentZerosIterative(gameState.board, gameState.revealed, row, col);
        for (const { row: r, col: c, value } of revealedTiles) {
            const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
            if (tile) {
                tile.classList.remove("hidden");
                tile.classList.add("revealed");
                tile.textContent = value > 0 ? value : "";
            }
        }
    }
    if (checkWinCondition(gameState.board, gameState.revealed, gameState.boardSize.rows, gameState.boardSize.cols, MINE)) {
        endGame(true);
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
    resetGameState(gameState, rows, cols, mines); 

    updateMineCounter(mineCounter, mines);        
    stopTimer();                                 
    updateTimerDisplay(0);                        

    boardContainer.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = createTileElement(r, c);
            bindTileEvents(tile, r, c);
            boardContainer.appendChild(tile);
        }
    }
    setDynamicTileSize(rows, cols);
    boardContainer.style.display = "grid";
    boardContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

function revealSafeZone(row, col) {
    const tilesToReveal = getSafeZoneTiles(row, col, gameState.boardSize.rows, gameState.boardSize.cols);
    for (const [r, c] of tilesToReveal) {
        const tileEl = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
        if (tileEl && !gameState.revealed[r][c] && !tileEl.classList.contains("flag")) {
            revealTile(r, c, tileEl);
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
    gameNavbar.style.display = "flex";  

    boardContainer.style.setProperty('--cols', width);
    boardContainer.style.setProperty('--rows', height);

    setupBoard(height, width, mines);

}

function initGame() {
    wrapper.style.display = "none";
    gameSection.style.display = "flex";
    gameNavbar.style.display = "flex";

    boardContainer.style.setProperty('--cols', currentWidth);
    boardContainer.style.setProperty('--rows', currentHeight);

    setupBoard(currentHeight, currentWidth, currentMines);
}

function showMenu() {
    wrapper.style.display = "flex";
    gameSection.style.display = "none";
    gameNavbar.style.display = "none";
}

playButton.addEventListener("click", startGame);
document.getElementById("icon-difficulty").onclick = () => {
    showMenu(); 
}; 


