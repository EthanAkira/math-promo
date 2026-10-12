// AMC / 수능 practice links that used to be inline badges on the home curriculum list. They now live on the
// worksheet page next to the 응용문제 level. Keys are "<page path>|<unit id>" ("" = every unit on that page).
const LINKS = {
  "/middle-school/prime-factorization|": {
    "amc": "/amc/units?unit=primes-factorization&variant=1"
  },
  "/middle-school/gcd-lcm|": {
    "amc": "/amc/units?unit=gcd-lcm&variant=1"
  },
  "/middle-school/coordinate-plane|": {
    "amc": "/amc/units?unit=coordinate-geometry&variant=1"
  },
  "/middle-school/proportion|": {
    "amc": "/amc/units?unit=ratios-percent&variant=1"
  },
  "/middle-school/basic-figures|visual-foundations": {
    "amc": "/amc/units?unit=angles-plane-figures&variant=1"
  },
  "/middle-school/basic-figures|circle-sector-inverse-basic": {
    "amc": "/amc/units?unit=circles&variant=1"
  },
  "/middle-school/pre-algebra|systems-linear": {
    "amc": "/amc/units?unit=equations-inequalities&variant=1"
  },
  "/middle-school/basic-figures|isosceles-triangle-properties": {
    "amc": "/amc/units?unit=quadrilaterals-polygons&variant=1"
  },
  "/middle-school/basic-figures|similarity-conditions": {
    "amc": "/amc/units?unit=triangles&variant=1"
  },
  "/middle-school/pre-algebra|probability-2": {
    "amc": "/amc/units?unit=probability&variant=1"
  },
  "/middle-school/basic-figures|transform-reflection": {
    "amc": "/amc/units?unit=symmetry-transformations&variant=1"
  },
  "/middle-school/basic-figures|logic-detachment-syllogism": {
    "amc": "/amc/units?unit=logical-reasoning&variant=1"
  },
  "/middle-school/pre-algebra|exponential-equations": {
    "csat": "/csat/units?unit=exp-log"
  },
  "/middle-school/pre-algebra|h2-exponential-log-functions": {
    "csat": "/csat/units?unit=exp-log"
  },
  "/middle-school/pre-algebra|precalc-exp-log-transformations": {
    "csat": "/csat/units?unit=exp-log"
  },
  "/middle-school/pre-algebra|logarithms": {
    "csat": "/csat/units?unit=exp-log"
  },
  "/middle-school/pre-algebra|h2-radians-trig": {
    "csat": "/csat/units?unit=trig"
  },
  "/middle-school/pre-algebra|algebra2-trigonometry": {
    "csat": "/csat/units?unit=trig"
  },
  "/middle-school/pre-algebra|precalc-trig-graphs": {
    "csat": "/csat/units?unit=trig"
  },
  "/middle-school/pre-algebra|precalc-trig-identities": {
    "csat": "/csat/units?unit=trig"
  },
  "/middle-school/pre-algebra|h2-sine-cosine-laws": {
    "csat": "/csat/units?unit=trig"
  },
  "/middle-school/pre-algebra|sequences": {
    "amc": "/amc/units?unit=sequences-patterns&variant=1",
    "csat": "/csat/units?unit=sequences"
  },
  "/middle-school/pre-algebra|geometric-sequences": {
    "csat": "/csat/units?unit=sequences"
  },
  "/middle-school/pre-algebra|h2-sequence-sums-induction": {
    "csat": "/csat/units?unit=sequences"
  },
  "/middle-school/pre-algebra|h2-function-limits": {
    "csat": "/csat/units?unit=limits-continuity"
  },
  "/middle-school/pre-algebra|h2-continuity": {
    "csat": "/csat/units?unit=limits-continuity"
  },
  "/middle-school/pre-algebra|h2-derivative-rules": {
    "csat": "/csat/units?unit=differentiation"
  },
  "/middle-school/pre-algebra|h2-tangent-lines": {
    "csat": "/csat/units?unit=differentiation"
  },
  "/middle-school/pre-algebra|h2-monotonic-extrema": {
    "csat": "/csat/units?unit=differentiation"
  },
  "/middle-school/pre-algebra|h2-definite-integrals": {
    "csat": "/csat/units?unit=integration"
  },
  "/middle-school/pre-algebra|h2-integral-area": {
    "csat": "/csat/units?unit=integration"
  },
  "/middle-school/pre-algebra|h2-binomial-distribution": {
    "csat": "/csat/units?unit=counting"
  },
  "/middle-school/pre-algebra|h2-expected-value": {
    "csat": "/csat/units?unit=probability"
  },
  "/middle-school/pre-algebra|h2-normal-distribution": {
    "csat": "/csat/units?unit=statistics"
  },
  "/middle-school/pre-algebra|h2-confidence-interval": {
    "csat": "/csat/units?unit=statistics"
  },
  "/middle-school/pre-algebra|h3-sequence-limits": {
    "csat": "/csat/units?unit=sequence-limits"
  },
  "/middle-school/pre-algebra|h3-infinite-series": {
    "csat": "/csat/units?unit=sequence-limits"
  },
  "/middle-school/pre-algebra|h3-exp-log-derivatives": {
    "csat": "/csat/units?unit=advanced-differentiation"
  },
  "/middle-school/pre-algebra|h3-advanced-derivative-rules": {
    "csat": "/csat/units?unit=advanced-differentiation"
  },
  "/middle-school/pre-algebra|h3-substitution-integration": {
    "csat": "/csat/units?unit=advanced-integration"
  },
  "/middle-school/pre-algebra|h3-volume-integrals": {
    "csat": "/csat/units?unit=advanced-integration"
  },
  "/middle-school/pre-algebra|h3-parabola": {
    "csat": "/csat/units?unit=conic-sections"
  },
  "/middle-school/pre-algebra|h3-vector-angle": {
    "csat": "/csat/units?unit=plane-vectors"
  },
  "/middle-school/pre-algebra|h3-lines-planes": {
    "csat": "/csat/units?unit=space-geometry"
  },
  "/middle-school/pre-algebra|h3-space-coordinates": {
    "csat": "/csat/units?unit=space-geometry"
  },
  "/middle-school/pre-algebra|sets-logic": {
    "amc": "/amc/units?unit=venn-sets&variant=1"
  }
};

// [{ unitId, amcUnitId }] for every unit of `path` that has an AMC unit attached ("" = the whole page).
export function amcMappingsFor(path) {
  return Object.entries(LINKS)
    .filter(([key, value]) => key.startsWith(`${path}|`) && value.amc)
    .map(([key, value]) => ({ unitId: key.slice(path.length + 1), amcUnitId: (value.amc.match(/unit=([a-z0-9-]+)/) || [])[1] }))
    .filter((entry) => entry.amcUnitId);
}

export function practiceLinksFor(path, unitId) {
  return LINKS[`${path}|${unitId}`] || LINKS[`${path}|`] || null;
}

export default function PracticeLinks({ path, unitId, language }) {
  const links = practiceLinksFor(path, unitId);
  if (!links || !links.csat) return null;
  const ko = language === 'ko';
  const linkStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--paper-line, #d8d0bd)', borderRadius: 999, background: '#fff', color: 'var(--ink, #222)', textDecoration: 'none', fontSize: 13, fontWeight: 700 };
  return (
    <div className="practice-links no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 12px' }}>
      {links.csat ? <a href={links.csat} style={linkStyle}>📝 {ko ? '수능 기출 응용문제로 연습하기 →' : 'Practice CSAT past-exam problems →'}</a> : null}
    </div>
  );
}
