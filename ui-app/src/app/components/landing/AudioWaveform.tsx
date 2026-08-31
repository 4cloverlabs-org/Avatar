"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AudioWaveform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (isInView) {
      const end = 98;
      const duration = 1500; 
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setPercentage(Math.floor(ease * end));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }, [isInView]);

  const bars = Array.from({ length: 35 });

  return (
    <div 
      ref={containerRef}
      style={{ 
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderTopRightRadius: 'var(--radius-lg)',
        borderBottomRightRadius: 'var(--radius-lg)',
        borderRight: '1px solid var(--border-subtle)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', fontWeight: 600 }}>Vocal Tone: Matched</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: '#000000', fontWeight: 600 }}>{percentage}%</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2px', height: '100px' }}>
        {bars.map((_, i) => (
          <motion.div
            key={i}
            style={{
              flex: 1,
              backgroundColor: '#000000',
              borderRadius: '2px'
            }}
            animate={{
              height: ['20%', `${Math.random() * 60 + 40}%`, '20%']
            }}
            transition={{
              duration: Math.random() * 1.5 + 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * -2
            }}
          />
        ))}
      </div>
    </div>
  );
}
