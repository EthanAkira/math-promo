'use client';

import { useEffect, useState } from 'react';
import LatexMath from './LatexMath';
import InteractiveProblemCard from './InteractiveProblemCard';
import { getExamFullText, clearCustomExams } from '../data/sampleExams';
import { sanitizePublicText } from '../publicText';
import { decodeHwpPua, cleanCsatProblemText } from '../utils/hwpPuaDecoder';

const CHOICE_SYMBOLS = ['①', '②', '③', '④', '⑤'];

// Client-side PDF full-text extractor using CDN pdf.js
export async function extractTextFromPdf(pdfSource) {
  if (typeof window === 'undefined') return '';
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        resolve();
      };
      script.onerror = () => reject(new Error('PDF 라이브러리를 로드하지 못했습니다.'));
      document.head.appendChild(script);
    });
  }

  let docPromise;
  if (typeof pdfSource === 'string') {
    docPromise = window.pdfjsLib.getDocument(pdfSource).promise;
  } else if (pdfSource instanceof ArrayBuffer || pdfSource instanceof Uint8Array) {
    docPromise = window.pdfjsLib.getDocument({ data: pdfSource }).promise;
  } else if (pdfSource instanceof Blob) {
    const arrayBuffer = await pdfSource.arrayBuffer();
    docPromise = window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } else {
    return '';
  }

  const pdf = await docPromise;
  let fullText = '';
  // CSAT booklets often have 40 pages where pages 21-40 are duplicate 짝수형 booklet.
  // If the PDF has >= 36 pages and starts with 홀수형, we limit to the primary 20 pages
  // (common 1-22 + elective 23-30) to avoid duplicates overwriting earlier questions.
  const maxPages = pdf.numPages >= 36 ? 20 : pdf.numPages;
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item) => decodeHwpPua(item.str));
    fullText += `\n\n--- [Page ${pageNum}] ---\n` + pageStrings.join(' ');
  }
  return decodeHwpPua(fullText);
}

// Browser-side OCR for screenshots and cropped page images. The OCR library is
// loaded only when an image is selected, so normal page loads stay lightweight.
export async function extractTextFromImage(imageFile, onProgress) {
  if (typeof window === 'undefined' || !imageFile) return '';
  if (!window.Tesseract) {
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-exam-ocr="tesseract"]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error('OCR 모듈을 불러오지 못했습니다.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.dataset.examOcr = 'tesseract';
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('OCR 모듈을 불러오지 못했습니다.'));
      document.head.appendChild(script);
    });
  }
  const result = await window.Tesseract.recognize(imageFile, 'eng+kor', {
    logger: (message) => {
      if (message.status === 'recognizing text' && onProgress) onProgress(Math.round((message.progress || 0) * 100));
    },
  });
  return result?.data?.text || '';
}

function prepareForReview(problems, source = 'text') {
  return problems.map((problem) => ({
    ...problem,
    unit: sanitizePublicText(problem.unit),
    question: sanitizePublicText(problem.question),
    choices: (problem.choices || []).map((choice) => sanitizePublicText(choice)),
    explanation: sanitizePublicText(problem.explanation),
    sourceLabel: sanitizePublicText(problem.sourceLabel),
    reviewStatus: 'needs-review',
    importSource: source,
  }));
}

function problemIssues(problem) {
  const issues = [];
  if (!String(problem.question || '').trim()) issues.push('문제 내용 없음');
  if (problem.type === 'multiple_choice') {
    if (!Array.isArray(problem.choices) || problem.choices.length !== 5) issues.push(`선택지 ${problem.choices?.length || 0}개`);
    if ((problem.choices || []).some((choice) => !String(choice || '').trim())) issues.push('빈 선택지');
    const answer = Number(problem.correctAnswer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= (problem.choices?.length || 0)) issues.push('정답 확인 필요');
  }
  return issues;
}

// Intelligent parser recognizing entire 1~30 question exams at once
export function parseExamText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // 1. Normalize line endings and remove page header/footer markers
  let text = decodeHwpPua(rawText).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  text = text.replace(/---\s*\[Page\s*\d+\]\s*---/gi, '\n');

  // Clean noise and headers common in competition PDFs (AoPS, MAA headers, page numbers)
  text = text.replace(/http:\/\/www\.artofproblemsolving\.com\/[^\n]*/gi, '');
  text = text.replace(/This\s+f\S+le\s+was\s+downloaded[^\n]*/gi, '');
  text = text.replace(/(?:^|\n)\s*USA\s*\n\s*AMC\s*(?:8|10|12)[^\n]*\n\s*\d{4}\s*(?=\n)/gi, '\n');
  text = text.replace(/(?:^|\n)\s*\d{4}\s*AMC\s*(?:8|10|12)[A-B]?\s*Problems\s*\d*\s*(?=\n)/gi, '\n');

  // Clean KICE CSAT copyright/exam headers
  text = text.replace(/이\s*문제(?:지)?에\s*관한\s*저작권은\s*한국교육과정평가원에\s*있습니다\.?/gi, '');
  text = text.replace(/(?:^|\n)\s*(?:홀수형|짝수형)[^\n]*/gi, '\n');
  text = text.replace(/(?:^|\n)\s*\d{4}학년도\s*대학수학능력시험[^\n]*/gi, '\n');
  text = text.replace(/(?:^|\n)\s*제\s*2\s*교시\s*수학\s*영역[^\n]*/gi, '\n');
  text = text.replace(/(?:^|\n)\s*5\s*지선다형[^\n]*/gi, '\n');
  text = text.replace(/(?:^|\n)\s*단답형[^\n]*/gi, '\n');

  // 2. Global Answer Key table detection (e.g., [정답표], Answer Key:)
  const answerMap = new Map();
  const ansKeyMatch = text.match(/(?:\[?\s*(?:정답표|정답\s*모음|Answer\s*Key|Answers)\s*\]?[:\n])([\s\S]+)$/i);
  if (ansKeyMatch) {
    const ansTableText = ansKeyMatch[1];
    const tableRegex = /(?:^|\s)(\d{1,2})[\.:\s\-]+(?:\(?([①②③④⑤1-5A-Ea-e])\)?|(\d+))/g;
    let tMatch;
    while ((tMatch = tableRegex.exec(ansTableText)) !== null) {
      const pNum = parseInt(tMatch[1], 10);
      const choiceChar = tMatch[2];
      const intVal = tMatch[3];
      if (choiceChar) {
        let idx = 0;
        if (['①', '1', 'A', 'a'].includes(choiceChar)) idx = 0;
        else if (['②', '2', 'B', 'b'].includes(choiceChar)) idx = 1;
        else if (['③', '3', 'C', 'c'].includes(choiceChar)) idx = 2;
        else if (['④', '4', 'D', 'd'].includes(choiceChar)) idx = 3;
        else if (['⑤', '5', 'E', 'e'].includes(choiceChar)) idx = 4;
        answerMap.set(pNum, { type: 'mc', value: idx });
      } else if (intVal) {
        answerMap.set(pNum, { type: 'subjective', value: parseInt(intVal, 10) });
      }
    }
  }

  // 3. Global Solutions section detection (e.g., [해설], Solutions:)
  const solutionMap = new Map();
  const solSectionMatch = text.match(/(?:\[?\s*(?:해설|풀이|Solutions?)\s*\]?[:\n])([\s\S]+)$/i);
  if (solSectionMatch && !ansKeyMatch) {
    const solText = solSectionMatch[1];
    const solSplits = solText.split(/(?=(?:^|\n)\s*(?:\[?\s*(?:문제\s*)?\d+\s*\]?|\d+\s*[\.\)]|\bProblem\s+\d+\b))/i);
    solSplits.forEach((sBlock) => {
      const sNumMatch = sBlock.match(/(?:\[?\s*(?:문제\s*)?(\d+)\s*\]?|(\d+)\s*[\.\)]|\bProblem\s+(\d+)\b)/i);
      if (sNumMatch) {
        const sNum = parseInt(sNumMatch[1] || sNumMatch[2] || sNumMatch[3], 10);
        solutionMap.set(sNum, sBlock.trim());
      }
    });
  }

  let examBody = text;
  if (ansKeyMatch) {
    examBody = text.slice(0, ansKeyMatch.index);
  }

  // 4. Match all problem starts across the entire exam file
  const dottedRegex = /(?:^|\n)\s*(?:\[\s*문제\s*(\d{1,2})\s*\]|【\s*문제\s*(\d{1,2})\s*】|\bProblem\s+(\d{1,2})[\.:]?|\bProb\s*(\d{1,2})[\.:]?|\b문\s*(\d{1,2})[\.:]|\b문제\s*(\d{1,2})[\.:]?|(\d{1,2})\s*번[\.:]?|(\d{1,2})\s*[\.\)]\s+)/gi;
  const combinedRegex = /(?:^|\n)\s*(?:\[\s*문제\s*(\d{1,2})\s*\]|【\s*문제\s*(\d{1,2})\s*】|\bProblem\s+(\d{1,2})[\.:]?|\bProb\s*(\d{1,2})[\.:]?|\b문\s*(\d{1,2})[\.:]|\b문제\s*(\d{1,2})[\.:]?|(\d{1,2})\s*번[\.:]?|(\d{1,2})\s*[\.\)]\s+|(?<=^|\n)\s*([1-9]|[12]\d|30)\s+(?=[A-Z가-힣\"“\$\\\(]))/gi;

  const INSTRUCTION_KEYWORDS = [
    'DO NOT OPEN', 'twenty-five question', 'answer form', 'penalty for guessing',
    'scratch paper', 'drawn to scale', 'before beginning the test', 'minutes to complete',
    'finish the exam', 'sign your name', 'proctor', 'blackened circles',
    'administer this exam', "teachers' manual", 'rules and instructions', 'certification form'
  ];

  function isInstructionSnippet(snippet) {
    const s = (snippet || '').toLowerCase();
    return INSTRUCTION_KEYWORDS.some((kw) => s.includes(kw.toLowerCase()));
  }

  function collectMatches(regex) {
    const arr = [];
    let m;
    while ((m = regex.exec(examBody)) !== null) {
      const pNum = parseInt(m[1] || m[2] || m[3] || m[4] || m[5] || m[6] || m[7] || m[8] || m[9], 10);
      if (pNum >= 1 && pNum <= 30) {
        const snippet = examBody.slice(m.index, m.index + 120);
        if (!isInstructionSnippet(snippet)) {
          arr.push({ index: m.index, pNum });
        }
      }
    }
    arr.sort((a, b) => a.index - b.index);
    return arr;
  }

  // Extract all distinct problem numbers (handles booklet permutations, columns & standard sequence)
  function extractBookletAwareProblems(candidates) {
    if (!candidates || candidates.length === 0) return [];
    const chunksByNum = new Map();

    for (let i = 0; i < candidates.length; i++) {
      const start = candidates[i].index;
      const end = i + 1 < candidates.length ? candidates[i + 1].index : examBody.length;
      const chunk = examBody.slice(start, end).trim();
      const pNum = candidates[i].pNum;
      const hasChoices = /\([A-E]\)|[①②③④⑤]/.test(chunk);
      const existing = chunksByNum.get(pNum);
      const existingHasChoices = existing ? /\([A-E]\)|[①②③④⑤]/.test(existing) : false;

      if (!existing) {
        chunksByNum.set(pNum, chunk);
      } else if (hasChoices && !existingHasChoices) {
        chunksByNum.set(pNum, chunk);
      } else if (hasChoices === existingHasChoices && chunk.length > existing.length) {
        chunksByNum.set(pNum, chunk);
      }
    }

    const sortedNums = Array.from(chunksByNum.keys()).sort((a, b) => a - b);
    return sortedNums.map((num) => ({ pNum: num, chunk: chunksByNum.get(num) }));
  }

  // Linear fallback in case booklet extraction finds very few problems
  function extractBestSequence(candidates, maxExpected = 30) {
    let sequences = [];
    let currentSeq = [];
    let lastNum = 0;

    for (let i = 0; i < candidates.length; i++) {
      const cand = candidates[i];
      if (cand.pNum === 1) {
        if (currentSeq.length > 0) sequences.push(currentSeq);
        currentSeq = [cand];
        lastNum = 1;
      } else if (currentSeq.length > 0 && cand.pNum > lastNum && cand.pNum <= lastNum + 3 && cand.pNum <= maxExpected) {
        currentSeq.push(cand);
        lastNum = cand.pNum;
      }
    }
    if (currentSeq.length > 0) sequences.push(currentSeq);
    sequences.sort((a, b) => b.length - a.length);
    return sequences[0] || [];
  }

  const rawDotted = collectMatches(dottedRegex);
  const rawCombined = collectMatches(combinedRegex);
  const bookletDotted = extractBookletAwareProblems(rawDotted);
  const bookletCombined = extractBookletAwareProblems(rawCombined);

  let problemBlocks = [];
  if (bookletCombined.length >= 10 || bookletDotted.length >= 10) {
    problemBlocks = bookletCombined.length >= bookletDotted.length ? bookletCombined : bookletDotted;
  } else {
    const seq = extractBestSequence(rawCombined.length >= rawDotted.length ? rawCombined : rawDotted, 30);
    if (seq.length > 0) {
      for (let i = 0; i < seq.length; i++) {
        const start = seq[i].index;
        const end = i + 1 < seq.length ? seq[i + 1].index : examBody.length;
        const chunk = examBody.slice(start, end).trim();
        if (chunk) problemBlocks.push({ chunk, pNum: seq[i].pNum });
      }
    } else {
      const chunks = examBody.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
      chunks.forEach((c, idx) => problemBlocks.push({ chunk: c, pNum: idx + 1 }));
    }
  }

  const parsedProblems = [];

  problemBlocks.forEach((item, idx) => {
    const trimmed = item.chunk;
    const problemNumber = item.pNum || idx + 1;

    // A. Points: [2점], [3점], [4점], (3점), [6 points]
    const pointsMatch = trimmed.match(/\[\s*(\d+)\s*점\s*\]|\(\s*(\d+)\s*점\s*\)|\[\s*(\d+)\s*points?\s*\]|\(\s*(\d+)\s*points?\s*\)/i);
    const points = pointsMatch ? parseInt(pointsMatch[1] || pointsMatch[2] || pointsMatch[3] || pointsMatch[4], 10) : (problemNumber <= 3 ? 2 : problemNumber >= 14 ? 4 : 3);

    // B. Unit: [수학 I], [미적분], [Algebra], [Geometry], etc.
    const unitMatch = trimmed.match(/\[\s*(수학\s*[I|II|1|2]|미적분|확률과\s*통계|기하|공통수학|Algebra|Geometry|Number\s*Theory|Combinatorics|Counting)[^\]]*\]/i);
    const unit = unitMatch ? unitMatch[0].replace(/[\[\]]/g, '').trim() : '';

    // C. Embedded Answer
    let correctAnswer = 0;
    const ansMatch = trimmed.match(/(?:\[\s*정답\s*\]|정답\s*[:：]|Answer\s*[:：]|Ans\s*[:：])\s*([①②③④⑤1-5A-Ea-e]|\d+)/i);
    if (ansMatch) {
      const char = ansMatch[1];
      if (['①', '1', 'A', 'a'].includes(char)) correctAnswer = 0;
      else if (['②', '2', 'B', 'b'].includes(char)) correctAnswer = 1;
      else if (['③', '3', 'C', 'c'].includes(char)) correctAnswer = 2;
      else if (['④', '4', 'D', 'd'].includes(char)) correctAnswer = 3;
      else if (['⑤', '5', 'E', 'e'].includes(char)) correctAnswer = 4;
      else if (!isNaN(parseInt(char, 10))) correctAnswer = parseInt(char, 10);
    } else if (answerMap.has(problemNumber)) {
      correctAnswer = answerMap.get(problemNumber).value;
    }

    // D. Embedded Explanation
    let explanation = '';
    const expMatch = trimmed.match(/(?:\[\s*(?:해설|풀이)\s*\]|(?:해설|풀이|Solution)\s*[:：])\s*([\s\S]+)$/i);
    if (expMatch) {
      explanation = expMatch[1].trim();
    } else if (solutionMap.has(problemNumber)) {
      explanation = solutionMap.get(problemNumber);
    }

    // E. SVG Figure
    let figureSvg = '';
    const svgMatch = trimmed.match(/<svg[\s\S]+?<\/svg>/i);
    if (svgMatch) {
      figureSvg = svgMatch[0];
    }

    // F. Choices
    let choices = [];
    const choiceBlock = trimmed.split(/(?:\[\s*(?:해설|풀이|정답)\s*\]|(?:해설|풀이|정답|Answer|Ans)\s*[:：])/i)[0];

    // ①~⑤
    if (choiceBlock.includes('①') && choiceBlock.includes('②')) {
      const cParts = choiceBlock.split(/(?:①|②|③|④|⑤)/);
      if (cParts.length >= 6) {
        choices = cParts.slice(1, 6).map((c) => c.trim().replace(/[\n\r]+/g, ' '));
      }
    }
    // (A)~(E)
    else if (choiceBlock.search(/\(A\)[\s\S]*\(B\)/i) !== -1) {
      const cParts = choiceBlock.split(/(?:\([A-E]\))/i);
      if (cParts.length >= 6) {
        choices = cParts.slice(1, 6).map((c) => c.trim().replace(/[\n\r]+/g, ' '));
      }
    }
    // A. B. C. D. E.
    else if (choiceBlock.search(/(?:^|\n|\s)A\.\s+[\s\S]*B\.\s+/i) !== -1) {
      const cParts = choiceBlock.split(/(?:^|\n|\s)[A-E]\.\s+/i);
      if (cParts.length >= 6) {
        choices = cParts.slice(1, 6).map((c) => c.trim().replace(/[\n\r]+/g, ' '));
      }
    }
    // (1)~(5)
    else if (choiceBlock.search(/\(1\)[\s\S]*\(2\)[\s\S]*\(3\)/) !== -1) {
      const cParts = choiceBlock.split(/(?:\([1-5]\))/);
      if (cParts.length >= 6) {
        choices = cParts.slice(1, 6).map((c) => c.trim().replace(/[\n\r]+/g, ' '));
      }
    }

    // G. Question Body
    let qText = choiceBlock;
    qText = qText.replace(/^(?:\[?\s*문제\s*\d+\s*\]?|【\s*문제\s*\d+\s*】|\d+\s*[\.\)]|\bProblem\s+\d+[\.:]?|\bProb\s*\d+[\.:]?|\b문\s*\d+[\.:]|\b문제\s*\d+[\.:]?|\d+\s*번[\.:]?|\d+\s+)/i, '');
    if (pointsMatch) qText = qText.replace(pointsMatch[0], '');
    if (unitMatch) qText = qText.replace(unitMatch[0], '');
    if (svgMatch) qText = qText.replace(svgMatch[0], '');

    if (choices.length > 0) {
      const firstChoiceIdx = choiceBlock.search(/(?:①|\([A-E]\)|\([1-5]\)|(?:^|\n|\s)A\.\s+)/i);
      if (firstChoiceIdx !== -1) {
        qText = choiceBlock.slice(0, firstChoiceIdx);
        qText = qText.replace(/^(?:\[?\s*문제\s*\d+\s*\]?|【\s*문제\s*\d+\s*】|\d+\s*[\.\)]|\bProblem\s+\d+[\.:]?|\bProb\s*\d+[\.:]?|\b문\s*\d+[\.:]|\b문제\s*\d+[\.:]?|\d+\s*번[\.:]?|\d+\s+)/i, '');
        if (pointsMatch) qText = qText.replace(pointsMatch[0], '');
        if (unitMatch) qText = qText.replace(unitMatch[0], '');
      }
    }
    qText = qText.trim();

    const isSubjective = choices.length === 0;

    if (qText || choices.length > 0) {
      parsedProblems.push({
        id: `parsed-p${problemNumber}`,
        number: problemNumber,
        points: points,
        unit: unit || (rawText.includes('AMC') ? 'AMC Competition' : (problemNumber <= 15 ? '수학 I · II' : '선택과목')),
        type: isSubjective ? 'subjective' : 'multiple_choice',
        question: cleanCsatProblemText(qText) || `문제 ${problemNumber}`,
        choices: isSubjective ? [] : choices.map((c) => decodeHwpPua(c)),
        correctAnswer: correctAnswer,
        figureSvg: figureSvg,
        explanation: cleanCsatProblemText(explanation) || '정답 및 상세 풀이가 등록되어 있습니다.',
      });
    }
  });

  return parsedProblems;
}

function ProblemReviewEditor({ problem, onChange, onReview, onRemove, language }) {
  const issues = problemIssues(problem);
  const fieldStyle = {
    width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid var(--paper-line, #d8c9a8)',
    boxSizing: 'border-box', fontSize: '14px', background: '#fff', color: 'var(--ink, #1f2733)',
  };
  const changeChoice = (index, value) => {
    const choices = [...(problem.choices || [])];
    choices[index] = value;
    onChange({ choices });
  };

  return (
    <section style={{ border: `2px solid ${problem.reviewStatus === 'reviewed' ? '#2f6e5c' : issues.length ? '#c23b32' : '#d8c9a8'}`, borderRadius: 14, padding: 18, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <strong style={{ fontSize: 18 }}>문제 {problem.number}</strong>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {issues.length ? <span style={{ color: '#a82828', fontSize: 12, fontWeight: 700 }}>확인: {issues.join(' · ')}</span> : null}
          <label style={{ fontSize: 13, fontWeight: 800, color: problem.reviewStatus === 'reviewed' ? '#2f6e5c' : '#8f2a24' }}>
            <input type="checkbox" checked={problem.reviewStatus === 'reviewed'} onChange={(event) => onReview(event.target.checked)} /> 검수 완료
          </label>
          <button type="button" onClick={onRemove} style={{ border: '1px solid #d99', background: '#fff5f5', color: '#a22', borderRadius: 7, padding: '5px 9px', cursor: 'pointer' }}>삭제</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) minmax(100px, 160px) minmax(90px, 120px)', gap: 10, marginBottom: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 700 }}>단원
          <input value={problem.unit || ''} onChange={(event) => onChange({ unit: event.target.value })} style={fieldStyle} />
        </label>
        <label style={{ fontSize: 12, fontWeight: 700 }}>문제 유형
          <select value={problem.type} onChange={(event) => onChange({ type: event.target.value, choices: event.target.value === 'multiple_choice' ? (problem.choices?.length ? problem.choices : ['', '', '', '', '']) : [] })} style={fieldStyle}>
            <option value="multiple_choice">객관식</option>
            <option value="subjective">주관식</option>
          </select>
        </label>
        <label style={{ fontSize: 12, fontWeight: 700 }}>배점
          <input type="number" min="0" value={problem.points || 0} onChange={(event) => onChange({ points: Number(event.target.value) })} style={fieldStyle} />
        </label>
      </div>

      <label style={{ display: 'grid', gap: 5, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>문제 내용
        <textarea rows={5} value={problem.question || ''} onChange={(event) => onChange({ question: event.target.value })} style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      </label>

      {problem.type === 'multiple_choice' ? (
        <div style={{ display: 'grid', gap: 7, marginBottom: 10 }}>
          {(problem.choices || []).map((choice, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 34px', gap: 6, alignItems: 'center' }}>
              <b>{String.fromCharCode(65 + index)}</b>
              <input value={choice || ''} onChange={(event) => changeChoice(index, event.target.value)} style={fieldStyle} />
              <button type="button" onClick={() => onChange({ choices: problem.choices.filter((_, choiceIndex) => choiceIndex !== index) })} aria-label={`${index + 1}번 선택지 삭제`} style={{ border: 'none', background: '#f4efe6', borderRadius: 6, height: 34, cursor: 'pointer' }}>−</button>
            </div>
          ))}
          <button type="button" onClick={() => onChange({ choices: [...(problem.choices || []), ''] })} style={{ justifySelf: 'start', border: '1px solid #b9ad97', background: '#fbf8f2', borderRadius: 7, padding: '6px 10px', cursor: 'pointer' }}>+ 선택지 추가</button>
          <label style={{ fontSize: 12, fontWeight: 700, maxWidth: 220 }}>정답
            <select value={Number(problem.correctAnswer) || 0} onChange={(event) => onChange({ correctAnswer: Number(event.target.value) })} style={fieldStyle}>
              {(problem.choices || []).map((_, index) => <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>)}
            </select>
          </label>
        </div>
      ) : (
        <label style={{ display: 'grid', gap: 5, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>정답
          <input value={problem.correctAnswer ?? ''} onChange={(event) => onChange({ correctAnswer: event.target.value })} style={fieldStyle} />
        </label>
      )}

      <label style={{ display: 'grid', gap: 5, fontSize: 12, fontWeight: 700 }}>해설
        <textarea rows={3} value={problem.explanation || ''} onChange={(event) => onChange({ explanation: event.target.value })} style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      </label>

      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>학생 화면 미리보기</summary>
        <div style={{ marginTop: 10 }}>
          <InteractiveProblemCard problem={problem} userAnswer={null} onSelectAnswer={() => {}} isExamMode showResult={false} language={language} />
        </div>
      </details>
    </section>
  );
}

export default function AiExamParser({ initialText = '', onSaveToArchive, examType = 'csat', language = 'ko', defaultLevel = '10' }) {
  const [level, setLevel] = useState(defaultLevel || (examType === 'amc' ? '10' : 'csat'));
  const [inputText, setInputText] = useState(initialText || '');
  const [parsedProblems, setParsedProblems] = useState([]);
  const [previewActive, setPreviewActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loadingFile, setLoadingFile] = useState(false);
  const [partialQuestionNumber, setPartialQuestionNumber] = useState(1);

  const getSampleText = (lvl) => getExamFullText(examType, lvl || level);

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      const res = parseExamText(initialText);
      if (res.length > 0) {
        setParsedProblems(prepareForReview(res, 'initial'));
        setPreviewActive(true);
        setStatusMsg(`⚡ 전체 파일에서 총 ${res.length}개 문제를 일괄 인식하여 변환했습니다.`);
      }
    }
  }, [initialText]);

  const handleParse = () => {
    const text = inputText.trim() || getSampleText(level);
    const result = parseExamText(text);
    if (result.length === 0) {
      setStatusMsg('문제를 인식하지 못했습니다. 형식(1., 2., Problem 1, [문제 1])을 확인해주세요.');
      return;
    }
    setParsedProblems(prepareForReview(result));
    setPreviewActive(true);
    setStatusMsg(`🎉 전체 파일에서 총 ${result.length}개 문제를 한 번에 성공적으로 분리·변환했습니다!`);
  };

  const handleLoadSample = (targetLevel) => {
    const lvl = targetLevel || level;
    if (targetLevel) setLevel(targetLevel);
    const text = getExamFullText(examType, lvl);
    setInputText(text);
    const result = parseExamText(text);
    setParsedProblems(prepareForReview(result, 'sample'));
    setPreviewActive(true);
    setStatusMsg(`📝 ${examType.toUpperCase()}${lvl ? ` (${lvl})` : ''} 전체 ${result.length}문항 일괄 샘플 세트가 로드 및 변환되었습니다.`);
  };

  const handleResetToDefault = () => {
    clearCustomExams(examType, level);
    const text = getExamFullText(examType, level);
    setInputText(text);
    const result = parseExamText(text);
    setParsedProblems(prepareForReview(result, 'sample'));
    setPreviewActive(true);
    setStatusMsg(`🔄 공식 ${examType.toUpperCase()} 기본 ${result.length}문항 원본 세트로 복원되었습니다.`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingFile(true);
    setStatusMsg(`⏳ 파일 "${file.name}" 분석 중...`);

    try {
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const extracted = await extractTextFromPdf(file);
        const result = extracted?.trim() ? parseExamText(extracted) : [];
        const expected = examType === 'amc' ? 25 : 30;
        setInputText(extracted || '');
        setParsedProblems(prepareForReview(result, 'pdf'));
        setPreviewActive(result.length > 0);
        setStatusMsg(result.length
          ? `PDF에서 ${result.length}/${expected}문항을 인식했습니다. 누락·선택지를 확인한 뒤 문제별로 수정하세요.`
          : 'PDF에서 텍스트를 인식하지 못했습니다. 스캔본이면 아래 이미지 부분 OCR을 사용하세요.');
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setInputText(content);
          const result = parseExamText(content);
          if (result.length > 0) {
            setParsedProblems(prepareForReview(result, 'text-file'));
            setPreviewActive(true);
            setStatusMsg(`📁 파일 "${file.name}" 에서 총 ${result.length}개 문제를 일괄 변환했습니다!`);
          } else {
            setStatusMsg(`📁 파일 "${file.name}" 을(를) 불러왔습니다. 아래 변환 버튼을 눌러주세요.`);
          }
          setLoadingFile(false);
        };
        reader.readAsText(file);
        return;
      }
    } catch (err) {
      setStatusMsg(`⚠️ 파일 읽기 오류: ${err.message}`);
    } finally {
      setLoadingFile(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setLoadingFile(true);
    let nextNumber = Math.max(1, Number(partialQuestionNumber) || 1);
    const additions = [];
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setStatusMsg(`이미지 OCR ${index + 1}/${files.length}: ${file.name}`);
        const text = await extractTextFromImage(file, (progress) => {
          setStatusMsg(`이미지 OCR ${index + 1}/${files.length}: ${progress}%`);
        });
        const parsed = parseExamText(text);
        const imported = parsed.length > 0 ? parsed : [{
          id: `partial-p${nextNumber}`,
          number: nextNumber,
          points: 0,
          unit: '',
          type: 'multiple_choice',
          question: text.trim(),
          choices: ['', '', '', '', ''],
          correctAnswer: 0,
          explanation: '',
        }];
        prepareForReview(imported, 'image-ocr').forEach((problem, offset) => {
          additions.push({
            ...problem,
            id: `partial-p${nextNumber + offset}`,
            number: nextNumber + offset,
          });
        });
        nextNumber += imported.length;
      }
      setParsedProblems((current) => {
        const replacementNumbers = new Set(additions.map((item) => item.number));
        return [...current.filter((item) => !replacementNumbers.has(item.number)), ...additions].sort((a, b) => a.number - b.number);
      });
      setPreviewActive(true);
      setPartialQuestionNumber(nextNumber);
      setStatusMsg(`${files.length}개 이미지에서 ${additions.length}개 문제를 부분 인식했습니다. 각 문제를 확인하고 수정하세요.`);
    } catch (error) {
      setStatusMsg(`이미지 OCR 오류: ${error.message}`);
    } finally {
      setLoadingFile(false);
      event.target.value = '';
    }
  };

  const updateProblem = (problemNumber, patch) => {
    setParsedProblems((current) => current.map((problem) => (
      problem.number === problemNumber ? { ...problem, ...patch, reviewStatus: 'needs-review' } : problem
    )));
  };

  const markReviewed = (problemNumber, reviewed) => {
    setParsedProblems((current) => current.map((problem) => (
      problem.number === problemNumber ? { ...problem, reviewStatus: reviewed ? 'reviewed' : 'needs-review' } : problem
    )));
  };

  const addBlankProblem = () => {
    const used = new Set(parsedProblems.map((problem) => problem.number));
    let number = 1;
    while (used.has(number)) number += 1;
    setParsedProblems((current) => [...current, {
      id: `manual-p${number}`,
      number,
      points: 0,
      unit: '',
      type: 'multiple_choice',
      question: '',
      choices: ['', '', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      reviewStatus: 'needs-review',
      importSource: 'manual',
    }].sort((a, b) => a.number - b.number));
    setPreviewActive(true);
    setTimeout(() => scrollToProblem(number), 0);
  };

  const removeProblem = (problemNumber) => {
    setParsedProblems((current) => current.filter((problem) => problem.number !== problemNumber));
  };

  const handleSave = () => {
    if (parsedProblems.length === 0) {
      setStatusMsg('저장할 문제가 없습니다.');
      return;
    }
    const invalidNumbers = parsedProblems.filter((problem) => problemIssues(problem).length > 0).map((problem) => problem.number);
    if (invalidNumbers.length > 0) {
      setStatusMsg(`저장 전 수정이 필요한 문제: ${invalidNumbers.join(', ')}번`);
      return;
    }
    const savedProblems = parsedProblems.map(({ reviewStatus, importSource, ...problem }) => problem);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`custom_exam_${examType}`, JSON.stringify(savedProblems));
        if (examType === 'amc') {
          localStorage.setItem(`custom_exam_amc_${level}`, JSON.stringify(savedProblems));
          localStorage.setItem(`custom_exam_${level}`, JSON.stringify(savedProblems));
        } else {
          localStorage.setItem(`custom_exam_csat_${level}`, JSON.stringify(savedProblems));
          localStorage.setItem(`custom_exam_csat_csat`, JSON.stringify(savedProblems));
        }
      } catch (e) {}
    }
    if (onSaveToArchive) {
      onSaveToArchive(savedProblems);
    }
    setStatusMsg(`🎉 전체 ${parsedProblems.length}개 문제가 웹/태블릿 인터랙티브 시험 세트로 즉시 등록되었습니다!`);
  };

  const scrollToProblem = (num) => {
    const el = document.getElementById(`problem-card-${num}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const displayedProblems = parsedProblems.filter((p) => {
    if (filterType === 'mc') return p.type === 'multiple_choice';
    if (filterType === 'subjective') return p.type === 'subjective';
    return true;
  });
  const expectedProblemCount = examType === 'amc' ? 25 : 30;
  const recognizedNumbers = new Set(parsedProblems.map((problem) => Number(problem.number)));
  const missingNumbers = Array.from({ length: expectedProblemCount }, (_, index) => index + 1).filter((number) => !recognizedNumbers.has(number));
  const needsAttentionCount = parsedProblems.filter((problem) => problem.reviewStatus !== 'reviewed' || problemIssues(problem).length > 0).length;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid var(--paper-line, #d8c9a8)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        margin: '24px 0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--ink, #1f2733)' }}>
            ✨ AI 시험지 1개 파일 전체 (전 문항) 일괄 자동 변환기
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft, #718096)', margin: '4px 0 0', lineHeight: 1.5 }}>
            1개 시험지 파일 전체(PDF/TXT/TeX)를 넣으면 <strong>1번부터 25/30번까지의 전 문항</strong>을 AI가 한 번에 인식하여 웹·태블릿 풀이 세트로 자동 생성합니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: '700',
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid var(--paper-line, #d8c9a8)',
              background: '#f4efe6',
              color: 'var(--ink, #1f2733)',
              cursor: loadingFile ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {loadingFile ? '⏳ 추출 중...' : '📂 전체 파일 불러오기 (.pdf, .txt, .tex)'}
            <input type="file" accept=".pdf,.txt,.tex,.latex,.md,.json" onChange={handleFileUpload} disabled={loadingFile} style={{ display: 'none' }} />
          </label>
          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', padding: '5px 8px', border: '1px solid var(--paper-line, #d8c9a8)', borderRadius: 8, background: '#f8fbff' }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>시작 번호
              <input type="number" min="1" max="30" value={partialQuestionNumber} onChange={(event) => setPartialQuestionNumber(event.target.value)} style={{ width: 48, marginLeft: 5, padding: 4 }} />
            </label>
            <label style={{ fontSize: 13, fontWeight: 800, color: '#1d4ed8', cursor: loadingFile ? 'wait' : 'pointer' }}>
              📷 문제별·부분 캡처 OCR
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={loadingFile} style={{ display: 'none' }} />
            </label>
          </div>
          {examType === 'amc' ? (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)' }}>표준 25문항:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('8')}
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line, #d8c9a8)',
                  background: level === '8' ? 'var(--chalk-green, #2f6e5c)' : '#fbf8f2',
                  color: level === '8' ? '#ffffff' : 'var(--ink, #1f2733)',
                  cursor: 'pointer',
                }}
              >
                AMC 8 (25문항)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('10')}
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line, #d8c9a8)',
                  background: level === '10' ? 'var(--chalk-green, #2f6e5c)' : '#fbf8f2',
                  color: level === '10' ? '#ffffff' : 'var(--ink, #1f2733)',
                  cursor: 'pointer',
                }}
              >
                AMC 10 (25문항)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('12')}
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line, #d8c9a8)',
                  background: level === '12' ? 'var(--chalk-green, #2f6e5c)' : '#fbf8f2',
                  color: level === '12' ? '#ffffff' : 'var(--ink, #1f2733)',
                  cursor: 'pointer',
                }}
              >
                AMC 12 (25문항)
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d99',
                  background: '#fff5f5',
                  color: '#b22',
                  cursor: 'pointer',
                }}
                title="localStorage에 저장된 시험을 삭제하고 공식 25문항 세트로 복원합니다."
              >
                🔄 원본 25문항 복원
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleLoadSample('csat')}
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--paper-line, #d8c9a8)',
                  background: '#fbf8f2',
                  cursor: 'pointer',
                }}
              >
                📝 수능 30문항 전체 로드
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d99',
                  background: '#fff5f5',
                  color: '#b22',
                  cursor: 'pointer',
                }}
                title="localStorage에 저장된 시험을 삭제하고 공식 30문항 세트로 복원합니다."
              >
                🔄 원본 30문항 복원
              </button>
            </div>
          )}
        </div>
      </div>

      <textarea
        rows={10}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={`여기에 1개 파일 전체(1번~25/30번 문제 전체) 내용을 붙여넣거나 위의 [📂 전체 파일 불러오기]를 사용하세요.\n\nAI가 1., 2., 3., ... 또는 [문제 1], [문제 2], ... 및 보기(①~⑤/(A)~(E)), 정답표, 해설을 한 번에 전 문항 자동 분리합니다.`}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '1.5px solid var(--paper-line, #d8c9a8)',
          fontSize: '13.5px',
          fontFamily: 'Consolas, Monaco, monospace',
          lineHeight: '1.6',
          marginBottom: '14px',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={handleParse}
          style={{
            fontSize: '14.5px',
            fontWeight: '800',
            padding: '10px 22px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--red, #c23b32) 0%, var(--red-dark, #8f2a24) 100%)',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(194,59,50,0.3)',
          }}
        >
          ✨ 1개 파일 전체 (전 문항) 일괄 분석 및 변환하기
        </button>

        {previewActive && parsedProblems.length > 0 ? (
          <button
            type="button"
            onClick={handleSave}
            style={{
              fontSize: '14.5px',
              fontWeight: '800',
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: '#2f6e5c',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(47,110,92,0.3)',
            }}
          >
            💾 전체 {parsedProblems.length}개 문항 인터랙티브 시험 세트로 저장 및 즉시 배포
          </button>
        ) : null}

        {statusMsg ? (
          <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--blue, #2a5c8a)' }}>
            {statusMsg}
          </span>
        ) : null}
      </div>

      {/* Live Preview Section with Quick Jump Toolbar */}
      {previewActive && parsedProblems.length > 0 ? (
        <div style={{ marginTop: '24px', borderTop: '2px solid var(--paper-line, #d8c9a8)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--ink, #1f2733)' }}>
                👀 일괄 변환 완료 ({parsedProblems.length}개 전체 문항)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft, #718096)', margin: '4px 0 0' }}>
                객관식 {parsedProblems.filter((p) => p.type === 'multiple_choice').length}문항 · 주관식 {parsedProblems.filter((p) => p.type === 'subjective').length}문항 인식됨
              </p>
              <p style={{ fontSize: '13px', color: missingNumbers.length ? '#a82828' : '#2f6e5c', margin: '4px 0 0', fontWeight: 700 }}>
                {parsedProblems.length}/{expectedProblemCount}문항 · 확인 필요 {needsAttentionCount}개
                {missingNumbers.length ? ` · 누락 번호: ${missingNumbers.join(', ')}` : ' · 번호 누락 없음'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setFilterType('all')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line)',
                  background: filterType === 'all' ? 'var(--chalk-green, #2f6e5c)' : '#fff',
                  color: filterType === 'all' ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                전체 ({parsedProblems.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('mc')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line)',
                  background: filterType === 'mc' ? 'var(--chalk-green, #2f6e5c)' : '#fff',
                  color: filterType === 'mc' ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                객관식 ({parsedProblems.filter((p) => p.type === 'multiple_choice').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('subjective')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line)',
                  background: filterType === 'subjective' ? 'var(--chalk-green, #2f6e5c)' : '#fff',
                  color: filterType === 'subjective' ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                주관식 ({parsedProblems.filter((p) => p.type === 'subjective').length})
              </button>
            </div>
          </div>

          <button type="button" onClick={addBlankProblem} style={{ marginBottom: 14, border: '1px solid #2f6e5c', background: '#eef8f3', color: '#215845', borderRadius: 8, padding: '8px 12px', fontWeight: 800, cursor: 'pointer' }}>
            + 누락 문제 직접 추가
          </button>

          {/* Quick Jump Number Palette */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '12px',
              background: 'var(--paper, #f7f3ec)',
              borderRadius: '10px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 800, alignSelf: 'center', marginRight: '6px', color: 'var(--ink-soft)' }}>
              문항 바로가기:
            </span>
            {parsedProblems.map((p) => (
              <button
                key={p.id || p.number}
                type="button"
                onClick={() => scrollToProblem(p.number)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--paper-line, #d8c9a8)',
                  background: '#ffffff',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: 'var(--ink, #1f2733)',
                }}
              >
                {p.number}
              </button>
            ))}
          </div>

          {/* Render All Problems */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {displayedProblems.map((p) => (
              <div key={p.id || p.number} id={`problem-card-${p.number}`}>
                <ProblemReviewEditor
                  problem={p}
                  language={language}
                  onChange={(patch) => updateProblem(p.number, patch)}
                  onReview={(reviewed) => markReviewed(p.number, reviewed)}
                  onRemove={() => removeProblem(p.number)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

