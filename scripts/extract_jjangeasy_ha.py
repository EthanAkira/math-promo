import fitz
import re
import os
import json

SHIFT_NUM_MAP = {
    '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
    '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '¡': '1', '™': '2', '£': '3', '¢': '4', '∞': '5',
    '§': '6', '¶': '7', '•': '8', 'ª': '9', 'º': '0',
}

FONT_DIGIT_MAP = {
    '¡': '1', '™': '2', '£': '3', '¢': '4', '∞': '5',
    '§': '6', '¶': '7', '•': '8', 'ª': '9', 'º': '0',
    '«': 'n', '®': 'r', '¤': '^2', '‹': '^3', '›': '^4',
}

CIRCLED_MAP = {'①': 0, '②': 1, '③': 2, '④': 3, '⑤': 4}

CHAPTERS = [
    (1, '원의방정식', 8, 13, 30, 'coordinate-geometry-equations', 'common-math-2'),
    (2, '원과직선', 14, 17, 18, 'coordinate-geometry-equations', 'common-math-2'),
    (3, '도형의이동', 18, 23, 29, 'coordinate-geometry-equations', 'common-math-2'),
    (4, '집합의연산', 24, 29, 31, 'sets-propositions', 'common-math-2'),
    (5, '집합의포함관계', 30, 35, 30, 'sets-propositions', 'common-math-2'),
    (6, '명제와진리집합', 36, 41, 31, 'sets-propositions', 'common-math-2'),
    (7, '충분조건과필요조건', 42, 47, 24, 'sets-propositions', 'common-math-2'),
    (8, '함수의뜻', 48, 53, 24, 'functions-graphs', 'common-math-2'),
    (9, '합성함수와역함수', 54, 61, 38, 'functions-graphs', 'common-math-2'),
    (10, '유리함수', 62, 67, 30, 'functions-graphs', 'common-math-2'),
    (11, '무리함수', 68, 73, 24, 'functions-graphs', 'common-math-2'),
    (12, '경우의수', 74, 77, 19, 'common-math-counting', 'common-math-1'),
    (13, '순열', 78, 83, 30, 'common-math-counting', 'common-math-1'),
    (14, '조합', 84, 88, 25, 'common-math-counting', 'common-math-1'),
]

SOL_PAGE_RANGES = {
    1: (1, 3),
    2: (4, 5),
    3: (6, 8),
    4: (9, 10),
    5: (11, 12),
    6: (13, 15),
    7: (16, 17),
    8: (18, 19),
    9: (20, 21),
    10: (22, 24),
    11: (25, 26),
    12: (27, 28),
    13: (29, 30),
    14: (31, 32),
}

def decode_fractions(text):
    def repl_semi(m):
        raw = m.group(1).replace('`', '')
        if len(raw) >= 2:
            d = raw[0]
            n = raw[1:]
            for k, v in SHIFT_NUM_MAP.items():
                n = n.replace(k, v)
                d = d.replace(k, v)
            return f'\\frac{{{n}}}{{{d}}}'
        return m.group(0)
    
    def repl_colon(m):
        raw = m.group(1).replace('`', '')
        for k, v in SHIFT_NUM_MAP.items():
            raw = raw.replace(k, v)
        if len(raw) >= 2:
            d = raw[0]
            n = raw[1:]
            return f'\\frac{{{n}}}{{{d}}}'
        return raw

    t = re.sub(r';([^;]+);', repl_semi, text)
    t = re.sub(r':([^:]+):', repl_colon, t)
    return t

def clean_math_text(text):
    if not text:
        return ''
    t = text
    for k, v in FONT_DIGIT_MAP.items():
        t = t.replace(k, v)
    t = t.replace('`', '')
    t = t.replace('⋯⋯', '...')
    t = t.replace('Δ', '\\emptyset')
    t = t.replace('—', '\\pm ')
    t = t.replace('"√', '\\sqrt')
    t = re.sub(r"'(\d+)å(\d+)", r"\\sqrt{\1\2}", t)
    t = re.sub(r"'(\d+)", r"\\sqrt{\1}", t)
    t = decode_fractions(t)
    return t.strip()

def parse_solution_book(sol_path):
    doc_sol = fitz.open(sol_path)
    ch_answers = {c: {} for c in range(1, 15)}
    ch_expls = {c: {} for c in range(1, 15)}

    for ch_num, (sp, ep) in SOL_PAGE_RANGES.items():
        total_expected = [c[4] for c in CHAPTERS if c[0] == ch_num][0]
        full_ch_text = []

        for p in range(sp - 1, ep):
            if p >= len(doc_sol):
                continue
            txt = doc_sol[p].get_text()
            lines = [l.strip() for l in txt.splitlines() if l.strip()]
            full_ch_text.extend(lines)

            # Look for answer table lines
            for line in lines:
                m_ans = re.match(r'^(\d{2})\s+([①②③④⑤]|-?\d+|[^\n]+)$', line)
                if m_ans:
                    q = int(m_ans.group(1))
                    val = m_ans.group(2).strip()
                    if 1 <= q <= total_expected:
                        if len(val) <= 25 and not any(k in val for k in ['따라서', '이므로', '이차항', '대입하면', '짱쉬운유형', '본문', '중심']):
                            ch_answers[ch_num][q] = clean_math_text(val)

        # Explanations
        cur_q = None
        cur_lines = []
        for line in full_ch_text:
            if line in ['기본문제다지기', '기출문제맛보기', '예상문제도전하기', '정답및풀이', '유형']:
                continue
            m_expl = re.match(r'^(\d{2})\s+(.+)$', line)
            if m_expl and len(m_expl.group(2)) > 3 and not re.match(r'^[①②③④⑤]$', m_expl.group(2)) and not '본문' in m_expl.group(2):
                q = int(m_expl.group(1))
                if 1 <= q <= total_expected:
                    if cur_q is not None and cur_lines:
                        prev = ch_expls[ch_num].get(cur_q, '')
                        body = '\n'.join(cur_lines).strip()
                        ch_expls[ch_num][cur_q] = (prev + '\n' + body).strip() if prev else body
                    cur_q = q
                    cur_lines = [m_expl.group(2)]
            elif cur_q is not None:
                cur_lines.append(line)

        if cur_q is not None and cur_lines:
            prev = ch_expls[ch_num].get(cur_q, '')
            body = '\n'.join(cur_lines).strip()
            ch_expls[ch_num][cur_q] = (prev + '\n' + body).strip() if prev else body

    return ch_answers, ch_expls

def extract_choices(text):
    choices = []
    pattern = r'([①②③④⑤])\s*([^\n①②③④⑤]+)'
    found = re.findall(pattern, text)
    if len(found) >= 5:
        sorted_found = sorted(found, key=lambda x: CIRCLED_MAP.get(x[0], 0))
        return [clean_math_text(c[1].strip()) for c in sorted_found[:5]]
    return []

def parse_main_book(main_path, ch_answers, ch_expls):
    doc_main = fitz.open(main_path)
    all_problems = []

    for ch_num, ch_name, start_p, end_p, total_q, unit_id, subj_id in CHAPTERS:
        current_section = '기본문제다지기'

        for pno in range(start_p, end_p + 1):
            page_idx = pno - 1
            if page_idx >= len(doc_main):
                continue
            page = doc_main[page_idx]
            blocks = page.get_text('blocks')

            content_blocks = [b for b in blocks if 60 <= b[1] <= 800]
            left = sorted([b for b in content_blocks if b[0] < 310], key=lambda b: b[1])
            right = sorted([b for b in content_blocks if b[0] >= 310], key=lambda b: b[1])
            ordered = left + right

            q_raw_list = []
            cur_q = None

            for b in ordered:
                txt = b[4].strip()
                lines = [l.strip() for l in txt.splitlines() if l.strip()]

                # Section header detection
                for l in lines:
                    if '기본문제다지기' in l:
                        current_section = '기본문제다지기'
                    elif '기출문제맛보기' in l:
                        current_section = '기출문제맛보기'
                    elif '예상문제도전하기' in l:
                        current_section = '예상문제도전하기'

                # Question number detection
                found_q_num = None
                exam_tag = None
                remaining_lines = []

                for l in lines:
                    if re.match(r'^\d{2}$', l):
                        cand = int(l)
                        if 1 <= cand <= total_q:
                            found_q_num = cand
                            continue
                    m_src = re.search(r'(\d{4}학년도\s*교육청|\d{4}학년도\s*평가원|\d{4}학년도\s*수능|\d{4}학년도\s*모의평가)', l)
                    if m_src:
                        exam_tag = m_src.group(1).replace(' ', '')
                        continue
                    if any(s in l for s in ['기본문제다지기', '기출문제맛보기', '예상문제도전하기', '정답및풀이', '유형']):
                        continue
                    remaining_lines.append(l)

                if found_q_num is not None:
                    if cur_q:
                        q_raw_list.append(cur_q)
                    cur_q = {
                        'q_num': found_q_num,
                        'section': current_section,
                        'source_tag': exam_tag or '',
                        'blocks': remaining_lines[:]
                    }
                elif cur_q:
                    if exam_tag and not cur_q['source_tag']:
                        cur_q['source_tag'] = exam_tag
                    cur_q['blocks'].extend(remaining_lines)

            if cur_q:
                q_raw_list.append(cur_q)

            for raw_q in q_raw_list:
                q_num = raw_q['q_num']
                section = raw_q['section']
                source_tag = raw_q['source_tag']
                blocks_text = raw_q['blocks']

                question_lines = []
                choices = []

                full_block_str = '\n'.join(blocks_text)

                for b_str in blocks_text:
                    if '①' in b_str and '②' in b_str:
                        ch_list = extract_choices(b_str)
                        if ch_list:
                            choices = ch_list
                    elif any(c in b_str for c in ['①', '②', '③', '④', '⑤']):
                        ch_list = extract_choices(b_str)
                        if ch_list:
                            choices.extend(ch_list)
                    else:
                        question_lines.append(b_str)

                if len(choices) < 5:
                    alt_choices = extract_choices(full_block_str)
                    if len(alt_choices) >= 5:
                        choices = alt_choices[:5]

                def format_choice_latex(c):
                    c = c.strip()
                    if not c:
                        return c
                    if c.startswith('$') and c.endswith('$'):
                        return c
                    if re.search(r'[\dxyzabcikmnpqrs\+\-\^\\/]', c, re.IGNORECASE):
                        return f'${c}$'
                    return c

                formatted_choices = [format_choice_latex(c) for c in choices]

                q_text = '\n'.join(question_lines).strip()
                q_text = re.sub(r'①[\s\S]+$', '', q_text).strip()
                q_text = clean_math_text(q_text)

                def format_math_exprs(text):
                    lines = text.splitlines()
                    out = []
                    for line in lines:
                        l = line.strip()
                        if not l:
                            continue
                        l = re.sub(r'(f\(x\)\s*=\s*[^\n,]+)', r'$\1$', l)
                        l = re.sub(r'(\(x[\+\-]\d+\)\^2\s*\+\s*\(y[\+\-]\d+\)\^2\s*=\s*\d+)', r'$\1$', l)
                        l = re.sub(r'(x\^2\s*\+\s*y\^2[^\n,.]+)', r'$\1$', l)
                        l = re.sub(r'(\d+[PC]\d+)', r'$\1$', l)
                        out.append(l)
                    return '\n'.join(out)

                formatted_q_text = format_math_exprs(q_text)

                raw_ans = ch_answers.get(ch_num, {}).get(q_num, '')
                correct_idx = None
                ans_text = raw_ans

                if raw_ans in CIRCLED_MAP:
                    correct_idx = CIRCLED_MAP[raw_ans]
                    if len(formatted_choices) > correct_idx:
                        ans_text = formatted_choices[correct_idx]
                elif raw_ans and len(formatted_choices) == 5:
                    for i, ch in enumerate(formatted_choices):
                        if raw_ans.strip() == ch.replace('$', '').strip():
                            correct_idx = i
                            ans_text = ch
                            break

                expl_text = clean_math_text(ch_expls.get(ch_num, {}).get(q_num, ''))
                if not expl_text and raw_ans:
                    expl_text = f'정답: {raw_ans}'

                tier = 'basic'
                prob_source = f'18짱쉬운 수학(하) {ch_num:02d}단원 [{ch_name}] {q_num:02d}번'
                if source_tag:
                    prob_source += f' ({source_tag})'
                elif section == '기본문제다지기':
                    prob_source += ' (기본개념)'
                elif section == '기출문제맛보기':
                    prob_source += ' (학평기출)'
                else:
                    prob_source += ' (실전예상)'

                problem_id = f'jjangeasy-ha-ch{ch_num:02d}-q{q_num:02d}'

                problem_obj = {
                    'id': problem_id,
                    'book': '18짱쉬운 수학(하)',
                    'chapterNumber': ch_num,
                    'chapterName': ch_name,
                    'problemNumber': q_num,
                    'section': section,
                    'subjectId': subj_id,
                    'unitId': unit_id,
                    'grade': 'g1',
                    'tier': tier,
                    'points': 2 if section == '기본문제다지기' else 3,
                    'source': prob_source,
                    'question': formatted_q_text,
                    'choices': formatted_choices if len(formatted_choices) == 5 else [],
                    'answer': correct_idx if correct_idx is not None else ans_text,
                    'solution': expl_text,
                }
                all_problems.append(problem_obj)

    # Sort problems by chapter and problem number, deduplicating if any
    unique_problems = []
    seen_ids = set()
    for p in all_problems:
        if p['id'] not in seen_ids:
            seen_ids.add(p['id'])
            unique_problems.append(p)

    return unique_problems

if __name__ == '__main__':
    main_pdf = r'D:\수학\18짱쉬운+수학(하)+본문_학생용.pdf'
    sol_pdf = r'D:\수학\18짱쉬운+_+수학(하)+_+해설.pdf'

    print('Parsing solution book...')
    ch_answers, ch_expls = parse_solution_book(sol_pdf)
    total_answers = sum(len(v) for v in ch_answers.values())
    total_expls = sum(len(v) for v in ch_expls.values())
    print(f'Parsed {total_answers} answers, {total_expls} explanations.')

    print('Parsing main student book...')
    problems = parse_main_book(main_pdf, ch_answers, ch_expls)
    print(f'Extracted {len(problems)} problems!')

    breakdown = {}
    for p in problems:
        k = (p['subjectId'], p['unitId'])
        breakdown[k] = breakdown.get(k, 0) + 1
    for k, v in sorted(breakdown.items()):
        print(f'Unit {k}: {v} problems')

    out_file = 'scripts/ha_extracted.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)
    print(f'Saved to {out_file}')
