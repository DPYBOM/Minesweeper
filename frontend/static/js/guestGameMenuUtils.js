export function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

export function restrictInputToNumbers(inputElement) {
  inputElement.value = inputElement.value.replace(/[^0-9]/g, "");
}

export function handleInput(inputElement, min = 1, max = 40) {
  restrictInputToNumbers(inputElement);
  let value = parseInt(inputElement.value, 10);
  if (isNaN(value)) return;
  value = clamp(value, min, max);
  inputElement.value = value;
}

export function updateMinesMaxValue(input1, input2, input3) {
  let value1 = parseInt(input1.value, 10);
  let value2 = parseInt(input2.value, 10);
  const maxValue3 = (value1 * value2) - 9; // discounting the click and minimum safe zone size, when clicked in a middle of the board
                                           // there could be a solution in which you click and when there is bigger proportion of mines, 
                                           // than the seeding would work differently - to allow players to play,
                                           // this seems to be only "Custom" game problem, example for replication: 40x40, 9780 mines
                                           
  input3.max = maxValue3;

  const value3 = parseInt(input3.value, 10);
  if (value3 > maxValue3) {
    input3.value = maxValue3;
  }
}