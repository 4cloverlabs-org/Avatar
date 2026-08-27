"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="brutalist-section grid-container" style={{ minHeight: '80vh', paddingTop: '6rem' }}>
      <div className="col-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <motion.h1
          className="editorial-h1 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          CREATE<br />YOUR<br />AI VERSION.
        </motion.h1>

        <p className="mono-text mb-4" style={{ color: 'var(--text-muted)' }}>
          A digital version of you<br />that creates content on autopilot.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <a href="/dashboard" className="btn-primary">
            CREATE AVATAR
          </a>
          <button className="btn-secondary" style={{ fontFamily: 'monospace' }}>
            WATCH DEMO
          </button>
        </div>

        <p className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          [ 1,200+ CREATORS GENERATING CONTENT DAILY ]
        </p>
      </div>

      <div className="col-7">
        <motion.div
          className="dashboard-placeholder"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{ height: '100%', minHeight: '500px' }}
        >
          <div className="dashboard-bar">
            <span>AVATAR ENGINE</span>

          </div>
          <div className="dashboard-content card-dark" style={{ border: 'none', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ position: 'relative', flex: 1, width: '100%', border: '1px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', minHeight: '200px', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-yellow)', color: 'var(--text-main)', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', zIndex: 10 }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--text-main)', borderRadius: '50%', marginRight: '4px' }}></span>
                GENERATING
              </div>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/videos/hero_section.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="mono-text mb-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Live preview — script generated from "productivity tips"
            </p>

            <div style={{ width: '100%' }}>
              <div className="flex-between mb-1">
                <span className="mono-text" style={{ fontSize: '0.75rem' }}>LIP SYNC ACCURACY</span>
                <span className="mono-text" style={{ fontSize: '0.75rem' }}>98%</span>
              </div>
              <div className="progress-bar-container mb-2" style={{ borderColor: 'var(--bg-primary)', height: '10px' }}>
                <div className="progress-bar-fill" style={{ background: 'var(--accent)', width: '98%' }}></div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ flex: 1, border: '1px solid var(--bg-primary)', padding: '0.75rem' }}>
                  <div className="mono-text" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>RENDER TIME</div>
                  <div className="mono-text" style={{ fontSize: '1rem' }}>45s</div>
                </div>
                <div style={{ flex: 1, border: '1px solid var(--bg-primary)', padding: '0.75rem' }}>
                  <div className="mono-text" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>VOICE MATCH</div>
                  <div className="mono-text" style={{ fontSize: '1rem' }}>96%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
