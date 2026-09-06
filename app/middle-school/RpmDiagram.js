'use client';

import React from 'react';

export default function RpmDiagram({ diagram }) {
  if (!diagram || !diagram.kind) return null;

  if (diagram.kind === 'rpm-number-line') {
    const { min = -5, max = 5, step = 1, points = [], highlightSegment } = diagram;
    const width = 280;
    const height = 70;
    const leftPad = 25;
    const rightPad = width - 25;
    const xFor = (val) => leftPad + ((val - min) / (max - min)) * (rightPad - leftPad);
    const tickCount = Math.round((max - min) / step);

    return (
      <svg className="generated-geometry" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="수직선 다이어그램">
        <line x1="10" y1="36" x2={width - 10} y2="36" stroke="var(--ink)" strokeWidth="1.8" />
        <path d={`M 10 36 L 18 32 L 18 40 Z`} fill="var(--ink)" />
        <path d={`M ${width - 10} 36 L ${width - 18} 32 L ${width - 18} 40 Z`} fill="var(--ink)" />

        {/* Highlight segment */}
        {highlightSegment && (
          <line
            x1={xFor(highlightSegment.from)}
            y1="36"
            x2={xFor(highlightSegment.to)}
            y2="36"
            stroke="var(--red-pen)"
            strokeWidth="3.2"
          />
        )}

        {/* Ticks */}
        {Array.from({ length: tickCount + 1 }, (_, i) => {
          const val = min + i * step;
          const x = xFor(val);
          const showLabel = val === min || val === 0 || val === max || points.some((p) => p.val === val);
          return (
            <g key={i}>
              <line x1={x} y1="31" x2={x} y2="41" stroke="var(--ink)" strokeWidth="1.2" />
              {showLabel && (
                <text x={x} y="54" textAnchor="middle" fontSize="11" fill="var(--ink)">
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* Points */}
        {points.map((p, i) => {
          const x = xFor(p.val);
          return (
            <g key={i}>
              <circle cx={x} cy="36" r={p.highlight ? 4.5 : 3.5} fill={p.highlight ? 'var(--red-pen)' : '#176b87'} />
              <text
                x={x}
                y="24"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={p.highlight ? 'var(--red-pen)' : '#176b87'}
              >
                {p.label}
              </text>
              {p.subLabel && (
                <text x={x} y="66" textAnchor="middle" fontSize="10" fill="var(--ink-soft)">
                  {p.subLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  if (diagram.kind === 'rpm-plane-polygon') {
    const { vertices = [], xRange = [-5, 5], yRange = [-5, 5], label = 'ABC' } = diagram;
    const width = 230;
    const height = 230;
    const pad = 24;
    const xFor = (x) => pad + ((x - xRange[0]) / (xRange[1] - xRange[0])) * (width - 2 * pad);
    const yFor = (y) => height - (pad + ((y - yRange[0]) / (yRange[1] - yRange[0])) * (height - 2 * pad));

    const originX = xFor(0);
    const originY = yFor(0);

    const polyPoints = vertices.map((v) => `${xFor(v.x)},${yFor(v.y)}`).join(' ');

    return (
      <svg className="generated-geometry" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="좌표평면 다각형">
        {/* Grid lines */}
        {Array.from({ length: xRange[1] - xRange[0] + 1 }, (_, i) => {
          const xVal = xRange[0] + i;
          if (xVal === 0) return null;
          const x = xFor(xVal);
          return <line key={`gx-${i}`} x1={x} y1={pad} x2={x} y2={height - pad} stroke="var(--ink-soft)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />;
        })}
        {Array.from({ length: yRange[1] - yRange[0] + 1 }, (_, i) => {
          const yVal = yRange[0] + i;
          if (yVal === 0) return null;
          const y = yFor(yVal);
          return <line key={`gy-${i}`} x1={pad} y1={y} x2={width - pad} y2={y} stroke="var(--ink-soft)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />;
        })}

        {/* Axes */}
        <line x1={pad} y1={originY} x2={width - 8} y2={originY} stroke="var(--ink)" strokeWidth="1.6" />
        <path d={`M ${width - 8} ${originY} L ${width - 15} ${originY - 3} L ${width - 15} ${originY + 3} Z`} fill="var(--ink)" />
        <text x={width - 6} y={originY - 6} fontSize="11" fontWeight="700" fill="var(--ink)">x</text>

        <line x1={originX} y1={height - pad} x2={originX} y2={8} stroke="var(--ink)" strokeWidth="1.6" />
        <path d={`M ${originX} 8 L ${originX - 3} 15 L ${originX + 3} 15 Z`} fill="var(--ink)" />
        <text x={originX + 6} y={12} fontSize="11" fontWeight="700" fill="var(--ink)">y</text>
        <text x={originX - 10} y={originY + 14} fontSize="11" fill="var(--ink)">O</text>

        {/* Polygon */}
        <polygon points={polyPoints} fill="color-mix(in srgb, #176b87 22%, transparent)" stroke="#176b87" strokeWidth="2" strokeLinejoin="round" />

        {/* Dashed projections to axes & Vertices */}
        {vertices.map((v, i) => {
          const vx = xFor(v.x);
          const vy = yFor(v.y);
          const offsetX = v.x >= 0 ? 8 : -14;
          const offsetY = v.y >= 0 ? -8 : 14;
          return (
            <g key={i}>
              <line x1={vx} y1={vy} x2={vx} y2={originY} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1={vx} y1={vy} x2={originX} y2={vy} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <circle cx={vx} cy={vy} r="3.5" fill="var(--red-pen)" />
              <text x={vx + offsetX} y={vy + offsetY} fontSize="11" fontWeight="700" fill="var(--ink)">
                {v.label || label[i] || `P${i + 1}`}({v.x}, {v.y})
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (diagram.kind === 'rpm-hyperbola-line') {
    const { slope = 2, k = 12, meetX = 2, meetY = 6, showTriangle = false } = diagram;
    const width = 240;
    const height = 220;
    const originX = 120;
    const originY = 110;
    const scaleX = 16;
    const scaleY = 10;

    const xFor = (x) => originX + x * scaleX;
    const yFor = (y) => originY - y * scaleY;

    // Generate hyperbola points for branch 1 (x > 0)
    const curvePoints1 = [];
    for (let x = 0.8; x <= 6.5; x += 0.2) {
      const y = k / x;
      if (y <= 9.5) curvePoints1.push(`${xFor(x).toFixed(1)},${yFor(y).toFixed(1)}`);
    }

    // Generate line points
    const lineX1 = -5;
    const lineY1 = slope * lineX1;
    const lineX2 = 5;
    const lineY2 = slope * lineX2;

    const px = xFor(meetX);
    const py = yFor(meetY);

    return (
      <svg className="generated-geometry" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="정비례와 반비례 그래프">
        {/* Axes */}
        <line x1="16" y1={originY} x2={width - 16} y2={originY} stroke="var(--ink)" strokeWidth="1.6" />
        <text x={width - 12} y={originY - 5} fontSize="11" fontWeight="700" fill="var(--ink)">x</text>
        <line x1={originX} y1={height - 16} x2={originX} y2="16" stroke="var(--ink)" strokeWidth="1.6" />
        <text x={originX + 6} y="16" fontSize="11" fontWeight="700" fill="var(--ink)">y</text>
        <text x={originX - 10} y={originY + 12} fontSize="10" fill="var(--ink)">O</text>

        {/* Shaded triangle or rectangle under P if requested */}
        {showTriangle && (
          <polygon
            points={`${originX},${originY} ${originX},${py} ${px},${py}`}
            fill="color-mix(in srgb, var(--red-pen) 18%, transparent)"
            stroke="none"
          />
        )}

        {/* Hyperbola curve */}
        {curvePoints1.length > 1 && (
          <path d={`M ${curvePoints1.join(' L ')}`} fill="none" stroke="#176b87" strokeWidth="2.2" />
        )}

        {/* Linear line */}
        <line x1={xFor(lineX1)} y1={yFor(lineY1)} x2={xFor(lineX2)} y2={yFor(lineY2)} stroke="var(--ink)" strokeWidth="1.8" />

        {/* Meeting point P and projection */}
        <line x1={px} y1={py} x2={px} y2={originY} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={px} y1={py} x2={originX} y2={py} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" />

        <circle cx={px} cy={py} r="4" fill="var(--red-pen)" />
        <text x={px + 6} y={py - 6} fontSize="11" fontWeight="700" fill="var(--ink)">
          P({meetX}, {meetY})
        </text>

        {/* Formula labels */}
        <text x={width - 65} y={yFor(slope * 4.2)} fontSize="10" fill="var(--ink)">y = ax</text>
        <text x={width - 60} y={yFor(k / 5.2)} fontSize="10" fill="#176b87">y = a/x</text>
      </svg>
    );
  }

  if (diagram.kind === 'rpm-shaded-shape') {
    const { shape = 'trapezoid', top = 'x', bottom = 'x + 6', height = 10 } = diagram;
    const width = 240;
    const h = 140;

    if (shape === 'trapezoid') {
      const pTopLeft = { x: 75, y: 30 };
      const pTopRight = { x: 165, y: 30 };
      const pBotLeft = { x: 40, y: 110 };
      const pBotRight = { x: 200, y: 110 };

      return (
        <svg className="generated-geometry" viewBox={`0 0 ${width} ${h}`} role="img" aria-label="사다리꼴 넓이 다이어그램">
          {/* Main trapezoid */}
          <polygon
            points={`${pTopLeft.x},${pTopLeft.y} ${pTopRight.x},${pTopRight.y} ${pBotRight.x},${pBotRight.y} ${pBotLeft.x},${pBotLeft.y}`}
            fill="color-mix(in srgb, #176b87 14%, transparent)"
            stroke="var(--ink)"
            strokeWidth="1.8"
          />
          {/* Shaded triangle inside */}
          <polygon
            points={`${pTopLeft.x},${pTopLeft.y} ${pBotLeft.x},${pBotLeft.y} ${pBotRight.x},${pBotRight.y}`}
            fill="color-mix(in srgb, var(--red-pen) 26%, transparent)"
            stroke="var(--red-pen)"
            strokeWidth="1.5"
          />

          {/* Dimension labels */}
          <text x={(pTopLeft.x + pTopRight.x) / 2} y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
            {top}
          </text>
          <text x={(pBotLeft.x + pBotRight.x) / 2} y="126" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
            {bottom}
          </text>
          {/* Height guide */}
          <line x1={pTopRight.x + 15} y1="30" x2={pTopRight.x + 15} y2="110" stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" />
          <text x={pTopRight.x + 22} y="74" fontSize="11" fill="var(--ink)">{height}</text>
        </svg>
      );
    }

    if (shape === 'road-rectangle') {
      const { w = 40, h: rectH = 30, road = 'x' } = diagram;
      return (
        <svg className="generated-geometry" viewBox="0 0 240 140" role="img" aria-label="길을 낸 직사각형 땅">
          {/* Entire land */}
          <rect x="35" y="25" width="170" height="90" fill="color-mix(in srgb, #8ccfd0 30%, transparent)" stroke="var(--ink)" strokeWidth="1.8" />
          {/* Cross roads */}
          <rect x="105" y="25" width="22" height="90" fill="#fffefb" stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="35" y="60" width="170" height="20" fill="#fffefb" stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Dimension text */}
          <text x="120" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">{w}m</text>
          <text x="20" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">{rectH}m</text>
          <text x="116" y="56" textAnchor="middle" fontSize="10" fill="var(--red-pen)">폭 {road}m</text>
        </svg>
      );
    }
  }

  if (diagram.kind === 'rpm-travel-diagram') {
    const { speedA = 60, speedB = 80, delay = 15 } = diagram;
    return (
      <svg className="generated-geometry" viewBox="0 0 260 90" role="img" aria-label="속력과 거리 경로도">
        <line x1="25" y1="35" x2="235" y2="35" stroke="var(--ink)" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="25" cy="35" r="4" fill="var(--ink)" />
        <text x="25" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">출발(집)</text>

        <circle cx="235" cy="35" r="4" fill="var(--red-pen)" />
        <text x="235" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--red-pen)">만남 지점</text>

        {/* Route A */}
        <path d="M 25 45 C 90 60, 170 60, 235 45" fill="none" stroke="#176b87" strokeWidth="1.8" />
        <text x="130" y="74" textAnchor="middle" fontSize="10" fill="#176b87">
          먼저 출발 (시속 {speedA}km)
        </text>

        {/* Route B */}
        <text x="130" y="48" textAnchor="middle" fontSize="10" fill="var(--red-pen)">
          {delay}분 후 출발 (시속 {speedB}km)
        </text>
      </svg>
    );
  }

  return null;
}
