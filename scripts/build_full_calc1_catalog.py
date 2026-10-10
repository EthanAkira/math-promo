# -*- coding: utf-8 -*-
"""
Merges and validates all 15 chapters (374 problems) of 짱쉬운 미적분 1.
Saves to app/data/csatCalculus1BasicCatalog.json.
"""

import json
import os

from calc1_chapters_1_5 import get_ch1_to_ch5
from calc1_chapters_6_10 import get_ch6_to_ch10
from calc1_chapters_11_15 import get_ch11_to_ch15
from build_calculus1_catalog import ANSWERS

def main():
    p1_5 = get_ch1_to_ch5()
    p6_10 = get_ch6_to_ch10()
    p11_15 = get_ch11_to_ch15()

    all_probs = p1_5 + p6_10 + p11_15
    print(f"Total problems collected: {len(all_probs)}")
    assert len(all_probs) == 374, f"Expected 374 problems, got {len(all_probs)}"

    # Validation
    for p in all_probs:
        ch = p['chapter']
        num = p['problemNumber']
        expected_ans = ANSWERS[ch][num - 1]
        
        if p['type'] == 'multiple_choice':
            assert len(p['choices']) == 5, f"Problem {p['id']} choices length != 5"
            c_idx = p['correctAnswer']
            assert 0 <= c_idx <= 4, f"Problem {p['id']} invalid c_idx {c_idx}"
            assert str(c_idx + 1) == expected_ans, f"Problem {p['id']} answer mismatch: expected {expected_ans}, got {c_idx+1}"
        else:
            assert p['type'] == 'subjective', f"Problem {p['id']} invalid type"
            assert len(p['choices']) == 0, f"Subjective problem {p['id']} has choices"
            # Subjective answer value matches expected_ans
            assert str(p['correctAnswer']) == expected_ans or p['answer'] == expected_ans, f"Subjective {p['id']} answer mismatch"

    out_path = 'app/data/csatCalculus1BasicCatalog.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(all_probs, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved {len(all_probs)} validated problems to {out_path}!")

if __name__ == '__main__':
    main()
