# Testing

71 tests across 9 suites (5 math + 4 physics).

## Running Tests

```bash
node run-tests.js
```

No browser or extra dependencies needed — tests run directly in Node.js.

## Suites

### Suite 1 — Generation invariants (11 tests)

Generates 500 random tasks and verifies structural correctness:

- All 13 problem types appear at least once
- Every task has `display`, `hint`, `type`, `answer`, `isFraction`
- `display` always ends with `=`, `?`, or `.`
- `hint` is non-empty only for fraction, Dreisatz, and Umrechnung types
- `isFraction` is `true` only for `frac_add` / `frac_sub`
- Integer operations produce integer answers
- Division always yields whole numbers
- Subtraction results are always >= 1
- Fraction subtraction numerators are never negative
- No `NaN` or `Infinity` answers
- Fraction denominators are always > 0

### Suite 2 — Answer checking (14 tests)

Tests `MathProblems.checkAnswer()` against various inputs:

- Correct and wrong integers
- Empty and whitespace-only input rejected
- Comma and dot accepted as decimal separators
- Tolerance: answers within +/-0.005 accepted, beyond rejected
- Non-numeric text rejected
- Fraction exact match and equivalent fractions accepted
- Wrong fractions, zero denominators, and decimal input for fractions rejected

### Suite 3 — formatAnswer (4 tests)

Tests `MathProblems.formatAnswer()` output:

- Integers and decimals format as plain strings
- Fractions are reduced to lowest terms via GCD (e.g. 6/4 becomes 3/2)

### Suite 4 — Mathematical correctness (13 tests)

For each of the 13 problem types, generates 100 tasks, parses the `display` string back into operands, recomputes the expected answer independently, and compares it to the stored `answer`. Catches any mismatch between what the student sees and what the system expects.

### Suite 5 — Student-safety checks (6 tests)

Generates 300 tasks and verifies constraints that protect students from confusing results:

- Subtraction never produces negative answers
- Division is always exact (answer x divisor = dividend)
- Decimal answers have at most 2 decimal places
- Fraction subtraction never produces negative numerators
- Tolerance is not so loose that off-by-1 integers pass
- Tolerance is not so tight that valid rounding fails

### Suite 6 — Physics generation invariants (7 tests)

Generates 300 random physics tasks and verifies structural correctness:

- All 3 physics types (`ohm_u`, `ohm_r`, `ohm_i`) appear
- Every task has `display`, `hint`, `type`, `answer`, `isFraction`
- `isFraction` is always `false`
- `display` always ends with `.`
- `hint` is always non-empty
- No `NaN` or `Infinity` answers
- All answers are positive

### Suite 7 — Physics answer checking (9 tests)

Tests `PhysicsProblems.checkAnswer()` against various inputs:

- Correct and wrong integers
- Empty and whitespace-only input rejected
- Comma and dot accepted as decimal separators
- Tolerance: answers within +/-0.005 accepted, beyond rejected
- Non-numeric text rejected

### Suite 8 — Physics mathematical correctness (3 tests)

For each of the 3 Ohm's Law types, generates 100 tasks, parses the `display` string back into given values, recomputes the expected answer using U = R × I, and compares it to the stored `answer`.

### Suite 9 — Physics safety checks (4 tests)

Generates 300 physics tasks and verifies:

- All answers in reasonable range (0–10000)
- `ohm_r` answers are always whole numbers
- `ohm_i` answers have at most 1 decimal place
- Hints match expected units (V, Ω, A)
