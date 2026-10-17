# -*- coding: utf-8 -*-
"""Shared helpers for the 마플 수능기출 미적분Ⅰ (2017) import pipeline."""
import os, sys, io, json
sys.stdout.reconfigure(encoding='utf-8')

PDF_Q = r'E:\마플 교과서 미적분1 2017.pdf'
PDF_S = r'E:\마플 교과서 미적분1 2017 풀이와 정답.pdf'
CACHE = os.environ.get('MARPLE_CACHE', r'C:\Users\akihi\marple_cache')
TESS = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.makedirs(CACHE, exist_ok=True)

def cache_path(name):
    return os.path.join(CACHE, name)

def load_json(name):
    with open(cache_path(name), encoding='utf-8') as f:
        return json.load(f)

def save_json(name, obj):
    with open(cache_path(name), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False)
