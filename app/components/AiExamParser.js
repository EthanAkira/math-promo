'use client';

import { useState } from 'react';
import LatexMath from './LatexMath';
import InteractiveProblemCard from './InteractiveProblemCard';

const CHOICE_SYMBOLS = ['①', '②', '③', '④', '⑤'];

// Intelligent parser for Korean CSAT and English AMC math exams
export function parseExamText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // Split text by problem markers (e.g., "1.", "[문제 1]", "Problem 1", "문 1.")
  const problemSplits = rawText.split(/(?=(?:^|\n)\s*(?:\[?\s*문제\s*\d+\s*\]?|\d+\s*\.|\bProblem\s+\d+\b|\b문\s*\d+\.))/i);
  
  const parsedProblems = [];

  problemSplits.forEach((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // 1. Extract problem number
    const numMatch = trimmed.match(/^(?:\[?\s*문제\s*(\d+)\s*\]?|(\d+)\s*\.|\bProblem\s+(\d+)\b|\b문\s*(\d+)\.)/i);
    const problemNumber = numMatch ? parseInt(numMatch[1] || numMatch[2] || numMatch[3] || numMatch[4], 10) : idx + 1;

    // 2. Extract points (e.g., "[3점]", "(4점)", "[4 points]")
    const pointsMatch = trimmed.match(/\[\s*(\d+)\s*점\s*\]|\(\s*(\d+)\s*점\s*\)|\[\s*(\d+)\s*points?\s*\]/i);
    const points = pointsMatch ? parseInt(pointsMatch[1] || pointsMatch[2] || pointsMatch[3], 10) : 3;

    // 3. Extract unit/tag (e.g., "[수학 I]", "[지수와 로그]")
    const unitMatch = trimmed.match(/\[\s*(수학\s*[I|II|1|2]|미적분|확률과\s*통계|기하|Algebra|Geometry|Number\s*Theory|Combinatorics)[^\]]*\]/i);
    const unit = unitMatch ? unitMatch[0].replace(/[\[\]]/g, '').trim() : '';

    // 4. Extract Answer if present (e.g., "[정답] 3", "정답: ①", "Answer: (B)")
    let correctAnswer = 0;
    const ansMatch = trimmed.match(/(?:\[\s*정답\s*\]|정답\s*[:：]|Answer\s*[:：])\s*([①②③④⑤1-5A-Ea-e])/i);
    if (ansMatch) {
      const char = ansMatch[1];
      if (['①', '1', 'A', 'a'].includes(char)) correctAnswer = 0;
      else if (['②', '2', 'B', 'b'].includes(char)) correctAnswer = 1;
      else if (['③', '3', 'C', 'c'].includes(char)) correctAnswer = 2;
      else if (['④', '4', 'D', 'd'].includes(char)) correctAnswer = 3;
      else if (['⑤', '5', 'E', 'e'].includes(char)) correctAnswer = 4;
    }

    // 5. Extract Explanation if present (e.g., "[해설] ...", "[풀이] ...", "Solution: ...")
    let explanation = '';
    const expMatch = trimmed.match(/(?:\[\s*(?:해설|풀이)\s*\]|(?:해설|풀이|Solution)\s*[:：])\s*([\s\S]+)$/i);
    if (expMatch) {
      explanation = expMatch[1].trim();
    }

    // 6. Extract choices (① ... ② ... ③ ... ④ ... ⑤ ... or (A) ... (B) ... (C) ... (D) ... (E))
    let choices = [];
    const choiceBlock = trimmed.split(/(?:\[\s*(?:해설|풀이|정답)\s*\]|(?:해설|풀이|정답|Answer)\s*[:：])/i)[0];

    // Check Korean circles ①~⑤
    if (choiceBlock.includes('①') && choiceBlock.includes('②')) {
      const cParts = choiceBlock.split(/(?:①|②|③|④|⑤)/);
      if (cParts.length >= 6) {
        choices = cParts.slice(1, 6).map((c) => c.trim().replace(/[\n\r]+/g, ' '));
      }
    } else if (choiceBlock.includes('(A)') && choiceBlock.includes('(B)')) {
      const cParts = choiceBlock.split(/(?:\(A\)|\(B\)|\(C\)|\(D\)|\(E\))/i);
      if (cParts.length >= 6) {
        choices = cParts.slice(1, 6).map((c) => c.trim().replace(/[\n\r]+/g, ' '));
      }
    }

    // 7. Extract Question text (remove header, points, choices, answers, explanation)
    let qText = choiceBlock;
    // Remove leading problem number
    qText = qText.replace(/^(?:\[?\s*문제\s*\d+\s*\]?|\d+\s*\.|\bProblem\s+\d+\b|\b문\s*\d+\.)/i, '');
    // Remove points tag
    if (pointsMatch) qText = qText.replace(pointsMatch[0], '');
    // Remove unit tag
    if (unitMatch) qText = qText.replace(unitMatch[0], '');
    // Remove choices from question body
    if (choices.length > 0) {
      const firstChoiceMarker = choiceBlock.search(/(?:①|\(A\))/i);
      if (firstChoiceMarker !== -1) {
        qText = choiceBlock.slice(0, firstChoiceMarker);
      }
    }
    qText = qText.trim();

    if (qText || choices.length > 0) {
      parsedProblems.push({
        id: `parsed-p${problemNumber}`,
        number: problemNumber,
        points: points || 3,
        unit: unit || '공통수학',
        type: choices.length > 0 ? 'multiple_choice' : 'subjective',
        question: qText || `문제 ${problemNumber}`,
        choices: choices.length > 0 ? choices : ['$1$', '$2$', '$3$', '$4$', '$5$'],
        correctAnswer: correctAnswer,
        explanation: explanation || '정답 및 해설이 등록되어 있습니다.',
      });
    }
  });

  return parsedProblems;
}

const SAMPLE_RAW_TEXT = `[문제 1] [2점] [수학 I]
$\\sqrt[3]{24} \\times 3^{\\frac{2}{3}}$ 의 값은?
① $6$  ② $7$  ③ $8$  ④ $9$  ⑤ $10$
[정답] 1
[해설]
$\\sqrt[3]{24} = 2 \\times 3^{\\frac{1}{3}}$ 이므로,
$$2 \\times 3^{\\frac{1}{3}} \\times 3^{\\frac{2}{3}} = 2 \\times 3 = 6$$
따라서 정답은 ① $6$ 입니다.

[문제 2] [3점] [수학 II]
함수 $f(x) = 2x^3 - 5x + 3$ 에 대하여 $\\lim_{h \\to 0} \\frac{f(2+h) - f(2)}{h}$ 의 값은?
① $15$  ② $17$  ③ $19$  ④ $21$  ⑤ $23$
[정답] 3
[해설]
미분계수의 정의에 의해 $f'(2) = 6(2)^2 - 5 = 19$ 입니다.`;

export default function AiExamParser({ onSaveToArchive, examType = 'csat', language = 'ko' }) {
  const [inputText, setInputText] = useState('');
  const [parsedProblems, setParsedProblems] = useState([]);
  const [previewActive, setPreviewActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleParse = () => {
    const text = inputText.trim() || SAMPLE_RAW_TEXT;
    const result = parseExamText(text);
    if (result.length === 0) {
      setStatusMsg('문제를 인식하지 못했습니다. 형식을 확인해주세요.');
      return;
    }
    setParsedProblems(result);
    setPreviewActive(true);
    setStatusMsg(`총 ${result.length}개의 문제가 성공적으로 파싱되었습니다.`);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_RAW_TEXT);
    setStatusMsg('수능 기출 샘플 텍스트가 로드되었습니다. "AI 분석 및 변환"을 클릭하세요.');
  };

  const handleSave = () => {
    if (parsedProblems.length === 0) {
      setStatusMsg('저장할 문제가 없습니다.');
      return;
    }
    if (onSaveToArchive) {
      onSaveToArchive(parsedProblems);
    }
    setStatusMsg(`🎉 ${parsedProblems.length}개 문제가 인터랙티브 시험 세트로 등록되었습니다!`);
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--ink, #1f2733)' }}>
            ✨ AI 시험지 텍스트/LaTeX → 인터랙티브 문제 자동 변환기
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft, #718096)', margin: '4px 0 0' }}>
            기출문제 텍스트, LaTeX 수식, 보기를 붙여넣으면 즉시 웹·태블릿 풀이 가능한 인터랙티브 세트로 자동 분리·변환합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          style={{
            fontSize: '13px',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--paper-line, #d8c9a8)',
            background: '#fbf8f2',
            cursor: 'pointer',
          }}
        >
          📝 샘플 불러오기
        </button>
      </div>

      <textarea
        rows={8}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={`여기에 시험지 텍스트나 LaTeX 문제 내용을 붙여넣으세요...\n\n예시:\n[문제 1] [2점] [수학 I]\n$\\sqrt[3]{24} \\times 3^{2/3}$ 의 값은?\n① 6  ② 7  ③ 8  ④ 9  ⑤ 10\n[정답] 1\n[해설] 풀이 내용...`}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '1.5px solid var(--paper-line, #d8c9a8)',
          fontSize: '14.5px',
          fontFamily: 'monospace',
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
          ✨ AI 문제 자동 분석 및 변환하기
        </button>

        {previewActive ? (
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
            💾 인터랙티브 시험 세트로 저장 및 즉시 배포
          </button>
        ) : null}

        {statusMsg ? (
          <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--blue, #2a5c8a)' }}>
            {statusMsg}
          </span>
        ) : null}
      </div>

      {/* Live Preview Section */}
      {previewActive && parsedProblems.length > 0 ? (
        <div style={{ marginTop: '24px', borderTop: '2px solid var(--paper-line, #d8c9a8)', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 16px', color: 'var(--ink, #1f2733)' }}>
            👀 변환된 인터랙티브 문제 실시간 미리보기 ({parsedProblems.length}문항)
          </h3>
          {parsedProblems.map((p) => (
            <InteractiveProblemCard
              key={p.id || p.number}
              problem={p}
              userAnswer={null}
              onSelectAnswer={() => {}}
              isExamMode={false}
              showResult={false}
              language={language}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
