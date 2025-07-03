import {
  restrictInputToNumbers,
  handleInput,
  updateMinesMaxValue
} from "./guestGameMenuUtils.js";

const input1 = document.getElementById("height");
const input2 = document.getElementById("width");
const input3 = document.getElementById("mines");
const buttons = document.querySelectorAll(".main");
const customButton = document.getElementById("custom");

function setup() {
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const values = button.dataset.values.split(',');
            [input1, input2, input3].forEach((input, i) => {
                input.value = values[i] || "";
                input.readOnly = true;
                input.style.cursor = "default";
        });
        });
    });

    customButton.addEventListener("click", () => {
        input1.value = "";
        input2.value = "";
        input3.value = "";

        if (input1.readOnly || input2.readOnly || input3.readOnly) {
        [input1, input2, input3].forEach(input => {
            input.readOnly = false;
            input.style.cursor = "text";
        });
        input1.focus();
        }
    });

    input1.addEventListener("input", () => handleInput(input1));
    input2.addEventListener("input", () => handleInput(input2));

    input3.addEventListener("input", () => {
        restrictInputToNumbers(input3);
        updateMinesMaxValue(input1, input2, input3);

        const maxValue3 = parseInt(input3.max, 10);
        const value3 = parseInt(input3.value, 10);

        if (!isNaN(value3) && value3 > maxValue3) {
        input3.value = maxValue3;
        }
    });
}

document.addEventListener('DOMContentLoaded', setup);



