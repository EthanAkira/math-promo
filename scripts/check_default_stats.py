import json
import re

with open('app/data/csatGrade1NationalMockCatalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

default_count = 0
sess_stats = {}
for item in catalog:
    s = item['sessionKey']
    is_def = '다음 조건을 만족시키는 값을 구하시오' in item['question']
    if is_def:
        default_count += 1
    sess_stats[s] = sess_stats.get(s, 0) + (1 if is_def else 0)

print(f"Total items: {len(catalog)}, Items with default text: {default_count}")
print(f"Default text by session: {sess_stats}")
