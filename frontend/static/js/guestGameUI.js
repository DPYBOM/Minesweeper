let timerInterval;
let secondsElapsed = 0;
const timerDisplay = document.getElementById("timer") || createTextDisplay("timer");

export function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function startTimer() {
    stopTimer();
    secondsElapsed = 0;
    updateTimerDisplay(0); 

    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay(secondsElapsed);
    }, 1000);
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

export function updateMineCounter(counterElement, minesLeft) {
    counterElement.textContent = minesLeft.toString().padStart(3, '0');
}