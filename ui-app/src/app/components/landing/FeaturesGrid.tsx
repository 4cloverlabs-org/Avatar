"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FeaturesGrid() {
  const [niche, setNiche] = useState<'tech' | 'fitness'>('tech');

  return (
    <section className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>02</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">CONTENT ENGINE</h2>
      </div>

      <div className="col-12">
        <div className="dashboard-placeholder" style={{ padding: '0' }}>
           <div className="dashboard-bar" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span>PROCESS: GENERATION PIPELINE</span>
              <span style={{ color: 'var(--text-muted)' }}>AVG. TOTAL TIME: 3 MIN 40S</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', padding: '4rem', alignItems: 'center' }}>
              
              {/* Input Mechanism */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                  onClick={() => setNiche('tech')}
                  style={{ 
                    background: niche === 'tech' ? 'var(--accent)' : 'transparent', 
                    color: niche === 'tech' ? '#fff' : 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 1rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer'
                  }}
                >
                  [ NICHE: TECH ]
                </button>
                <button 
                  onClick={() => setNiche('fitness')}
                  style={{ 
                    background: niche === 'fitness' ? 'var(--accent)' : 'transparent', 
                    color: niche === 'fitness' ? '#fff' : 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 1rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer'
                  }}
                >
                  [ NICHE: FITNESS ]
                </button>
              </div>

              {/* Pipeline Step 1 */}
              <div className="panel" style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-primary)', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="mono-text" style={{ fontWeight: 700 }}>01. SCRIPT</span>
                 <span className="mono-text">{niche === 'tech' ? '"Top 5 AI Tools..."' : '"3 core exercises..."'}</span>
              </div>
              
              <div style={{ height: '40px', width: '2px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              
              {/* Pipeline Step 2 */}
              <div className="panel" style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-primary)', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="mono-text" style={{ fontWeight: 700 }}>02. VOICE</span>
                 <span className="mono-text">SYNTHESIS: 100%</span>
              </div>
              
              <div style={{ height: '40px', width: '2px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              
              {/* Pipeline Step 3 */}
              <div className="panel" style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-primary)', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="mono-text" style={{ fontWeight: 700 }}>03. AVATAR</span>
                 <span className="mono-text">RENDERING...</span>
              </div>
              
              <div style={{ height: '40px', width: '2px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              
              {/* Pipeline Step 4 */}
              <div className="panel" style={{ width: '100%', maxWidth: '600px', background: 'var(--accent)', color: '#fff', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="mono-text" style={{ fontWeight: 700 }}>04. VIDEO OUTPUT</span>
                 <span className="mono-text">READY ↗</span>
              </div>
              
           </div>
        </div>
      </div>
    </section>
  );
}
