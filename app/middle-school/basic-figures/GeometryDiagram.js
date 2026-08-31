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

function TriangleExteriorBasicDiagram({ data }) {
  const left = { x: 34, y: 128 }; const right = { x: 174, y: 128 }; const apex = { x: 103, y: 30 };
  return <svg className="generated-geometry" viewBox="0 0 240 160" role="img" aria-label="triangle interior and exterior angle problem">
    <polygon points={`${left.x},${left.y} ${right.x},${right.y} ${apex.x},${apex.y}`} />
    <Arc cx={left.x} cy={left.y} radius={24} start={-55} end={0} />
    <text x="55" y="119" className="value-label">{data.a}°</text>
    {data.exterior ? <>
      <line x1={right.x} y1={right.y} x2="225" y2={right.y} className="highlight-edge" />
      <Arc cx={right.x} cy={right.y} radius={25} start={-125} end={0} className="angle-arc target-arc" />
      <text x="190" y="109" className="target-label">x</text>
      <text x="102" y="58" className="value-label">{data.b}°</text>
    </> : <>
      <Arc cx={right.x} cy={right.y} radius={24} start={180} end={235} />
      <text x="145" y="119" className="value-label">{data.b}°</text>
      <text x="99" y="58" className="target-label">x</text>
    </>}
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

function regularPoints(n, cx = 115, cy = 78, radius = 58, rotation = -90) {
  return Array.from({ length: n }, (_, index) => { const angle = (rotation + index * 360 / n) * Math.PI / 180; return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]; });
}

function PolygonBasicDiagram({ data }) {
  const points = regularPoints(data.n); const pointString = points.map((point) => point.join(',')).join(' '); const diagonals = [];
  if (data.mode === 'vertex-diagonals') for (let i = 2; i < data.n - 1; i += 1) diagonals.push([points[0], points[i]]);
  if (data.mode === 'all-diagonals' && data.n <= 8) for (let i = 0; i < data.n; i += 1) for (let j = i + 1; j < data.n; j += 1) if (j !== i + 1 && !(i === 0 && j === data.n - 1)) diagonals.push([points[i], points[j]]);
  return <svg className="generated-geometry" viewBox="0 0 230 160" role="img" aria-label={`${data.n}-gon`}><polygon points={pointString} />{diagonals.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="guide-line" />)}{data.mode === 'exterior' ? <><line x1={points[0][0]} y1={points[0][1]} x2={points[0][0] + 55} y2={points[0][1]} className="highlight-edge" /><text x={points[0][0] + 18} y={points[0][1] + 18} className="target-label">x</text></> : null}<text x="115" y="153" textAnchor="middle" className="value-label">{data.n}-gon</text></svg>;
}

function CirclePartsDiagram({ data }) {
  const target = data.target;
  return <svg className="generated-geometry" viewBox="0 0 230 155" role="img" aria-label="parts of a circle"><circle cx="110" cy="76" r="55" className="circle-outline" /><circle cx="110" cy="76" r="3" className="target-point" /><text x="99" y="91">O</text><g transform={`rotate(${data.rotation || 0} 110 76)`}>{target === 'radius' ? <line x1="110" y1="76" x2="165" y2="76" className="highlight-edge" /> : null}{target === 'diameter' ? <line x1="55" y1="76" x2="165" y2="76" className="highlight-edge" /> : null}{target === 'chord' ? <line x1="72" y1="36" x2="154" y2="112" className="highlight-edge" /> : null}{target === 'arc' ? <path d="M72 36 A55 55 0 0 1 154 112" className="highlight-edge" fill="none" /> : null}</g></svg>;
}

function CircleRatioDiagram({ data }) {
  const sector = (cx, theta, fill) => { const r = 45; const endAngle = -90 + theta; const start = [cx, 75 - r]; const end = [cx + r * Math.cos(endAngle * Math.PI / 180), 75 + r * Math.sin(endAngle * Math.PI / 180)]; return <path d={`M${cx} 75 L${start[0]} ${start[1]} A${r} ${r} 0 ${theta > 180 ? 1 : 0} 1 ${end[0]} ${end[1]} Z`} className={fill} />; };
  return <svg className="generated-geometry" viewBox="0 0 250 155" role="img" aria-label="two sectors in the same circle">{sector(65, data.thetaA, 'sector-fill')}{sector(185, data.thetaB, 'highlight-face')}<text x="65" y="140" textAnchor="middle" className="value-label">{data.thetaA}° · {data.valueA}</text><text x="185" y="140" textAnchor="middle" className="target-label">{data.thetaB}° · x</text></svg>;
}

function AnnulusDiagram({ data }) {
  const scale = 52 / data.outer;
  return <svg className="generated-geometry" viewBox="0 0 230 155" role="img" aria-label="annulus"><circle cx="110" cy="75" r={data.outer * scale} className="sector-fill" /><circle cx="110" cy="75" r={data.inner * scale} fill="white" className="circle-outline" /><line x1="110" y1="75" x2={110 + data.outer * scale} y2="75" /><line x1="110" y1="75" x2={110 + data.inner * scale} y2="75" className="guide-line" /><text x="122" y="68" className="value-label">{data.inner}</text><text x="157" y="68" className="value-label">{data.outer}</text></svg>;
}

function AnnularSectorDiagram({ data }) {
  const cx = 104; const cy = 125; const scale = 74 / data.outer;
  const outer = data.outer * scale; const inner = data.inner * scale; const endAngle = -data.theta;
  const point = (radius, degree) => ({ x: cx + radius * Math.cos(degree * Math.PI / 180), y: cy + radius * Math.sin(degree * Math.PI / 180) });
  const outerStart = point(outer, 0); const outerEnd = point(outer, endAngle); const innerStart = point(inner, 0); const innerEnd = point(inner, endAngle);
  const large = data.theta > 180 ? 1 : 0;
  const path = `M${outerStart.x} ${outerStart.y} A${outer} ${outer} 0 ${large} 0 ${outerEnd.x} ${outerEnd.y} L${innerEnd.x} ${innerEnd.y} A${inner} ${inner} 0 ${large} 1 ${innerStart.x} ${innerStart.y} Z`;
  return <svg className="generated-geometry" viewBox="0 0 230 165" role="img" aria-label="annular sector">
    <path d={path} className="sector-fill" />
    <line x1={cx} y1={cy} x2={outerStart.x} y2={outerStart.y} />
    <line x1={cx} y1={cy} x2={outerEnd.x} y2={outerEnd.y} />
    <Arc cx={cx} cy={cy} radius={21} start={endAngle} end={0} />
    <text x={cx + 25} y={cy - 9} className="value-label">{data.theta}°</text>
    <text x={cx + inner / 2 - 8} y={cy + 17} className="value-label">{data.inner}</text>
    <text x={cx + outer - 16} y={cy + 17} className="value-label">{data.outer}</text>
    <circle cx={cx} cy={cy} r="2.5" />
  </svg>;
}

function PolyhedronGeneralDiagram({ data }) {
  const top = regularPoints(data.n, 115, 45, 36, -90); const bottom = regularPoints(data.n, 115, 112, 48, -90);
  if (data.solid === 'pyramid') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 165" role="img" aria-label={`${data.n}-gonal pyramid`}><polygon points={bottom.map(p => p.join(',')).join(' ')} />{bottom.map((p, i) => <line key={i} x1="115" y1="18" x2={p[0]} y2={p[1]} className={i > data.n / 2 ? 'hidden-edge' : ''} />)}<text x="115" y="157" textAnchor="middle">{data.n}-gonal pyramid</text></svg>;
  return <svg className="generated-geometry generated-solid" viewBox="0 0 230 165" role="img" aria-label={`${data.n}-gonal prism`}><polygon points={top.map(p => p.join(',')).join(' ')} /><polygon points={bottom.map(p => p.join(',')).join(' ')} />{top.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={bottom[i][0]} y2={bottom[i][1]} />)}<text x="115" y="160" textAnchor="middle">{data.n}-gonal prism</text></svg>;
}

function RegularPolyhedronDiagram({ data }) {
  return <svg className="generated-geometry generated-solid" viewBox="0 0 230 160" role="img" aria-label={data.name}><polygon points="115,18 38,112 192,112" /><polygon points="115,143 38,48 192,48" /><line x1="38" y1="112" x2="192" y2="48" className="guide-line" /><line x1="192" y1="112" x2="38" y2="48" className="guide-line" /><text x="115" y="157" textAnchor="middle" className="value-label">{data.name} · {data.faces} faces</text></svg>;
}

function RevolutionDiagram({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 230 160" role="img" aria-label="solid of revolution"><line x1="60" y1="20" x2="60" y2="140" className="highlight-edge" />{data.source === 'cylinder' ? <rect x="60" y="42" width="65" height="76" className="shape-outline" /> : data.source === 'cone' ? <polygon points="60,35 60,125 135,125" /> : <path d="M60 30 A55 55 0 0 1 60 140 Z" className="sector-fill" />}<path d="M148 52 Q190 80 148 108" className="measure-arc" /><polygon points="148,108 145,97 155,101" className="arrow-head" /><text x="174" y="82" className="target-label">360°</text></svg>;
}

function RevolutionSectionDiagram({ data }) {
  const axisPlane = data.plane?.includes('회전축을 포함');
  if (data.source === 'sphere') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 165" role="img" aria-label="sphere cross-section"><circle cx="112" cy="80" r="57" className="sector-fill" /><ellipse cx="112" cy="80" rx="57" ry="17" className="hidden-edge" /><ellipse cx="112" cy="80" rx="40" ry="12" className="highlight-edge" /><text x="112" y="157" textAnchor="middle" className="target-label">cross-section</text></svg>;
  if (data.source === 'cone') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 170" role="img" aria-label="cone cross-section"><ellipse cx="112" cy="137" rx="55" ry="15" /><line x1="112" y1="18" x2="57" y2="137" /><line x1="112" y1="18" x2="167" y2="137" />{axisPlane ? <polygon points="112,18 65,137 159,137" className="highlight-face" /> : <ellipse cx="112" cy="91" rx="34" ry="9" className="highlight-edge" />}<text x="112" y="163" textAnchor="middle" className="target-label">cross-section</text></svg>;
  return <svg className="generated-geometry generated-solid" viewBox="0 0 230 170" role="img" aria-label="cylinder cross-section"><ellipse cx="112" cy="31" rx="51" ry="14" className="sector-fill" /><line x1="61" y1="31" x2="61" y2="137" /><line x1="163" y1="31" x2="163" y2="137" /><ellipse cx="112" cy="137" rx="51" ry="14" />{axisPlane ? <rect x="82" y="31" width="60" height="106" className="highlight-face" /> : <ellipse cx="112" cy="84" rx="51" ry="14" className="highlight-edge" />}<text x="112" y="163" textAnchor="middle" className="target-label">cross-section</text></svg>;
}

function NetBasicDiagram({ data }) {
  const shift = data.shift || 0;
  if (data.net === 'net-cylinder') return <svg className="generated-geometry" viewBox="0 0 240 175" role="img" aria-label="cylinder net"><rect x="45" y="48" width="150" height="68" className="shape-outline" /><circle cx={80 + shift} cy="26" r="22" className="sector-fill" /><circle cx={160 + shift} cy="138" r="22" className="sector-fill" />{data.metric ? <><text x="120" y="68" textAnchor="middle" className="value-label">2πr = {2 * data.r}π</text><text x="202" y="86" className="value-label">h={data.h}</text><text x={80 + shift} y="31" textAnchor="middle" className="value-label">r={data.r}</text></> : null}</svg>;
  if (data.net === 'net-cone') return <svg className="generated-geometry" viewBox="0 0 240 175" role="img" aria-label="cone net"><path d="M55 128 A92 92 0 0 1 187 31 L126 102 Z" className="sector-fill" /><circle cx={176 + shift / 2} cy="128" r="25" className="highlight-face" />{data.metric ? <><text x="102" y="59" className="value-label">l={data.slant}</text><text x="170" y="133" textAnchor="middle" className="value-label">r={data.r}</text></> : null}</svg>;
  return <svg className="generated-geometry" viewBox="0 0 240 175" role="img" aria-label="triangular prism net"><rect x="35" y="55" width="55" height="62" className="shape-outline" /><rect x="90" y="55" width="55" height="62" className="shape-outline" /><rect x="145" y="55" width="55" height="62" className="shape-outline" /><polygon points={`${90 + shift},55 ${117.5 + shift},20 ${145 + shift},55`} /><polygon points={`${90 - shift},117 ${117.5 - shift},152 ${145 - shift},117`} />{data.metric ? <><text x="62" y="91" textAnchor="middle" className="value-label">3 × {data.h}</text><text x="117" y="91" textAnchor="middle" className="value-label">4 × {data.h}</text><text x="172" y="91" textAnchor="middle" className="value-label">5 × {data.h}</text></> : null}</svg>;
}

function MeasurementSolidDiagram({ data }) {
  if (data.solid === 'sphere') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 160" role="img" aria-label="sphere"><circle cx="110" cy="76" r="56" className="sector-fill" /><ellipse cx="110" cy="76" rx="56" ry="17" className="hidden-edge" /><line x1="110" y1="76" x2="166" y2="76" /><text x="130" y="69" className="value-label">r={data.r}</text></svg>;
  if (data.solid === 'hemisphere') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 165" role="img" aria-label="hemisphere"><path d="M50 100 A60 60 0 0 1 170 100 Z" className="sector-fill" /><ellipse cx="110" cy="100" rx="60" ry="18" /><line x1="110" y1="100" x2="170" y2="100" /><text x="133" y="92" className="value-label">r={data.r}</text></svg>;
  if (data.solid === 'cylinder') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 170" role="img" aria-label="cylinder"><ellipse cx="110" cy="35" rx="48" ry="15" className="sector-fill" /><line x1="62" y1="35" x2="62" y2="135" /><line x1="158" y1="35" x2="158" y2="135" /><ellipse cx="110" cy="135" rx="48" ry="15" /><line x1="110" y1="35" x2="158" y2="35" /><text x="126" y="28">r={data.r}</text><text x="164" y="88">h={data.h}</text></svg>;
  if (data.solid === 'cone') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 170" role="img" aria-label="cone"><ellipse cx="110" cy="135" rx="52" ry="15" /><line x1="110" y1="20" x2="58" y2="135" /><line x1="110" y1="20" x2="162" y2="135" /><line x1="110" y1="20" x2="110" y2="135" className="guide-line" /><text x="116" y="82">{data.slant ? `l=${data.slant}` : `h=${data.h}`}</text><text x="130" y="128">r={data.r}</text></svg>;
  if (data.solid === 'triangular-prism') return <svg className="generated-geometry generated-solid" viewBox="0 0 240 170" role="img" aria-label="triangular prism"><polygon points="45,125 45,55 100,125" className="highlight-face" /><polygon points="125,125 125,55 180,125" /><line x1="45" y1="55" x2="125" y2="55" /><line x1="45" y1="125" x2="125" y2="125" /><line x1="100" y1="125" x2="180" y2="125" /><path d="M45 113 h12 v12" className="right-mark" /><text x="27" y="94" className="value-label">3</text><text x="68" y="145" className="value-label">4</text><text x="66" y="86" className="value-label">5</text><text x="112" y="45" className="value-label">h={data.h}</text></svg>;
  if (data.solid === 'frustum') return <svg className="generated-geometry generated-solid" viewBox="0 0 230 170" role="img" aria-label="conical frustum"><ellipse cx="110" cy="38" rx="29" ry="10" className="sector-fill" /><ellipse cx="110" cy="135" rx="58" ry="16" /><line x1="81" y1="38" x2="52" y2="135" /><line x1="139" y1="38" x2="168" y2="135" /><line x1="110" y1="38" x2="110" y2="135" className="guide-line" /><line x1="110" y1="38" x2="139" y2="38" /><line x1="110" y1="135" x2="168" y2="135" /><text x="118" y="31" className="value-label">r={data.inner}</text><text x="136" y="128" className="value-label">R={data.outer}</text><text x="116" y="90" className="value-label">h={data.h}</text></svg>;
  if (data.solid === 'pyramid') return <PolyhedronGeneralDiagram data={{ solid: 'pyramid', n: 4 }} />;
  return <svg className="generated-geometry generated-solid" viewBox="0 0 230 165" role="img" aria-label="cuboid"><polygon points="45,48 145,48 185,25 85,25" /><polygon points="45,48 145,48 145,130 45,130" /><polygon points="145,48 185,25 185,107 145,130" /><text x="87" y="146">{data.w}</text><text x="166" y="126">{data.d}</text><text x="28" y="92">{data.h}</text></svg>;
}

function SolidRatioDiagram({ data }) {
  if (data.solid === 'sphere') return <svg className="generated-geometry generated-solid" viewBox="0 0 250 165" role="img" aria-label="sphere volume ratio"><circle cx="55" cy="84" r="28" className="sector-fill" /><circle cx="174" cy="84" r="56" className="highlight-face" /><line x1="55" y1="84" x2="83" y2="84" /><line x1="174" y1="84" x2="230" y2="84" /><text x="55" y="151" textAnchor="middle" className="value-label">r = 1</text><text x="174" y="151" textAnchor="middle" className="target-label">r = {data.scale}</text></svg>;
  return <svg className="generated-geometry generated-solid" viewBox="0 0 250 165" role="img" aria-label="matching prism and pyramid volumes"><rect x="25" y="42" width="75" height="90" className="shape-outline" /><polygon points="160,132 235,132 198,42" /><text x="62" y="151" textAnchor="middle">V</text><text x="198" y="151" textAnchor="middle" className="target-label">V/3</text></svg>;
}

function tickMarks(p1, p2, count) {
  const mx = (p1[0] + p2[0]) / 2; const my = (p1[1] + p2[1]) / 2;
  const dx = p2[0] - p1[0]; const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len; const uy = dy / len;
  const px = -uy; const py = ux;
  const tickLen = 5; const spacing = 5;
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const offset = (i - (count - 1) / 2) * spacing;
    const cx = mx + ux * offset; const cy = my + uy * offset;
    d += `M${cx - px * tickLen} ${cy - py * tickLen} L${cx + px * tickLen} ${cy + py * tickLen} `;
  }
  return d;
}

// 이등변삼각형: 밑각 정리(∠B=∠C)를 이용해 apexAngle 또는 baseAngle 중 하나를 구하는 문제.
// showFoot이 있으면 꼭지각의 이등분선이 밑변을 수직이등분하는 점 D도 함께 표시한다.
function IsoscelesTriangleDiagram({ data }) {
  const apex = [115, 26]; const left = [32, 128]; const right = [198, 128];
  const foot = [(left[0] + right[0]) / 2, left[1]];
  const apexIsTarget = data.target === 'apex';
  const showAngles = data.showAngles !== false;
  const apexLabel = apexIsTarget ? 'x' : `${data.apexAngle}°`;
  const baseLabel = apexIsTarget ? `${data.baseAngle}°` : 'x';
  return <svg className="generated-geometry" viewBox="0 0 230 150" role="img" aria-label="isosceles triangle with base angle theorem">
    <polygon points={`${apex.join(',')} ${left.join(',')} ${right.join(',')}`} />
    <path className="tick-line" d={tickMarks(apex, left, 1)} />
    <path className="tick-line" d={tickMarks(apex, right, 1)} />
    {data.showFoot ? <>
      <line x1={foot[0]} y1={foot[1]} x2={apex[0]} y2={apex[1]} className="hidden-edge" />
      <path className="right-mark" d={`M${foot[0] - 7} ${foot[1]} v-7 h7`} />
      <text x={foot[0] - 3} y={foot[1] + 16} className="point-label">D</text>
    </> : null}
    {showAngles ? <>
      <Arc cx={left[0]} cy={left[1]} radius={26} start={-50} end={0} className={apexIsTarget ? 'angle-arc' : 'angle-arc target-arc'} />
      <Arc cx={right[0]} cy={right[1]} radius={26} start={180} end={230} className={apexIsTarget ? 'angle-arc' : 'angle-arc target-arc'} />
      <Arc cx={apex[0]} cy={apex[1]} radius={20} start={60} end={120} className={apexIsTarget ? 'angle-arc target-arc' : 'angle-arc'} />
      <text x={apex[0] - 5} y={apex[1] + 32} className={apexIsTarget ? 'target-label' : 'value-label'}>{apexLabel}</text>
      <text x={left[0] + 32} y={left[1] - 10} className={apexIsTarget ? 'value-label' : 'target-label'}>{baseLabel}</text>
      <text x={right[0] - 40} y={right[1] - 10} className={apexIsTarget ? 'value-label' : 'target-label'}>{baseLabel}</text>
    </> : null}
    {(data.lengthLabels || []).map((label, index) => {
      const anchor = label.position === 'BD' ? [(left[0] + foot[0]) / 2, foot[1] + 16] : label.position === 'DC' ? [(foot[0] + right[0]) / 2, foot[1] + 16] : [(left[0] + right[0]) / 2, foot[1] + 16];
      return <text key={index} x={anchor[0]} y={anchor[1]} textAnchor="middle" className={label.isTarget ? 'target-label' : 'value-label'}>{label.text}</text>;
    })}
    <text x={apex[0] - 4} y={apex[1] - 8} className="point-label">A</text>
    <text x={left[0] - 14} y={left[1] + 16} className="point-label">B</text>
    <text x={right[0] + 4} y={right[1] + 16} className="point-label">C</text>
  </svg>;
}

// 삼각형의 외심/내심: 중심점 O(또는 I)에서 세 꼭짓점으로 이은 선분과, 그 위에 표시된 각/길이 값들.
function TriangleCenterDiagram({ data }) {
  const A = [115, 22]; const B = [28, 130]; const C = [202, 130];
  const O = data.center === 'circumcenter' ? [113, 88] : [112, 100];
  const points = { A, B, C };
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  return <svg className="generated-geometry" viewBox="0 0 230 150" role="img" aria-label={`triangle ${data.center}`}>
    <polygon points={`${A.join(',')} ${B.join(',')} ${C.join(',')}`} />
    <line x1={O[0]} y1={O[1]} x2={A[0]} y2={A[1]} className="hidden-edge" />
    <line x1={O[0]} y1={O[1]} x2={B[0]} y2={B[1]} className="hidden-edge" />
    <line x1={O[0]} y1={O[1]} x2={C[0]} y2={C[1]} className="hidden-edge" />
    <circle cx={O[0]} cy={O[1]} r="2.6" className="highlight-point" />
    <text x={O[0] + 4} y={O[1] - 4} className="point-label">{data.center === 'circumcenter' ? 'O' : 'I'}</text>
    <text x={A[0] - 4} y={A[1] - 8} className="point-label">A</text>
    <text x={B[0] - 14} y={B[1] + 16} className="point-label">B</text>
    <text x={C[0] + 4} y={C[1] + 16} className="point-label">C</text>
    {data.labels.map((label, index) => {
      const vertexPos = points[label.vertex];
      const towardO = mid(vertexPos, O);
      const offsetY = label.vertex === 'A' ? 14 : -10;
      return <text key={index} x={towardO[0]} y={towardO[1] + offsetY} textAnchor="middle" className={label.isTarget ? 'target-label' : 'value-label'}>{label.text}</text>;
    })}
  </svg>;
}

const QUAD_LAYOUTS = {
  parallelogram: { A: [70, 26], D: [195, 26], B: [30, 128], C: [155, 128] },
  rectangle: { A: [50, 26], D: [180, 26], B: [50, 128], C: [180, 128] },
  rhombus: { A: [115, 20], D: [198, 78], B: [32, 78], C: [115, 132] },
  square: { A: [70, 26], D: [160, 26], B: [70, 118], C: [160, 118] },
  trapezoid: { A: [80, 26], D: [160, 26], B: [30, 128], C: [200, 128] },
};

// 평행사변형/직사각형/마름모/정사각형/등변사다리꼴 공통 다이어그램. variant에 따라 꼭짓점 배치만 바꾸고,
// showDiagonals·rightAngleCorners·tickSides·labels로 각 사각형 고유의 성질을 표시한다.
function QuadrilateralDiagram({ data }) {
  const points = QUAD_LAYOUTS[data.variant] || QUAD_LAYOUTS.parallelogram;
  const { A, B, C, D } = points;
  const O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
  const cornerMark = (corner) => {
    const p = points[corner];
    const dx = corner === 'A' || corner === 'B' ? 8 : -8;
    const dy = corner === 'A' || corner === 'D' ? 8 : -8;
    return <path key={corner} className="right-mark" d={`M${p[0]} ${p[1] - dy} v${dy} h${dx}`} />;
  };
  return <svg className="generated-geometry" viewBox="0 0 230 150" role="img" aria-label={`${data.variant} with marked properties`}>
    <polygon points={`${A.join(',')} ${D.join(',')} ${C.join(',')} ${B.join(',')}`} />
    {data.showDiagonals ? <>
      <line x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} className="hidden-edge" />
      <line x1={B[0]} y1={B[1]} x2={D[0]} y2={D[1]} className="hidden-edge" />
      <text x={O[0] + 4} y={O[1] - 4} className="point-label">O</text>
    </> : null}
    {(data.rightAngleCorners || []).map(cornerMark)}
    {(data.tickSides || []).map(([p1, p2, count], index) => <path key={index} className="tick-line" d={tickMarks(points[p1], points[p2], count)} />)}
    <text x={A[0] - 6} y={A[1] - 8} className="point-label">A</text>
    <text x={D[0] + 4} y={D[1] - 8} className="point-label">D</text>
    <text x={B[0] - 14} y={B[1] + 16} className="point-label">B</text>
    <text x={C[0] + 4} y={C[1] + 16} className="point-label">C</text>
    {(data.labels || []).map((label, index) => {
      const p = points[label.corner];
      const dx = label.corner === 'B' || label.corner === 'C' ? 22 : -22;
      const dy = label.corner === 'A' || label.corner === 'D' ? 18 : -12;
      return <text key={index} x={p[0] + dx} y={p[1] + dy} textAnchor="middle" className={label.isTarget ? 'target-label' : 'value-label'}>{label.text}</text>;
    })}
  </svg>;
}

export default function GeometryDiagram({ diagram }) {
  if (!diagram) return null;
  if (diagram.kind === 'angle') return <AngleDiagram data={diagram} />;
  if (diagram.kind === 'intersecting') return <IntersectingDiagram data={diagram} />;
  if (diagram.kind === 'parallel') return <ParallelDiagram data={diagram} />;
  if (diagram.kind === 'triangle') return <TriangleDiagram data={diagram} />;
  if (diagram.kind === 'triangle-exterior-basic') return <TriangleExteriorBasicDiagram data={diagram} />;
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
  if (diagram.kind === 'polygon-basic') return <PolygonBasicDiagram data={diagram} />;
  if (diagram.kind === 'circle-parts') return <CirclePartsDiagram data={diagram} />;
  if (diagram.kind === 'circle-ratio') return <CircleRatioDiagram data={diagram} />;
  if (diagram.kind === 'annulus-basic') return <AnnulusDiagram data={diagram} />;
  if (diagram.kind === 'annular-sector-basic') return <AnnularSectorDiagram data={diagram} />;
  if (diagram.kind === 'polyhedron-general') return <PolyhedronGeneralDiagram data={diagram} />;
  if (diagram.kind === 'regular-polyhedron') return <RegularPolyhedronDiagram data={diagram} />;
  if (diagram.kind === 'revolution-basic') return <RevolutionDiagram data={diagram} />;
  if (diagram.kind === 'revolution-section-basic') return <RevolutionSectionDiagram data={diagram} />;
  if (diagram.kind === 'net-basic') return <NetBasicDiagram data={diagram} />;
  if (diagram.kind === 'measurement-solid') return <MeasurementSolidDiagram data={diagram} />;
  if (diagram.kind === 'solid-ratio') return <SolidRatioDiagram data={diagram} />;
  if (diagram.kind === 'isosceles-triangle') return <IsoscelesTriangleDiagram data={diagram} />;
  if (diagram.kind === 'triangle-center-angles') return <TriangleCenterDiagram data={diagram} />;
  if (diagram.kind === 'quadrilateral') return <QuadrilateralDiagram data={diagram} />;
  return <AdvancedGeometryDiagram diagram={diagram} />;
}
