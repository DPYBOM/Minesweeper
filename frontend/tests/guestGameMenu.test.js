import { describe, it, expect } from "vitest";

import {
  restrictInputToNumbers,
  clamp,
  updateMinesMaxValue,
  handleInput
} from "../static/js/gameUI/guestGameMenuUtils.js";

describe("clamp", () => {
  it("returns value within range", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  it("clamps to min if below", () => {
    expect(clamp(0, 1, 10)).toBe(1);
  });

  it("clamps to max if above", () => {
    expect(clamp(15, 1, 10)).toBe(10);
  });
});


describe("restrictInputToNumbers", () => {
  it("removes non-numeric characters", () => {
    const input = document.createElement("input");
    input.value = "a+1b2-c3/!";
    restrictInputToNumbers(input);
    expect(input.value).toBe("123");
  });

  it("keeps numbers unchanged", () => {
    const input = document.createElement("input");
    input.value = "456";
    restrictInputToNumbers(input);
    expect(input.value).toBe("456");
  });
});

describe("handleInput", () => {
  it("removes non-numeric and clamps to min/max", () => {
    const input = document.createElement("input");
    input.value = "abc100";
    handleInput(input, 1, 50);
    expect(input.value).toBe("50");
  });

  it("clamps to min if too small", () => {
    const input = document.createElement("input");
    input.value = "0";
    handleInput(input, 1, 40);
    expect(input.value).toBe("1");
  });

  it("clamps to max if too large", () => {
    const input = document.createElement("input");
    input.value = "1000";
    handleInput(input, 1, 40);
    expect(input.value).toBe("40");
  });

  it("handles empty input", () => {
    const input = document.createElement("input");
    input.value = "";
    handleInput(input, 1, 40);
    expect(input.value).toBe("");
  });
});

describe("updateMinesMaxValue", () => {
  it("sets max attribute and clamps current value if needed", () => {
    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    const input3 = document.createElement("input");

    input1.value = "10";
    input2.value = "10";
    input3.value = "200"; // should get clamped based on the formula (value1 * value2) - 9; - updated to include the min reveal value

    updateMinesMaxValue(input1, input2, input3);

    expect(input3.max).toBe("91");
    expect(input3.value).toBe("91");
  });

  it("leaves input3 unchanged if within max", () => {
    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    const input3 = document.createElement("input");

    input1.value = "5";
    input2.value = "5";
    input3.value = "10";

    updateMinesMaxValue(input1, input2, input3);

    expect(input3.max).toBe("16");
    expect(input3.value).toBe("10");
  });
});


