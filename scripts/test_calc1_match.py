import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import re

with open('app/data/csatRateDatabase.json', 'r', encoding='utf-8') as f:
    rates_db = json.load(f)

with open('app/data/csatCalculus1BasicCatalog.json', 'r', encoding='utf-8') as f:
    calc1 = json.load(f)

def match_rate(item):
    src = item.get('sourceLabel', '')
    # patterns like: "2015학년도 수능 · 9번"
    # "2017학년도 모의평가 · 11번"
    # "2017학년도교육청 (고1) · 8번"
    m_yr = re.search(r'(\d{4})학년도|\b(20\d{2})\b', src)
    if not m_yr:
        return None
    year = m_yr.group(1) or m_yr.group(2)
    
    # problem number: · 9번 or #09 or 9번
    m_num = re.search(r'[·#\s](\d{1,2})번?', src)
    if not m_num:
        m_num = re.search(r'(\d{1,2})번', src)
    num = str(int(m_num.group(1))) if m_num else str(item.get('problemNumber', ''))
    
    # examType: 수능 -> nov, 9월 -> sept, 6월 -> june, 모의평가 -> nov/sept/june
    exam_types = []
    if '9월' in src:
        exam_types = ['sept']
    elif '6월' in src:
        exam_types = ['june']
    elif '수능' in src:
        exam_types = ['nov']
    elif '모의평가' in src or '학평' in src or '교육청' in src:
        exam_types = ['nov', 'june', 'sept']
    else:
        exam_types = ['nov', 'june', 'sept']
        
    # Check in rates_db
    # Candidate years: year, int(year)+1, int(year)-1
    candidate_years = [year, str(int(year)+1), str(int(year)-1)]
    
    for y in candidate_years:
        if y not in rates_db:
            continue
        y_data = rates_db[y]
        for et in exam_types:
            if et not in y_data:
                continue
            e_data = y_data[et]
            # search across all subject papers
            for sub_key, paper in e_data.items():
                if num in paper:
                    entry = paper[num]
                    return {
                        'matched_year': y,
                        'matched_exam': et,
                        'matched_sub': sub_key,
                        'num': num,
                        'correctRate': entry.get('correctRate'),
                        'errorRate': entry.get('errorRate'),
                        'choiceRatios': entry.get('choiceRatios'),
                        'rank': entry.get('rank')
                    }
    return None

matched_count = 0
unmatched = []

for item in calc1:
    src = item.get('sourceLabel', '')
    if any(w in src for w in ['수능', '모의평가', '학평', '학년도']):
        res = match_rate(item)
        if res:
            matched_count += 1
            if matched_count <= 5:
                print(f"MATCH: [{item['id']}] '{src}' -> {res['matched_year']} {res['matched_exam']} {res['matched_sub']} #{res['num']} : 정답률 {res['correctRate']}%")
        else:
            unmatched.append((item['id'], src))

print(f"\nTotal exam items in calc1: {matched_count + len(unmatched)}")
print(f"Successfully matched: {matched_count}")
print(f"Unmatched: {len(unmatched)}")
if unmatched[:5]:
    print("Unmatched samples:")
    for pid, s in unmatched[:5]:
        print(f"  [{pid}] '{s}'")
