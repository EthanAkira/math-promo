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
  const { shape, a, b, height, d1, d2 } = polygon;
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

export function ProblemVisual({ item }) {
  const kind = item.visualKind;
  if (kind === 'clock') return <ClockFace clock={item.clock} />;
  if (kind === 'angle-figure') return <AngleFigure angle={item.angle} />;
  if (kind === 'point-figure') return <PointFigure figure={item.figure} />;
  if (kind === 'point-cloud') return <PointCloud cloud={item.cloud} />;
  if (kind === 'polygon-figure') return <PolygonFigure polygon={item.polygon} />;
  return null;
}

export function hasProblemVisual(item) {
  return ['clock', 'angle-figure', 'point-figure', 'point-cloud', 'polygon-figure'].includes(item.visualKind);
}
