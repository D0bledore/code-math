import random

def generate_task():
    types = ['add', 'sub', 'mul', 'div', 'dec_add', 'dec_sub', 'dec_mul', 'dec_div', 'frac_add', 'frac_sub']
    task_type = random.choice(types)
    
    if task_type == 'add':
        a, b = random.randint(1000, 9999), random.randint(1000, 9999)
        return f"{a} + {b} ="
    
    elif task_type == 'sub':
        a, b = random.randint(5000, 15000), random.randint(1000, 4999)
        return f"{a} - {b} ="
    
    elif task_type == 'mul':
        a, b = random.randint(100, 999), random.randint(2, 9)
        return f"{a} × {b} ="
    
    elif task_type == 'div':
        a, b = random.randint(1000, 5000), random.randint(2, 12)
        a = a - (a % b)  # Ganzzahlig
        return f"{a} ÷ {b} ="
    
    elif task_type == 'dec_add':
        a, b = round(random.uniform(1, 20), 2), round(random.uniform(1, 20), 2)
        return f"{a} + {b} ="
    
    elif task_type == 'dec_sub':
        a, b = round(random.uniform(10, 30), 2), round(random.uniform(1, 9), 2)
        return f"{a} - {b} ="
    
    elif task_type == 'dec_mul':
        a, b = round(random.uniform(1, 10), 1), round(random.uniform(1, 10), 1)
        return f"{a} × {b} ="
    
    elif task_type == 'dec_div':
        a, b = random.randint(10, 50), round(random.uniform(0.5, 5), 1)
        return f"{a} ÷ {b} ="
    
    elif task_type == 'frac_add':
        num1, den1 = random.randint(1, 9), random.randint(2, 12)
        num2, den2 = random.randint(1, 9), random.randint(2, 12)
        return f"{num1}/{den1} + {num2}/{den2} = (als Bruch)"
    
    elif task_type == 'frac_sub':
        den1, den2 = random.randint(2, 6), random.randint(2, 6)
        num1 = random.randint(5, 9)
        num2 = random.randint(1, 4)
        if num1/den1 < num2/den2:
            num1, den1, num2, den2 = num2, den2, num1, den1
        return f"{num1}/{den1} - {num2}/{den2} = (als Bruch)"

# Aufgaben generieren (Enter für nächste, 'q' zum Beenden)
while True:
    print(generate_task())
    user_input = input()
    if user_input.lower() == 'q':
        break
