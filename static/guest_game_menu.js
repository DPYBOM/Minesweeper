const input1 = document.getElementById("height");
const input2 = document.getElementById("width");
const input3 = document.getElementById("mines");

const buttons = document.querySelectorAll(".main")
const customButton = document.getElementById("custom")


function updateMinesMaxValue() {
    let value1 = parseInt(input1.value, 10);
    let value2 = parseInt(input2.value, 10);

    const maxValue3 = (value1 * value2) - 1;

    input3.max = maxValue3;

    const value3 = parseInt(input3.value, 10);
    if (value3 > maxValue3) {
        input3.value = maxValue3;
    }
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

function restrictInputToNumbers(inputElement) {
    inputElement.value = inputElement.value.replace(/[^0-9]/g, "");
}

// Function to restrict input to numbers and clamp the value for input1(height) and input2(width)
function handleInput(inputElement, min = 1, max = 40) {
    restrictInputToNumbers(inputElement);
    let value = parseInt(inputElement.value, 10);
    if (isNaN(value)) return;  
    value = clamp(value, min, max); 
    inputElement.value = value;  
}


buttons.forEach(button => {
    button.addEventListener("click", () => {
        const values = button.dataset.values.split(',');
        const inputs = [input1, input2, input3]
        inputs.forEach((input, i) => {
            input.value = values[i] || "";
            input.readOnly = true;
            input.style.cursor = "default";
        });
    });
});

customButton.addEventListener("click", () => {
    input1.value = ""
    input2.value = ""
    input3.value = ""

    const isEditable = input1.readOnly === false && input2.readOnly === false && input3.readOnly === false;

    if (!isEditable) {
        [input1, input2, input3].forEach(input => {
            input.readOnly = false;
            input.style.cursor = "text"; 
        });
        input1.focus(); 
    }
});

// input1.addEventListener("input", () => {
//     restrictInputToNumbers(input1)
//     let value1 = parseInt(input1.value, 10);
//     if (isNaN(value1)) return;
//     value1 = clamp(value1, 1, 40)
//     input1.value = value1; 
// });

// input2.addEventListener("input", () => {
//     restrictInputToNumbers(input2)
//     let value2 = parseInt(input2.value, 10);
//     if (isNaN(value2)) return;
//     value2 = clamp(value2, 1, 40)
//     input2.value = value2; 
// });

input1.addEventListener("input", () => handleInput(input1));
input2.addEventListener("input", () => handleInput(input2));

input3.addEventListener("input", () => {
    restrictInputToNumbers(input3)
    updateMinesMaxValue();
    const maxValue3 = parseInt(input3.max, 10);
    const value3 = parseInt(input3.value, 10);

    if (!isNaN(value3) && value3 > maxValue3) {
        input3.value = maxValue3;
    }
});


