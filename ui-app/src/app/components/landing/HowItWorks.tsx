"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import TerminalLog from './TerminalLog';
import AudioWaveform from './AudioWaveform';

export default function HowItWorks() {
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden'
    }}>
      <section id="how-it-works" className="editorial-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        
        {/* Centered Top Heading */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="editorial-h2" style={{ marginBottom: '1rem', fontSize: '3rem' }}>Create Your Digital Identity</h2>
          <p className="mono-text" style={{ fontSize: '1.25rem', color: 'var(--text-main)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            We precisely map your facial movements, subtle micro-expressions, and <span style={{ fontWeight: 600 }}>exact vocal tone</span> to generate a hyper-realistic AI avatar.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column: List Items */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { 
                title: "Face Mapping", 
                desc: "Advanced 468-point tracking captures your unique geometry, mapping every detail in 3D space." 
              },
              { 
                title: "Voice Cloning", 
                desc: "Our neural networks recreate your exact tone and cadence from just 60 seconds of audio." 
              },
              { 
                title: "Expression Sync", 
                desc: "Subtle micro-expressions are matched frame-by-frame to deliver a photorealistic performance." 
              },
              { 
                title: "Motion Capture", 
                desc: "We preserve your natural body language—head tilts, blinks, and gestures—so your avatar feels alive." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  padding: '2rem 0',
                  borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {feature.title}
                </div>
                <div className="mono-text" style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>
                  {feature.desc}
                </div>
              </motion.div>
            ))}
            
          </div>

          {/* Right Column: Video in Blue Background */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ 
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', // Light blue background like image
                borderRadius: '2rem',
                padding: '4rem', // Generous equal padding on all sides to frame it perfectly
                width: '100%',
                maxWidth: '480px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                aspectRatio: '9/16', // Phone shape
                borderRadius: '2rem', 
                // Removed overflow: hidden so badge can stick out
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                <img 
                  src="/avatar.png" 
                  alt="Digital Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '2rem' }} 
                />

                {/* Face Mapping Badge */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                  style={{
                    position: 'absolute',
                    right: '-32px', // Breaks out of the image container to the right
                    top: '28%',

                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 20
                  }}
                >
                  {/* Dashed arrow pointing to the cheek */}
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 40 40" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 1)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    style={{
                      position: 'absolute',
                      left: '-36px', // Longer arrow distance to reach the cheek
                      top: '12px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                  >
                    {/* Dashed curved line pointing down-left to cheek */}
                    <path d="M 38 12 Q 20 12 5 35" strokeDasharray="4 4" />
                    {/* Solid Arrow head at the end (5, 35) pointing down-left, made smaller */}
                    <path d="M 5 30 L 5 35 L 10 35" />
                  </svg>

                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Face Mapping...</span>
                </motion.div>
                {/* Gradient overlay to fade into background at the bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '40%',
                  background: 'linear-gradient(to top, #bae6fd 0%, transparent 100%)',
                  pointerEvents: 'none',
                  borderBottomLeftRadius: '2rem',
                  borderBottomRightRadius: '2rem'
                }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Privacy Note */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '4rem' }}>
          <div className="mono-text" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '100px' }}>
            <Lock size={16} />
            <span>Privacy First: Your source video is encrypted and never used to train <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>shared models</span>.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

