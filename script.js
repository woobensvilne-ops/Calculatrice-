// script.js
class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete() {
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
    }
    if (this.currentOperand === '0') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  appendDecimal() {
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
    }
    if (this.currentOperand.includes('.')) return;
    this.currentOperand += '.';
  }

  chooseOperation(operation) {
    if (this.currentOperand === 'Erreur') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.currentOperand = 'Erreur';
          this.previousOperand = '';
          this.operation = undefined;
          this.shouldResetScreen = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    computation = Math.round((computation + Number.EPSILON) * 1e10) / 1e10;

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  getDisplayNumber(number) {
    if (number === 'Erreur') return 'Erreur';
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '0';
    } else {
      integerDisplay = integerDigits.toLocaleString('fr-FR', {
        maximumFractionDigits: 0
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay},${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandElement.textContent =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandElement.textContent = '';
    }
  }
}

const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case 'number':
        calculator.appendNumber(value);
        break;
      case 'decimal':
        calculator.appendDecimal();
        break;
      case 'operator':
        calculator.chooseOperation(value);
        break;
      case 'equals':
        calculator.compute();
        break;
      case 'clear':
        calculator.clear();
        break;
      case 'delete':
        calculator.delete();
        break;
    }

    calculator.updateDisplay();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key >= '0' && event.key <= '9') {
    calculator.appendNumber(event.key);
  } else if (event.key === '.') {
    calculator.appendDecimal();
  } else if (event.key === '+' || event.key === '-') {
    calculator.chooseOperation(event.key);
  } else if (event.key === '*') {
    calculator.chooseOperation('×');
  } else if (event.key === '/') {
    event.preventDefault();
    calculator.chooseOperation('÷');
  } else if (event.key === 'Enter' || event.key === '=') {
    calculator.compute();
  } else if (event.key === 'Backspace') {
    calculator.delete();
  } else if (event.key === 'Escape') {
    calculator.clear();
  } else {
    return;
  }

  calculator.updateDisplay();
});
