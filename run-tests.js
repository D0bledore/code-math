var MathProblems = require('./js/problems.js');
var PhysicsProblems = require('./js/physics-problems.js');

var passed = 0, failed = 0;
var allTypes = ['add','sub','mul','div','dec_add','dec_sub','dec_mul','dec_div','frac_add','frac_sub','dreisatz','dreisatz_inv','umrechnung'];
var physicsTypes = ['ohm_u', 'ohm_r', 'ohm_i'];

function suite(name) {
  console.log('\n' + name);
  console.log('-'.repeat(name.length));
}

function assert(condition, name, detail) {
  if (condition) {
    passed++;
    console.log('\u2713 ' + name);
  } else {
    failed++;
    console.log('\u2717 ' + name);
    if (detail) console.log('  ' + detail);
  }
}

function parseAndVerify(type, count) {
  var mismatches = [];
  for (var i = 0; i < count; i++) {
    var t;
    do { t = MathProblems.generateTask(); } while (t.type !== type);
    var d = t.display;
    var expected;

    if (type === 'add') {
      var m = d.match(/^(\d+)\s*\+\s*(\d+)\s*=$/);
      expected = parseInt(m[1]) + parseInt(m[2]);
    } else if (type === 'sub') {
      var m = d.match(/^(\d+)\s*\u2212\s*(\d+)\s*=$/);
      expected = parseInt(m[1]) - parseInt(m[2]);
    } else if (type === 'mul') {
      var m = d.match(/^(\d+)\s*\u00d7\s*(\d+)\s*=$/);
      expected = parseInt(m[1]) * parseInt(m[2]);
    } else if (type === 'div') {
      var m = d.match(/^(\d+)\s*\u00f7\s*(\d+)\s*=$/);
      expected = parseInt(m[1]) / parseInt(m[2]);
    } else if (type === 'dec_add') {
      var m = d.match(/^([\d.]+)\s*\+\s*([\d.]+)\s*=$/);
      expected = parseFloat((parseFloat(m[1]) + parseFloat(m[2])).toFixed(2));
    } else if (type === 'dec_sub') {
      var m = d.match(/^([\d.]+)\s*\u2212\s*([\d.]+)\s*=$/);
      expected = parseFloat((parseFloat(m[1]) - parseFloat(m[2])).toFixed(2));
    } else if (type === 'dec_mul') {
      var m = d.match(/^([\d.]+)\s*\u00d7\s*([\d.]+)\s*=$/);
      expected = parseFloat((parseFloat(m[1]) * parseFloat(m[2])).toFixed(2));
    } else if (type === 'dec_div') {
      var m = d.match(/^([\d.]+)\s*\u00f7\s*([\d.]+)\s*=$/);
      expected = parseFloat((parseFloat(m[1]) / parseFloat(m[2])).toFixed(2));
    } else if (type === 'frac_add') {
      var m = d.match(/^(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)\s*=$/);
      var eNum = parseInt(m[1]) * parseInt(m[4]) + parseInt(m[3]) * parseInt(m[2]);
      var eDen = parseInt(m[2]) * parseInt(m[4]);
      expected = {num: eNum, den: eDen};
    } else if (type === 'frac_sub') {
      var m = d.match(/^(\d+)\/(\d+)\s*\u2212\s*(\d+)\/(\d+)\s*=$/);
      var eNum = parseInt(m[1]) * parseInt(m[4]) - parseInt(m[3]) * parseInt(m[2]);
      var eDen = parseInt(m[2]) * parseInt(m[4]);
      expected = {num: eNum, den: eDen};
    } else if (type === 'dreisatz') {
      var m = d.match(/(\d+) Äpfel kosten (\d+)€\. Was kosten (\d+) Äpfel\?/);
      if (!m) return { ok: false, msg: 'parse fail' };
      var a = +m[1], b = +m[2], c = +m[3];
      expected = (c * b) / a;
    } else if (type === 'dreisatz_inv') {
      var m = d.match(/(\d+) Arbeiter brauchen (\d+) Tage\. Wie viele Tage brauchen (\d+) Arbeiter\?/);
      if (!m) return { ok: false, msg: 'parse fail' };
      var a = +m[1], b = +m[2], c = +m[3];
      expected = (a * b) / c;
    } else if (type === 'umrechnung') {
      var m = d.match(/^Rechne ([\d.]+) (\S+) in (\S+) um\.$/);
      if (!m) { mismatches.push('parse fail: ' + d); continue; }
      if (!isFinite(t.answer)) mismatches.push(d + ' answer not finite');
      continue;
    }

    if (t.isFraction) {
      if (expected.num * t.answer.den !== expected.den * t.answer.num) {
        mismatches.push(d + ' got ' + t.answer.num + '/' + t.answer.den +
          ' expected ' + expected.num + '/' + expected.den);
      }
    } else {
      if (Math.abs(expected - t.answer) > 0.001) {
        mismatches.push(d + ' got ' + t.answer + ' expected ' + expected);
      }
    }
  }
  return mismatches;
}

// ---------- Suite 1: Generation invariants ----------
suite('Suite 1 — Generation invariants (N=500)');

var N = 500;
var tasks = [];
var typeSeen = {};
for (var i = 0; i < N; i++) {
  tasks.push(MathProblems.generateTask());
}
tasks.forEach(function(t) { typeSeen[t.type] = true; });

var allSeen = allTypes.every(function(tp) { return typeSeen[tp]; });
assert(allSeen, 'All 13 types appear over 500 generations',
  'Missing: ' + allTypes.filter(function(tp) { return !typeSeen[tp]; }).join(', '));

var allFields = tasks.every(function(t) {
  return t.hasOwnProperty('display') && t.hasOwnProperty('hint') &&
         t.hasOwnProperty('type') && t.hasOwnProperty('answer') &&
         t.hasOwnProperty('isFraction');
});
assert(allFields, 'Every task has display, hint, type, answer, isFraction');

var allEndEqual = tasks.every(function(t) { return /[=?.]\s*$/.test(t.display); });
assert(allEndEqual, 'display always ends with = or ? or .');

var hintCorrect = tasks.every(function(t) {
  if (t.type === 'frac_add' || t.type === 'frac_sub' || t.type === 'dreisatz' || t.type === 'dreisatz_inv' || t.type === 'umrechnung') return t.hint !== '';
  return t.hint === '';
});
assert(hintCorrect, 'hint non-empty only for frac/dreisatz types');

var isFracCorrect = tasks.every(function(t) {
  if (t.type === 'frac_add' || t.type === 'frac_sub') return t.isFraction === true;
  return t.isFraction === false;
});
assert(isFracCorrect, 'isFraction true only for frac_add/frac_sub');

var intTypes = ['add','sub','mul','div'];
var intAnswersOk = tasks.filter(function(t) { return intTypes.indexOf(t.type) >= 0; })
  .every(function(t) { return Number.isInteger(t.answer); });
assert(intAnswersOk, 'Integer ops produce integer answers');

var divExact = tasks.filter(function(t) { return t.type === 'div'; })
  .every(function(t) { return Number.isInteger(t.answer); });
assert(divExact, 'div: answer is always a whole number');

var subPositive = tasks.filter(function(t) { return t.type === 'sub'; })
  .every(function(t) { return t.answer >= 1; });
assert(subPositive, 'sub: result always >= 1');

var fracSubNonNeg = tasks.filter(function(t) { return t.type === 'frac_sub'; })
  .every(function(t) { return t.answer.num >= 0; });
assert(fracSubNonNeg, 'frac_sub: numerator >= 0');

var noNaN = tasks.every(function(t) {
  if (t.isFraction) return !isNaN(t.answer.num) && !isNaN(t.answer.den);
  return !isNaN(t.answer) && isFinite(t.answer);
});
assert(noNaN, 'Answers never NaN / Infinity');

var fracDenPos = tasks.filter(function(t) { return t.isFraction; })
  .every(function(t) { return t.answer.den > 0; });
assert(fracDenPos, 'Fraction denominators always > 0');

// ---------- Suite 2: Answer checking ----------
suite('Suite 2 — Answer checking');

assert(MathProblems.checkAnswer(42, false, '42'), 'Correct integer accepted');
assert(!MathProblems.checkAnswer(42, false, '43'), 'Wrong integer rejected');
assert(!MathProblems.checkAnswer(42, false, ''), 'Empty string rejected');
assert(!MathProblems.checkAnswer(42, false, '   '), 'Whitespace-only rejected');

assert(MathProblems.checkAnswer(3.14, false, '3,14'), 'Comma as decimal separator accepted');
assert(MathProblems.checkAnswer(3.14, false, '3.14'), 'Dot as decimal separator accepted');
assert(MathProblems.checkAnswer(5.55, false, '5.554'), 'Within tolerance (0.004 off) accepted');
assert(!MathProblems.checkAnswer(5.55, false, '5.556'), 'Outside tolerance (0.006 off) rejected');
assert(!MathProblems.checkAnswer(42, false, 'abc'), 'Non-numeric text rejected');

assert(MathProblems.checkAnswer({num:3,den:4}, true, '3/4'), 'Fraction exact match accepted');
assert(MathProblems.checkAnswer({num:3,den:4}, true, '6/8'), 'Fraction equivalent (unreduced) accepted');
assert(!MathProblems.checkAnswer({num:3,den:4}, true, '2/4'), 'Wrong fraction rejected');
assert(!MathProblems.checkAnswer({num:3,den:4}, true, '3/0'), 'Fraction zero denominator rejected');
assert(!MathProblems.checkAnswer({num:3,den:4}, true, '0.75'), 'Decimal input for fraction rejected');

// ---------- Suite 3: formatAnswer ----------
suite('Suite 3 — formatAnswer');

assert(MathProblems.formatAnswer(42, false) === '42', 'Integer formats as plain string');
assert(MathProblems.formatAnswer(3.14, false) === '3.14', 'Decimal formats as plain string');
assert(MathProblems.formatAnswer({num:6,den:4}, true) === '3/2', 'Fraction reduces to lowest terms (6/4 -> 3/2)');
assert(MathProblems.formatAnswer({num:3,den:7}, true) === '3/7', 'Already-reduced fraction unchanged');

// ---------- Suite 4: Mathematical correctness ----------
suite('Suite 4 — Mathematical correctness (parse & verify, N=100 each)');

allTypes.forEach(function(tp) {
  var mm = parseAndVerify(tp, 100);
  assert(mm.length === 0, tp + ': display matches stored answer (100 runs)',
    mm.length > 0 ? mm.slice(0, 3).join('; ') : '');
});

// ---------- Suite 5: Student-safety checks ----------
suite('Suite 5 — Student-safety checks');

var safetyN = 300;
var safetyTasks = [];
for (var i = 0; i < safetyN; i++) safetyTasks.push(MathProblems.generateTask());

var noNegSub = safetyTasks.filter(function(t) { return t.type === 'sub'; })
  .every(function(t) { return t.answer >= 0; });
assert(noNegSub, 'No negative answers in sub type');

var divExact2 = safetyTasks.filter(function(t) { return t.type === 'div'; })
  .every(function(t) {
    var m = t.display.match(/^(\d+)\s*\u00f7\s*(\d+)\s*=$/);
    return t.answer * parseInt(m[2]) === parseInt(m[1]);
  });
assert(divExact2, 'Division always exact (answer * divisor = dividend)');

var decTypes = ['dec_add','dec_sub','dec_mul','dec_div'];
var decPlacesOk = safetyTasks.filter(function(t) { return decTypes.indexOf(t.type) >= 0; })
  .every(function(t) {
    var s = String(t.answer);
    var parts = s.split('.');
    return parts.length === 1 || parts[1].length <= 2;
  });
assert(decPlacesOk, 'Decimal answers have <= 2 decimal places');

var fracSubNonNeg2 = safetyTasks.filter(function(t) { return t.type === 'frac_sub'; })
  .every(function(t) { return t.answer.num >= 0; });
assert(fracSubNonNeg2, 'Fraction subtraction never negative');

assert(!MathProblems.checkAnswer(100, false, '101'), 'Tolerance not so loose that off-by-1 integers pass');
assert(MathProblems.checkAnswer(3.33, false, '3.334'), 'Tolerance not so tight that valid rounding fails');

// ========== PHYSICS TESTS ==========

// ---------- Suite 6: Physics generation invariants ----------
suite('Suite 6 — Physics generation invariants (N=300)');

var physN = 300;
var physicsTasks = [];
var physTypeSeen = {};
for (var i = 0; i < physN; i++) {
  physicsTasks.push(PhysicsProblems.generateTask());
}
physicsTasks.forEach(function(t) { physTypeSeen[t.type] = true; });

var physAllSeen = physicsTypes.every(function(tp) { return physTypeSeen[tp]; });
assert(physAllSeen, 'All 3 physics types appear over 300 generations',
  'Missing: ' + physicsTypes.filter(function(tp) { return !physTypeSeen[tp]; }).join(', '));

var physAllFields = physicsTasks.every(function(t) {
  return t.hasOwnProperty('display') && t.hasOwnProperty('hint') &&
         t.hasOwnProperty('type') && t.hasOwnProperty('answer') &&
         t.hasOwnProperty('isFraction');
});
assert(physAllFields, 'Every physics task has display, hint, type, answer, isFraction');

var physNeverFrac = physicsTasks.every(function(t) { return t.isFraction === false; });
assert(physNeverFrac, 'Physics tasks never have isFraction=true');

var physDisplayEnd = physicsTasks.every(function(t) { return /\.\s*$/.test(t.display); });
assert(physDisplayEnd, 'Physics display always ends with .');

var physHintNonEmpty = physicsTasks.every(function(t) { return t.hint !== ''; });
assert(physHintNonEmpty, 'Physics tasks always have a hint');

var physNoNaN = physicsTasks.every(function(t) {
  return !isNaN(t.answer) && isFinite(t.answer);
});
assert(physNoNaN, 'Physics answers never NaN / Infinity');

var physPositive = physicsTasks.every(function(t) { return t.answer > 0; });
assert(physPositive, 'Physics answers always positive');

// ---------- Suite 7: Physics answer checking ----------
suite('Suite 7 — Physics answer checking');

assert(PhysicsProblems.checkAnswer(42, false, '42'), 'Physics: correct integer accepted');
assert(!PhysicsProblems.checkAnswer(42, false, '43'), 'Physics: wrong integer rejected');
assert(!PhysicsProblems.checkAnswer(42, false, ''), 'Physics: empty string rejected');
assert(!PhysicsProblems.checkAnswer(42, false, '   '), 'Physics: whitespace-only rejected');
assert(PhysicsProblems.checkAnswer(3.5, false, '3,5'), 'Physics: comma decimal separator accepted');
assert(PhysicsProblems.checkAnswer(3.5, false, '3.5'), 'Physics: dot decimal separator accepted');
assert(PhysicsProblems.checkAnswer(5.5, false, '5.504'), 'Physics: within tolerance accepted');
assert(!PhysicsProblems.checkAnswer(5.5, false, '5.506'), 'Physics: outside tolerance rejected');
assert(!PhysicsProblems.checkAnswer(42, false, 'abc'), 'Physics: non-numeric text rejected');

// ---------- Suite 8: Physics mathematical correctness ----------
suite('Suite 8 — Physics mathematical correctness (N=100 each)');

physicsTypes.forEach(function(tp) {
  var mismatches = [];
  for (var i = 0; i < 100; i++) {
    var t;
    do { t = PhysicsProblems.generateTask(); } while (t.type !== tp);
    var d = t.display;

    if (tp === 'ohm_u') {
      var m = d.match(/R = (\d+) \u03A9, I = ([\d,]+) A\. Berechne U\./);
      if (!m) { mismatches.push('parse fail: ' + d); continue; }
      var r = parseInt(m[1]);
      var iVal = parseFloat(m[2].replace(',', '.'));
      var expected = parseFloat((r * iVal).toFixed(1));
      if (Math.abs(expected - t.answer) > 0.001)
        mismatches.push(d + ' got ' + t.answer + ' expected ' + expected);
    } else if (tp === 'ohm_r') {
      var m = d.match(/U = ([\d,]+) V, I = ([\d,]+) A\. Berechne R\./);
      if (!m) { mismatches.push('parse fail: ' + d); continue; }
      var u = parseFloat(m[1].replace(',', '.'));
      var iVal = parseFloat(m[2].replace(',', '.'));
      var expected = u / iVal;
      if (Math.abs(expected - t.answer) > 0.01)
        mismatches.push(d + ' got ' + t.answer + ' expected ' + expected);
    } else if (tp === 'ohm_i') {
      var m = d.match(/U = ([\d,]+) V, R = (\d+) \u03A9\. Berechne I\./);
      if (!m) { mismatches.push('parse fail: ' + d); continue; }
      var u = parseFloat(m[1].replace(',', '.'));
      var r = parseInt(m[2]);
      var expected = u / r;
      if (Math.abs(expected - t.answer) > 0.01)
        mismatches.push(d + ' got ' + t.answer + ' expected ' + expected);
    }
  }
  assert(mismatches.length === 0, tp + ': display matches stored answer (100 runs)',
    mismatches.length > 0 ? mismatches.slice(0, 3).join('; ') : '');
});

// ---------- Suite 9: Physics safety checks ----------
suite('Suite 9 — Physics safety checks');

var physSafetyN = 300;
var physSafetyTasks = [];
for (var i = 0; i < physSafetyN; i++) physSafetyTasks.push(PhysicsProblems.generateTask());

var physRangeOk = physSafetyTasks.every(function(t) {
  return t.answer > 0 && t.answer < 10000;
});
assert(physRangeOk, 'Physics answers in reasonable range (0-10000)');

var ohmRClean = physSafetyTasks.filter(function(t) { return t.type === 'ohm_r'; })
  .every(function(t) { return Number.isInteger(t.answer); });
assert(ohmRClean, 'ohm_r: R answer is always a whole number');

var ohmIClean = physSafetyTasks.filter(function(t) { return t.type === 'ohm_i'; })
  .every(function(t) {
    var s = String(t.answer);
    var parts = s.split('.');
    return parts.length === 1 || parts[1].length <= 1;
  });
assert(ohmIClean, 'ohm_i: I answer has at most 1 decimal place');

var physHintCorrect = physSafetyTasks.every(function(t) {
  if (t.type === 'ohm_u') return t.hint === 'Antwort in V';
  if (t.type === 'ohm_r') return t.hint === 'Antwort in \u03A9';
  if (t.type === 'ohm_i') return t.hint === 'Antwort in A';
  return false;
});
assert(physHintCorrect, 'Physics hints match expected units');

// ---------- Summary ----------
console.log('\n=== RESULTS ===');
var total = passed + failed;
console.log(passed + '/' + total + ' passed' + (failed > 0 ? ', ' + failed + ' failed' : ' — all green!'));
process.exit(failed > 0 ? 1 : 0);
