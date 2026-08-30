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
      <section id="how-it-works" className="editorial-section grid-container">
        <div className="col-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="editorial-h2" style={{ textAlign: 'left', marginBottom: '2rem' }}>Create Your Digital Identity</h2>
          
          <p className="mono-text mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
            We map your exact facial movements, micro-expressions, and <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>vocal tone</span> to create a 1:1 digital twin.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { title: "Face Mapping", desc: "468-point facial landmark tracking" },
              { title: "Voice Cloning", desc: "Natural tone from 60 seconds of audio" },
              { title: "Expression Sync", desc: "Micro-expressions matched frame by frame" },
              { title: "Motion Capture", desc: "Head tilts, blinks, and gestures preserved" }
            ].map((feature, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-glass-card" 
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderRadius: 'var(--radius-lg)' }}
              >
                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{feature.title}</div>
                  <div className="mono-text" style={{ fontSize: '0.85rem' }}>{feature.desc}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="col-7">
          <motion.div 
            className="product-island" 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}
          >
            <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
              
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
              <div style={{ position: 'relative', width: '100%', borderBottom: '1px solid var(--border-subtle)', display: 'flex', backgroundColor: '#f9f9f9', minHeight: '320px' }}>
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
              <div style={{ display: 'flex', flexDirection: 'row', minHeight: '180px', width: '100%', backgroundColor: '#fff' }}>
                <TerminalLog />
                <AudioWaveform />
              </div>
            </div>

          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '2.5rem' }}>
            <a href="/dashboard" className="btn-primary">
              Create Avatar
            </a>
          </div>


        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="mono-text" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1.25rem', backgroundColor: 'rgba(0, 0, 0, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Lock size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>Privacy First: Your source video is encrypted and never used to train <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>shared models</span>.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

