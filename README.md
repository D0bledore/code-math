# Math Exercise Generator

A simple Python script that generates random math problems for practice.

## Usage

```bash
python logic.py
```

- Press **Enter** to get the next problem
- Type **q** and press Enter to quit

## Problem Types

| Type | Description | Example |
|------|-------------|---------|
| `add` | 4-digit addition | `3456 + 7891 =` |
| `sub` | Subtraction (positive results) | `12000 - 3500 =` |
| `mul` | 3-digit × single digit | `456 × 7 =` |
| `div` | Division (whole number results) | `1440 ÷ 12 =` |
| `dec_add` | Decimal addition | `12.45 + 8.32 =` |
| `dec_sub` | Decimal subtraction | `25.67 - 4.23 =` |
| `dec_mul` | Decimal multiplication | `5.5 × 3.2 =` |
| `dec_div` | Decimal division | `45 ÷ 2.5 =` |
| `frac_add` | Fraction addition | `3/4 + 2/5 = (als Bruch)` |
| `frac_sub` | Fraction subtraction | `7/3 - 2/5 = (als Bruch)` |

## Design Decisions

### Ensuring Valid Results

**Subtraction**: The first operand (5000-15000) is always larger than the second (1000-4999), preventing negative results.

**Division**: The dividend is adjusted with `a = a - (a % b)` to guarantee whole number results.

**Fraction Subtraction**: The fractions are compared and swapped if necessary to ensure positive results:
```python
if num1/den1 < num2/den2:
    num1, den1, num2, den2 = num2, den2, num1, den1
```

### Decimal Division Ranges

Changed from `10-100 ÷ 0.1-2` to `10-50 ÷ 0.5-5` because:
- Original could produce results up to 1000 (100 ÷ 0.1)
- Original divisors like 0.1 create unwieldy decimal answers
- New range produces more manageable results (2-100)

### User-Controlled Loop

Changed from infinite `while True` to input-controlled loop:
- Allows users to pace themselves
- Provides clean exit with 'q' instead of requiring Ctrl+C
