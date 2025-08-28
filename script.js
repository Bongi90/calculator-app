(() => {
  const display = document.getElementById('display');
  const keys = document.getElementById('keys');

  let current = '0';    
  let previous = null;  
  let operator = null;  
  let justEvaluated = false;

  function updateDisplay(value = current) {
    const str = String(value);
    display.textContent = str.length > 14 ? Number(str).toPrecision(10) : str;
  }

  function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    justEvaluated = false;
    updateDisplay();
  }

  function del() {
    if (justEvaluated) { clearAll(); return; }
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }

  function appendNumber(n) {
    if (n === '.' && current.includes('.')) return;
    if (justEvaluated) {
      current = (n === '.' ? '0.' : n);
      justEvaluated = false;
      updateDisplay();
      return;
    }
    if (current === '0' && n !== '.') current = n;
    else current += n;
    updateDisplay();
  }

  function chooseOperator(op) {
    if (operator && previous !== null && !justEvaluated) {
      compute(); 
    } else {
      previous = current;
    }
    operator = op;
    current = '0';
    justEvaluated = false;
  }

  function percent() {
    const num = parseFloat(current);
    if (!isNaN(num)) {
      current = String(num / 100);
      updateDisplay();
    }
  }

  function compute() {
    if (operator === null || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if (b === 0) {
          current = 'Cannot ÷ 0';
          updateDisplay(current);
          previous = null; operator = null; justEvaluated = true;
          return;
        }
        result = a / b;
        break;
    }

    result = Math.round(result * 1e12) / 1e12; 
    current = String(result);
    previous = null;
    operator = null;
    justEvaluated = true;
    updateDisplay();
  }

  
  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.num !== undefined) return appendNumber(btn.dataset.num);
    if (btn.dataset.op !== undefined) return chooseOperator(btn.dataset.op);

    const action = btn.dataset.action;
    if (action === 'clear') return clearAll();
    if (action === 'delete') return del();
    if (action === 'percent') return percent();
    if (action === 'equals') return compute();
  });


  window.addEventListener('keydown', (e) => {
    const { key } = e;
    if (/[0-9]/.test(key)) return appendNumber(key);
    if (key === '.') return appendNumber('.');
    if (['+', '-', '*', '/'].includes(key)) return chooseOperator(key);
    if (key === 'Enter' || key === '=') { e.preventDefault(); return compute(); }
    if (key === 'Backspace') return del();
    if (key === 'Escape') return clearAll();
    if (key === '%') return percent();
  });

  updateDisplay('0');
})();
