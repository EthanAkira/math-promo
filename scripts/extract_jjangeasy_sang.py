import fitz
import re
import os
import json

SHIFT_NUM_MAP = {
    '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
    '^': '6', '&': '7', '*': '8', '(': '9', ')': '0'
}

CIRCLED_MAP = {'①': 0, '②': 1, '③': 2, '④': 3, '⑤': 4}

CHAPTERS = [
    (1, '다항식의 연산', 8, 13, 'polynomial-ops', 'common-math-1'),
    (2, '곱셈공식', 14, 19, 'polynomial-ops', 'common-math-1'),
    (3, '항등식', 20, 23, 'polynomial-ops', 'common-math-1'),
    (4, '나머지정리와 인수정리', 24, 29, 'polynomial-ops', 'common-math-1'),
    (5, '인수분해', 30, 33, 'polynomial-ops', 'common-math-1'),
    (6, '복소수의 연산', 34, 39, 'equations-inequalities', 'common-math-1'),
    (7, '복소수의 거듭제곱', 40, 43, 'equations-inequalities', 'common-math-1'),
    (8, '이차방정식과 판별식', 44, 47, 'equations-inequalities', 'common-math-1'),
    (9, '근과 계수의 관계', 48, 53, 'equations-inequalities', 'common-math-1'),
    (10, '이차함수의 활용', 54, 59, 'equations-inequalities', 'common-math-1'),
    (11, '고차방정식', 60, 65, 'equations-inequalities', 'common-math-1'),
    (12, '연립방정식', 66, 69, 'equations-inequalities', 'common-math-1'),
    (13, '일차부등식', 70, 75, 'equations-inequalities', 'common-math-1'),
    (14, '이차부등식', 76, 81, 'equations-inequalities', 'common-math-1'),
    (15, '평면좌표', 82, 87, 'coordinate-geometry-equations', 'common-math-2'),
    (16, '직선의 방정식', 88, 95, 'coordinate-geometry-equations', 'common-math-2'),
]

def decode_fractions(text):
    def repl(m):
        raw = m.group(1).replace('`', '')
        if len(raw) >= 2:
            d = raw[0]
            n = raw[1:]
            for k, v in SHIFT_NUM_MAP.items():
                n = n.replace(k, v)
                d = d.replace(k, v)
            return f'\\frac{{{n}}}{{{d}}}'
        return m.group(0)
    return re.sub(r';([^;]+);', repl, text)

def clean_math_text(text):
    if not text:
        return ''
    t = text.replace('¤', '^2').replace('‹', '^3').replace('›', '^4')
    t = t.replace('«', '^n').replace('μ', '^m')
    t = t.replace('`', '')
    t = t.replace('⋯⋯', '...')
    t = decode_fractions(t)
    return t.strip()

def parse_solution_book(sol_path):
    doc_sol = fitz.open(sol_path)
    ch_answers = {c: {} for c in range(1, 17)}
    ch_expls = {c: {} for c in range(1, 17)}

    current_ch = 1

    for pno, page in enumerate(doc_sol):
        txt = page.get_text()

        # Check if chapter header appears on this page
        m_ch = re.search(r'유형\s*\n\s*([^\n]+)\s*\n\s*(\d{2})', txt)
        if m_ch:
            current_ch = int(m_ch.group(2))

        # 1. Parse answer table
        lines = [l.strip() for l in txt.split('\n') if l.strip()]
        for line in lines:
            m_ans = re.match(r'^(\d{2})\s+([①②③④⑤]|-?\d+|[^\n]+)$', line)
            if m_ans:
                q_num = int(m_ans.group(1))
                val = m_ans.group(2).strip()
                if len(val) <= 25 and not any(k in val for k in ['A+B', 'A-B', '따라서', '이므로', '이차항', '대입하면', '짱쉬운유형', '본문']):
                    ch_answers[current_ch][q_num] = val

        # 2. Parse problem explanations
        cur_q = None
        cur_lines = []
        for line in lines:
            if line in ['기본문제다지기', '기출문제맛보기', '예상문제도전하기', '정답및풀이', '유형']:
                continue
            m_expl = re.match(r'^(\d{2})\s+(.+)$', line)
            # Differentiate explanation start from answer key (explanation is longer or has math/formula)
            if m_expl and len(m_expl.group(2)) > 3 and not re.match(r'^[①②③④⑤]$', m_expl.group(2)) and not '본문' in m_expl.group(2):
                q_num = int(m_expl.group(1))
                if cur_q is not None and cur_lines:
                    prev_expl = ch_expls[current_ch].get(cur_q, '')
                    new_part = '\n'.join(cur_lines).strip()
                    ch_expls[current_ch][cur_q] = (prev_expl + '\n' + new_part).strip() if prev_expl else new_part
                cur_q = q_num
                cur_lines = [m_expl.group(2)]
            elif cur_q is not None:
                cur_lines.append(line)

        if cur_q is not None and cur_lines:
            prev_expl = ch_expls[current_ch].get(cur_q, '')
            new_part = '\n'.join(cur_lines).strip()
            ch_expls[current_ch][cur_q] = (prev_expl + '\n' + new_part).strip() if prev_expl else new_part

    return ch_answers, ch_expls

def extract_choices(text):
    # Matches ①... ②... ③... ④... ⑤...
    choices = []
    pattern = r'([①②③④⑤])\s*([^\n①②③④⑤]+)'
    found = re.findall(pattern, text)
    if len(found) >= 5:
        # Sort by circled symbol order
        sorted_found = sorted(found, key=lambda x: CIRCLED_MAP.get(x[0], 0))
        return [clean_math_text(c[1].strip()) for c in sorted_found[:5]]
    return []

def parse_main_book(main_path, ch_answers, ch_expls):
    doc_main = fitz.open(main_path)
    all_problems = []

    for ch_num, ch_name, start_p, end_p, unit_id, subj_id in CHAPTERS:
        current_section = '기본문제다지기'

        # Chapter problem pages are start_p + 1 to end_p (start_p is concept page)
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
                if '기본문제다지기' in txt:
                    current_section = '기본문제다지기'
                    continue
                elif '기출문제맛보기' in txt:
                    current_section = '기출문제맛보기'
                    continue
                elif '예상문제도전하기' in txt:
                    current_section = '예상문제도전하기'
                    continue

                m_num = re.match(r'^(\d{2})$', txt)
                if m_num:
                    if cur_q:
                        q_raw_list.append(cur_q)
                    cur_q = {
                        'q_num': int(m_num.group(1)),
                        'section': current_section,
                        'blocks': []
                    }
                elif cur_q:
                    cur_q['blocks'].append(txt)

            if cur_q:
                q_raw_list.append(cur_q)

            # Process each raw question on this page
            for raw_q in q_raw_list:
                q_num = raw_q['q_num']
                section = raw_q['section']
                blocks_text = raw_q['blocks']

                source_tag = ''
                question_lines = []
                choices = []

                full_block_str = '\n'.join(blocks_text)

                # Check if there is an exam source tag like '2017학년도교육청'
                for b_str in blocks_text:
                    m_src = re.search(r'(\d{4}학년도\s*교육청|\d{4}학년도\s*평가원|\d{4}학년도\s*수능)', b_str)
                    if m_src:
                        source_tag = m_src.group(1).replace(' ', '')
                    elif '①' in b_str and '②' in b_str:
                        ch_list = extract_choices(b_str)
                        if ch_list:
                            choices = ch_list
                    elif '①' in b_str or '②' in b_str or '③' in b_str or '④' in b_str or '⑤' in b_str:
                        ch_list = extract_choices(b_str)
                        if ch_list:
                            choices.extend(ch_list)
                    else:
                        question_lines.append(b_str)

                # If choices not cleanly extracted from individual blocks, try full_block_str
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

                # Clean up question text
                q_text = '\n'.join(question_lines).strip()
                # Remove choices from question text if they leaked in
                q_text = re.sub(r'①[\s\S]+$', '', q_text).strip()
                q_text = clean_math_text(q_text)

                # Format common mathematical expressions with LaTeX $
                def format_math_exprs(text):
                    # Wrap A = ... or B = ...
                    text = re.sub(r'([A-Z]\s*=\s*[0-9a-zA-Z\^\+\-\s]+(?:\s*[\+\-]\s*[0-9a-zA-Z\^\+\-\s]+)*)', r'$\1$', text)
                    # Wrap single variable polynomial terms like 3x^2 - 5x + 7
                    text = re.sub(r'(?<!\$)([0-9]*[a-zA-Z]\^[0-9]+(?:\s*[\+\-]\s*[0-9]*[a-zA-Z](?:\^[0-9]+)?)*(?:\s*[\+\-]\s*[0-9]+)?)(?!\$)', r'$\1$', text)
                    return text

                q_text_formatted = format_math_exprs(q_text)

                # Answer lookup
                raw_ans = ch_answers[ch_num].get(q_num, '')
                ans_idx = None
                ans_value = raw_ans

                for sym, idx in CIRCLED_MAP.items():
                    if sym in raw_ans:
                        ans_idx = idx
                        ans_value = str(idx)
                        break

                # Explanation lookup
                expl = ch_expls[ch_num].get(q_num, '')
                cleaned_expl = clean_math_text(expl)
                if cleaned_expl and not cleaned_expl.startswith('$'):
                    # Wrap formulas in explanation
                    cleaned_expl = format_math_exprs(cleaned_expl)

                # Format source label
                sec_badge = '기본개념' if section == '기본문제다지기' else ('학평기출' if section == '기출문제맛보기' else '실전예상')
                if source_tag:
                    source_label = f'{source_tag} (고1) · {q_num}번 [{sec_badge}]'
                else:
                    source_label = f'짱쉬운 고1 수학(상) {ch_num:02d}단원 · {q_num}번 [{sec_badge}]'

                prob_id = f'jjangeasy-sang-{ch_num:02d}-{q_num:02d}'
                prob_type = 'multiple_choice' if len(choices) == 5 else 'subjective'

                problem_obj = {
                    'id': prob_id,
                    'chapter': ch_num,
                    'chapterName': ch_name,
                    'problemNumber': q_num,
                    'number': q_num,
                    'subjectId': subj_id,
                    'unitId': unit_id,
                    'tier': 'basic',
                    'grade': 'g1',
                    'points': 2 if section == '기본문제다지기' else 3,
                    'type': prob_type,
                    'section': section,
                    'sourceLabel': source_label,
                    'question': q_text_formatted,
                    'choices': formatted_choices,
                    'answer': ans_value,
                    'correctAnswer': ans_idx if ans_idx is not None else ans_value,
                    'explanation': cleaned_expl,
                    'category': 'csat'
                }
                all_problems.append(problem_obj)

    return all_problems

if __name__ == '__main__':
    main_pdf = r'D:\수학\18짱쉬운+수학(상)+본문_학생용.pdf'
    sol_pdf = r'D:\수학\18짱쉬운+_+수학(상)+_+해설.pdf'

    print('Parsing solution book...')
    ch_answers, ch_expls = parse_solution_book(sol_pdf)

    print('Parsing main student book...')
    problems = parse_main_book(main_pdf, ch_answers, ch_expls)

    out_path = 'app/data/csatCommonMathProblemCatalog.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)

    print(f'Done! Successfully extracted {len(problems)} problems into {out_path}.')
