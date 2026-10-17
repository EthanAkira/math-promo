import json
import glob
import os
import re

BRAND_REPLACEMENTS = [
    (re.compile(r'짱중요한유형\s*(?:수학[ⅠⅡI12]|미적분[ⅠⅡ12]|확률과\s*통계|기하와\s*벡터)?\s*', re.IGNORECASE), '수능·평가원 기출 핵심유형 '),
    (re.compile(r'짱중요한\s*(?:유형)?\s*', re.IGNORECASE), '수능·평가원 기출 '),
    (re.compile(r'짱쉬운\s*(?:고[123]\s*)?(?:수학(?:\([상하]\))?|미적분[12]?|기하와\s*벡터)?\s*', re.IGNORECASE), '평가원·학력평가 기출 '),
    (re.compile(r'(?:기본정석|실력정석)\s*(?:수[12]|수학[12ⅠⅡ]|미적분[ⅠⅡ12]?|기하와\s*벡터|적분과\s*통계)?\s*', re.IGNORECASE), '수능·평가원 기출 유형 '),
    (re.compile(r'마플\s*(?:수능기출)?\s*', re.IGNORECASE), '수능·평가원 기출 '),
    (re.compile(r'\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*', re.IGNORECASE), ''),
    (re.compile(r'\*\*\s*\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*\*\*\s*', re.IGNORECASE), ''),
    (re.compile(r'\s*[（(]\s*(?:RPM|짱쉬운|짱중요한|마더텅|자이스토리|쎈|블랙라벨)\b[^）)]*[）)]', re.IGNORECASE), ''),
    (re.compile(r'\[\s*(?:RPM|기본문제\s*\(짱쉬운\s*유형별\)|짱쉬운\s*유형별)\s*\]', re.IGNORECASE), '[기출 기본]'),
    (re.compile(r'\b(?:RPM|쎈|블랙라벨|마더텅|자이스토리)\b', re.IGNORECASE), ''),
]

def clean_text(text):
    if not isinstance(text, str):
        return text
    res = text
    for pat, repl in BRAND_REPLACEMENTS:
        res = pat.sub(repl, res)
    return res.strip()

def clean_obj(obj):
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            if k == 'id':
                new_obj[k] = v  # preserve id for URL/state stability
            else:
                new_obj[k] = clean_obj(v)
        return new_obj
    elif isinstance(obj, list):
        return [clean_obj(item) for item in obj]
    elif isinstance(obj, str):
        return clean_text(obj)
    else:
        return obj

def main():
    json_files = glob.glob('app/data/*.json')
    total_cleaned = 0
    for path in json_files:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            continue
        
        cleaned_data = clean_obj(data)
        
        # Check if changed
        orig_str = json.dumps(data, ensure_ascii=False)
        clean_str = json.dumps(cleaned_data, ensure_ascii=False)
        if orig_str != clean_str:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(cleaned_data, f, ensure_ascii=False, indent=2)
            print(f"Cleaned {os.path.basename(path)}")
            total_cleaned += 1
    
    print(f"Total files updated: {total_cleaned}")

if __name__ == '__main__':
    main()
