import re
import sys
import os

filepath = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    '_posts', '2026-03-01-continuous-reinforcement-learning_good.md')

with open(filepath, 'r') as f:
    content = f.read()

# Replace single-dollar inline math with double-dollar display math
# Process character by character to avoid replacing already-double dollars
result = []
i = 0
count = 0
while i < len(content):
    if content[i] == '$':
        # Check if this is $$
        if i + 1 < len(content) and content[i + 1] == '$':
            # Already double dollar, copy as-is
            # Find the closing $$
            result.append('$$')
            i += 2
            while i < len(content):
                if content[i] == '$' and i + 1 < len(content) and content[i + 1] == '$':
                    result.append('$$')
                    i += 2
                    break
                result.append(content[i])
                i += 1
            continue
        # Check if preceded by $ (shouldn't happen if we process left to right correctly)
        if len(result) > 0 and result[-1] == '$':
            result.append(content[i])
            i += 1
            continue
        # This is a single $ - replace with $$
        result.append('$$')
        i += 1
        # Find matching closing single $
        while i < len(content):
            if content[i] == '$':
                if i + 1 < len(content) and content[i + 1] == '$':
                    # This is $$, not our closing $
                    result.append(content[i])
                    i += 1
                    continue
                # Found closing single $
                result.append('$$')
                i += 1
                count += 1
                break
            result.append(content[i])
            i += 1
    else:
        result.append(content[i])
        i += 1

new_content = ''.join(result)

with open(filepath, 'w') as f:
    f.write(new_content)

sys.stdout.write("Replaced %d inline math instances (single $ to $$)\n" % count)
sys.stdout.flush()
