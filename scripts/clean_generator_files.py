import glob
import re

files = glob.glob('app/csat/*Generator.js')

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    orig = text
    # Replace commercial names
    text = re.sub(r'짱중요한유형\s*(?:수학[ⅠⅡI12]|미적분[ⅠⅡ12]|확률과\s*통계)?', '수능·평가원 핵심 기출', text)
    text = re.sub(r'짱중요한\s*유형', '수능·평가원 핵심 기출', text)
    text = re.sub(r'짱쉬운\s*(?:고[123]\s*)?(?:수학(?:\([상하]\))?|미적분[12]?|기하와\s*벡터)?', '수능·학력평가 기출 유형', text)
    text = re.sub(r'기본정석\s*(?:수[12]|수학[12ⅠⅡ]|미적분[ⅠⅡ12]?|기하와\s*벡터)?', '수능·평가원 기출 유형', text)
    text = re.sub(r'실력정석\s*(?:수[12]|수학[12ⅠⅡ]|미적분[ⅠⅡ12]?|기하와\s*벡터|적분과\s*통계)?', '수능·평가원 심화 기출 유형', text)
    text = text.replace('기본문제 (짱쉬운 유형별)', '기본 기출 유형')
    text = text.replace('짱쉬운 유형별', '기본 기출 유형')
    text = text.replace('짱쉬운', '기본 기출')
    text = text.replace('짱중요한', '핵심 기출')
    text = text.replace('기본정석', '수능·평가원 기출')
    text = text.replace('실력정석', '수능·평가원 심화 기출')

    if text != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Cleaned {path}")
    else:
        print(f"No changes in {path}")
