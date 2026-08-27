'use client';

/**
 * NoteCanvas
 * ----------
 * 문제 하나당 붙는 "손글씨 풀이 노트" 컴포넌트.
 *
 * 설계 원칙 (기획 배경):
 *  - 태블릿/펜슬 보유 여부는 학생마다 다르다. 강제하지 않고, 기기가 알려주는
 *    Pointer Events의 pointerType('pen' | 'touch' | 'mouse')에 따라 자동으로
 *    최적의 입력 방식을 고른다.
 *  - 펜슬이 있는 학생에게는 실제 노트 앱처럼 느껴지도록 필압 반영 + 손바닥
 *    거부(palm rejection)를 적용한다.
 *  - 펜슬이 없는 학생(터치만 있는 태블릿/폰)은 손가락으로도 그릴 수 있게 둔다.
 *  - 풀이 과정을 답과 함께 남기게 하는 것 자체가 "정답만 베끼는" 행위를
 *    어렵게 만드는 장치이기도 하다.
 *
 * 저장: 현재는 백엔드가 없으므로 localStorage에 학생 기기 로컬로만 저장한다.
 * 나중에 부모 리포트/서버 저장 기능을 붙일 때는 onChange 콜백에 스트로크
 * 데이터를 그대로 넘겨주면 되도록 만들어 두었다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';

const PEN_SEEN_KEY = 'dll-note-pen-seen';

const COLORS = [
  { id: 'ink', value: '#1f2733' },
  { id: 'red', value: '#c8283f' },
  { id: 'green', value: '#2f6e5c' },
];

const BASE_WIDTH = { thin: 2, thick: 4.5 };
const ERASER_WIDTH = 20;

function loadStrokes(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistStrokes(key, strokes) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(strokes));
  } catch {
    /* 저장 공간이 없거나 접근 불가 — 화면에서 그리는 동작 자체는 계속 되게 둔다 */
  }
}

function drawSegment(ctx, from, to, stroke) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over';
  ctx.strokeStyle = stroke.erase ? 'rgba(0,0,0,1)' : stroke.color;
  ctx.lineWidth = Math.max(1, stroke.baseWidth * (to.pressure || 0.5) * (stroke.erase ? 1.4 : 1));
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(from.x, from.y, mid.x, mid.y);
  ctx.stroke();
}

function drawDot(ctx, point, stroke) {
  ctx.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over';
  ctx.fillStyle = stroke.erase ? 'rgba(0,0,0,1)' : stroke.color;
  const r = Math.max(0.6, (stroke.baseWidth * (point.pressure || 0.5)) / 2);
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawStrokeFull(ctx, stroke) {
  if (!stroke.points.length) return;
  if (stroke.points.length === 1) {
    drawDot(ctx, stroke.points[0], stroke);
    return;
  }
  for (let i = 1; i < stroke.points.length; i += 1) {
    drawSegment(ctx, stroke.points[i - 1], stroke.points[i], stroke);
  }
}

export default function NoteCanvas({ storageKey, open }) {
  const { language } = useLanguage();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const redoStackRef = useRef([]);
  const activePointerRef = useRef(null);
  const penEverSeenRef = useRef(false);
  const [color, setColor] = useState(COLORS[0].value);
  const [thick, setThick] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [historyTick, setHistoryTick] = useState(0); // undo/redo 버튼 활성화 여부 갱신용

  const fullRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    strokesRef.current.forEach((stroke) => drawStrokeFull(ctx, stroke));
  }, []);

  // 저장된 필기 불러오기 + 캔버스 크기를 컨테이너에 맞춰 반응형으로 설정
  useEffect(() => {
    if (!open) return undefined;
    strokesRef.current = loadStrokes(storageKey);
    redoStackRef.current = [];

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = wrap;
      canvas.width = Math.max(1, Math.round(clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(clientHeight * ratio));
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      fullRedraw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [open, storageKey, fullRedraw]);

  const getPoint = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pressure > 0 ? event.pressure : 0.5,
    };
  }, []);

  const handlePointerDown = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (event.pointerType === 'pen') {
      penEverSeenRef.current = true;
      try { window.localStorage.setItem(PEN_SEEN_KEY, '1'); } catch { /* ignore */ }
    } else if (event.pointerType === 'touch') {
      // 손바닥 거부: 이 기기에서 펜슬이 한 번이라도 쓰인 적 있으면
      // 손가락 터치는 그리기가 아니라 손바닥으로 간주하고 무시한다.
      const penCapable = penEverSeenRef.current
        || (typeof window !== 'undefined' && window.localStorage.getItem(PEN_SEEN_KEY) === '1');
      if (penCapable) return;
    }

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    activePointerRef.current = event.pointerId;

    const point = getPoint(event);
    const stroke = {
      color,
      baseWidth: (erasing ? ERASER_WIDTH : (thick ? BASE_WIDTH.thick : BASE_WIDTH.thin)),
      erase: erasing,
      points: [point],
    };
    strokesRef.current = [...strokesRef.current, stroke];
    redoStackRef.current = [];
    const ctx = canvas.getContext('2d');
    drawDot(ctx, point, stroke);
  }, [color, erasing, thick, getPoint]);

  const handlePointerMove = useCallback((event) => {
    if (activePointerRef.current !== event.pointerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    event.preventDefault();

    const stroke = strokesRef.current[strokesRef.current.length - 1];
    if (!stroke) return;
    const ctx = canvas.getContext('2d');

    const events = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [event];
    (events.length ? events : [event]).forEach((native) => {
      const point = getPoint(native);
      const prev = stroke.points[stroke.points.length - 1];
      stroke.points.push(point);
      if (prev) drawSegment(ctx, prev, point, stroke);
    });
  }, [getPoint]);

  const endStroke = useCallback((event) => {
    if (activePointerRef.current !== event.pointerId) return;
    activePointerRef.current = null;
    persistStrokes(storageKey, strokesRef.current);
    setHistoryTick((tick) => tick + 1);
  }, [storageKey]);

  const undo = useCallback(() => {
    if (!strokesRef.current.length) return;
    const last = strokesRef.current[strokesRef.current.length - 1];
    strokesRef.current = strokesRef.current.slice(0, -1);
    redoStackRef.current = [...redoStackRef.current, last];
    fullRedraw();
    persistStrokes(storageKey, strokesRef.current);
    setHistoryTick((tick) => tick + 1);
  }, [fullRedraw, storageKey]);

  const redo = useCallback(() => {
    if (!redoStackRef.current.length) return;
    const restored = redoStackRef.current[redoStackRef.current.length - 1];
    redoStackRef.current = redoStackRef.current.slice(0, -1);
    strokesRef.current = [...strokesRef.current, restored];
    fullRedraw();
    persistStrokes(storageKey, strokesRef.current);
    setHistoryTick((tick) => tick + 1);
  }, [fullRedraw, storageKey]);

  const clearAll = useCallback(() => {
    if (!strokesRef.current.length) return;
    strokesRef.current = [];
    redoStackRef.current = [];
    fullRedraw();
    persistStrokes(storageKey, strokesRef.current);
    setHistoryTick((tick) => tick + 1);
  }, [fullRedraw, storageKey]);

  if (!open) return null;

  return (
    <div className="note-canvas-panel no-print">
      <div className="note-canvas-toolbar">
        <div className="note-canvas-colors">
          {COLORS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.id}
              className={`note-color-swatch ${!erasing && color === item.value ? 'active' : ''}`}
              style={{ background: item.value }}
              onClick={() => { setColor(item.value); setErasing(false); }}
            />
          ))}
        </div>
        <div className="note-canvas-actions">
          <button type="button" className={`note-tool-btn ${thick ? 'active' : ''}`} onClick={() => setThick((v) => !v)}>{tr(language, 'noteThick')}</button>
          <button type="button" className={`note-tool-btn ${erasing ? 'active' : ''}`} onClick={() => setErasing((v) => !v)}>{tr(language, 'noteEraser')}</button>
          <button type="button" className="note-tool-btn" onClick={undo}>{tr(language, 'noteUndo')}</button>
          <button type="button" className="note-tool-btn" onClick={redo}>{tr(language, 'noteRedo')}</button>
          <button type="button" className="note-tool-btn note-tool-clear" onClick={clearAll}>{tr(language, 'noteClear')}</button>
        </div>
      </div>
      <div className="note-canvas-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="note-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          onPointerCancel={endStroke}
        />
      </div>
    </div>
  );
}
