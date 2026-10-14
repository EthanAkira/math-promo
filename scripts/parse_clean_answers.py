import json
import re

CIRCLED_MAP = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
    '➀': 1, '➁': 2, '➂': 3, '➃': 4, '➄': 5,
    '➊': 1, '➋': 2, '➌': 3, '➍': 4, '➎': 5,
    'D': 1, '®': 1, '@': 2, '©': 3, 'O': 3, '0': 1, 'e': 1, 'Q': 2,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
}

with open('scripts/extracted_answer_tables.json', 'r', encoding='utf-8') as f:
    raw_tables = json.load(f)

parsed_answers = {}

for sess, txt in raw_tables.items():
    # Find all patterns like "001 [answer]" or "042 [answer]"
    # Split text into lines or tokens
    lines = txt.split('\n')
    ans_map = {}
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Matches tokens like "001 ③", "006 100", "010 30", "O22 26"
        # Notice sometimes 022 is OCRed as O22
        line_clean = re.sub(r'^[Oo](\d\d)\b', r'0\1', line)
        
        # Find all occurrences of 3-digit number (or O-digit) followed by answer
        # e.g. "001 @", "002 ©", "004 36"
        matches = re.findall(r'(?:0\d\d|[1-9]\d\d|[Oo]\d\d)\s+([①-⑤➀-➄➊-➎@©®D0-9]+)', line)
        num_matches = re.findall(r'\b(0\d\d|[1-9]\d\d|[Oo]\d\d)\b', line)
        
        # If pairs of num and answer appear
        pairs = re.findall(r'\b([0-9Oo]\d\d)\s+([①-⑤➀-➄➊-➎@©®DQ0-9]+)', line)
        for num_str, ans_str in pairs:
            n = int(num_str.replace('O', '0').replace('o', '0'))
            # normalize answer
            ans_clean = ans_str.strip()
            # if circled or special symbol
            if ans_clean in CIRCLED_MAP:
                val = CIRCLED_MAP[ans_clean]
            elif ans_clean.isdigit():
                val = int(ans_clean)
            else:
                # check first char
                c = ans_clean[0]
                val = CIRCLED_MAP.get(c, ans_clean)
            ans_map[n] = val

    print(f"[{sess}] Parsed {len(ans_map)} answers: min={min(ans_map.keys()) if ans_map else 'None'}, max={max(ans_map.keys()) if ans_map else 'None'}")
    parsed_answers[sess] = ans_map

with open('scripts/clean_answers.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_answers, f, ensure_ascii=False, indent=2)

print("Saved clean_answers.json successfully!")
