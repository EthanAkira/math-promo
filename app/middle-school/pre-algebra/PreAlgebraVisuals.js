'use client';

export function MathText({ value }) {
  const parts = String(value ?? '').split(/([+-]?\d+\/\d+|\^\d+)/g);
  return <>{parts.map((part, index) => {
    if (part.startsWith('^')) return <sup key={index}>{part.slice(1)}</sup>;
    const match = part.match(/^([+-]?)(\d+)\/(\d+)$/);
    if (!match) return <span key={index}>{part}</span>;
    return <span key={index} className="signed-fraction"><span>{match[1]}</span><span className="stacked-fraction"><span className="fraction-numerator">{match[2]}</span><span className="fraction-denominator">{match[3]}</span></span></span>;
  })}</>;
}

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

function StemLeaf({ rows }) {
  return <div className="generated-stem-leaf" role="img" aria-label="줄기와 잎 그림"><div className="stem-key">줄기 | 잎</div>{rows.map(([stem, leaves]) => <div key={stem}><strong>{stem}</strong><span>{leaves.join('  ')}</span></div>)}<small>예: 2 | 4 는 24</small></div>;
}

function FrequencyTable({ rows }) {
  return <table className="generated-math-table" aria-label="도수분포표"><thead><tr><th>계급</th><th>도수</th></tr></thead><tbody>{rows.map((row) => <tr key={row.interval}><td>{row.interval}</td><td>{row.frequency}</td></tr>)}</tbody></table>;
}

export function ProblemVisual({ item }) {
  if (item.kind === 'number-line') return <NumberLine line={item.line} />;
  if (item.kind === 'coordinate-plane') return <CoordinatePlane plane={item.plane} />;
  if (item.kind === 'trip-graph') return <TripGraph graph={item.graph} />;
  if (item.kind === 'proportion-graph') return <ProportionGraph graph={item.graph} />;
  if (item.kind === 'ratio-table') return <RatioTable table={item.table} />;
  if (item.kind === 'stem-leaf') return <StemLeaf rows={item.stemLeaf} />;
  if (item.kind === 'frequency-table') return <FrequencyTable rows={item.frequencyTable} />;
  return null;
}

export function hasProblemVisual(item) {
  return ['number-line', 'coordinate-plane', 'trip-graph', 'proportion-graph', 'ratio-table', 'stem-leaf', 'frequency-table'].includes(item.kind);
}
