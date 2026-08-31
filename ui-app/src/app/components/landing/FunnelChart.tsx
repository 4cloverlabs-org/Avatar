"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FunnelChart({ inView }: { inView: boolean }) {
  const reducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Using the exact structure from the image, but with our content labels
  const data = [
    { label: "Impressions", value: 65200, displayValue: "65.2k", percentage: 95 },
    { label: "Views", value: 54800, displayValue: "54.8k", percentage: 75 },
    { label: "High Engagement", value: 48600, displayValue: "48.6k", percentage: 60 },
    { label: "Click-Throughs", value: 38300, displayValue: "38.3k", percentage: 40 },
    { label: "Conversions", value: 32900, displayValue: "32.9k", percentage: 30 }
  ];

  const yAxisLabels = ["70k", "60k", "50k", "40k", "30k"];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 className="editorial-h2" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Content Funnel</h3>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ letterSpacing: '2px', lineHeight: '10px', color: 'var(--text-muted)' }}>...</span>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* Y-Axis */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '1rem', paddingTop: '80px', paddingBottom: '0', color: 'var(--text-muted)', fontSize: '0.75rem', zIndex: 2 }}>
          {yAxisLabels.map((lbl, i) => (
            <div key={i}>{lbl}</div>
          ))}
        </div>

        {/* Columns Container */}
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          
          {/* Bars and Columns */}
          {data.map((item, index) => {
            const isActive = hoveredIndex === index || (hoveredIndex === null && index === 2);
            
            return (
              <div 
                key={index} 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative',
                  borderRight: index < data.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  borderLeft: index === 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  padding: '0 15px 0 5px' // Extra padding on right to make room for the 3D side
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                
                {/* Top Labels */}
                <div style={{ paddingTop: '10px', paddingBottom: '20px', paddingLeft: '10px', zIndex: 5 }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)', 
                    fontWeight: isActive ? 500 : 400,
                    whiteSpace: 'nowrap', 
                    transition: 'color 0.2s' 
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 600, 
                    color: isActive ? '#000000' : 'var(--text-muted)',
                    transition: 'color 0.2s',
                    marginTop: '2px'
                  }}>
                    {item.displayValue}
                  </div>
                </div>

                {/* Bar Area */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 5 }}>
                  
                  {/* Floating Pill Above Bar */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1, bottom: `${item.percentage + 5}%` } : {}}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    style={{
                      position: 'absolute',
                      width: '24px',
                      height: '4px',
                      backgroundColor: '#6187FF',
                      borderRadius: '2px',
                      opacity: 0.6,
                      zIndex: 6
                    }}
                  />

                  {/* The Bar */}
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={inView ? { height: `${item.percentage}%` } : {}}
                    transition={{ delay: index * 0.1, duration: 0.8, type: 'spring', stiffness: 100 }}
                    style={{
                      width: '100%',
                      position: 'relative',
                      background: isActive 
                        ? 'linear-gradient(180deg, #6ECBF5 0%, #6187FF 100%)' 
                        : 'repeating-linear-gradient(45deg, #8ED6F8, #8ED6F8 6px, #C2E3FC 6px, #C2E3FC 12px)',
                      boxShadow: isActive ? '0 -4px 12px rgba(97, 135, 255, 0.4)' : 'none',
                      borderTopLeftRadius: '0px',
                      borderTopRightRadius: '0px'
                    }}
                  >
                    {/* Fade to white at bottom for inactive bars */}
                    {!isActive && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                        pointerEvents: 'none'
                      }} />
                    )}

                    {/* 3D Side Face */}
                    <div style={{
                      position: 'absolute',
                      left: '100%',
                      bottom: 0,
                      width: '15px', // Depth of the 3D bar
                      height: '100%',
                      background: isActive 
                        ? 'linear-gradient(180deg, #4A90E2 0%, #4A69F0 100%)' // Darker blue for side of active bar
                        : 'linear-gradient(180deg, rgba(142, 214, 248, 0.5) 0%, rgba(255, 255, 255, 0) 100%)',
                      transformOrigin: 'left bottom',
                      transform: 'skewY(-10deg)', // Rotate to 10deg to view sides as requested
                      zIndex: -1
                    }} />
                  </motion.div>

                  {/* Tooltip for Active Bar */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-20%)', // offset slightly to right like image
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#000000' }}>{item.displayValue}</span>
                      <span>users</span>
                      <span style={{ color: 'rgba(0,0,0,0.2)' }}>|</span>
                      <span>Conversion:</span>
                      <span style={{ fontWeight: 600, color: '#000000' }}>89%</span>
                      <span style={{ color: 'rgba(0,0,0,0.2)' }}>|</span>
                      <span>Drop-off:</span>
                      <span style={{ fontWeight: 600, color: '#000000' }}>-11%</span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
