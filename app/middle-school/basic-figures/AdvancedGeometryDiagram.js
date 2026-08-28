const sx = (x) => 26 + x * 16;
const sy = (y) => 132 - y * 12;

function TrigTriangle({ data }) {
  const width = 145; const height = Math.max(55, width * data.opposite / data.adjacent);
  return <svg className="generated-geometry" viewBox="0 0 230 165" role="img" aria-label="right triangle with trigonometric side labels">
    <polygon points={`35,140 180,140 35,${140 - height}`} /><path className="right-mark" d="M35 126 h14 v14" />
    <text x="20" y={140 - height / 2} className="value-label">{data.opposite}</text><text x="105" y="158" className="value-label">{data.adjacent}</text><text x="112" y={128 - height / 2} className="value-label">{data.hypotenuse}</text>
    <path className="angle-arc" d="M154 140 A26 26 0 0 0 160 124" /><text x="148" y="128" className="target-label">θ</text>
  </svg>;
}

function ObliqueTriangle({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 240 160" role="img" aria-label="oblique triangle for sine or cosine rule">
    <polygon points="25,135 215,135 137,25" /><text x="17" y="151" className="point-label">A</text><text x="217" y="151" className="point-label">B</text><text x="137" y="19" className="point-label">C</text>
    {data.sides.map((side, index) => <text key={index} x={[80,178,122][index]} y={[82,86,151][index]} className={data.target === ['a','b','c'][index] ? 'target-label' : 'value-label'}>{data.target === ['a','b','c'][index] ? 'x' : side}</text>)}
    {data.angles?.map((angle, index) => <text key={`a${index}`} x={index ? 188 : 39} y="126" className="value-label">{angle}°</text>)}
  </svg>;
}

function Bearing({ data }) {
  const rad = (data.bearing - 90) * Math.PI / 180; const x = 110 + 65 * Math.cos(rad); const y = 82 + 65 * Math.sin(rad);
  return <svg className="generated-geometry" viewBox="0 0 220 170" role="img" aria-label={`bearing ${data.bearing} degrees`}>
    <line x1="110" y1="15" x2="110" y2="150" className="axis-line" /><line x1="40" y1="82" x2="180" y2="82" className="axis-line" /><line x1="110" y1="82" x2={x} y2={y} className="highlight-edge" />
    <text x="105" y="12">N</text><text x="184" y="86">E</text><text x="105" y="164">S</text><text x="27" y="86">W</text><text x="122" y="48" className="value-label">{data.bearing}°</text>
  </svg>;
}

function AdvancedCircle({ data }) {
  const common = <circle cx="110" cy="78" r="52" className="circle-outline" />;
  if (data.mode === 'inscribed') return <svg className="generated-geometry" viewBox="0 0 230 160" role="img" aria-label="inscribed angle and intercepted arc">{common}<polyline points="63,56 110,130 157,56" /><path className="angle-arc target-arc" d="M98 113 A20 20 0 0 1 122 113" /><path className="measure-arc" d="M63 56 A52 52 0 0 1 157 56" /><text x="110" y="21" textAnchor="middle" className="value-label">{data.arc}°</text><text x="110" y="112" textAnchor="middle" className="target-label">x</text></svg>;
  if (data.mode === 'chords') return <svg className="generated-geometry" viewBox="0 0 230 155" role="img" aria-label="intersecting chords">{common}<line x1="67" y1="47" x2="157" y2="116" /><line x1="60" y1="105" x2="164" y2="50" /><text x="76" y="67" className="value-label">{data.values[0]}</text><text x="136" y="104" className="value-label">{data.values[1]}</text><text x="75" y="100" className="value-label">1</text><text x="141" y="66" className="target-label">x</text></svg>;
  if (data.mode === 'cyclic-quad') return <svg className="generated-geometry" viewBox="0 0 230 155" role="img" aria-label="cyclic rectangle">{common}<rect x="66" y="42" width="88" height="72" className="shape-outline" /><line x1="66" y1="114" x2="154" y2="42" className="highlight-edge" /><text x="108" y="132" className="value-label">{data.values[0]}</text><text x="47" y="82" className="value-label">{data.values[1]}</text><text x="112" y="72" className="target-label">x</text></svg>;
  return <svg className="generated-geometry" viewBox="0 0 260 155" role="img" aria-label="tangent secant power theorem">{common}<circle cx="205" cy="78" r="3" /><line x1="205" y1="78" x2="104" y2="25" className="highlight-edge" /><line x1="205" y1="78" x2="58" y2="78" /><text x="161" y="45" className="target-label">x</text><text x="175" y="72" className="value-label">{data.values[0]}</text><text x="103" y="72" className="value-label">{data.values[1]}</text></svg>;
}

function TriangleCenter({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 230 160" role="img" aria-label={`${data.center} of a triangle`}><polygon points="25,135 205,135 118,22" />
    {data.center === 'centroid' ? <><line x1="118" y1="22" x2="115" y2="135" className="guide-line" /><circle cx="116" cy="98" r="4" className="target-point" /><text x="122" y="98">G</text><text x="124" y="65" className="value-label">{data.values[0]}</text><text x="124" y="122" className="value-label">{data.values[1]}</text></> : <><circle cx="116" cy="91" r="4" className="target-point" /><circle cx="116" cy="91" r="34" className="coordinate-circle" /><text x="122" y="86">I</text></>}
  </svg>;
}

function Ceva({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 230 165" role="img" aria-label="triangle with concurrent cevians"><polygon points="25,140 205,140 115,20" /><line x1="115" y1="20" x2="115" y2="140" /><line x1="25" y1="140" x2="160" y2="80" /><line x1="205" y1="140" x2="70" y2="80" /><circle cx="115" cy="100" r="4" className="target-point" /><text x="59" y="95" className="value-label">{data.ratios[0]}:{data.ratios[1]}</text><text x="154" y="96" className="value-label">{data.ratios[2]}:x</text></svg>;
}

function Conic({ data }) {
  const path = data.mode === 'parabola' ? 'M55 145 Q110 20 165 145' : data.mode === 'ellipse' ? '' : 'M25 25 Q95 78 25 135 M195 25 Q125 78 195 135';
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 220 165" role="img" aria-label={`${data.mode} graph`}><line x1="15" y1="82" x2="205" y2="82" className="axis-line" /><line x1="110" y1="15" x2="110" y2="150" className="axis-line" />{data.mode === 'ellipse' ? <ellipse cx="110" cy="82" rx="75" ry="48" className="coordinate-circle" /> : <path d={path} className="proportion-curve" fill="none" />}<text x="198" y="76">x</text><text x="116" y="18">y</text></svg>;
}

function Vector({ data }) {
  const end = (v) => [105 + v[0] * 7, 102 - v[1] * 7];
  const [ux, uy] = end(data.u); const second = data.v ? end(data.v) : null;
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 220 155" role="img" aria-label="vectors on coordinate axes"><line x1="18" y1="102" x2="205" y2="102" className="axis-line" /><line x1="105" y1="142" x2="105" y2="15" className="axis-line" /><line x1="105" y1="102" x2={ux} y2={uy} className="highlight-edge" /><circle cx={ux} cy={uy} r="4" className="highlight-point" />{second ? <><line x1="105" y1="102" x2={second[0]} y2={second[1]} className="target-edge" /><circle cx={second[0]} cy={second[1]} r="4" className="target-point" /></> : null}<text x={ux + 5} y={uy - 5}>u</text>{second ? <text x={second[0] + 5} y={second[1] - 5}>v</text> : null}</svg>;
}

function SpaceCoordinate({ data }) {
  return <svg className="generated-geometry generated-solid" viewBox="0 0 230 170" role="img" aria-label="three dimensional coordinate or projection diagram"><line x1="55" y1="132" x2="200" y2="132" className="axis-line" /><line x1="55" y1="132" x2="55" y2="20" className="axis-line" /><line x1="55" y1="132" x2="15" y2="160" className="axis-line" /><text x="204" y="136">x</text><text x="59" y="20">z</text><text x="10" y="164">y</text>{data.projection ? <><polygon points="55,132 190,132 165,78" className="plane-fill" /><line x1="55" y1="132" x2="165" y2="45" className="highlight-edge" /><line x1="165" y1="45" x2="165" y2="78" className="guide-line" /><text x="103" y="72" className="value-label">{data.projection[0]}</text><text x="72" y="122" className="value-label">{data.projection[1]}°</text></> : <><line x1="55" y1="132" x2="155" y2="45" className="highlight-edge" /><circle cx="155" cy="45" r="4" className="target-point" /><text x="160" y="41">P</text></>}</svg>;
}

function TrigGraph({ data }) {
  const pts = Array.from({ length: 81 }, (_, i) => { const x = i / 80 * 2 * Math.PI; return [20 + i * 2.25, 82 - data.amplitude * 13 * Math.sin(data.periodFactor * x)]; });
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 220 165" role="img" aria-label="sine function graph"><line x1="15" y1="82" x2="210" y2="82" className="axis-line" /><line x1="20" y1="15" x2="20" y2="150" className="axis-line" /><polyline points={pts.map((p) => p.join(',')).join(' ')} className="proportion-curve" fill="none" /><text x="202" y="76">x</text><text x="26" y="17">y</text></svg>;
}

function FunctionGraph({ data }) {
  if (data.mode === 'revolution') return <svg className="generated-geometry" viewBox="0 0 220 165" role="img" aria-label="cylinder solid of revolution"><ellipse cx="110" cy="35" rx="48" ry="16" className="coordinate-circle" /><line x1="62" y1="35" x2="62" y2="130" /><line x1="158" y1="35" x2="158" y2="130" /><ellipse cx="110" cy="130" rx="48" ry="16" className="coordinate-circle" /><text x="112" y="25" className="value-label">r={data.radius}</text><text x="164" y="86" className="value-label">h={data.height}</text></svg>;
  const points = data.mode === 'tangent' ? Array.from({ length: 41 }, (_, i) => { const x = -4 + i / 5; return [110 + x * 20, 130 - data.a * x * x * 6]; }) : [];
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 220 165" role="img" aria-label="function graph with tangent or shaded area"><line x1="15" y1="130" x2="210" y2="130" className="axis-line" /><line x1="110" y1="150" x2="110" y2="15" className="axis-line" />{data.mode === 'tangent' ? <><polyline points={points.map((p) => p.join(',')).join(' ')} className="proportion-curve" fill="none" /><line x1="38" y1={130 - data.slope * (-3.6 - data.x) * 8 - data.a * data.x * data.x * 6} x2="192" y2={130 - data.slope * (4.1 - data.x) * 8 - data.a * data.x * data.x * 6} className="highlight-edge" /></> : <polygon points="110,130 190,130 190,45" className="sector-fill" />}</svg>;
}

function BoxPlot({ data }) {
  const [min, q1, median, q3, max] = data.values; const scale = 170 / (max - min + 2); const x = (v) => 25 + (v - min + 1) * scale;
  return <svg className="generated-geometry" viewBox="0 0 220 120" role="img" aria-label="box plot"><line x1={x(min)} y1="60" x2={x(max)} y2="60" /><line x1={x(min)} y1="45" x2={x(min)} y2="75" /><line x1={x(max)} y1="45" x2={x(max)} y2="75" /><rect x={x(q1)} y="35" width={x(q3) - x(q1)} height="50" className="shape-outline" /><line x1={x(median)} y1="35" x2={x(median)} y2="85" className="highlight-edge" />{data.values.map((v) => <text key={v} x={x(v)} y="105" textAnchor="middle">{v}</text>)}</svg>;
}

function Scatter({ data }) {
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 220 165" role="img" aria-label="scatter plot"><line x1="25" y1="140" x2="205" y2="140" className="axis-line" /><line x1="25" y1="140" x2="25" y2="15" className="axis-line" />{data.points.map(([x,y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r="3.5" className="highlight-point" />)}</svg>;
}

export default function AdvancedGeometryDiagram({ diagram }) {
  if (diagram.kind === 'trig-triangle') return <TrigTriangle data={diagram} />;
  if (diagram.kind === 'oblique-triangle') return <ObliqueTriangle data={diagram} />;
  if (diagram.kind === 'bearing') return <Bearing data={diagram} />;
  if (diagram.kind === 'circle-advanced') return <AdvancedCircle data={diagram} />;
  if (diagram.kind === 'triangle-center') return <TriangleCenter data={diagram} />;
  if (diagram.kind === 'ceva') return <Ceva data={diagram} />;
  if (diagram.kind === 'conic') return <Conic data={diagram} />;
  if (diagram.kind === 'vector') return <Vector data={diagram} />;
  if (diagram.kind === 'space-coordinate') return <SpaceCoordinate data={diagram} />;
  if (diagram.kind === 'trig-graph') return <TrigGraph data={diagram} />;
  if (diagram.kind === 'function-graph') return <FunctionGraph data={diagram} />;
  if (diagram.kind === 'box-plot') return <BoxPlot data={diagram} />;
  if (diagram.kind === 'scatter') return <Scatter data={diagram} />;
  return null;
}
