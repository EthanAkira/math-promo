import urllib.request
import re

url = 'https://illumialab.com/csat/units'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        js_files = re.findall(r'/_next/static/chunks/[^"]+\.js', content)
        print(f"Found {len(js_files)} JS chunk files in page.")
        for js in js_files:
            js_url = 'https://illumialab.com' + js
            with urllib.request.urlopen(urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})) as js_resp:
                js_content = js_resp.read().decode('utf-8', errors='ignore')
                brands = re.findall(r'짱중요한유형|짱쉬운|실력정석', js_content)
                rates = re.findall(r'정답률', js_content)
                if len(brands) > 0 or len(rates) > 0:
                    print(f"{js}: brands={len(brands)}, rates={len(rates)}")
except Exception as e:
    print("Error:", e)
