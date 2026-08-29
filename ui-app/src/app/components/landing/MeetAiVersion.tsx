"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section id="product" className="editorial-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="grid-container" style={{ width: '100%' }}>
         <div className="col-12" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.h2 
              className="editorial-h2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Meet the version of you that<br/>never needs a camera.
            </motion.h2>
            <motion.p 
              className="mono-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.6 }}
            >
              Record yourself once. We turn your appearance and voice into a reusable digital identity that can create videos whenever you need them.
            </motion.p>
         </div>
      </div>
      
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          aspectRatio: '16/9',
          borderRadius: '24px',
          overflow: 'hidden',
          cursor: 'ew-resize',
          boxShadow: 'var(--shadow-medium)',
          border: '1px solid var(--border-subtle)',
          margin: '0 1rem'
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleDrag(e);
        }}
        onTouchMove={handleDrag}
        onClick={handleDrag}
      >
        {/* Real Video Layer */}
        <div style={{ position: 'absolute', inset: 0, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '4rem', color: 'var(--text-muted)', fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
           Real You
        </div>
        
        {/* AI Video Layer */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          width: `${sliderPosition}%`, 
          background: 'linear-gradient(135deg, #000000, #000000)', 
          overflow: 'hidden',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          padding: '4rem', 
          color: '#FFFFFF', 
          fontSize: '2.5rem',
          fontWeight: 600,
          fontFamily: 'var(--font-heading)',
          borderRight: '1px solid rgba(255,255,255,0.5)'
        }}>
           <div style={{ width: '900px' }}>AI Version</div>
        </div>

        {/* Slider Handle */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '2px',
          background: '#FFFFFF',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', color: 'var(--text-muted)' }}>
               <ChevronLeft size={20} style={{ marginRight: '-4px' }} />
               <ChevronRight size={20} style={{ marginLeft: '-4px' }} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
