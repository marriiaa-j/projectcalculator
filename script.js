const display = document.querySelector('#display');
const buttons = document.querySelector('.calculator-buttons');

let currentValue = '0';
let storedValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let justCalculated = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function formatNumber(value) {
  const rounded = Number(value.toFixed(10));
  return String(rounded);
}

function calculate(first, second, operator) {
  const left = Number(first);
  const right = Number(second);

  if (operator === '+') return left + right;
  if (operator === '−') return left - right;
  if (operator === '×') return left * right;
  if (operator === '÷') return right === 0 ? null : left / right;
  return right;
}

function inputNumber(number) {
  if (currentValue === 'Error' || waitingForOperand || justCalculated) {
    currentValue = number;
    waitingForOperand = false;
    justCalculated = false;
  } else if (currentValue === '0') {
    currentValue = number;
  } else {
    currentValue += number;
  }
  updateDisplay();
}

function chooseOperator(operator) {
  if (currentValue === 'Error') return;

  if (pendingOperator && !waitingForOperand) {
    const result = calculate(storedValue, currentValue, pendingOperator);
    if (result === null) {
      currentValue = 'Error';
      storedValue = null;
      pendingOperator = null;
      updateDisplay();
      return;
    }
    currentValue = formatNumber(result);
  }

  storedValue = Number(currentValue);
  pendingOperator = operator;
  waitingForOperand = true;
  justCalculated = false;
  updateDisplay();
}

function pressEquals() {
  if (!pendingOperator || storedValue === null || currentValue === 'Error') return;

  const result = calculate(storedValue, currentValue, pendingOperator);
  currentValue = result === null ? 'Error' : formatNumber(result);
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  justCalculated = true;
  updateDisplay();
}

function clearCalculator() {
  currentValue = '0';
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  justCalculated = false;
  updateDisplay();
}

function backspace() {
  if (waitingForOperand || justCalculated || currentValue === 'Error') return;
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  updateDisplay();
}

buttons.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action === 'equals') pressEquals();
  if (button.dataset.action === 'clear') clearCalculator();
  if (button.dataset.action === 'backspace') backspace();
});

updateDisplay();
