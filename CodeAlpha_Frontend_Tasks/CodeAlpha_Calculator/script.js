const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");
let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let resetOnNextDigit = false;

function render() {
  currentDisplay.textContent = currentInput;
  previousDisplay.textContent = storedValue !== null && pendingOperator
    ? `${storedValue} ${symbol(pendingOperator)}` : "";
}
function symbol(operator) {
  return ({ "+":"+","-":"−","*":"×","/":"÷" })[operator] || operator;
}
function inputNumber(value) {
  if (currentInput === "Error" || resetOnNextDigit) {
    currentInput = value === "." ? "0." : value;
    resetOnNextDigit = false;
  } else if (value === ".") {
    if (!currentInput.includes(".")) currentInput += ".";
  } else {
    currentInput = currentInput === "0" ? value : currentInput + value;
  }
  render();
}
function calculate(a, operator, b) {
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;
  if (operator === "/") return b === 0 ? null : a / b;
  return b;
}
function chooseOperator(operator) {
  const value = Number(currentInput);
  if (!Number.isFinite(value)) return;
  if (storedValue !== null && pendingOperator && !resetOnNextDigit) {
    const result = calculate(storedValue, pendingOperator, value);
    if (result === null) { currentInput = "Cannot divide by zero"; storedValue = null; pendingOperator = null; resetOnNextDigit = true; render(); return; }
    storedValue = Number(result.toPrecision(12));
    currentInput = String(storedValue);
  } else {
    storedValue = value;
  }
  pendingOperator = operator;
  resetOnNextDigit = true;
  render();
}
function equals() {
  if (storedValue === null || !pendingOperator || currentInput === "Error") return;
  const result = calculate(storedValue, pendingOperator, Number(currentInput));
  if (result === null) currentInput = "Cannot divide by zero";
  else currentInput = String(Number(result.toPrecision(12)));
  storedValue = null;
  pendingOperator = null;
  resetOnNextDigit = true;
  render();
}
function clearAll() {
  currentInput = "0"; storedValue = null; pendingOperator = null; resetOnNextDigit = false; render();
}
function deleteLast() {
  if (resetOnNextDigit || currentInput.length <= 1 || currentInput === "Error" || currentInput.startsWith("Cannot")) currentInput = "0";
  else currentInput = currentInput.slice(0, -1);
  resetOnNextDigit = false;
  render();
}

document.querySelector(".keys").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action === "clear") clearAll();
  if (button.dataset.action === "delete") deleteLast();
  if (button.dataset.action === "equals") equals();
});
document.addEventListener("keydown", event => {
  if (/^[0-9.]$/.test(event.key)) inputNumber(event.key);
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); equals(); }
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
});
render();
