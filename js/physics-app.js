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
  var currentAnswer = null;

  var typeNames = {
    ohm_u: 'Ohmsches Gesetz (U)',
    ohm_r: 'Ohmsches Gesetz (R)',
    ohm_i: 'Ohmsches Gesetz (I)'
  };

  function nextProblem() {
    var task = PhysicsProblems.generateTask();
    currentAnswer = task.answer;
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
    if (PhysicsProblems.checkAnswer(currentAnswer, false, val)) {
      score++;
      feedbackEl.textContent = 'Richtig!';
      feedbackEl.className = 'feedback correct';
    } else {
      feedbackEl.textContent = 'Falsch. Antwort: ' + PhysicsProblems.formatAnswer(currentAnswer);
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
