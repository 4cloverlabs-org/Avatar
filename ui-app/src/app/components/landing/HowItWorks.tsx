"use client";

import React from 'react';
import { motion } from 'framer-motion';
import TerminalLog from './TerminalLog';
import AudioWaveform from './AudioWaveform';
import { Check } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="editorial-section grid-container">
      <div className="col-12 mb-4">
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Create Your Digital Identity</h2>
      </div>

      <div className="col-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p className="mono-text mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
          We map your exact facial movements, micro-expressions, and vocal tone to create a 1:1 digital twin.
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

        <p className="mono-text mt-4" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          Privacy First: Your source video is encrypted and never used to train shared models.
        </p>
      </div>

      <div className="col-7">
        <motion.div 
          className="product-island" 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', padding: '0.5rem', backgroundColor: '#fff' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: '#f9f9f9', border: '1px solid var(--border-subtle)' }}>
            <div className="dashboard-bar" style={{ backgroundColor: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <span>AI Avatar Generation</span>
              <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1A1A1A' }}></span>
                PROCESSING
              </span>
            </div>
            
            <div style={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Top Half: Video */}
              <div style={{ flex: 1, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: '280px', width: '100%' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
