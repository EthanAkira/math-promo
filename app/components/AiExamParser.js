'use client';

import { useEffect, useState } from 'react';
import LatexMath from './LatexMath';
import InteractiveProblemCard from './InteractiveProblemCard';

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
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item) => item.str);
    fullText += `\n\n--- [Page ${pageNum}] ---\n` + pageStrings.join(' ');
  }
  return fullText;
}

// Intelligent parser recognizing entire 1~30 question exams at once
export function parseExamText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // 1. Normalize line endings and remove page header/footer markers
  let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  text = text.replace(/---\s*\[Page\s*\d+\]\s*---/gi, '\n');

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
  const markerRegex = /(?:^|\n)\s*(?:\[\s*문제\s*(\d+)\s*\]|【\s*문제\s*(\d+)\s*】|\bProblem\s+(\d+)[\.:]?|\b문\s*(\d+)[\.:]|\b문제\s*(\d+)[\.:]?|(\d+)\s*번[\.:]?|(\d+)\s*[\.\)]\s+)/gi;

  const matches = [];
  let m;
  while ((m = markerRegex.exec(examBody)) !== null) {
    const pNum = parseInt(m[1] || m[2] || m[3] || m[4] || m[5] || m[6] || m[7], 10);
    matches.push({ index: m.index, pNum });
  }

  const problemBlocks = [];
  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? matches[i + 1].index : examBody.length;
      const chunk = examBody.slice(start, end).trim();
      if (chunk) {
        problemBlocks.push({ chunk, pNum: matches[i].pNum });
      }
    }
  } else {
    // Fallback: split by paragraph blocks
    const chunks = examBody.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
    chunks.forEach((c, idx) => problemBlocks.push({ chunk: c, pNum: idx + 1 }));
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
    qText = qText.replace(/^(?:\[?\s*문제\s*\d+\s*\]?|【\s*문제\s*\d+\s*】|\d+\s*[\.\)]|\bProblem\s+\d+[\.:]?|\b문\s*\d+[\.:]|\b문제\s*\d+[\.:]?|\d+\s*번[\.:]?)/i, '');
    if (pointsMatch) qText = qText.replace(pointsMatch[0], '');
    if (unitMatch) qText = qText.replace(unitMatch[0], '');
    if (svgMatch) qText = qText.replace(svgMatch[0], '');

    if (choices.length > 0) {
      const firstChoiceIdx = choiceBlock.search(/(?:①|\([A-E]\)|\([1-5]\)|(?:^|\n|\s)A\.\s+)/i);
      if (firstChoiceIdx !== -1) {
        qText = choiceBlock.slice(0, firstChoiceIdx);
        qText = qText.replace(/^(?:\[?\s*문제\s*\d+\s*\]?|【\s*문제\s*\d+\s*】|\d+\s*[\.\)]|\bProblem\s+\d+[\.:]?|\b문\s*\d+[\.:]|\b문제\s*\d+[\.:]?|\d+\s*번[\.:]?)/i, '');
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
        question: qText || `문제 ${problemNumber}`,
        choices: isSubjective ? [] : choices,
        correctAnswer: correctAnswer,
        figureSvg: figureSvg,
        explanation: explanation || '정답 및 상세 풀이가 등록되어 있습니다.',
      });
    }
  });

  return parsedProblems;
}

const SAMPLE_CSAT_FULL_TEXT = `[문제 1] [2점] [수학 I]
$\\sqrt[3]{24} \\times 3^{\\frac{2}{3}}$ 의 값은?
① $6$  ② $7$  ③ $8$  ④ $9$  ⑤ $10$
[정답] 1
[해설]
$\\sqrt[3]{24} = 2 \\times 3^{\\frac{1}{3}}$ 이므로,
$$2 \\times 3^{\\frac{1}{3}} \\times 3^{\\frac{2}{3}} = 2 \\times 3 = 6$$
따라서 정답은 ① $6$ 입니다.

[문제 2] [2점] [수학 II]
함수 $f(x) = 2x^3 - 5x + 3$ 에 대하여 $\\lim_{h \\to 0} \\frac{f(2+h) - f(2)}{h}$ 의 값은?
① $15$  ② $17$  ③ $19$  ④ $21$  ⑤ $23$
[정답] 3
[해설]
미분계수의 정의에 의해 구하는 값은 $f'(2)$ 입니다.
$$f'(x) = 6x^2 - 5 \\implies f'(2) = 6(2)^2 - 5 = 19$$

[문제 3] [3점] [수학 I]
$\\theta$ 가 제 $2$ 사분면의 각이고 $\\sin\\theta = \\frac{1}{3}$ 일 때, $\\cos\\theta \\times \\tan\\theta$ 의 값은?
① $-\\frac{1}{3}$  ② $-\\frac{\\sqrt{2}}{3}$  ③ $\\frac{1}{3}$  ④ $\\frac{\\sqrt{2}}{3}$  ⑤ $\\frac{2\\sqrt{2}}{3}$
[정답] 3
[해설]
$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ 이므로 $\\cos\\theta \\times \\tan\\theta = \\sin\\theta = \\frac{1}{3}$ 입니다.

[문제 4] [3점] [수학 I]
첫째항이 $2$ 인 등차수열 $\\{a_n\\}$ 에 대하여 $a_5 - a_3 = 6$ 일 때, $a_{10}$ 의 값은?
① $27$  ② $29$  ③ $31$  ④ $33$  ⑤ $35$
[정답] 2
[해설]
$a_5 - a_3 = 2d = 6 \\implies d = 3$.
$$a_{10} = a_1 + 9d = 2 + 9(3) = 29$$

[문제 5] [3점] [수학 II]
함수 $f(x) = x^3 - 3x^2 - 9x + 5$ 가 $x = a$ 에서 극대, $x = b$ 에서 극소일 때, $b - a$ 의 값은?
① $2$  ② $3$  ③ $4$  ④ $5$  ⑤ $6$
[정답] 3
[해설]
$f'(x) = 3x^2 - 6x - 9 = 3(x-3)(x+1) = 0$
$x = -1$ 에서 극대($a = -1$), $x = 3$ 에서 극소($b = 3$).
$$b - a = 3 - (-1) = 4$$`;

const SAMPLE_AMC_FULL_TEXT = `Problem 1. [6 points] [Arithmetic]
What is the value of $(2023 - 202) \\times 3 - 2023$?
(A) $3440$  (B) $3441$  (C) $3442$  (D) $3443$  (E) $3444$
Answer: (A)
Solution:
$$(2023 - 202) \\times 3 - 2023 = 1821 \\times 3 - 2023 = 5463 - 2023 = 3440$$

Problem 2. [6 points] [Geometry]
A rectangle has length $8$ and width $6$. What is the length of its diagonal?
(A) $9$  (B) $10$  (C) $11$  (D) $12$  (E) $14$
Answer: (B)
Solution:
By the Pythagorean theorem:
$$d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10$$

Problem 3. [6 points] [Algebra]
If $2^x = 15$ and $15^y = 32$, what is the value of $xy$?
(A) $3$  (B) $4$  (C) $5$  (D) $6$  (E) $8$
Answer: (C)
Solution:
$$(2^x)^y = 2^{xy} = 15^y = 32 = 2^5 \\implies xy = 5$$

Problem 4. [6 points] [Number Theory]
How many positive integers less than $100$ are divisible by both $3$ and $4$?
(A) $6$  (B) $7$  (C) $8$  (D) $9$  (E) $10$
Answer: (C)
Solution:
Numbers must be multiples of $\\text{lcm}(3, 4) = 12$.
The multiples less than $100$ are $12, 24, 36, 48, 60, 72, 84, 96$, which is $\\lfloor 99/12 \\rfloor = 8$.

Problem 5. [6 points] [Combinatorics]
In how many ways can $4$ distinct books be arranged on a shelf?
(A) $12$  (B) $16$  (C) $24$  (D) $36$  (E) $48$
Answer: (C)
Solution:
$$4! = 4 \\times 3 \\times 2 \\times 1 = 24$$`;

export default function AiExamParser({ initialText = '', onSaveToArchive, examType = 'csat', language = 'ko' }) {
  const [inputText, setInputText] = useState(initialText || '');
  const [parsedProblems, setParsedProblems] = useState([]);
  const [previewActive, setPreviewActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loadingFile, setLoadingFile] = useState(false);

  const sampleText = examType === 'amc' ? SAMPLE_AMC_FULL_TEXT : SAMPLE_CSAT_FULL_TEXT;

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      const res = parseExamText(initialText);
      if (res.length > 0) {
        setParsedProblems(res);
        setPreviewActive(true);
        setStatusMsg(`⚡ 전체 파일에서 총 ${res.length}개 문제를 일괄 인식하여 변환했습니다.`);
      }
    }
  }, [initialText]);

  const handleParse = () => {
    const text = inputText.trim() || sampleText;
    const result = parseExamText(text);
    if (result.length === 0) {
      setStatusMsg('문제를 인식하지 못했습니다. 형식(1., 2., Problem 1, [문제 1])을 확인해주세요.');
      return;
    }
    setParsedProblems(result);
    setPreviewActive(true);
    setStatusMsg(`🎉 전체 파일에서 총 ${result.length}개 문제를 한 번에 성공적으로 분리·변환했습니다!`);
  };

  const handleLoadSample = () => {
    setInputText(sampleText);
    const result = parseExamText(sampleText);
    setParsedProblems(result);
    setPreviewActive(true);
    setStatusMsg(`📝 ${examType.toUpperCase()} 전체 5문항 일괄 샘플 세트가 로드 및 변환되었습니다.`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingFile(true);
    setStatusMsg(`⏳ 파일 "${file.name}" 분석 중...`);

    try {
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const extracted = await extractTextFromPdf(file);
        if (!extracted || !extracted.trim()) {
          throw new Error('PDF에서 텍스트를 추출하지 못했습니다. 스캔 이미지 전용 PDF인 경우 텍스트를 직접 복사해주세요.');
        }
        setInputText(extracted);
        const result = parseExamText(extracted);
        if (result.length > 0) {
          setParsedProblems(result);
          setPreviewActive(true);
          setStatusMsg(`📄 PDF 전체 페이지에서 총 ${result.length}개 문제를 성공적으로 일괄 추출·변환했습니다!`);
        } else {
          setStatusMsg(`📄 PDF 텍스트를 추출했습니다. 문제 구분 형식을 검토 후 변환 버튼을 눌러주세요.`);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setInputText(content);
          const result = parseExamText(content);
          if (result.length > 0) {
            setParsedProblems(result);
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

  const handleSave = () => {
    if (parsedProblems.length === 0) {
      setStatusMsg('저장할 문제가 없습니다.');
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`custom_exam_${examType}`, JSON.stringify(parsedProblems));
      } catch (e) {}
    }
    if (onSaveToArchive) {
      onSaveToArchive(parsedProblems);
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
          <button
            type="button"
            onClick={handleLoadSample}
            style={{
              fontSize: '13px',
              fontWeight: '700',
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid var(--paper-line, #d8c9a8)',
              background: '#fbf8f2',
              cursor: 'pointer',
            }}
          >
            📝 전 문항 샘플 세트 로드
          </button>
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
                <InteractiveProblemCard
                  problem={p}
                  userAnswer={null}
                  onSelectAnswer={() => {}}
                  isExamMode={false}
                  showResult={false}
                  language={language}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

