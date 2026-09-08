"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function ViewerRetentionChart({ inView }: { inView: boolean }) {
  const labels = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const points = [3.5, 2.1, 4.99, 4.99, 5.6, 5.6, 5.6]; // Corresponding to 1M to 6M scale

  // Layout dimensions
  const width = 600;
  const height = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 60;
  const paddingBottom = 30;

  const effectiveWidth = width - paddingLeft - paddingRight;
  const effectiveHeight = height - paddingTop - paddingBottom;
  const stepWidth = effectiveWidth / (labels.length - 1);

  let pathD = "";
  let areaDHatched = "";
  let areaDSolid = "";
  const circles: { cx: number; cy: number; isTooltip: boolean }[] = [];

  const tooltipIndex = 2; // Monday
  const tooltipX = paddingLeft + tooltipIndex * stepWidth;
  const tooltipY = height - paddingBottom - (points[tooltipIndex] / 6) * effectiveHeight;

  for (let i = 0; i < points.length; i++) {
    const x = paddingLeft + i * stepWidth;
    const y = height - paddingBottom - (points[i] / 6) * effectiveHeight;

    if (i === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }

    if (i <= tooltipIndex) {
      if (i === 0) {
        areaDHatched += `M ${x} ${height - paddingBottom} L ${x} ${y}`;
      } else {
        areaDHatched += ` L ${x} ${y}`;
      }
    }
    
    if (i >= tooltipIndex) {
      if (i === tooltipIndex) {
        areaDSolid += `M ${x} ${height - paddingBottom} L ${x} ${y}`;
      } else {
        areaDSolid += ` L ${x} ${y}`;
      }
    }

    circles.push({ cx: x, cy: y, isTooltip: i === tooltipIndex });
  }

  areaDHatched += ` L ${tooltipX} ${height - paddingBottom} Z`;
  areaDSolid += ` L ${paddingLeft + (points.length - 1) * stepWidth} ${height - paddingBottom} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body, sans-serif)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 24px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#111827' }}>User Statistics</h3>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          padding: '6px 12px', borderRadius: '6px', 
          border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
          fontSize: '0.875rem', color: '#4B5563', cursor: 'pointer'
        }}>
          Last 7 Days
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '100%', aspectRatio: `${width} / ${height}` }}>
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" stroke="#E5E7EB" strokeWidth="1.5" />
              </pattern>
              <linearGradient id="solidArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Gridlines & Y-Axis */}
            {[1, 2, 3, 4, 5, 6].map((val, i) => {
              const y = height - paddingBottom - (val / 6) * effectiveHeight;
              return (
                <g key={`grid-${i}`}>
                  <text x={paddingLeft - 10} y={y} fill="#9CA3AF" fontSize="12" textAnchor="end" alignmentBaseline="middle">
                    {val}M
                  </text>
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#F3F4F6" strokeWidth="1" />
                </g>
              );
            })}

            {/* X-Axis Labels */}
            {labels.map((lbl, i) => (
              <text
                key={`x-${i}`}
                x={paddingLeft + i * stepWidth}
                y={height - 5}
                fill="#9CA3AF"
                fontSize="12"
                textAnchor="middle"
              >
                {lbl}
              </text>
            ))}
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#E5E7EB" strokeWidth="1" />

            {/* Area Fill - Hatched */}
            <motion.path
              d={areaDHatched}
              fill="url(#diagonalHatch)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            />

            {/* Area Fill - Solid segment */}
            <motion.path
              d={areaDSolid}
              fill="url(#solidArea)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            />

            {/* Stroke Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="#ff6b35"
              strokeWidth="2"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Vertical Line for Tooltip */}
            <motion.line
              x1={tooltipX} y1={tooltipY}
              x2={tooltipX} y2={height - paddingBottom}
              stroke="#ff6b35"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            />

            {/* Nodes (Circles) */}
            {circles.map((c, i) => (
              <motion.circle
                key={`circle-${i}`}
                cx={c.cx}
                cy={c.cy}
                r={c.isTooltip ? 5 : 4}
                fill="#FFFFFF"
                stroke="#ff6b35"
                strokeWidth={2}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.3 }}
              />
            ))}

            {/* Tooltip Embedded in SVG */}
            <foreignObject
              x={tooltipX - 100}
              y={tooltipY - 100}
              width={200}
              height={100}
              style={{ overflow: 'visible' }}
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '12px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    width: 'max-content',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                    4.990K
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px', whiteSpace: 'nowrap' }}>
                    Monday 18, September
                  </div>
                  {/* Tooltip Arrow */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #E5E7EB',
                    borderBottom: '1px solid #E5E7EB',
                  }} />
                </motion.div>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div>
  );
}

