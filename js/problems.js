var MathProblems = (function() {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randFloat(min, max, decimals) {
    var val = Math.random() * (max - min) + min;
    return parseFloat(val.toFixed(decimals));
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var tmp = b; b = a % b; a = tmp; }
    return a;
  }

  var types = [
    'add', 'sub', 'mul', 'div',
    'dec_add', 'dec_sub', 'dec_mul', 'dec_div',
    'frac_add', 'frac_sub',
    'dreisatz', 'dreisatz_inv',
    'umrechnung'
  ];

  function generateTask() {
    var t = types[randInt(0, types.length - 1)];
    var isFraction = false;
    var display, hint = '', answer;

    if (t === 'add') {
      var a = randInt(1000, 9999), b = randInt(1000, 9999);
      display = a + ' + ' + b + ' =';
      answer = a + b;
    } else if (t === 'sub') {
      var a = randInt(5000, 15000), b = randInt(1000, 4999);
      display = a + ' \u2212 ' + b + ' =';
      answer = a - b;
    } else if (t === 'mul') {
      var a = randInt(100, 999), b = randInt(2, 9);
      display = a + ' \u00d7 ' + b + ' =';
      answer = a * b;
    } else if (t === 'div') {
      var a = randInt(1000, 5000), b = randInt(2, 12);
      a = a - (a % b);
      display = a + ' \u00f7 ' + b + ' =';
      answer = a / b;
    } else if (t === 'dec_add') {
      var a = randFloat(1, 20, 2), b = randFloat(1, 20, 2);
      display = a + ' + ' + b + ' =';
      answer = parseFloat((a + b).toFixed(2));
    } else if (t === 'dec_sub') {
      var a = randFloat(10, 30, 2), b = randFloat(1, 9, 2);
      display = a + ' \u2212 ' + b + ' =';
      answer = parseFloat((a - b).toFixed(2));
    } else if (t === 'dec_mul') {
      var a = randFloat(1, 10, 1), b = randFloat(1, 10, 1);
      display = a + ' \u00d7 ' + b + ' =';
      answer = parseFloat((a * b).toFixed(2));
    } else if (t === 'dec_div') {
      var ans = randFloat(2, 20, 1);      // Clean answer: 2.0-20.0 with 1 decimal
      var b = randFloat(0.5, 5, 1);       // Divisor: 0.5-5.0 with 1 decimal
      var a = parseFloat((ans * b).toFixed(2));  // Dividend = answer × divisor
      display = a + ' \u00f7 ' + b + ' =';
      answer = ans;
    } else if (t === 'frac_add') {
      isFraction = true;
      var num1 = randInt(1, 9), den1 = randInt(2, 12);
      var num2 = randInt(1, 9), den2 = randInt(2, 12);
      display = num1 + '/' + den1 + ' + ' + num2 + '/' + den2 + ' =';
      hint = 'Antwort als Bruch (z.B. 3/4)';
      var rNum = num1 * den2 + num2 * den1;
      var rDen = den1 * den2;
      answer = { num: rNum, den: rDen };
    } else if (t === 'frac_sub') {
      isFraction = true;
      var den1 = randInt(2, 6), den2 = randInt(2, 6);
      var num1 = randInt(5, 9), num2 = randInt(1, 4);
      if (num1 / den1 < num2 / den2) {
        var tmpN = num1, tmpD = den1;
        num1 = num2; den1 = den2;
        num2 = tmpN; den2 = tmpD;
      }
      display = num1 + '/' + den1 + ' \u2212 ' + num2 + '/' + den2 + ' =';
      hint = 'Antwort als Bruch (z.B. 3/4)';
      var rNum = num1 * den2 - num2 * den1;
      var rDen = den1 * den2;
      answer = { num: rNum, den: rDen };
    } else if (t === 'dreisatz') {
      // Direct proportion: a items cost b€, what do c items cost?
      var a = randInt(2, 10);
      var pricePerItem = randInt(2, 10);
      var b = a * pricePerItem;
      var c = randInt(2, 10);
      while (c === a) c = randInt(2, 10);  // Ensure different quantity
      display = a + ' Äpfel kosten ' + b + '€. Was kosten ' + c + ' Äpfel?';
      hint = 'Antwort in €';
      answer = c * pricePerItem;
    } else if (t === 'dreisatz_inv') {
      // Inverse proportion: a workers take b days, how long for c workers?
      var a = randInt(2, 8);
      var bVal = randInt(2, 8);
      while (bVal === a) bVal = randInt(2, 8);
      var totalWork = a * bVal;
      var b = bVal;
      var c = randInt(2, 8);
      while (totalWork % c !== 0 || c === a) c = randInt(2, 8);
      display = a + ' Arbeiter brauchen ' + b + ' Tage. Wie viele Tage brauchen ' + c + ' Arbeiter?';
      hint = 'Antwort in Tagen';
      answer = totalWork / c;
    } else if (t === 'umrechnung') {
      var conversions = [
        { from: 'mm', to: 'cm', factor: 10, dir: 'div' },
        { from: 'cm', to: 'm',  factor: 100, dir: 'div' },
        { from: 'm',  to: 'km', factor: 1000, dir: 'div' },
        { from: 'mm', to: 'm',  factor: 1000, dir: 'div' },
        { from: 'cm', to: 'km', factor: 100000, dir: 'div' },
        { from: 'mm', to: 'km', factor: 1000000, dir: 'div' },
        { from: 'km', to: 'm',  factor: 1000, dir: 'mul' },
        { from: 'km', to: 'cm', factor: 100000, dir: 'mul' },
        { from: 'km', to: 'mm', factor: 1000000, dir: 'mul' },
        { from: 'm',  to: 'cm', factor: 100, dir: 'mul' },
        { from: 'm',  to: 'mm', factor: 1000, dir: 'mul' },
        { from: 'cm', to: 'mm', factor: 10, dir: 'mul' },
        { from: 'g',  to: 'kg', factor: 1000, dir: 'div' },
        { from: 'kg', to: 'g',  factor: 1000, dir: 'mul' },
        { from: 'kg', to: 't',  factor: 1000, dir: 'div' },
        { from: 't',  to: 'kg', factor: 1000, dir: 'mul' },
        { from: 'g',  to: 't',  factor: 1000000, dir: 'div' },
        { from: 't',  to: 'g',  factor: 1000000, dir: 'mul' },
        { from: 'ml', to: 'l',  factor: 1000, dir: 'div' },
        { from: 'l',  to: 'ml', factor: 1000, dir: 'mul' },
        { from: 's',  to: 'min', factor: 60, dir: 'div' },
        { from: 'min', to: 's', factor: 60, dir: 'mul' },
        { from: 'min', to: 'h', factor: 60, dir: 'div' },
        { from: 'h', to: 'min', factor: 60, dir: 'mul' },
        { from: 's',  to: 'h',  factor: 3600, dir: 'div' },
        { from: 'h',  to: 's',  factor: 3600, dir: 'mul' }
      ];
      var conv = conversions[randInt(0, conversions.length - 1)];
      if (conv.dir === 'div') {
        var ans = randFloat(1, 20, 1);
        var val = parseFloat((ans * conv.factor).toFixed(1));
        display = 'Rechne ' + val + ' ' + conv.from + ' in ' + conv.to + ' um.';
        answer = ans;
      } else {
        var val = randFloat(1, 10, 1);
        var ans = parseFloat((val * conv.factor).toFixed(1));
        display = 'Rechne ' + val + ' ' + conv.from + ' in ' + conv.to + ' um.';
        answer = ans;
      }
      hint = 'Antwort in ' + conv.to;
    }

    return { display: display, hint: hint, type: t, answer: answer, isFraction: isFraction };
  }

  function checkAnswer(answer, isFraction, userStr) {
    var trimmed = userStr.trim();
    if (trimmed === '') return false;

    if (isFraction) {
      var match = trimmed.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
      if (!match) return false;
      var uNum = parseInt(match[1], 10);
      var uDen = parseInt(match[2], 10);
      if (uDen === 0) return false;
      return uNum * answer.den === uDen * answer.num;
    }

    var userNum = parseFloat(trimmed.replace(',', '.'));
    if (isNaN(userNum)) return false;
    return Math.abs(userNum - answer) < 0.005;
  }

  function formatAnswer(answer, isFraction) {
    if (isFraction) {
      var g = gcd(answer.num, answer.den);
      return (answer.num / g) + '/' + (answer.den / g);
    }
    return String(answer);
  }

  return {
    generateTask: generateTask,
    checkAnswer: checkAnswer,
    formatAnswer: formatAnswer
  };
})();

if (typeof module !== 'undefined') module.exports = MathProblems;
