'use client';

function point(cx, cy, radius, degree) {
  const rad = (degree * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function Arc({ cx, cy, radius, start, end, className = 'angle-arc' }) {
  const a = point(cx, cy, radius, start);
  const b = point(cx, cy, radius, end);
  return <path className={className} d={`M ${a.x} ${a.y} A ${radius} ${radius} 0 ${Math.abs(end - start) > 180 ? 1 : 0} 1 ${b.x} ${b.y}`} />;
}

export function ClockFace({ clock }) {
  const cx = 80;
  const cy = 80;
  const hourAngle = ((clock.hour % 12) + clock.minute / 60) * 30 - 90;
  const minuteAngle = clock.minute * 6 - 90;
  const hourEnd = point(cx, cy, 32, hourAngle);
  const minuteEnd = point(cx, cy, 52, minuteAngle);
  return <svg className="generated-geometry" viewBox="0 0 160 160" role="img" aria-label="시계">
    <circle cx={cx} cy={cy} r="62" className="shape-outline" />
    {Array.from({ length: 12 }, (_, index) => {
      const degree = index * 30 - 90;
      const outer = point(cx, cy, 62, degree);
      const inner = point(cx, cy, 54, degree);
      const label = point(cx, cy, 46, degree);
      return <g key={index}>
        <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} />
        <text x={label.x} y={label.y + 4} textAnchor="middle">{index === 0 ? 12 : index}</text>
      </g>;
    })}
    <line x1={cx} y1={cy} x2={hourEnd.x} y2={hourEnd.y} className="highlight-edge" />
    <line x1={cx} y1={cy} x2={minuteEnd.x} y2={minuteEnd.y} />
    <circle cx={cx} cy={cy} r="3" />
  </svg>;
}

export function AngleFigure({ angle }) {
  const cx = 105;
  const cy = 92;
  const end = point(cx, cy, 67, -angle.degrees);
  return <svg className="generated-geometry" viewBox="0 0 210 125" role="img" aria-label={`${angle.degrees}도 각`}>
    <line x1="28" y1={cy} x2="184" y2={cy} />
    <line x1={cx} y1={cy} x2={end.x} y2={end.y} />
    <circle cx={cx} cy={cy} r="2.5" />
    <Arc cx={cx} cy={cy} radius={25} start={-angle.degrees} end={0} />
    <text x={cx - 4} y={cy + 16} className="point-label">O</text>
    <text x="146" y="78" className="value-label">{angle.degrees}°</text>
  </svg>;
}

export function PointFigure({ figure }) {
  const y = 40;
  const ax = 40;
  const bx = 160;
  const dot = (x) => <circle cx={x} cy={y} r="2.6" />;
  const arrow = (x, direction) => <path className="arrow-head" d={`M${x} ${y} L${x - direction * 8} ${y - 4} L${x - direction * 8} ${y + 4} Z`} />;
  let line;
  if (figure.kind === 'segment') line = <line x1={ax} y1={y} x2={bx} y2={y} />;
  else if (figure.kind === 'ray') line = <line x1={ax} y1={y} x2={190} y2={y} />;
  else line = <line x1={10} y1={y} x2={190} y2={y} />;
  return <svg className="generated-geometry" viewBox="0 0 200 80" role="img" aria-label="선분, 반직선, 직선 그림">
    {line}
    {figure.kind === 'line' ? arrow(10, -1) : null}
    {figure.kind !== 'segment' ? arrow(190, 1) : null}
    {dot(ax)}{dot(bx)}
    <text x={ax} y={y - 12} textAnchor="middle" className="point-label">{figure.labelA}</text>
    <text x={bx} y={y - 12} textAnchor="middle" className="point-label">{figure.labelB}</text>
  </svg>;
}

export function PointCloud({ cloud }) {
  return <svg className="generated-geometry" viewBox="0 0 200 160" role="img" aria-label="점들의 배치">
    {cloud.points.map(([x, y], index) => <g key={cloud.labels[index]}>
      <circle cx={x} cy={y} r="2.8" />
      <text x={x + 7} y={y - 6} className="point-label">{cloud.labels[index]}</text>
    </g>)}
  </svg>;
}

function rightAngleMark(x, y, sizeX, sizeY) {
  return <path className="right-mark" d={`M${x} ${y - sizeY} h${sizeX} v${sizeY}`} />;
}

export function PolygonFigure({ polygon }) {
  const { shape, a, b, height, d1, d2, w: fullW, h: fullH } = polygon;
  if (shape === 'lshape') {
    const left = 20;
    const top = 20;
    const width = 160;
    const boxHeight = 100;
    const notchW = 60;
    const notchH = 40;
    const bl = { x: left, y: top + boxHeight };
    const br = { x: left + width, y: top + boxHeight };
    const midR = { x: left + width, y: top + notchH };
    const notchInnerX = left + width - notchW;
    const notch1 = { x: notchInnerX, y: top + notchH };
    const notch2 = { x: notchInnerX, y: top };
    const tl = { x: left, y: top };
    return <svg className="generated-geometry" viewBox="0 0 220 150" role="img" aria-label="직각으로 이루어진 도형">
      <polygon className="shape-outline" points={[bl, br, midR, notch1, notch2, tl].map((p) => `${p.x},${p.y}`).join(' ')} />
      <text x={(bl.x + br.x) / 2} y={bl.y + 16} textAnchor="middle" className="value-label">{fullW}cm</text>
      <text x={tl.x - 14} y={(tl.y + bl.y) / 2} className="value-label">{fullH}cm</text>
      <text x={(notch2.x + midR.x) / 2} y={notch1.y - 6} textAnchor="middle" className="value-label">{a}cm</text>
      <text x={notch1.x + 10} y={(notch1.y + notch2.y) / 2} className="value-label">{b}cm</text>
    </svg>;
  }
  if (shape === 'rectangle' || shape === 'square') {
    const w = 150;
    const h = shape === 'square' ? 90 : 90 * Math.min(1.4, Math.max(0.5, b / a || 1));
    const left = 25;
    const top = 20;
    return <svg className="generated-geometry" viewBox="0 0 200 140" role="img" aria-label={shape === 'square' ? '정사각형' : '직사각형'}>
      <polygon className="shape-outline" points={`${left},${top} ${left + w},${top} ${left + w},${top + h} ${left},${top + h}`} />
      {rightAngleMark(left, top + h, 10, 10)}
      <text x={left + w / 2} y={top - 6} textAnchor="middle" className="value-label">{a}cm</text>
      <text x={left + w + 12} y={top + h / 2} textAnchor="middle" className="value-label">{shape === 'square' ? `${a}cm` : `${b}cm`}</text>
    </svg>;
  }
  if (shape === 'triangle') {
    const base = { x1: 30, x2: 170, y: 115 };
    const apex = { x: 90, y: 20 };
    return <svg className="generated-geometry" viewBox="0 0 200 140" role="img" aria-label="삼각형">
      <polygon className="shape-outline" points={`${base.x1},${base.y} ${base.x2},${base.y} ${apex.x},${apex.y}`} />
      <line x1={apex.x} y1={apex.y} x2={apex.x} y2={base.y} className="guide-line" />
      {rightAngleMark(apex.x, base.y, 9, 9)}
      <text x={(base.x1 + base.x2) / 2} y={base.y + 16} textAnchor="middle" className="value-label">{a}cm</text>
      <text x={apex.x + 10} y={(apex.y + base.y) / 2} className="value-label">{height}cm</text>
    </svg>;
  }
  if (shape === 'parallelogram') {
    const base = { x1: 25, x2: 145, y: 115 };
    const top = { x1: 55, x2: 175, y: 25 };
    return <svg className="generated-geometry" viewBox="0 0 200 140" role="img" aria-label="평행사변형">
      <polygon className="shape-outline" points={`${base.x1},${base.y} ${base.x2},${base.y} ${top.x2},${top.y} ${top.x1},${top.y}`} />
      <line x1={top.x1} y1={top.y} x2={top.x1} y2={base.y} className="guide-line" />
      {rightAngleMark(top.x1, base.y, 9, 9)}
      <text x={(base.x1 + base.x2) / 2} y={base.y + 16} textAnchor="middle" className="value-label">{a}cm</text>
      <text x={top.x1 - 22} y={(top.y + base.y) / 2} className="value-label">{height}cm</text>
    </svg>;
  }
  if (shape === 'trapezoid') {
    const base = { x1: 20, x2: 180, y: 115 };
    const top = { x1: 65, x2: 135, y: 25 };
    return <svg className="generated-geometry" viewBox="0 0 200 140" role="img" aria-label="사다리꼴">
      <polygon className="shape-outline" points={`${base.x1},${base.y} ${base.x2},${base.y} ${top.x2},${top.y} ${top.x1},${top.y}`} />
      <line x1={top.x1} y1={top.y} x2={top.x1} y2={base.y} className="guide-line" />
      {rightAngleMark(top.x1, base.y, 9, 9)}
      <text x={(top.x1 + top.x2) / 2} y={top.y - 6} textAnchor="middle" className="value-label">{a}cm</text>
      <text x={(base.x1 + base.x2) / 2} y={base.y + 16} textAnchor="middle" className="value-label">{b}cm</text>
      <text x={top.x1 - 22} y={(top.y + base.y) / 2} className="value-label">{height}cm</text>
    </svg>;
  }
  const cx = 100;
  const cy = 70;
  const rx = 65;
  const ry = 48;
  const pts = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
  return <svg className="generated-geometry" viewBox="0 0 200 140" role="img" aria-label="마름모">
    <polygon className="shape-outline" points={pts.map((p) => p.join(',')).join(' ')} />
    <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[2][0]} y2={pts[2][1]} className="guide-line" />
    <line x1={pts[3][0]} y1={pts[3][1]} x2={pts[1][0]} y2={pts[1][1]} className="guide-line" />
    <text x={cx + 6} y={cy - ry / 2} className="value-label">{d1}cm</text>
    <text x={cx - rx / 2} y={cy - 6} className="value-label">{d2}cm</text>
  </svg>;
}

export function CircleRow({ row }) {
  const r = 22;
  const width = row.count * 2 * r + 20;
  const cy = 45;
  return <svg className="generated-geometry" viewBox={`0 0 ${width} 90`} role="img" aria-label="맞닿은 원">
    {Array.from({ length: row.count }, (_, index) => {
      const cx = 10 + r + index * 2 * r;
      return <circle key={index} cx={cx} cy={cy} r={r} className="shape-outline" />;
    })}
    <text x={10 + r} y={cy + 4} textAnchor="middle" className="value-label">{row.radiusLabel}cm</text>
  </svg>;
}

export function CirclePair({ pair }) {
  const scale = 4.2;
  const r1 = pair.r1 * scale;
  const r2 = pair.r2 * scale;
  const cy = 60;
  const c1x = 20 + r1;
  const c2x = c1x + r1 + r2;
  return <svg className="generated-geometry" viewBox={`0 0 ${c2x + r2 + 20} 110`} role="img" aria-label="맞닿은 두 원">
    <circle cx={c1x} cy={cy} r={r1} className="shape-outline" />
    <circle cx={c2x} cy={cy} r={r2} className="shape-outline" />
    <circle cx={c1x} cy={cy} r="2.2" /><circle cx={c2x} cy={cy} r="2.2" />
    <text x={c1x} y={cy - r1 - 6} textAnchor="middle" className="point-label">{pair.labelA}</text>
    <text x={c2x} y={cy - r2 - 6} textAnchor="middle" className="point-label">{pair.labelB}</text>
    <text x={c1x} y={cy + r1 + 16} textAnchor="middle" className="value-label">{pair.r1}cm</text>
    <text x={c2x} y={cy + r2 + 16} textAnchor="middle" className="value-label">{pair.r2}cm</text>
  </svg>;
}

export function Pictograph({ pictograph }) {
  const rowHeight = 30;
  const iconGap = 18;
  const startX = 92;
  const height = pictograph.categories.length * rowHeight + 40;
  const maxIcons = Math.max(...pictograph.categories.map((c) => Math.floor(c.value / 10) + (c.value % 10)));
  const width = Math.max(260, startX + maxIcons * iconGap + 20);
  return <svg className="generated-geometry" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="그림그래프">
    <circle cx="14" cy="14" r="7" /><text x="26" y="18">= 10</text>
    <circle cx="70" cy="14" r="3" /><text x="80" y="18">= 1</text>
    {pictograph.categories.map((category, rowIndex) => {
      const y = 40 + rowIndex * rowHeight;
      const tens = Math.floor(category.value / 10);
      const ones = category.value % 10;
      return <g key={category.label}>
        <text x="0" y={y + 5} className="point-label">{category.label}</text>
        {Array.from({ length: tens }, (_, index) => <circle key={`t${index}`} cx={startX + index * iconGap} cy={y} r="7" />)}
        {Array.from({ length: ones }, (_, index) => <circle key={`o${index}`} cx={startX + (tens + index) * iconGap} cy={y} r="3" />)}
      </g>;
    })}
  </svg>;
}

export function FractionTape({ tape }) {
  const left = 15;
  const width = 320;
  const right = left + width;
  const top = 40;
  const stepWidth = width / tape.parts;
  return <svg className="generated-geometry" viewBox="0 0 350 70" role="img" aria-label="분수 테이프">
    {Array.from({ length: tape.mark }, (_, index) => <rect key={index} x={left + index * stepWidth} y={top} width={stepWidth} height="18" className="highlight-face" />)}
    <rect x={left} y={top} width={width} height="18" className="shape-outline" />
    {Array.from({ length: tape.parts + 1 }, (_, index) => {
      const x = left + index * stepWidth;
      const value = Math.round((tape.total / tape.parts) * index * 10) / 10;
      return <g key={index}>
        <line x1={x} y1={top} x2={x} y2={top + 18} />
        <text x={x} y={top + 34} textAnchor="middle">{value}</text>
      </g>;
    })}
  </svg>;
}

function staircaseCells(n) {
  const cells = new Set();
  for (let i = 0; i < n; i += 1) { cells.add(`${i},0`); cells.add(`0,${i}`); }
  return Array.from(cells, (key) => key.split(',').map(Number));
}

export function BlockPattern({ pattern }) {
  const cell = 12;
  const maxN = Math.max(...pattern.stages);
  const stageWidth = maxN * cell + 24;
  const height = maxN * cell + 34;
  return <svg className="generated-geometry" viewBox={`0 0 ${stageWidth * pattern.stages.length} ${height}`} role="img" aria-label="늘어나는 정사각형 배열">
    {pattern.stages.map((n, stageIndex) => {
      const offsetX = stageIndex * stageWidth + 10;
      const baseY = height - 24;
      return <g key={n}>
        {staircaseCells(n).map(([col, row]) => <rect key={`${col}-${row}`} x={offsetX + col * cell} y={baseY - row * cell - cell} width={cell} height={cell} className="shape-outline" />)}
        <text x={offsetX + (maxN * cell) / 2} y={height - 6} textAnchor="middle" className="point-label">{n}번째</text>
      </g>;
    })}
  </svg>;
}

export function DataTable({ table }) {
  return <table className="generated-math-table" aria-label="자료의 표">
    <thead><tr><th />{table.categories.map((category) => <th key={category.label}>{category.label}</th>)}<th>합계</th></tr></thead>
    <tbody><tr><th>수</th>{table.categories.map((category) => <td key={category.label}>{category.value === null ? '□' : category.value}</td>)}<td>{table.total}</td></tr></tbody>
  </table>;
}

export function ProblemVisual({ item }) {
  const kind = item.visualKind;
  if (kind === 'clock') return <ClockFace clock={item.clock} />;
  if (kind === 'angle-figure') return <AngleFigure angle={item.angle} />;
  if (kind === 'point-figure') return <PointFigure figure={item.figure} />;
  if (kind === 'point-cloud') return <PointCloud cloud={item.cloud} />;
  if (kind === 'polygon-figure') return <PolygonFigure polygon={item.polygon} />;
  if (kind === 'circle-row') return <CircleRow row={item.row} />;
  if (kind === 'circle-pair') return <CirclePair pair={item.pair} />;
  if (kind === 'pictograph') return <Pictograph pictograph={item.pictograph} />;
  if (kind === 'fraction-tape') return <FractionTape tape={item.tape} />;
  if (kind === 'data-table') return <DataTable table={item.table} />;
  if (kind === 'block-pattern') return <BlockPattern pattern={item.pattern} />;
  return null;
}

export function hasProblemVisual(item) {
  return ['clock', 'angle-figure', 'point-figure', 'point-cloud', 'polygon-figure', 'circle-row', 'circle-pair', 'pictograph', 'fraction-tape', 'data-table', 'block-pattern'].includes(item.visualKind);
}
