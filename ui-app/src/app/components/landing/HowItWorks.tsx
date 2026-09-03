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
          <p className="mono-text" style={{ fontSize: '1.25rem', color: 'var(--text-main)', maxWidth: '800px', margin: '0 auto' }}>
            We map your exact facial movements, micro-expressions, and <span style={{ fontWeight: 600 }}>vocal tone</span> to create a 1:1 digital twin.
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
                <div style={{ fontSize: '1.75rem', fontWeight: 500, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {feature.title}
                </div>
                <div className="mono-text" style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.5' }}>
                  {feature.desc}
                </div>
              </motion.div>
            ))}
            
            <div style={{ marginTop: '2rem' }}>
              <a href="/dashboard" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Create Avatar
              </a>
            </div>
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
                padding: '2rem 4rem', // Less vertical padding, more horizontal
                width: '100%',
                maxWidth: '580px', // Increased width
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxHeight: '600px' // Constrain height to decrease blue background height
              }}
            >
              <div style={{ 
                position: 'relative', 
                width: '110%', // Increased width beyond the blue padding slightly
                aspectRatio: '3/4', // Wider and shorter than 9/16
                borderRadius: '2rem', 
                overflow: 'hidden', 
                backgroundColor: '#fff', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                
                {/* Top Right Badges */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', zIndex: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', color: 'var(--text-main)', padding: '6px 12px', fontSize: '0.7rem', fontWeight: '600', borderRadius: '100px', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-soft)' }}>
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ display: 'inline-block', width: '8px', height: '8px', background: '#1A1A1A', borderRadius: '50%', marginRight: '8px' }}
                    />
                    PROCESSING
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', color: 'var(--text-main)', padding: '6px 12px', fontSize: '0.7rem', fontWeight: '600', borderRadius: '100px', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-soft)' }}>
                    VOCAL TONE: MATCHED 98%
                  </div>
                </div>

                {/* Top Half: Video */}
                <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', backgroundColor: '#f9f9f9' }}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  >
                    <source src="/videos/avatar_split.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Bottom Half: Terminal & Waveform */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '180px', width: '100%', backgroundColor: '#fff', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <TerminalLog />
                  </div>
                  <div style={{ height: '60px' }}>
                    <AudioWaveform />
                  </div>
                </div>
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

