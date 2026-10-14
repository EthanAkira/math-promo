import os
import glob
import pymupdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== Checking Calculus 2 Files in D: ===")
patterns = ['D:/*미적분2*.pdf', 'D:/*미적분 2*.pdf', 'D:/*미적분Ⅱ*.pdf']
found_files = []
for p in patterns:
    found_files.extend(glob.glob(p))

found_files = list(set(found_files))
for f in found_files:
    doc = pymupdf.open(f)
    print(f"{f}: {len(doc)} pages")
    doc.close()

if not found_files:
    print("Direct pattern search didn't find, listing all pdfs with '미적분':")
    for f in glob.glob('D:/*미적분*.pdf'):
        print(" ", f)
