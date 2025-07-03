import { mulberry32, stringToSeed } from "./guestUtils.js";

export const MINE = "💣";

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

        // const isSafe = r === safeRow && c === safeCol;

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
