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
        backgroundColor: 'var(--text-main)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--bg-primary)', textTransform: 'uppercase' }}>VOCAL TONE: MATCHED</span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--bg-primary)' }}>{percentage}%</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2px', height: '100px' }}>
        {bars.map((_, i) => (
          <motion.div
            key={i}
            style={{
              flex: 1,
              backgroundColor: 'var(--accent)',
              borderRadius: '1px'
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
