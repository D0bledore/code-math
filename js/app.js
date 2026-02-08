(function() {
  var problemEl = document.getElementById('problem');
  var hintEl = document.getElementById('hint');
  var inputEl = document.getElementById('answerInput');
  var submitBtn = document.getElementById('submitBtn');
  var nextBtn = document.getElementById('nextBtn');
  var feedbackEl = document.getElementById('feedback');
  var correctEl = document.getElementById('correct');
  var totalEl = document.getElementById('total');
  var typeLabelEl = document.getElementById('typeLabel');

  var score = 0, total = 0, answered = false;
  var currentAnswer = null, currentIsFraction = false;

  var typeNames = {
    add: 'Addition', sub: 'Subtraktion', mul: 'Multiplikation', div: 'Division',
    dec_add: 'Dezimal +', dec_sub: 'Dezimal \u2212', dec_mul: 'Dezimal \u00d7', dec_div: 'Dezimal \u00f7',
    frac_add: 'Bruch +', frac_sub: 'Bruch \u2212',
    dreisatz: 'Dreisatz', dreisatz_inv: 'Dreisatz umgekehrt',
    umrechnung: 'Umrechnung'
  };

  function nextProblem() {
    var task = MathProblems.generateTask();
    currentAnswer = task.answer;
    currentIsFraction = task.isFraction;
    problemEl.textContent = task.display;
    hintEl.textContent = task.hint;
    typeLabelEl.textContent = typeNames[task.type] || task.type;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    inputEl.value = '';
    inputEl.disabled = false;
    submitBtn.style.display = '';
    answered = false;
    inputEl.focus();
  }

  function submit() {
    if (answered) return;
    var val = inputEl.value;
    if (val.trim() === '') { inputEl.focus(); return; }
    answered = true;
    total++;
    if (MathProblems.checkAnswer(currentAnswer, currentIsFraction, val)) {
      score++;
      feedbackEl.textContent = 'Richtig!';
      feedbackEl.className = 'feedback correct';
    } else {
      feedbackEl.textContent = 'Falsch. Antwort: ' + MathProblems.formatAnswer(currentAnswer, currentIsFraction);
      feedbackEl.className = 'feedback incorrect';
    }
    correctEl.textContent = score;
    totalEl.textContent = total;
    inputEl.disabled = true;
    submitBtn.style.display = 'none';
  }

  submitBtn.addEventListener('click', submit);
  nextBtn.addEventListener('click', nextProblem);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      if (!answered) submit();
      else nextProblem();
    }
  });

  nextProblem();
})();
