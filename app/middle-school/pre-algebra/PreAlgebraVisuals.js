'use client';

import { preAlgebraCopy } from './localization';
export { default as MathText } from '../../components/MathText';

export function NumberLine({ line }) {
  const width = 320;
  const left = 22;
  const right = width - 22;
  const count = Math.round((line.max - line.min) / line.step);
  const xFor = (value) => left + ((value - line.min) / (line.max - line.min)) * (right - left);
  const labelValues = new Set([line.min, 0, line.max]);
  return <svg className="generated-number-line" viewBox="0 0 320 78" role="img" aria-label="수직선">
    <line x1="12" y1="42" x2="308" y2="42" /><path d="M12 42 L20 38 L20 46 Z" /><path d="M308 42 L300 38 L300 46 Z" />
    {Array.from({ length: count + 1 }, (_, index) => {
      const value = line.min + index * line.step;
      const x = xFor(value);
      return <g key={index}><line x1={x} y1="36" x2={x} y2="48" />{labelValues.has(value) ? <text x={x} y="64">{value}</text> : null}</g>;
    })}
    <circle cx={xFor(line.value)} cy="42" r="4" /><text className="point-label" x={xFor(line.value)} y="28">{line.label}</text>
  </svg>;
}

export function CoordinatePlane({ plane }) {
  const size = 220;
  const range = 5;
  const margin = 18;
  const scale = (size - margin * 2) / (range * 2);
  const toX = (x) => margin + (x + range) * scale;
  const toY = (y) => size - margin - (y + range) * scale;
  const ticks = Array.from({ length: range * 2 + 1 }, (_, index) => index - range).filter(Boolean);
  return <svg className="generated-coord-plane" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="좌표평면">
    {ticks.map((value) => <g key={value}><line x1={toX(value)} y1={margin} x2={toX(value)} y2={size - margin} className="grid-line" /><line x1={margin} y1={toY(value)} x2={size - margin} y2={toY(value)} className="grid-line" /></g>)}
    <line x1={margin} y1={toY(0)} x2={size - margin} y2={toY(0)} className="axis-line" /><line x1={toX(0)} y1={margin} x2={toX(0)} y2={size - margin} className="axis-line" />
    <path d={`M${size - margin} ${toY(0)} L${size - margin - 7} ${toY(0) - 4} L${size - margin - 7} ${toY(0) + 4} Z`} /><path d={`M${toX(0)} ${margin} L${toX(0) - 4} ${margin + 7} L${toX(0) + 4} ${margin + 7} Z`} />
    <text x={size - margin + 4} y={toY(0) - 5}>x</text><text x={toX(0) + 9} y={margin + 3}>y</text><text x={toX(0) - 7} y={toY(0) + 12}>O</text>
    {plane.points.map((point) => <g key={point.label}><circle cx={toX(point.x)} cy={toY(point.y)} r="3.2" className={plane.highlight === point.label ? 'plane-point highlight' : 'plane-point'} /><text x={toX(point.x) + (point.x >= 4 ? -7 : 7)} y={toY(point.y) - 6} textAnchor={point.x >= 4 ? 'end' : 'start'}>{point.label}</text></g>)}
  </svg>;
}

export function TripGraph({ graph }) {
  const width = 320;
  const height = 150;
  const left = 32;
  const bottom = 122;
  const toX = (time) => left + (time / (graph.home + 15)) * 272;
  const toY = (distance) => bottom - (distance / (graph.distance + 1)) * 104;
  const points = [[0, 0], [graph.arrive, graph.distance], [graph.leave, graph.distance], [graph.home, 0]];
  return <svg className="generated-trip-graph" viewBox="0 0 320 150" role="img" aria-label="거리 시간 그래프">
    <line x1={left} y1={bottom} x2="304" y2={bottom} className="axis-line" /><line x1={left} y1="16" x2={left} y2={bottom} className="axis-line" />
    <path d={points.map(([x, y], index) => `${index ? 'L' : 'M'}${toX(x)} ${toY(y)}`).join(' ')} className="trip-line" fill="none" />
    {[graph.arrive, graph.leave, graph.home].map((time) => <text key={time} x={toX(time)} y="138" textAnchor="middle">{time}</text>)}
    <text x="24" y={toY(graph.distance) + 4} textAnchor="end">{graph.distance}</text><text x="307" y="116">x</text><text x="38" y="18">y</text>
  </svg>;
}

export function ProportionGraph({ graph }) {
  const size = 200;
  const margin = 20;
  const range = graph.range;
  const toX = (x) => size / 2 + (x / range) * (size / 2 - margin);
  const toY = (y) => size / 2 - (y / range) * (size / 2 - margin);
  let path;
  if (graph.mode === 'direct') {
    const slope = graph.a.n / graph.a.d;
    const bound = Math.min(range, range / Math.abs(slope || 1));
    path = `M${toX(-bound)} ${toY(-slope * bound)} L${toX(bound)} ${toY(slope * bound)}`;
  } else {
    const minX = Math.abs(graph.a) / range;
    const branch = Array.from({ length: 27 }, (_, index) => minX + (range - minX) * index / 26);
    path = branch.map((x, index) => `${index ? 'L' : 'M'}${toX(x)} ${toY(graph.a / x)}`).join(' ') + ' ' + branch.map((x, index) => `${index ? 'L' : 'M'}${toX(-x)} ${toY(-graph.a / x)}`).join(' ');
  }
  return <svg className="generated-proportion-graph" viewBox="0 0 200 200" role="img" aria-label="정비례 또는 반비례 그래프">
    <line x1={margin} y1={toY(0)} x2={size - margin} y2={toY(0)} className="axis-line" /><line x1={toX(0)} y1={margin} x2={toX(0)} y2={size - margin} className="axis-line" /><path d={path} className="proportion-curve" fill="none" />
    <circle cx={toX(graph.point.x)} cy={toY(graph.point.y)} r="3.2" className="proportion-point" /><text x="184" y="94">x</text><text x="107" y="20">y</text><text x="91" y="113">O</text>
  </svg>;
}

function RatioTable({ table }) {
  return <table className="generated-math-table" aria-label="같은 비를 나타내는 표"><thead><tr><th>x</th>{table.map((pair, index) => <th key={index}>{pair[0]}</th>)}</tr></thead><tbody><tr><th>y</th>{table.map((pair, index) => <td key={index}>{pair[1] ?? '□'}</td>)}</tr></tbody></table>;
}

function StemLeaf({ rows, labels }) {
  return <div className="generated-stem-leaf" role="img" aria-label={`${labels[3]} · ${labels[4]}`}><div className="stem-key">{labels[3]} | {labels[4]}</div>{rows.map(([stem, leaves]) => <div key={stem}><strong>{stem}</strong><span>{leaves.join('  ')}</span></div>)}<small>{labels[5]}: 2 | 4 = 24</small></div>;
}

function FrequencyTable({ rows, labels }) {
  return <table className="generated-math-table" aria-label={`${labels[6]} · ${labels[7]}`}><thead><tr><th>{labels[6]}</th><th>{labels[7]}</th></tr></thead><tbody>{rows.map((row) => <tr key={row.interval}><td>{row.interval}</td><td>{row.frequency}</td></tr>)}</tbody></table>;
}

function AlgebraGraph({ graph }) {
  const size = 220;
  const range = 10;
  const toX = (x) => size / 2 + x * 9;
  const toY = (y) => size / 2 - y * 9;
  const xs = Array.from({ length: 81 }, (_, index) => -10 + index / 4);
  const valueAt = (x, curve = 0) => {
    if (graph.type === 'quadratic-system') {
      const linear = graph.slope * x + graph.intercept;
      return curve ? linear + (x - graph.roots[0]) * (x - graph.roots[1]) : linear;
    }
    if (graph.type === 'quadratic') return graph.a * (x - graph.h) ** 2 + graph.k;
    if (graph.type === 'exponential') return graph.base ** x;
    return graph.slope * x + graph.intercept;
  };
  const curveChunks = (curve = 0) => { const chunks = []; let current = [];
  xs.forEach((x) => {
    const y = valueAt(x, curve);
    if (Number.isFinite(y) && Math.abs(y) <= range + 2) current.push([toX(x), toY(y)]);
    else if (current.length) { chunks.push(current); current = []; }
  });
  if (current.length) chunks.push(current); return chunks; };
  const curves = graph.type === 'quadratic-system' ? [curveChunks(0), curveChunks(1)] : [curveChunks()];
  return <svg className="generated-coord-plane generated-algebra-graph" viewBox="0 0 220 220" role="img" aria-label="함수 그래프">
    {[1, 2, 3].map((value) => <g key={value}><line x1={20} y1={110 - value * 27} x2={200} y2={110 - value * 27} className="grid-line" /><line x1={20} y1={110 + value * 27} x2={200} y2={110 + value * 27} className="grid-line" /></g>)}
    <line x1="14" y1="110" x2="206" y2="110" className="axis-line" /><line x1="110" y1="14" x2="110" y2="206" className="axis-line" />
    {curves.map((chunks, curveIndex) => chunks.map((points, index) => <polyline key={`${curveIndex}-${index}`} points={points.map((point) => point.join(',')).join(' ')} className={curveIndex ? 'trip-line' : 'proportion-curve'} fill="none" />))}
    {(graph.points || []).map((point, index) => <g key={`${point.x}-${point.y}-${index}`}><circle cx={toX(point.x)} cy={toY(point.y)} r="3.5" className="proportion-point" /><text x={toX(point.x) + 5} y={toY(point.y) - 6}>({point.x},{point.y})</text></g>)}
    <text x="201" y="104">x</text><text x="117" y="18">y</text><text x="96" y="124">O</text>
  </svg>;
}

function SystemGraph({ lines, point }) {
  const graph = { type: 'linear', slope: 0, intercept: 0, points: [point] };
  const size = 220;
  const toX = (x) => size / 2 + x * 12;
  const toY = (y) => size / 2 - y * 12;
  const segment = (line) => [-8, 8].map((x) => [toX(x), toY((line.c - line.a * x) / line.b)]).map((pair) => pair.join(',')).join(' ');
  return <svg className="generated-coord-plane generated-system-graph" viewBox="0 0 220 220" role="img" aria-label="연립방정식 그래프">
    <line x1="12" y1="110" x2="208" y2="110" className="axis-line" /><line x1="110" y1="12" x2="110" y2="208" className="axis-line" />
    {lines.map((line, index) => <polyline key={index} points={segment(line)} className={index ? 'trip-line' : 'proportion-curve'} fill="none" />)}
    <circle cx={toX(graph.points[0].x)} cy={toY(graph.points[0].y)} r="4" className="proportion-point" /><text x={toX(point.x) + 6} y={toY(point.y) - 6}>({point.x},{point.y})</text>
  </svg>;
}

function ProbabilityBar({ counts, labels }) {
  const total = counts.reduce((sum, entry) => sum + entry.value, 0);
  let cursor = 20;
  return <svg className="generated-probability" viewBox="0 0 260 90" role="img" aria-label="확률 막대">
    {counts.map((entry, index) => {
      const width = 220 * entry.value / total;
      const x = cursor;
      cursor += width;
      return <g key={entry.label}><rect x={x} y="24" width={width} height="34" className={index ? 'probability-second' : 'probability-first'} /><text x={x + width / 2} y="45" textAnchor="middle">{entry.label}: {entry.value}</text></g>;
    })}
    <text x="130" y="76" textAnchor="middle">{labels[2]} {total}</text>
  </svg>;
}

function ProbabilityTree({ red, blue }) {
  const total = red + blue;
  return <svg className="generated-probability" viewBox="0 0 280 150" role="img" aria-label="확률 나무">
    <line x1="25" y1="75" x2="115" y2="35" /><line x1="25" y1="75" x2="115" y2="115" />
    <line x1="115" y1="35" x2="245" y2="20" /><line x1="115" y1="35" x2="245" y2="58" />
    <text x="62" y="42">R {red}/{total}</text><text x="62" y="119">B {blue}/{total}</text>
    <text x="170" y="18">R {red - 1}/{total - 1}</text><text x="170" y="63">B {blue}/{total - 1}</text>
    <circle cx="25" cy="75" r="3" /><circle cx="115" cy="35" r="3" /><circle cx="115" cy="115" r="3" />
  </svg>;
}

function MatrixOperation({ matrices, operator }) {
  return <div className="generated-matrix-operation" role="img" aria-label="행렬 연산">
    {matrices.map((matrix, matrixIndex) => <span className="matrix-wrap" key={matrixIndex}><span>{matrix[0]}</span><span>{matrix[1]}</span><span>{matrix[2]}</span><span>{matrix[3]}</span></span>).reduce((elements, matrix, index) => index ? [...elements, <strong key={`op-${index}`}>{operator}</strong>, matrix] : [matrix], [])}
  </div>;
}

function VennDiagram({ total, a, b, intersection }) {
  return <svg className="generated-venn" viewBox="0 0 260 145" role="img" aria-label="벤 다이어그램">
    <rect x="8" y="8" width="244" height="129" rx="8" fill="none" /><circle cx="105" cy="72" r="50" className="venn-a" /><circle cx="155" cy="72" r="50" className="venn-b" />
    <text x="72" y="72">{a - intersection}</text><text x="130" y="72" textAnchor="middle">{intersection}</text><text x="181" y="72">{b - intersection}</text><text x="18" y="25">U={total}</text><text x="78" y="32">A</text><text x="180" y="32">B</text>
  </svg>;
}

function SequenceTable({ values }) {
  return <table className="generated-math-table" aria-label="수열 표"><thead><tr>{values.map((_, index) => <th key={index}>a{index + 1}</th>)}</tr></thead><tbody><tr>{values.map((value, index) => <td key={index}>{value}</td>)}</tr></tbody></table>;
}

function DataBars({ data }) {
  const maximum = Math.max(...data);
  return <svg className="generated-data-bars" viewBox="0 0 260 130" role="img" aria-label="자료 막대그래프">
    <line x1="20" y1="108" x2="246" y2="108" className="axis-line" />
    {data.map((value, index) => { const height = 78 * value / maximum; return <g key={index}><rect x={35 + index * 40} y={108 - height} width="22" height={height} /><text x={46 + index * 40} y="123" textAnchor="middle">{value}</text></g>; })}
  </svg>;
}

function MappingTable({ mapping }) {
  return <table className="generated-math-table" aria-label="함수 대응표"><thead><tr><th>x</th>{mapping.inputs.map((value) => <th key={value}>{value}</th>)}</tr></thead><tbody><tr><th>f(x)</th>{mapping.outputs.map((value, index) => <td key={index}>{value}</td>)}</tr></tbody></table>;
}

function InequalityLine({ points }) {
  const min = Math.min(...points) - 3; const max = Math.max(...points) + 3; const x = (value) => 24 + (value - min) * 272 / (max - min);
  return <svg className="generated-number-line" viewBox="0 0 320 78" role="img" aria-label="해를 표시한 수직선"><line x1="16" y1="40" x2="304" y2="40" />{Array.from({ length: max - min + 1 }, (_, i) => min + i).map((value) => <g key={value}><line x1={x(value)} y1="35" x2={x(value)} y2="45" />{points.includes(value) || value === 0 ? <text x={x(value)} y="62">{value}</text> : null}</g>)}{points.map((value) => <circle key={value} cx={x(value)} cy="40" r="5" className="proportion-point" />)}</svg>;
}

function PiecewiseGraph({ item }) {
  const size = 220; const toX = (x) => 110 + x * 12; const toY = (y) => 110 - y * 12;
  const segment = (pair, from, to) => `${toX(from)},${toY(pair[0] * from + pair[1])} ${toX(to)},${toY(pair[0] * to + pair[1])}`;
  return <svg className="generated-coord-plane generated-system-graph" viewBox="0 0 220 220" role="img" aria-label="구간별 정의 함수 그래프"><line x1="12" y1="110" x2="208" y2="110" className="axis-line" /><line x1="110" y1="12" x2="110" y2="208" className="axis-line" /><polyline points={segment(item.left, -8, item.split)} className="proportion-curve" fill="none" /><polyline points={segment(item.right, item.split, 8)} className="trip-line" fill="none" /><circle cx={toX(item.split)} cy={toY(item.left[0] * item.split + item.left[1])} r="4" fill="white" className="open-point" /><circle cx={toX(item.split)} cy={toY(item.right[0] * item.split + item.right[1])} r="4" className="proportion-point" /></svg>;
}

function ScatterPlot({ item }) {
  const maximum = Math.max(12, ...item.points.flat().map(Math.abs)); const s = 170 / maximum; const x = (v) => 28 + v * s; const y = (v) => 196 - v * s;
  return <svg className="generated-coord-plane" viewBox="0 0 220 220" role="img" aria-label="산점도와 추세선"><line x1="24" y1="196" x2="208" y2="196" className="axis-line" /><line x1="28" y1="206" x2="28" y2="14" className="axis-line" /><line x1={x(0)} y1={y(item.intercept)} x2={x(maximum)} y2={y(item.slope * maximum + item.intercept)} className="trip-line" />{item.points.map(([px, py], index) => <circle key={index} cx={x(px)} cy={y(py)} r="3.5" className="proportion-point" />)}</svg>;
}

function TwoWayTable({ cells, labels }) {
  const rowTotals = cells.map((row) => row[0] + row[1]); const colTotals = [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]];
  return <table className="generated-math-table" aria-label={labels[8]}><thead><tr><th /><th>{labels[0]} 1</th><th>{labels[0]} 2</th><th>{labels[2]}</th></tr></thead><tbody>{cells.map((row, i) => <tr key={i}><th>{labels[1]} {i + 1}</th><td>{row[0]}</td><td>{row[1]}</td><td>{rowTotals[i]}</td></tr>)}<tr><th>{labels[2]}</th><td>{colTotals[0]}</td><td>{colTotals[1]}</td><td>{rowTotals[0] + rowTotals[1]}</td></tr></tbody></table>;
}

function UnitCircle({ angle }) {
  const radians = Number(angle) * Math.PI / 180; const px = 110 + 70 * Math.cos(radians); const py = 105 - 70 * Math.sin(radians);
  return <svg className="generated-coord-plane" viewBox="0 0 220 210" role="img" aria-label="단위원"><line x1="18" y1="105" x2="202" y2="105" className="axis-line" /><line x1="110" y1="13" x2="110" y2="197" className="axis-line" /><circle cx="110" cy="105" r="70" fill="none" className="proportion-curve" /><line x1="110" y1="105" x2={px} y2={py} className="trip-line" /><circle cx={px} cy={py} r="4" className="proportion-point" /><text x="125" y="98">{angle}°</text></svg>;
}

function CoordinateGeometryGraph({ item }) {
  const points = item.points || []; const limit = Math.max(8, item.radius || 0, ...points.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)])); const s = 82 / limit; const x = (v) => 110 + v * s; const y = (v) => 110 - v * s;
  return <svg className="generated-coord-plane" viewBox="0 0 220 220" role="img" aria-label="좌표기하 그래프"><line x1="14" y1="110" x2="206" y2="110" className="axis-line" /><line x1="110" y1="14" x2="110" y2="206" className="axis-line" />{item.mode === 'circle' ? <circle cx={x(item.h)} cy={y(item.k)} r={item.radius * s} fill="none" className="proportion-curve" /> : null}{item.mode === 'perpendicular-lines' ? <><line x1={x(-limit)} y1={y(-limit * item.slope)} x2={x(limit)} y2={y(limit * item.slope)} className="proportion-curve" /><line x1={x(-limit)} y1={y(limit / item.slope)} x2={x(limit)} y2={y(-limit / item.slope)} className="trip-line" /></> : null}{item.mode === 'point-line' ? <line x1={x(-limit)} y1={y((item.c + item.a * limit) / item.b)} x2={x(limit)} y2={y((item.c - item.a * limit) / item.b)} className="proportion-curve" /> : null}{points.length > 1 ? <polyline points={points.map((p) => `${x(p.x)},${y(p.y)}`).join(' ')} className="trip-line" fill="none" /> : null}{points.map((p, i) => <g key={i}><circle cx={x(p.x)} cy={y(p.y)} r="4" className="proportion-point" /><text x={x(p.x) + 6} y={y(p.y) - 6}>{p.label}</text></g>)}</svg>;
}

function PolynomialZeros({ roots }) {
  const graph = { type: 'quadratic', a: 0.12, h: (roots[0].x + roots[1].x) / 2, k: -2, points: roots.map((root) => ({ x: root.x, y: 0 })) };
  return <AlgebraGraph graph={graph} />;
}

export function ProblemVisual({ item, language = 'ko' }) {
  const kind = item.visualKind || item.kind;
  const labels = preAlgebraCopy(language).visual;
  if (kind === 'number-line') return <NumberLine line={item.line} />;
  if (kind === 'coordinate-plane') return <CoordinatePlane plane={item.plane} />;
  if (kind === 'trip-graph') return <TripGraph graph={item.graph} />;
  if (kind === 'proportion-graph') return <ProportionGraph graph={item.graph} />;
  if (kind === 'ratio-table') return <RatioTable table={item.table} />;
  if (kind === 'stem-leaf') return <StemLeaf rows={item.stemLeaf} labels={labels} />;
  if (kind === 'frequency-table') return <FrequencyTable rows={item.frequencyTable} labels={labels} />;
  if (kind === 'algebra-graph') return <AlgebraGraph graph={item.graph} />;
  if (kind === 'system-graph') return <SystemGraph lines={item.lines} point={item.point} />;
  if (kind === 'probability-bar') return <ProbabilityBar counts={item.counts} labels={labels} />;
  if (kind === 'probability-tree') return <ProbabilityTree red={item.red} blue={item.blue} />;
  if (kind === 'matrix-operation') return <MatrixOperation matrices={item.matrices} operator={item.operator} />;
  if (kind === 'venn') return <VennDiagram total={item.total} a={item.a} b={item.b} intersection={item.intersection} />;
  if (kind === 'sequence-table') return <SequenceTable values={item.values} />;
  if (kind === 'data-bars') return <DataBars data={item.data} />;
  if (kind === 'mapping-table') return <MappingTable mapping={item.mapping} />;
  if (kind === 'inequality-line') return <InequalityLine points={item.points} />;
  if (kind === 'piecewise-graph') return <PiecewiseGraph item={item} />;
  if (kind === 'regression-scatter') return <ScatterPlot item={item} />;
  if (kind === 'two-way-table') return <TwoWayTable cells={item.cells} labels={labels} />;
  if (kind === 'unit-circle') return <UnitCircle angle={item.angle} />;
  if (kind === 'coordinate-geometry-graph') return <CoordinateGeometryGraph item={item} />;
  if (kind === 'polynomial-zero-graph') return <PolynomialZeros roots={item.roots} />;
  return null;
}

export function hasProblemVisual(item) {
  return ['number-line', 'coordinate-plane', 'trip-graph', 'proportion-graph', 'ratio-table', 'stem-leaf', 'frequency-table', 'algebra-graph', 'system-graph', 'probability-bar', 'probability-tree', 'matrix-operation', 'venn', 'sequence-table', 'data-bars', 'mapping-table', 'inequality-line', 'piecewise-graph', 'regression-scatter', 'two-way-table', 'unit-circle', 'coordinate-geometry-graph', 'polynomial-zero-graph'].includes(item.visualKind || item.kind);
}
