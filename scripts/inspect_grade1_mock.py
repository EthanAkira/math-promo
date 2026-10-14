import fitz
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

DIR = "D:/고1 전국연합"
files = os.listdir(DIR)

for fname in sorted(files):
    if not fname.endswith('.pdf'):
        continue
    fpath = os.path.join(DIR, fname)
    try:
        doc = fitz.open(fpath)
        page_count = len(doc)
        # Check text in first 2 pages
        sample_texts = []
        for i in range(min(3, page_count)):
            txt = doc[i].get_text()
            sample_texts.append(f"Page {i+1}: len={len(txt)}, sample={txt[:150].strip().replace(chr(10), ' ')}")
        print(f"=== {fname} (Pages: {page_count}) ===")
        for s in sample_texts:
            print(f"  {s}")
        doc.close()
    except Exception as e:
        print(f"Error reading {fname}: {e}")
