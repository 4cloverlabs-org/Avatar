"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ViewerRetentionChart({ inView }: { inView: boolean }) {
  const reducedMotion = useReducedMotion();

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  // Adjusted values to visually match the steps in the provided image
  const points = [55, 65, 60, 95, 85, 55];

  // Layout dimensions
  const width = 600;
  const height = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 60; // Extra room for the badge
  const paddingBottom = 30; // Room for x-axis

  const effectiveWidth = width - paddingLeft - paddingRight;
  const effectiveHeight = height - paddingTop - paddingBottom;

  const stepWidth = effectiveWidth / (labels.length - 1);

  let pathD = "";
  let areaD = "";
  const circles: { cx: number; cy: number; isTopStart: boolean }[] = [];

  // Highest point for badge - in image it's Apr (index 3)
  const highestIndex = 3;
  const highestX = paddingLeft + highestIndex * stepWidth;
  const highestY = height - paddingBottom - (points[highestIndex] / 100) * effectiveHeight;

  for (let i = 0; i < points.length; i++) {
    const xStart = paddingLeft + i * stepWidth;
    // The horizontal segment goes to the next X coordinate
    const xEnd = paddingLeft + Math.min(i + 1, points.length - 1) * stepWidth;
    const y = height - paddingBottom - (points[i] / 100) * effectiveHeight;

    if (i === 0) {
      pathD += `M ${xStart} ${y}`;
      areaD += `M ${xStart} ${height - paddingBottom} L ${xStart} ${y}`;
    } else {
      // Draw vertical step up/down from previous horizontal segment
      const prevY = height - paddingBottom - (points[i - 1] / 100) * effectiveHeight;
      pathD += ` L ${xStart} ${prevY} L ${xStart} ${y}`;
      areaD += ` L ${xStart} ${prevY} L ${xStart} ${y}`;
    }

    // Draw horizontal segment
    if (i < points.length - 1) {
      pathD += ` L ${xEnd} ${y}`;
      areaD += ` L ${xEnd} ${y}`;
    }

    // Add start circle for this segment
    circles.push({ cx: xStart, cy: y, isTopStart: i === highestIndex });

    // Add end circle for this segment, unless it's the very last point
    if (i < points.length - 1) {
      circles.push({ cx: xEnd, cy: y, isTopStart: false });
    }
  }

  areaD += ` L ${paddingLeft + (points.length - 1) * stepWidth} ${height - paddingBottom} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body, sans-serif)' }}>

      <div style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        border: '1px solid var(--border-subtle, rgba(0,0,0,0.07))',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Top Text inside container like the image */}
        <div style={{ marginBottom: '0.5rem', padding: '0 24px' }}>
          <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-heading, sans-serif)' }}>% Retained</h3>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="line-grad" x1={paddingLeft} y1="0" x2={width - paddingRight} y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="mask-grad" x1="0" y1={paddingTop} x2="0" y2={height - paddingBottom} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <mask id="fade-mask">
                <rect x="0" y="0" width={width} height={height} fill="url(#mask-grad)" />
              </mask>
            </defs>

            {/* Gridlines & Y-Axis */}
            {[0, 25, 50, 75, 100].map((val, i) => {
              const y = height - paddingBottom - (val / 100) * effectiveHeight;
              return (
                <g key={`grid-${i}`}>
                  <text x={paddingLeft - 10} y={y} fill="var(--text-muted)" fontSize="11" fontWeight="500" textAnchor="end" alignmentBaseline="middle" fontFamily="var(--font-body, sans-serif)">
                    {val}%
                  </text>
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                </g>
              );
            })}

            {/* X-Axis Labels */}
            {labels.map((lbl, i) => (
              <text
                key={`x-${i}`}
                x={paddingLeft + i * stepWidth}
                y={height - 5}
                fill="var(--text-muted)"
                fontSize="12"
                fontWeight="500"
                textAnchor="middle"
                fontFamily="var(--font-body, sans-serif)"
              >
                {lbl}
              </text>
            ))}

            {/* X-Axis bottom line */}
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />

            {/* Area Fill */}
            <motion.path
              d={areaD}
              fill="url(#line-grad)"
              mask="url(#fade-mask)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            />

            {/* Stroke Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#line-grad)"
              strokeWidth="3"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Dashed line connecting badge to point */}
            <motion.line
              x1={highestX} y1={highestY}
              x2={highestX} y2={paddingTop}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
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
                r={c.isTopStart ? 4.5 : 3}
                fill="#FFFFFF"
                stroke={c.isTopStart ? "#FF5F7E" : "url(#line-grad)"}
                strokeWidth={c.isTopStart ? 3 : 2}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 1.0 + i * 0.05, duration: 0.3 }}
              />
            ))}
          </svg>

          {/* Floating badge for highest point */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            style={{
              position: 'absolute',
              top: `${(paddingTop / height) * 100}%`,
              left: `${(highestX / width) * 100}%`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-75px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(255, 95, 126, 0.15)',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 95, 126, 0.15)'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF5F7E', lineHeight: 1, fontFamily: 'var(--font-heading, sans-serif)' }}>
              85%
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', fontFamily: 'var(--font-body, sans-serif)' }}>
              Average Retention
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
