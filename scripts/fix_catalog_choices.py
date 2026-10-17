import json
import re
import glob
import os

def parse_choices_from_question(q):
    """
    Tries to extract 5 choices from question if formatted with @ or circled numbers.
    e.g. '@128 @192 @256 @384 @512'
    or '@1 128 @2 192 @3 256 @4 384 @5 512'
    or '① 128 ② 192 ③ 256 ④ 384 ⑤ 512'
    """
    if not q:
        return None, q
    
    # Check for circled numbers ① ~ ⑤
    circle_pattern = r'[①-⑤]'
    circle_matches = list(re.finditer(circle_pattern, q))
    if len(circle_matches) == 5:
        split_indices = [m.start() for m in circle_matches]
        q_text = q[:split_indices[0]].strip()
        choices = []
        for i in range(5):
            start = split_indices[i] + 1
            end = split_indices[i+1] if i < 4 else len(q)
            c = q[start:end].strip()
            # remove leading symbols if any
            c = re.sub(r'^[①-⑤\.\)]\s*', '', c)
            choices.append(f"${c}$" if not c.startswith('$') else c)
        if len(choices) == 5 and all(c.strip(' $') for c in choices):
            return choices, q_text

    # Check for @ pattern: '@128 @192 @256 @384 @512' or '@1 128 @2 192...'
    # Many OCRs use @ or @O for 1~5
    at_matches = list(re.finditer(r'@(?:[1-5O]\s*)?', q))
    if len(at_matches) >= 5:
        # Take the last 5 @ matches
        target_matches = at_matches[-5:]
        split_indices = [m.start() for m in target_matches]
        q_text = q[:split_indices[0]].strip()
        choices = []
        for i in range(5):
            start = target_matches[i].end()
            end = target_matches[i+1].start() if i < 4 else len(q)
            c = q[start:end].strip()
            # clean up choice text
            c = re.sub(r'^[\.\,\-\)]\s*', '', c).strip()
            choices.append(f"${c}$" if not c.startswith('$') else c)
        if len(choices) == 5 and all(c.strip(' $') for c in choices):
            return choices, q_text

    return None, q

def process_catalog(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        return
    
    if not isinstance(data, list):
        return

    changed = 0
    dummy_choices = 0
    extracted = 0

    for p in data:
        if not isinstance(p, dict):
            continue
        choices = p.get('choices')
        is_dummy = False
        if isinstance(choices, list) and len(choices) == 5:
            # check if dummy
            clean_choices = [re.sub(r'[\$\s\(\)]', '', str(c)) for c in choices]
            if clean_choices == ['①', '②', '③', '④', '⑤'] or clean_choices == ['1', '2', '3', '4', '5']:
                is_dummy = True
                dummy_choices += 1

        if is_dummy:
            extracted_choices, clean_q = parse_choices_from_question(p.get('question', ''))
            if extracted_choices:
                p['choices'] = extracted_choices
                p['question'] = clean_q
                extracted += 1
                changed += 1
            else:
                # If cannot extract from question, check explanation or leave choices as numbers
                # But don't keep ['$①$', '$②$', '$③$', '$④$', '$⑤$'] which renders as ① ①
                # Instead, set choices to ['$1$', '$2$', '$3$', '$4$', '$5$'] or if question is too short/empty
                p['choices'] = ['$1$', '$2$', '$3$', '$4$', '$5$']
                changed += 1

    if changed > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"{os.path.basename(filepath)}: dummy={dummy_choices}, extracted={extracted}, updated={changed}")

if __name__ == '__main__':
    for cat in glob.glob('app/data/*.json'):
        process_catalog(cat)
