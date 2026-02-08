var PhysicsProblems = (function() {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randFloat(min, max, decimals) {
    var val = Math.random() * (max - min) + min;
    return parseFloat(val.toFixed(decimals));
  }

  var types = ['ohm_u', 'ohm_r', 'ohm_i'];

  function generateTask() {
    var t = types[randInt(0, types.length - 1)];
    var display, hint, answer;

    if (t === 'ohm_u') {
      var r = randInt(2, 100);
      var i = randFloat(0.5, 10, 1);
      answer = parseFloat((r * i).toFixed(1));
      display = 'R = ' + r + ' \u03A9, I = ' + i.toFixed(1).replace('.', ',') + ' A. Berechne U.';
      hint = 'Antwort in V';
    } else if (t === 'ohm_r') {
      var r = randInt(2, 100);
      var i = randFloat(0.5, 5, 1);
      var u = parseFloat((r * i).toFixed(1));
      answer = r;
      display = 'U = ' + u.toFixed(1).replace('.', ',') + ' V, I = ' + i.toFixed(1).replace('.', ',') + ' A. Berechne R.';
      hint = 'Antwort in \u03A9';
    } else if (t === 'ohm_i') {
      var i = randFloat(0.5, 10, 1);
      var r = randInt(2, 100);
      var u = parseFloat((r * i).toFixed(1));
      answer = i;
      display = 'U = ' + u.toFixed(1).replace('.', ',') + ' V, R = ' + r + ' \u03A9. Berechne I.';
      hint = 'Antwort in A';
    }

    return { display: display, hint: hint, type: t, answer: answer, isFraction: false };
  }

  function checkAnswer(answer, isFraction, userStr) {
    var trimmed = userStr.trim();
    if (trimmed === '') return false;
    var userNum = parseFloat(trimmed.replace(',', '.'));
    if (isNaN(userNum)) return false;
    return Math.abs(userNum - answer) < 0.005;
  }

  function formatAnswer(answer) {
    return String(answer);
  }

  return {
    generateTask: generateTask,
    checkAnswer: checkAnswer,
    formatAnswer: formatAnswer
  };
})();

if (typeof module !== 'undefined') module.exports = PhysicsProblems;
