import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def parse_haeseol(raw_path, prefix="유제"):
    with open(raw_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Sort pages in ascending book order.
    # Note: data pages are stored in PDF scan order.
    # For solution files, let's look at the problem numbers on each page.
    # We can concatenate text or process page by page.
    # Because OCR can split problems across page boundaries, concatenating consecutive pages by chapter is cleanest.
    
    # Sort by chapter if we can, or concatenate all pages that belong to the solution
    # Notice: In the PDF, earlier pages have 15단원, later pages have 1단원 (reverse order)
    # So sorting data by pdf_page descending gives logical 1단원 -> 15단원 order!
    
    sorted_pages = sorted(data, key=lambda x: x['pdf_page'], reverse=True)
    full_text = "\n".join([p['full_text'] for p in sorted_pages])
    
    # Clean OCR noise
    # Problem header pattern: e.g. "1-1.", " 15-10." or "[1-1]" or "1-1 " at line start
    # Let's find matches: r'(?:^|\n)\s*(\d{1,2}\s*[-–—]\s*\d{1,2})\s*[\.|\)]?'
    pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
    
    matches = list(pattern.finditer(full_text))
    print(f"[{prefix}] Found {len(matches)} problem anchors")
    
    problems = {}
    for i, m in enumerate(matches):
        ch = int(m.group(1))
        num = int(m.group(2))
        key = f"{ch}-{num}"
        
        # Valid chapters are 1 ~ 15
        if not (1 <= ch <= 15):
            continue
            
        start_idx = m.end()
        end_idx = matches[i+1].start() if i + 1 < len(matches) else len(full_text)
        
        expl_text = full_text[start_idx:end_idx].strip()
        
        # Avoid overriding with shorter false match
        if key not in problems or len(expl_text) > len(problems[key]['explanation']):
            problems[key] = {
                'chapter': ch,
                'number': num,
                'key': key,
                'explanation': expl_text[:2000] # reasonable limit
            }
            
    print(f"[{prefix}] Extracted {len(problems)} unique problems across chapters 1-15")
    return problems

yuje_dict = parse_haeseol('scripts/ocr_cache/yuje_haeseol_raw.json', '유제')
yeonseup_dict = parse_haeseol('scripts/ocr_cache/yeonseup_haeseol_raw.json', '연습문제')

# Check distribution per chapter
for ch in range(1, 16):
    y_count = sum(1 for k in yuje_dict if yuje_dict[k]['chapter'] == ch)
    e_count = sum(1 for k in yeonseup_dict if yeonseup_dict[k]['chapter'] == ch)
    print(f"Chapter {ch:02d}: 유제 {y_count}개, 연습문제 {e_count}개")
