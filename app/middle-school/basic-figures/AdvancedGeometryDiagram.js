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

function CompositeCircle({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 270 170" role="img" aria-label="circle tangent radius and Pythagorean theorem">
    <circle cx="90" cy="86" r="55" className="circle-outline" /><circle cx="90" cy="86" r="3" className="target-point" /><text x="78" y="82">O</text>
    <circle cx="235" cy="86" r="3" className="target-point" /><text x="241" y="91">P</text><circle cx="119" cy="39" r="3" className="target-point" /><text x="120" y="32">T</text>
    <line x1="90" y1="86" x2="235" y2="86" className="guide-line" /><line x1="90" y1="86" x2="119" y2="39" /><line x1="119" y1="39" x2="235" y2="86" className="highlight-edge" />
    <path d="M115 47 l9 6 l-6 9" className="right-mark" /><text x="94" y="57" className="value-label">{data.radius}</text><text x="158" y="98" className="value-label">{data.distance}</text><text x="176" y="51" className="target-label">x</text>
  </svg>;
}

function SimilarityArea({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 240 180" role="img" aria-label="parallel segment similar triangles and area ratio">
    <polygon points="25,155 215,155 120,18" /><line x1="73" y1="87" x2="167" y2="87" className="highlight-edge" />
    <text x="113" y="14">A</text><text x="14" y="169">B</text><text x="217" y="169">C</text><text x="62" y="86">D</text><text x="171" y="86">E</text>
    <text x="119" y="70" textAnchor="middle" className="value-label">area={data.smallArea}</text><text x="119" y="135" textAnchor="middle" className="target-label">x</text>
    <text x="38" y="116" className="value-label">1:{data.ratio}</text><path d="M84 92 h14 M144 92 h14" className="parallel-mark" />
  </svg>;
}

function CentroidVector({ data }) {
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 230 180" role="img" aria-label="triangle centroid and vector magnitude">
    <line x1="25" y1="150" x2="215" y2="150" className="axis-line" /><line x1="25" y1="150" x2="25" y2="15" className="axis-line" />
    <polygon points="25,150 205,150 25,25" /><line x1="25" y1="150" x2={25 + data.p * 10} y2={150 - data.q * 7} className="highlight-edge" />
    <circle cx={25 + data.p * 10} cy={150 - data.q * 7} r="4" className="target-point" /><text x={32 + data.p * 10} y={145 - data.q * 7}>G({data.p},{data.q})</text><text x="12" y="163">O</text>
  </svg>;
}

function ConicVectorComposite({ data }) {
  const fx1 = 110 - data.c * 8; const fx2 = 110 + data.c * 8;
  return <svg className="generated-geometry generated-coordinate-geometry" viewBox="0 0 220 175" role="img" aria-label="ellipse foci and vectors from a point">
    <line x1="15" y1="100" x2="205" y2="100" className="axis-line" /><line x1="110" y1="15" x2="110" y2="160" className="axis-line" /><ellipse cx="110" cy="100" rx="78" ry="55" className="coordinate-circle" />
    <circle cx={fx1} cy="100" r="3" className="target-point" /><circle cx={fx2} cy="100" r="3" className="target-point" /><circle cx="110" cy="45" r="4" className="highlight-point" />
    <line x1="110" y1="45" x2={fx1} y2="100" className="highlight-edge" /><line x1="110" y1="45" x2={fx2} y2="100" className="target-edge" />
    <text x="115" y="39">P</text><text x={fx1 - 16} y="116">F₁</text><text x={fx2 + 5} y="116">F₂</text>
  </svg>;
}

function SpaceProjectionChallenge({ data }) {
  return <svg className="generated-geometry generated-solid" viewBox="0 0 250 185" role="img" aria-label="cuboid space diagonal and projection">
    <polygon points="35,145 150,145 205,112 90,112" className="plane-fill" /><polygon points="35,45 150,45 205,18 90,18" fill="none" />
    <line x1="35" y1="45" x2="35" y2="145" /><line x1="150" y1="45" x2="150" y2="145" /><line x1="205" y1="18" x2="205" y2="112" /><line x1="90" y1="18" x2="90" y2="112" />
    <line x1="35" y1="145" x2="205" y2="18" className="highlight-edge" /><line x1="35" y1="145" x2="205" y2="112" className="target-edge" /><line x1="205" y1="18" x2="205" y2="112" className="guide-line" />
    <text x="24" y="159">O</text><text x="211" y="18">P</text><text x="105" y="141" className="value-label">projection={data.baseDiagonal}</text><text x="210" y="69" className="value-label">{data.height}</text><text x="111" y="71" className="target-label">θ</text>
  </svg>;
}

function TrigComposite({ data }) {
  return <svg className="generated-geometry" viewBox="0 0 240 175" role="img" aria-label="triangle requiring cosine rule and area formula">
    <polygon points="30,150 215,150 92,27" /><text x="18" y="164">A</text><text x="218" y="164">B</text><text x="88" y="21">C</text>
    <text x="52" y="83" className="value-label">{data.b}</text><text x="125" y="164" className="value-label">{data.a}</text><text x="159" y="83" className="target-label">BC={data.c}</text>
    <path d="M58 150 A28 28 0 0 0 49 130" className="angle-arc" /><text x="55" y="130" className="value-label">{data.angle}°</text>
  </svg>;
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
  if (diagram.kind === 'composite-circle') return <CompositeCircle data={diagram} />;
  if (diagram.kind === 'similarity-area') return <SimilarityArea data={diagram} />;
  if (diagram.kind === 'centroid-vector') return <CentroidVector data={diagram} />;
  if (diagram.kind === 'conic-vector') return <ConicVectorComposite data={diagram} />;
  if (diagram.kind === 'space-projection-composite') return <SpaceProjectionChallenge data={diagram} />;
  if (diagram.kind === 'trig-composite') return <TrigComposite data={diagram} />;
  return null;
}
