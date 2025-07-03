export function createTileElement(r, c) {
  const tile = document.createElement('div');
  tile.className = 'tile hidden';
  tile.dataset.row = r;
  tile.dataset.col = c;
  return tile;
}

export function toggleFlag(tileEl, flagsLeft) {
    if (tileEl.classList.contains("flag")) {
        tileEl.classList.remove("flag");
        return flagsLeft + 1;
    } else {
        if (flagsLeft <= 0) return flagsLeft;
        tileEl.classList.add("flag");
        return flagsLeft - 1;
    }
}

export function calculateTileSize(rows, cols) {
    const sideUIPadding = 160; 
    const topBottomPadding = 100;

    const maxWidth = window.innerWidth - sideUIPadding;
    const maxHeight = window.innerHeight - topBottomPadding;

    const tileWidth = Math.floor(maxWidth / cols);
    const tileHeight = Math.floor(maxHeight / rows);

    return Math.min(tileWidth, tileHeight, 48); 
}


// to be implemented
export function applyBoardScaling(rows, cols) {
    const tileSize = calculateTileSize(rows, cols);

    document.documentElement.style.setProperty('--tile-size', `${tileSize}px`);
    document.documentElement.style.setProperty('--rows', rows);
    document.documentElement.style.setProperty('--cols', cols);
}
