"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MeetAiVersion() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(position, 100));
    setSliderPosition(position);
  };

  return (
    <section id="product" className="section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Meet the version of you that<br/>never needs a camera.
      </motion.h2>
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Record yourself once. We turn your appearance and voice into a reusable digital identity that can create videos whenever you need them.
      </motion.p>
      
      <motion.div 
        ref={containerRef}
        className="comparison-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          aspectRatio: '16/9',
          borderRadius: '24px',
          overflow: 'hidden',
          cursor: 'ew-resize',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid #E2DCC9'
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleDrag(e);
        }}
        onTouchMove={handleDrag}
        onClick={handleDrag}
      >
        {/* Real Video Layer */}
        <div style={{ position: 'absolute', inset: 0, background: '#E4DCC5', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '4rem', color: '#63685A', fontSize: '2rem' }}>
           Real You
        </div>
        
        {/* AI Video Layer */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          width: `${sliderPosition}%`, 
          background: 'linear-gradient(135deg, #ffffff, #000)', 
          overflow: 'hidden',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          padding: '4rem', 
          color: 'var(--brand-green)', 
          fontSize: '2rem',
          borderRight: '2px solid #1E2119'
        }}>
           <div style={{ width: '800px' }}>AI Version</div>
        </div>

        {/* Slider Handle */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '4px',
          background: '#1E2119',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#1E2119',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E2119" strokeWidth="2"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3"/></svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
