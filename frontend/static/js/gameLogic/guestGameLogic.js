import { mulberry32, stringToSeed } from "../gameUtils/guestUtils.js";

export const MINE = "";

export function createEmptyBoard(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

export function placeMines(board, rng, mineCount, safeRow, safeCol) {
    const rows = board.length;
    const cols = board[0].length;
    let placed = 0;

    while (placed < mineCount) {
        const r = Math.floor(rng() * rows);
        const c = Math.floor(rng() * cols);



        const isSafeZone =
            Math.abs(r - safeRow) <= 1 &&
            Math.abs(c - safeCol) <= 1;

        if (board[r][c] !== MINE && !isSafeZone) {
        board[r][c] = MINE;
        placed++;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
                nr >= 0 && nr < rows &&
                nc >= 0 && nc < cols &&
                board[nr][nc] !== MINE
            ) {
                board[nr][nc]++;
            }
            }
        }
        }
    }

    return board;
}

export function generateBoard(rows, cols, seedStr, mineCount, firstClickPos) {
    const rng = mulberry32(stringToSeed(seedStr));
    const board = createEmptyBoard(rows, cols);
    return placeMines(board, rng, mineCount, firstClickPos[0], firstClickPos[1]);
}

export function resetGameState(gameState, rows, cols, mines) {
    gameState.board = [];
    gameState.revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    gameState.flagsLeft = mines;
    gameState.timerStarted = false;
    gameState.firstClick = true;
    gameState.boardSize = { rows, cols };
    gameState.mines = mines;
    gameState.gameOver = false;
}


export function checkWinCondition(board, revealed, rows, cols, MINE) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] !== MINE && !revealed[r][c]) {
                return false;
            }
        }
    }
    return true;
}


export function revealAdjacentZerosIterative(board, revealed, startRow, startCol) {
    const queue = [[startRow, startCol]];
    const newlyRevealed = [];

    while (queue.length > 0) {
        const [row, col] = queue.shift();
        if (revealed[row][col]) continue;

        revealed[row][col] = true;
        newlyRevealed.push({ row, col, value: board[row][col] });

        if (board[row][col] === 0) {
            const neighbors = getNeighborCoords(row, col, board.length, board[0].length);
            for (const [r, c] of neighbors) {
                if (!revealed[r][c]) {
                    queue.push([r, c]);
                }
            }
        }
    }
    return newlyRevealed;
}


export function getSafeZoneTiles(row, col, rows, cols) {
    const safeTiles = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                safeTiles.push([r, c]);
            }
        }
    }
    return safeTiles;
}


export function getTileRevealResult(board, revealed, row, col, MINE) {
    if (revealed[row][col]) return null;

    const value = board[row][col];
    if (value === MINE) return { type: "mine" };
    if (value > 0) return { type: "number", value };
    return { type: "expand" }; 
}

export function getNeighborCoords(row, col, maxRows, maxCols) {
    const coords = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < maxRows && c >= 0 && c < maxCols) {
                coords.push([r, c]);
            }
        }
    }
    return coords;
}
