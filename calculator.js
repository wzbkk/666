// 按输入顺序计算，例如 2 + 3 × 4 得到 20。
function createCalculator() {
  let display = '0';
  let stored = null;
  let operator = null;
  let fresh = true;

  function reset() {
    display = '0'; stored = null; operator = null; fresh = true;
  }

  function calculate() {
    const right = Number(display);
    let result;
    switch (operator) {
      case '+': result = stored + right; break;
      case '-': result = stored - right; break;
      case '*': result = stored * right; break;
      case '/': result = right === 0 ? NaN : stored / right; break;
    }
    display = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : '错误';
    stored = null; operator = null; fresh = true;
  }

  return {
    get display() { return display; },
    press(key) {
      if (key === 'clear') { reset(); return; }
      if (display === '错误') reset();
      if (/^\d$/.test(key)) {
        display = fresh || display === '0' ? key : display + key;
        fresh = false;
      } else if (key === '.') {
        if (fresh) display = '0';
        if (!display.includes('.')) display += '.';
        fresh = false;
      } else if (key === 'backspace') {
        if (!fresh) display = display.slice(0, -1);
        if (!display || display === '-') display = '0';
      } else if (key === 'sign') {
        if (Number(display) !== 0) display = display.startsWith('-') ? display.slice(1) : '-' + display;
      } else if (['+', '-', '*', '/'].includes(key)) {
        if (operator && !fresh) calculate();
        if (display === '错误') return;
        stored = Number(display); operator = key; fresh = true;
      } else if (key === '=' && operator && !fresh) {
        calculate();
      }
    }
  };
}

if (typeof document !== 'undefined') {
  const calculator = createCalculator();
  const display = document.getElementById('display');
  const press = key => { calculator.press(key); display.textContent = calculator.display; };
  document.querySelector('.keys').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) press(button.dataset.key);
  });
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = ({ Enter: '=', Escape: 'clear', Backspace: 'backspace', Delete: 'clear' })[event.key] || event.key;
    if (/^[\d.+*/=\-]$/.test(key) || ['clear', 'backspace'].includes(key)) {
      event.preventDefault(); press(key);
    }
  });
}

if (typeof module !== 'undefined') module.exports = { createCalculator };
