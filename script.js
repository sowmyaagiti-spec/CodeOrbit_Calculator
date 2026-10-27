const display = document.getElementById("display");
const message = document.getElementById("message");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForNumber = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function clearCalculator() {
  currentInput = "0";
  firstNumber = null;
  operator = null;
  waitingForNumber = false;
  message.textContent = "";
  updateDisplay();
}

function enterNumber(number) {
  message.textContent = "";

  if (waitingForNumber) {
    currentInput = number;
    waitingForNumber = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 15) {
    currentInput += number;
  }

  updateDisplay();
}

function enterDecimal() {
  message.textContent = "";

  if (waitingForNumber) {
    currentInput = "0.";
    waitingForNumber = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function chooseOperator(nextOperator) {
  message.textContent = "";

  const inputValue = Number(currentInput);

  if (operator && !waitingForNumber) {
    calculate();
  }

  firstNumber = Number(currentInput);
  operator = nextOperator;
  waitingForNumber = true;
}

function calculate() {
  if (operator === null || firstNumber === null) return;

  const secondNumber = Number(currentInput);
  let result;

  // Perform the selected arithmetic operation.
  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "*":
      result = firstNumber * secondNumber;
      break;
    case "/":
      if (secondNumber === 0) {
        message.textContent = "Cannot divide by zero.";
        return;
      }
      result = firstNumber / secondNumber;
      break;
    default:
      return;
  }

  // Check for invalid results and round floating-point errors.
  if (!Number.isFinite(result)) {
    message.textContent = "Invalid calculation.";
    return;
  }

  currentInput = String(Number(result.toPrecision(12)));
  firstNumber = null;
  operator = null;
  waitingForNumber = true;

  updateDisplay();
}

function deleteDigit() {
  message.textContent = "";

  if (waitingForNumber) return;

  currentInput = currentInput.length > 1
    ? currentInput.slice(0, -1)
    : "0";

  updateDisplay();
}

// Connect the calculator buttons to their actions.
document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    switch (button.dataset.action) {
      case "clear":
        clearCalculator();
        break;
      case "delete":
        deleteDigit();
        break;
      case "decimal":
        enterDecimal();
        break;
      case "equals":
        calculate();
        break;
    }
  }
});