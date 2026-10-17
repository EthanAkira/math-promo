import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import glob

files = glob.glob('app/data/csat*.json')

total_count = 0
exam_info_count = 0
matched_rate_count = 0
no_rate_samples = []

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list):
        continue
    for item in data:
        total_count += 1
        src = str(item.get('sourceLabel') or '')
        has_rate = (item.get('correctRate') is not None)
        
        # Check if src contains exam info
        if any(k in src for k in ['수능', '학년도', '모의', '전국연합', '평가원', '교육청', '2024', '2025', '2023', '2022', '2021', '2020']):
            exam_info_count += 1
            if has_rate:
                matched_rate_count += 1
            else:
                if len(no_rate_samples) < 30:
                    no_rate_samples.append((item.get('id'), fpath, src, item.get('correctRate')))

print(f'Total: {total_count}, Exam info: {exam_info_count}, With rate: {matched_rate_count}')
print('Sample items with exam info but WITHOUT correctRate:')
for pid, fpath, src, cr in no_rate_samples:
    print(f'  [{pid}] ({fpath}) -> "{src}"')
