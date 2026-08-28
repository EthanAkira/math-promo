import AdvancedGeometryDiagram from './AdvancedGeometryDiagram';

function Arc({ cx, cy, radius, start, end, className = 'angle-arc' }) {
  const point = (degree) => ({ x: cx + radius * Math.cos((degree * Math.PI) / 180), y: cy + radius * Math.sin((degree * Math.PI) / 180) });
  const a = point(start); const b = point(end);
  return <path className={className} d={`M ${a.x} ${a.y} A ${radius} ${radius} 0 ${Math.abs(end - start) > 180 ? 1 : 0} 1 ${b.x} ${b.y}`} />;
}

function AngleDiagram({ data }) {
  const radians = (-data.degrees * Math.PI) / 180;
  const x = 105 + 67 * Math.cos(radians); const y = 92 + 67 * Math.sin(radians);
  return <svg className="generated-geometry" viewBox="0 0 210 125" role="img" aria-label={`angle ${data.degrees} degrees`}>
    <line x1="28" y1="92" x2="184" y2="92" /><line x1="105" y1="92" x2={x} y2={y} />
    <circle cx="105" cy="92" r="2.5" /><Arc cx={105} cy={92} radius={25} start={-data.degrees} end={0} />
    <text x="101" y="108" className="point-label">O</text><text x="146" y="78" className="value-label">{data.label || `${data.degrees}°`}</text>
  </svg>;
}

function IntersectingDiagram({ data }) {
  const center = { x: 110, y: 68 };
  const ray = (degree, length = 92) => ({ x: center.x + length * Math.cos((degree * Math.PI) / 180), y: center.y + length * Math.sin((degree * Math.PI) / 180) });
  const first = 270 - data.given / 2; const second = 270 + data.given / 2;
  const a1 = ray(first); const a2 = ray(first + 180); const b1 = ray(second); const b2 = ray(second + 180);
  return <svg className="generated-geometry" viewBox="0 0 220 135" role="img" aria-label="intersecting lines and vertical angles">
    <line x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} /><line x1={b1.x} y1={b1.y} x2={b2.x} y2={b2.y} />
    <Arc cx={center.x} cy={center.y} radius={27} start={first} end={second} /><Arc cx={center.x} cy={center.y} radius={27} start={first + 180} end={second + 180} className="angle-arc target-arc" />
    <text x="110" y="34" className="value-label" textAnchor="middle">{data.given}°</text><text x="110" y="112" className="target-label" textAnchor="middle">x</text>
  </svg>;
}

function ParallelDiagram({ data }) {
  const sameSide = data.relation === 'sameSide';
  const top = { x: 75, y: 45 };
  const bottom = { x: top.x + 73 / Math.tan((data.given * Math.PI) / 180), y: 118 };
  const transX = (y) => top.x + (y - top.y) / Math.tan((data.given * Math.PI) / 180);
  const labelAt = (center, start, end, radius = 31) => ({ x: center.x + radius * Math.cos((((start + end) / 2) * Math.PI) / 180), y: center.y + radius * Math.sin((((start + end) / 2) * Math.PI) / 180) });
  const targetStart = sameSide ? 180 + data.given : 180; const targetEnd = sameSide ? 360 : 180 + data.given;
  const givenLabel = labelAt(top, 0, data.given, 34); const targetLabel = labelAt(bottom, targetStart, targetEnd, 35);
  return <svg className="generated-geometry" viewBox="0 0 240 160" role="img" aria-label="two parallel lines cut by a transversal">
    <defs><marker id={`arrow-${data.id}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" /></marker></defs>
    <line x1="20" y1="45" x2="220" y2="45" /><line x1="20" y1="118" x2="220" y2="118" />
    <line x1={transX(10)} y1="10" x2={transX(150)} y2="150" />
    <path className="parallel-mark" d="M42 41 l7 4 l-7 4 M55 41 l7 4 l-7 4 M42 114 l7 4 l-7 4 M55 114 l7 4 l-7 4" />
    <Arc cx={top.x} cy={top.y} radius={20} start={0} end={data.given} />
    <Arc cx={bottom.x} cy={bottom.y} radius={20} start={targetStart} end={targetEnd} className="angle-arc target-arc" />
    <text x={givenLabel.x} y={givenLabel.y} className="value-label" textAnchor="middle">{data.given}°</text>
    <text x={targetLabel.x} y={targetLabel.y} className="target-label" textAnchor="middle">x</text>
    <text x="224" y="49" className="line-label">l</text><text x="224" y="122" className="line-label">m</text>
  </svg>;
}

function TriangleDiagram({ data }) {
  const left = { x: 28, y: 132 }; const right = { x: 199, y: 132 };
  const tanA = Math.tan((data.a * Math.PI) / 180); const tanB = Math.tan((data.b * Math.PI) / 180);
  const apexX = (tanA * left.x + tanB * right.x) / (tanA + tanB);
  const apexY = left.y - tanA * (apexX - left.x);
  return <svg className="generated-geometry" viewBox="0 0 230 160" role="img" aria-label="triangle angle problem">
    <polygon points={`${left.x},${left.y} ${right.x},${right.y} ${apexX},${apexY}`} />
    <Arc cx={left.x} cy={left.y} radius={28} start={-data.a} end={0} /><Arc cx={right.x} cy={right.y} radius={28} start={180} end={180 + data.b} />
    <text x="50" y="119" className="value-label">{data.a}°</text><text x="167" y="119" className="value-label">{data.b}°</text>
    <text x={apexX - 3} y={apexY + 28} className="target-label">x</text><text x="20" y="149" className="point-label">A</text><text x="201" y="149" className="point-label">B</text><text x={apexX - 3} y={apexY - 7} className="point-label">C</text>
  </svg>;
}

function LineTypeDiagram({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 230 90" role="img" aria-label="line ray or segment through A and B">
    <line x1={data.type === 'line' ? 28 : 78} y1="45" x2={data.type === 'segment' ? 154 : 202} y2="45" />
    {data.type !== 'segment' ? <polygon className="arrow-head" points={data.type === 'ray' ? '202,45 190,39 190,51' : '28,45 40,39 40,51'} /> : null}
    {data.type === 'line' ? <polygon className="arrow-head" points="202,45 190,39 190,51" /> : null}
    <circle cx="78" cy="45" r="3" /><circle cx="154" cy="45" r="3" />
    <text x="74" y="67" className="point-label">A</text><text x="150" y="67" className="point-label">B</text>
  </svg>;
}

function PointPlaneDiagram({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 235 145" role="img" aria-label="points, a line and a plane">
    <polygon className="plane-fill" points="48,48 193,48 171,118 27,118" />
    <line x1="38" y1="103" x2="181" y2="62" />
    <text x="34" y="132" className="line-label">P</text><text x="184" y="58" className="line-label">l</text>
    {data.points.map((point) => <g key={point.name}><circle cx={point.x} cy={point.y} r="3" className={point.target ? 'highlight-point' : ''} /><text x={point.x + 6} y={point.y - 6} className="point-label">{point.name}</text></g>)}
  </svg>;
}

function PartitionDiagram({ data }) {
  const xs = data.parts === 2 ? [32, 120, 208] : [32, 91, 150, 208];
  const names = data.parts === 2 ? ['A', 'M', 'B'] : ['A', 'M', 'N', 'B'];
  return <svg className="generated-geometry" viewBox="0 0 240 105" role="img" aria-label="segment divided into equal parts">
    <line x1="32" y1="62" x2="208" y2="62" />
    {xs.map((x, index) => <g key={names[index]}><line x1={x} y1="55" x2={x} y2="69" /><circle cx={x} cy="62" r="2.6" /><text x={x} y="84" textAnchor="middle" className="point-label">{names[index]}</text></g>)}
    <path className="measure-arc" d="M32 43 Q120 5 208 43" />
    <text x="120" y="22" textAnchor="middle" className="value-label">{data.total} cm</text>
  </svg>;
}

function AngleNotationDiagram({ data }) {
  const rays = [{ name: 'A', degree: 205 }, { name: 'B', degree: 180 }, { name: 'C', degree: 135 }, { name: 'D', degree: 75 }];
  const point = (degree, length = 78) => ({ x: 110 + length * Math.cos((degree * Math.PI) / 180), y: 100 + length * Math.sin((degree * Math.PI) / 180) });
  const selected = rays.filter((ray) => data.ends.includes(ray.name)).sort((a, b) => a.degree - b.degree);
  return <svg className="generated-geometry" viewBox="0 0 220 135" role="img" aria-label="angle notation with vertex O">
    {rays.map((ray) => { const end = point(ray.degree); return <g key={ray.name}><line x1="110" y1="100" x2={end.x} y2={end.y} /><text x={end.x + 2} y={end.y - 5} className="point-label">{ray.name}</text></g>; })}
    <circle cx="110" cy="100" r="3" /><text x="114" y="117" className="point-label">O</text>
    <Arc cx={110} cy={100} radius={28} start={selected[0].degree} end={selected[1].degree} className="angle-arc target-arc" />
  </svg>;
}

function PerpendicularDiagram({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 230 145" role="img" aria-label="perpendicular from point P to line l">
    <line x1="25" y1="112" x2="205" y2="112" /><line x1="112" y1="28" x2="112" y2="112" /><line x1="112" y1="28" x2="184" y2="112" className="guide-line" />
    <path className="right-mark" d="M112 99 h13 v13" />
    <circle cx="112" cy="28" r="3" /><circle cx="112" cy="112" r="3" /><circle cx="184" cy="112" r="3" />
    <text x="101" y="23" className="point-label">P</text><text x="99" y="130" className="point-label">H</text><text x="181" y="130" className="point-label">Q</text><text x="207" y="116" className="line-label">l</text>
    {data.length ? <text x="82" y="74" className="value-label">{data.length} cm</text> : null}
  </svg>;
}

function ParallelTestDiagram({ data }) {
  const top = { x: 75, y: 42 };
  const bottom = { x: top.x + 74 / Math.tan((data.a * Math.PI) / 180), y: 116 };
  const delta = data.a - data.b;
  const transX = (y) => top.x + (y - top.y) / Math.tan((data.a * Math.PI) / 180);
  const linePoint = (direction, length) => ({ x: bottom.x + length * Math.cos((direction * Math.PI) / 180), y: bottom.y + length * Math.sin((direction * Math.PI) / 180) });
  const m1 = linePoint(delta, -125); const m2 = linePoint(delta, 125);
  return <svg className="generated-geometry" viewBox="0 0 240 155" role="img" aria-label="test whether two lines are parallel">
    <line x1="20" y1="42" x2="220" y2="42" /><line x1={m1.x} y1={m1.y} x2={m2.x} y2={m2.y} /><line x1={transX(8)} y1="8" x2={transX(150)} y2="150" />
    <Arc cx={top.x} cy={top.y} radius={19} start={0} end={data.a} /><Arc cx={bottom.x} cy={bottom.y} radius={19} start={180 + delta} end={180 + data.a} className="angle-arc target-arc" />
    <text x={top.x + 30} y={top.y + 5} className="value-label">{data.a}°</text><text x={bottom.x - 42} y={bottom.y - 7} className="target-label">{data.b}°</text>
    <text x="224" y="46" className="line-label">l</text><text x="224" y="120" className="line-label">m</text>
  </svg>;
}

function ZigzagDiagram({ data }) {
  const vertex = { x: 102, y: 83 };
  const topX = vertex.x + (vertex.y - 30) / Math.tan((data.a * Math.PI) / 180);
  const bottomX = vertex.x + (135 - vertex.y) / Math.tan((data.b * Math.PI) / 180);
  return <svg className="generated-geometry" viewBox="0 0 250 165" role="img" aria-label="broken transversal between parallel lines">
    <line x1="18" y1="30" x2="232" y2="30" /><line x1="18" y1="135" x2="232" y2="135" />
    <polyline points={`${topX},30 ${vertex.x},${vertex.y} ${bottomX},135`} />
    <path className="parallel-mark" d="M38 26 l7 4 l-7 4 M51 26 l7 4 l-7 4 M38 131 l7 4 l-7 4 M51 131 l7 4 l-7 4" />
    <text x={topX - 34} y="48" className="value-label">{data.a}°</text><text x={bottomX - 34} y="126" className="value-label">{data.b}°</text><text x="111" y="82" className="target-label">x</text>
    <text x="234" y="34" className="line-label">l</text><text x="234" y="139" className="line-label">m</text>
  </svg>;
}

function TriPyramidDiagram() {
  const points = { A: [110, 18], B: [35, 108], C: [112, 137], D: [190, 105] };
  const edges = [['A','B'],['A','C'],['A','D'],['B','C'],['C','D'],['B','D']];
  return <svg className="generated-geometry generated-solid" viewBox="0 0 225 155" role="img" aria-label="triangular pyramid">
    {edges.map(([a,b]) => <line key={`${a}${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} className={a === 'B' && b === 'D' ? 'hidden-edge' : ''} />)}
    {Object.entries(points).map(([name,[x,y]]) => <g key={name}><circle cx={x} cy={y} r="2.5" /><text x={x + 5} y={y - 5} className="point-label">{name}</text></g>)}
  </svg>;
}

function TriPrismDiagram() {
  const points = { A: [110, 18], B: [43, 55], C: [177, 55], D: [110, 94], E: [43, 132], F: [177, 132] };
  const edges = [['A','B'],['B','C'],['C','A'],['D','E'],['E','F'],['F','D'],['A','D'],['B','E'],['C','F']];
  return <svg className="generated-geometry generated-solid" viewBox="0 0 225 150" role="img" aria-label="triangular prism">
    {edges.map(([a,b]) => <line key={`${a}${b}`} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} className={a === 'A' && b === 'D' ? 'hidden-edge' : ''} />)}
    {Object.entries(points).map(([name,[x,y]]) => <g key={name}><circle cx={x} cy={y} r="2.5" /><text x={x + 5} y={y - 5} className="point-label">{name}</text></g>)}
  </svg>;
}

function CircleDiagram({ data }) {
  const cx = 110; const cy = 78; const radius = 48;
  const end = { x: cx + radius * Math.cos((-data.theta * Math.PI) / 180), y: cy + radius * Math.sin((-data.theta * Math.PI) / 180) };
  const sector = `M ${cx} ${cy} L ${cx + radius} ${cy} A ${radius} ${radius} 0 ${data.theta > 180 ? 1 : 0} 0 ${end.x} ${end.y} Z`;
  return <svg className="generated-geometry" viewBox="0 0 230 145" role="img" aria-label="circle and sector">
    <circle cx={cx} cy={cy} r={radius} className="circle-outline" />
    {data.showSector ? <path d={sector} className="sector-fill" /> : null}
    <line x1={cx} y1={cy} x2={cx + radius} y2={cy} />{data.showSector ? <line x1={cx} y1={cy} x2={end.x} y2={end.y} /> : null}
    <circle cx={cx} cy={cy} r="2.6" /><text x={cx - 13} y={cy + 16} className="point-label">O</text>
    <text x={cx + 24} y={cy + 18} className={data.unknownRadius ? 'target-label' : 'value-label'}>r={data.unknownRadius ? 'x' : data.radius}</text>
    {data.circumferenceLabel ? <text x={cx} y="17" textAnchor="middle" className="value-label">{data.circumferenceLabel}</text> : null}
    {data.showSector ? <><Arc cx={cx} cy={cy} radius={23} start={-data.theta} end={0} /><text x={cx + 7} y={cy - 31} className={data.unknownTheta ? 'target-label' : 'value-label'}>{data.unknownTheta ? 'x°' : `${data.theta}°`}</text>{data.arcLabel ? <text x="178" y="37" textAnchor="middle" className="value-label">{data.arcLabel}</text> : null}</> : null}
  </svg>;
}

function TrianglePairDiagram({ data }) {
  if (data.mode === 'congruence') return <svg className="generated-geometry" viewBox="0 0 250 145" role="img" aria-label="two triangles with congruence markings">
    <polygon points="18,122 102,122 50,30" /><polygon points="148,122 232,122 200,30" />
    <text x="22" y="116" className="value-label">{data.labels[0]}</text><text x="70" y="80" className="value-label">{data.labels[1]}</text><text x="46" y="136" className="value-label">{data.labels[2]}</text>
    <text x="152" y="116" className="value-label">{data.labels[0]}</text><text x="200" y="80" className="value-label">{data.labels[1]}</text><text x="176" y="136" className="value-label">{data.labels[2]}</text>
    {data.condition !== 'SSS' ? <><Arc cx={18} cy={122} radius={20} start={-60} end={0} /><Arc cx={148} cy={122} radius={20} start={-60} end={0} /></> : null}
    {data.condition === 'ASA' ? <><Arc cx={102} cy={122} radius={18} start={180} end={240} className="angle-arc target-arc" /><Arc cx={232} cy={122} radius={18} start={180} end={240} className="angle-arc target-arc" /></> : null}
  </svg>;
  const scaleFactor = data.largeBase / data.smallBase;
  const unit = Math.min(90 / (data.smallHeight * scaleFactor), 112 / data.largeBase);
  const smallWidth = data.smallBase * unit; const smallHeight = data.smallHeight * unit;
  const largeWidth = data.largeBase * unit; const largeHeightPx = data.smallHeight * scaleFactor * unit;
  const bottom = 125; const left1 = 20; const left2 = 145;
  return <svg className="generated-geometry" viewBox="0 0 275 150" role="img" aria-label="two similar triangles with corresponding sides">
    <polygon points={`${left1},${bottom} ${left1 + smallWidth},${bottom} ${left1},${bottom - smallHeight}`} /><polygon points={`${left2},${bottom} ${left2 + largeWidth},${bottom} ${left2},${bottom - largeHeightPx}`} />
    <path className="right-mark" d={`M${left1} ${bottom - 11} h11 v11 M${left2} ${bottom - 11} h11 v11`} />
    <text x={left1 + smallWidth / 2} y="143" textAnchor="middle" className="value-label">{data.smallBase}</text><text x={left1 - 14} y={bottom - smallHeight / 2} className="value-label">{data.smallHeight}</text>
    <text x={left2 + largeWidth / 2} y="143" textAnchor="middle" className="value-label">{data.largeBase}</text><text x={left2 - 15} y={bottom - largeHeightPx / 2} className={data.showTarget === false ? 'value-label' : 'target-label'}>{data.showTarget === false ? data.largeHeight : 'x'}</text>
  </svg>;
}

function ConstructionDiagram({ data }) {
  if (data.mode === 'segment') return <svg className="generated-geometry" viewBox="0 0 250 150" role="img" aria-label="copying a segment with a compass">
    <line x1="35" y1="42" x2="112" y2="42" className="highlight-edge" /><circle cx="35" cy="42" r="3" /><circle cx="112" cy="42" r="3" />
    <text x="29" y="32" className="point-label">A</text><text x="108" y="32" className="point-label">B</text>
    <line x1="35" y1="112" x2="218" y2="112" /><polygon className="arrow-head" points="218,112 207,106 207,118" />
    <circle cx="35" cy="112" r="3" /><circle cx="112" cy="112" r="3" className="highlight-point" />
    <path className="construction-arc" d="M67 42 A77 77 0 0 1 112 112" />
    <text x="28" y="133" className="point-label">P</text><text x="108" y="133" className="point-label">Q</text><text x="222" y="117" className="point-label">X</text>
    <text x="153" y="91" className="construction-note">PQ = AB</text>
  </svg>;
  if (data.mode === 'angle') return <svg className="generated-geometry" viewBox="0 0 270 150" role="img" aria-label="copying an angle with straightedge and compass">
    <line x1="42" y1="116" x2="112" y2="116" /><line x1="42" y1="116" x2="91" y2="52" />
    <line x1="158" y1="116" x2="238" y2="116" /><line x1="158" y1="116" x2="207" y2="52" />
    <Arc cx={42} cy={116} radius={31} start={-53} end={0} className="construction-arc" /><Arc cx={158} cy={116} radius={31} start={-53} end={0} className="construction-arc" />
    <path className="construction-guide" d="M61 91 Q73 101 77 116 M177 91 Q189 101 193 116" />
    <text x="35" y="134" className="point-label">O</text><text x="113" y="121" className="point-label">B</text><text x="91" y="47" className="point-label">A</text>
    <text x="151" y="134" className="point-label">P</text><text x="240" y="121" className="point-label">Y</text><text x="207" y="47" className="point-label">X</text>
    <text x="135" y="24" textAnchor="middle" className="construction-note">∠AOB = ∠XPY</text>
  </svg>;
  return <svg className="generated-geometry" viewBox="0 0 250 155" role="img" aria-label="constructing a parallel line by copying an angle">
    <line x1="24" y1="122" x2="226" y2="122" /><line x1="24" y1="42" x2="226" y2="42" className="highlight-edge" />
    <line x1="72" y1="142" x2="176" y2="18" /><Arc cx={89} cy={122} radius={23} start={-50} end={0} className="construction-arc" /><Arc cx={156} cy={42} radius={23} start={130} end={180} className="construction-arc" />
    <path className="parallel-mark" d="M38 38 l7 4 l-7 4 M51 38 l7 4 l-7 4 M38 118 l7 4 l-7 4 M51 118 l7 4 l-7 4" />
    <circle cx="156" cy="42" r="3" className="highlight-point" /><text x="163" y="33" className="point-label">P</text><text x="229" y="46" className="line-label">m</text><text x="229" y="126" className="line-label">l</text>
  </svg>;
}

function triangleLayout(sides) {
  const [a, b, c] = sides;
  const x = (c * c + a * a - b * b) / (2 * a);
  const height = Math.sqrt(Math.max(0.01, c * c - x * x));
  const scale = Math.min(165 / a, 95 / height);
  const offsetX = (230 - a * scale) / 2;
  return { A: [offsetX + x * scale, 122 - height * scale], B: [offsetX, 122], C: [offsetX + a * scale, 122] };
}

function TriangleRelationDiagram({ data }) {
  const points = triangleLayout(data.sides); const edgePoints = { AB: [points.A, points.B], BC: [points.B, points.C], CA: [points.C, points.A] };
  const sideLabels = { BC: data.sides[0], CA: data.sides[1], AB: data.sides[2] };
  const mid = ([p, q]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const angleCircle = points[data.highlightAngle];
  return <svg className="generated-geometry" viewBox="0 0 230 150" role="img" aria-label="triangle side and opposite angle relationship">
    <polygon points={`${points.A.join(',')} ${points.B.join(',')} ${points.C.join(',')}`} />
    {data.highlightSide ? <line x1={edgePoints[data.highlightSide][0][0]} y1={edgePoints[data.highlightSide][0][1]} x2={edgePoints[data.highlightSide][1][0]} y2={edgePoints[data.highlightSide][1][1]} className="highlight-edge" /> : null}
    {angleCircle ? <circle cx={angleCircle[0]} cy={angleCircle[1]} r="10" className="highlight-angle-ring" /> : null}
    {Object.entries(points).map(([name, [x, y]]) => <text key={name} x={x + (name === 'B' ? -12 : name === 'C' ? 6 : -3)} y={y + (name === 'A' ? -8 : 17)} className="point-label">{name}</text>)}
    {data.showLengths ? Object.entries(edgePoints).map(([name, pair]) => { const [x, y] = mid(pair); return <text key={name} x={x + (name === 'AB' ? -13 : name === 'CA' ? 8 : 0)} y={y + (name === 'BC' ? 18 : 0)} textAnchor="middle" className="value-label">{sideLabels[name]}</text>; }) : null}
  </svg>;
}

function SegmentSetDiagram({ data }) {
  const max = Math.max(...data.lengths);
  return <svg className="generated-geometry" viewBox="0 0 250 145" role="img" aria-label="three segments for the triangle inequality">
    {data.lengths.map((length, index) => { const width = 145 * length / max; const y = 32 + index * 43; const left = (210 - width) / 2; return <g key={`${length}-${index}`}><line x1={left} y1={y} x2={left + width} y2={y} /><line x1={left} y1={y - 6} x2={left} y2={y + 6} /><line x1={left + width} y1={y - 6} x2={left + width} y2={y + 6} /><text x="222" y={y + 4} className="value-label">{length} cm</text></g>; })}
  </svg>;
}

function CongruenceMappingDiagram({ data }) {
  const left = { A: [62, 24], B: [18, 124], C: [112, 124] }; const right = { D: [188, 24], E: [144, 124], F: [238, 124] };
  const leftSides = [['A','B'],['B','C'],['C','A']]; const rightSides = [['D','E'],['E','F'],['F','D']];
  const leftAngles = ['A','B','C']; const rightAngles = ['D','E','F'];
  const drawTriangle = (points) => <polygon points={Object.values(points).map((point) => point.join(',')).join(' ')} />;
  return <svg className="generated-geometry" viewBox="0 0 256 150" role="img" aria-label="corresponding parts of congruent triangles">
    {drawTriangle(left)}{drawTriangle(right)}
    {data.askSide ? <><line x1={left[leftSides[data.index][0]][0]} y1={left[leftSides[data.index][0]][1]} x2={left[leftSides[data.index][1]][0]} y2={left[leftSides[data.index][1]][1]} className="highlight-edge" /><line x1={right[rightSides[data.index][0]][0]} y1={right[rightSides[data.index][0]][1]} x2={right[rightSides[data.index][1]][0]} y2={right[rightSides[data.index][1]][1]} className="target-edge" /></> : <><circle cx={left[leftAngles[data.index]][0]} cy={left[leftAngles[data.index]][1]} r="10" className="highlight-angle-ring" /><circle cx={right[rightAngles[data.index]][0]} cy={right[rightAngles[data.index]][1]} r="10" className="target-angle-ring" /></>}
    {Object.entries({ ...left, ...right }).map(([name, [x, y]]) => <text key={name} x={x + (['B','E'].includes(name) ? -12 : ['C','F'].includes(name) ? 6 : -3)} y={y + (['A','D'].includes(name) ? -8 : 17)} className="point-label">{name}</text>)}
    <text x="128" y="80" textAnchor="middle" className="construction-note">≡</text>
  </svg>;
}

function RightTriangleDiagram({ data }) {
  const unit = Math.min(88 / data.a, 155 / data.b); const height = data.a * unit; const width = data.b * unit;
  const left = 34; const bottom = 126;
  return <svg className="generated-geometry" viewBox="0 0 230 150" role="img" aria-label="right triangle for the Pythagorean theorem">
    <polygon points={`${left},${bottom} ${left + width},${bottom} ${left},${bottom - height}`} />
    <path className="right-mark" d={`M${left} ${bottom - 14} h14 v14`} />
    <text x={left - 25} y={bottom - height / 2} className={data.unknown === 'a' ? 'target-label' : 'value-label'}>{data.unknown === 'a' ? 'x' : data.a}</text>
    <text x={left + width / 2} y={bottom + 17} className={data.unknown === 'b' ? 'target-label' : 'value-label'}>{data.unknown === 'b' ? 'x' : data.b}</text>
    <text x={left + width / 2 + 4} y={bottom - height / 2 - 7} className={data.unknown === 'c' ? 'target-label' : 'value-label'}>{data.unknown === 'c' ? 'x' : data.c}</text>
  </svg>;
}

function RectangleDiagonalDiagram({ data }) {
  const scale = Math.min(145 / data.width, 82 / data.height); const width = data.width * scale; const height = data.height * scale;
  const left = (230 - width) / 2; const top = 24; const bottom = top + height;
  return <svg className="generated-geometry" viewBox="0 0 230 145" role="img" aria-label="rectangle with a diagonal">
    <rect x={left} y={top} width={width} height={height} className="shape-outline" />
    <line x1={left} y1={bottom} x2={left + width} y2={top} className="highlight-edge" />
    <path className="right-mark" d={`M${left} ${bottom - 13} h13 v13`} />
    <text x={left + width / 2} y={bottom + 18} textAnchor="middle" className="value-label">{data.width} cm</text>
    <text x={left - 7} y={top + height / 2} textAnchor="end" className="value-label">{data.height} cm</text>
    <text x={left + width / 2 + 8} y={top + height / 2 - 8} className="target-label">x</text>
  </svg>;
}

function CoordinateGeometryDiagram({ data }) {
  const size = 190; const origin = 100; const scale = 16;
  const map = ([x, y]) => [origin + x * scale, origin - y * scale];
  const [ax, ay] = map(data.a); const [bx, by] = map(data.b);
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox={`0 0 ${size + 20} ${size + 5}`} role="img" aria-label="coordinate geometry diagram">
    {Array.from({ length: 11 }, (_, index) => index - 5).map((value) => <g key={value}><line x1={origin + value * scale} y1="20" x2={origin + value * scale} y2="180" className="coord-grid" /><line x1="20" y1={origin + value * scale} x2="180" y2={origin + value * scale} className="coord-grid" /></g>)}
    <line x1="18" y1={origin} x2="185" y2={origin} className="axis-line" /><line x1={origin} y1="182" x2={origin} y2="15" className="axis-line" />
    {data.circle ? <circle cx={map(data.circle.center)[0]} cy={map(data.circle.center)[1]} r={data.circle.radius * scale} className="coordinate-circle" /> : <line x1={ax} y1={ay} x2={bx} y2={by} className="highlight-edge" />}
    <circle cx={ax} cy={ay} r="3.2" className="highlight-point" /><circle cx={bx} cy={by} r="3.2" className="highlight-point" />
    <text x={ax + 6} y={ay - 7} className="point-label">A{`(${data.a[0]},${data.a[1]})`}</text><text x={bx + 6} y={by - 7} className="point-label">B{`(${data.b[0]},${data.b[1]})`}</text>
    {data.p ? <><circle cx={map(data.p)[0]} cy={map(data.p)[1]} r="4" className="target-point" /><text x={map(data.p)[0] + 6} y={map(data.p)[1] + 14} className="target-label">P</text></> : null}
    <text x="188" y={origin + 4} className="line-label">x</text><text x={origin + 5} y="14" className="line-label">y</text>
  </svg>;
}

const BOX_POINTS = { A: [65, 28], B: [34, 58], C: [34, 128], D: [65, 98], E: [154, 28], F: [123, 58], G: [123, 128], H: [154, 98] };
const BOX_EDGES = [['A','B'],['B','C'],['C','D'],['D','A'],['E','F'],['F','G'],['G','H'],['H','E'],['A','E'],['B','F'],['C','G'],['D','H']];

function SolidDiagram({ data }) {
  return <svg className="generated-geometry generated-solid" viewBox="0 0 190 155" role="img" aria-label="rectangular prism with labelled vertices">
    {data.highlightFace ? <polygon className="highlight-face" points={data.highlightFace.split('').map((name) => BOX_POINTS[name].join(',')).join(' ')} /> : null}
    {BOX_EDGES.map(([a,b]) => <line key={`${a}${b}`} x1={BOX_POINTS[a][0]} y1={BOX_POINTS[a][1]} x2={BOX_POINTS[b][0]} y2={BOX_POINTS[b][1]} className={data.hidden?.includes(`${a}${b}`) ? 'hidden-edge' : ''} />)}
    {Object.entries(BOX_POINTS).map(([name,[x,y]]) => <g key={name}><circle cx={x} cy={y} r="2" /><text x={x + (name === 'B' || name === 'C' ? -11 : 5)} y={y - 4} className="point-label">{name}</text></g>)}
    {data.highlight?.map((edge) => { const [a,b] = edge.split(''); return <line key={`h-${edge}`} x1={BOX_POINTS[a][0]} y1={BOX_POINTS[a][1]} x2={BOX_POINTS[b][0]} y2={BOX_POINTS[b][1]} className="highlight-edge" />; })}
  </svg>;
}

export default function GeometryDiagram({ diagram }) {
  if (!diagram) return null;
  if (diagram.kind === 'angle') return <AngleDiagram data={diagram} />;
  if (diagram.kind === 'intersecting') return <IntersectingDiagram data={diagram} />;
  if (diagram.kind === 'parallel') return <ParallelDiagram data={diagram} />;
  if (diagram.kind === 'triangle') return <TriangleDiagram data={diagram} />;
  if (diagram.kind === 'line-type') return <LineTypeDiagram data={diagram} />;
  if (diagram.kind === 'point-plane') return <PointPlaneDiagram data={diagram} />;
  if (diagram.kind === 'partition') return <PartitionDiagram data={diagram} />;
  if (diagram.kind === 'angle-notation') return <AngleNotationDiagram data={diagram} />;
  if (diagram.kind === 'perpendicular') return <PerpendicularDiagram data={diagram} />;
  if (diagram.kind === 'parallel-test') return <ParallelTestDiagram data={diagram} />;
  if (diagram.kind === 'zigzag') return <ZigzagDiagram data={diagram} />;
  if (diagram.kind === 'tri-pyramid') return <TriPyramidDiagram />;
  if (diagram.kind === 'tri-prism') return <TriPrismDiagram />;
  if (diagram.kind === 'circle-sector') return <CircleDiagram data={diagram} />;
  if (diagram.kind === 'triangle-pair') return <TrianglePairDiagram data={diagram} />;
  if (diagram.kind === 'construction') return <ConstructionDiagram data={diagram} />;
  if (diagram.kind === 'triangle-relation') return <TriangleRelationDiagram data={diagram} />;
  if (diagram.kind === 'segment-set') return <SegmentSetDiagram data={diagram} />;
  if (diagram.kind === 'congruence-mapping') return <CongruenceMappingDiagram data={diagram} />;
  if (diagram.kind === 'right-triangle') return <RightTriangleDiagram data={diagram} />;
  if (diagram.kind === 'rectangle-diagonal') return <RectangleDiagonalDiagram data={diagram} />;
  if (diagram.kind === 'coordinate-geometry') return <CoordinateGeometryDiagram data={diagram} />;
  if (diagram.kind === 'solid') return <SolidDiagram data={diagram} />;
  return <AdvancedGeometryDiagram diagram={diagram} />;
}
