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
