"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ViewerRetentionChart({ inView }: { inView: boolean }) {
  const reducedMotion = useReducedMotion();

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const points = [50, 65, 55, 85, 75, 50]; // relative heights (0-100)
  
  // Calculate SVG path
  const width = 400;
  const height = 200;
  const padding = 20;
  const effectiveWidth = width - 2 * padding;
  const effectiveHeight = height - 2 * padding;
  
  const stepWidth = effectiveWidth / (points.length - 1);
  
  // Create step line path
  let pathD = `M ${padding} ${height - padding - (points[0] / 100) * effectiveHeight}`;
  
  for (let i = 1; i < points.length; i++) {
    const x = padding + i * stepWidth;
    const prevY = height - padding - (points[i - 1] / 100) * effectiveHeight;
    const y = height - padding - (points[i] / 100) * effectiveHeight;
    
    // Horizontal step then vertical step
    pathD += ` L ${x - stepWidth/2} ${prevY} L ${x - stepWidth/2} ${y} L ${x} ${y}`;
  }

  // Create filled area path
  let areaD = pathD + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  // Determine highest point for the badge
  const highestIndex = points.indexOf(Math.max(...points));
  const highestX = padding + highestIndex * stepWidth;
  const highestY = height - padding - (points[highestIndex] / 100) * effectiveHeight;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 className="editorial-h2" style={{ margin: 0, fontSize: '1.5rem' }}>Viewer Retention</h3>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ letterSpacing: '2px', lineHeight: '10px' }}>...</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, position: 'relative', minHeight: '220px', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="retention-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBB8FF" />
              <stop offset="50%" stopColor="#FF8D72" />
              <stop offset="100%" stopColor="#FFB6D8" />
            </linearGradient>
            <pattern id="vertical-stripes" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#FF8D72" strokeWidth="1" opacity="0.15" />
            </pattern>
            <linearGradient id="gradient-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF8D72" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF8D72" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Filled Area */}
          <motion.path
            d={areaD}
            fill="url(#vertical-stripes)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          />

          {/* Stroke Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#retention-grad)"
            strokeWidth="4"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Dot at highest point */}
          <motion.circle
            cx={highestX - stepWidth/2}
            cy={highestY}
            r="5"
            fill="#FF8D72"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          />
        </svg>

        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginTop: '-10px' }}>
          {labels.map((label, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              className="mono-text"
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
            >
              {label}
            </motion.div>
          ))}
        </div>

        {/* Floating badge for highest point */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          style={{
            position: 'absolute',
            top: `${(highestY / height) * 100 - 15}%`,
            left: `${((highestX - stepWidth/2) / width) * 100}%`,
            transform: 'translateX(-50%)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(255, 141, 114, 0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            zIndex: 10
          }}
        >
          {points[highestIndex]}%
        </motion.div>
      </div>
    </div>
  );
}
