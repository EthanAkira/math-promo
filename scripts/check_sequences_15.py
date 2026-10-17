import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('app/data/csatExtendedTaxonomy.json', 'r', encoding='utf-8') as f:
    tax = json.load(f)

# Find dt-math1-sequences-15
# In csatTaxonomyHelper.js:
# const typeId = `dt-${item.subjectId}-${unitId}-${String(index + 1).padStart(2, '0')}`;
print("Listing all detailedTypes for sequences:")
for idx, dt in enumerate(tax['detailedTypes']):
    # index + 1
    typeId = f"dt-{dt['subjectId']}-sequences-{str(idx + 1).zfill(2)}"
    if dt['subjectId'] == 'math1' and dt['majorUnit'] == '수열':
        tid = f"dt-math1-sequences-{str(idx + 1).zfill(2)}"
        print(f"Index {idx+1}: typeId={tid}, middleUnit={dt['middleUnit']}, detailedType={dt['detailedType']}, keywords={dt.get('keywords', [])}")
