import sys

with open('app.py', 'r') as f:
    content = f.read()

# I want to add try...except around prepare_avatar logic.
# Wait, let's just write a script that runs `app.py` in test mode and see what it outputs when we call it!
