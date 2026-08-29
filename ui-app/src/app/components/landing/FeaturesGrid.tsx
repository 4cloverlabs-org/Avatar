"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mic, Video, Share } from 'lucide-react';

export default function FeaturesGrid() {
  const [niche, setNiche] = useState<'tech' | 'fitness'>('tech');

  return (
    <section className="editorial-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)' }}>02</span>
      </div>
      <div className="col-12 mb-4">
        <h2 className="editorial-h2">Content Engine</h2>
      </div>

      <div className="col-12">
        <div className="premium-glass-card" style={{ padding: '0', background: '#FFFFFF', overflow: 'hidden' }}>
           <div className="dashboard-bar" style={{ borderBottom: '1px solid var(--border-subtle)', background: '#F8FAFC', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>Process: Generation Pipeline</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Avg. Total Time: 3 min 40s</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', padding: '4rem', alignItems: 'center', background: 'radial-gradient(circle at center, #F1F5F9 0%, #FFFFFF 100%)' }}>
              
              {/* Input Mechanism */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                <button 
                  onClick={() => setNiche('tech')}
                  style={{ 
                    background: niche === 'tech' ? '#000000' : '#FFFFFF', 
                    color: niche === 'tech' ? '#FFFFFF' : 'var(--text-main)',
                    border: niche === 'tech' ? '1px solid #000000' : '1px solid var(--border-subtle)',
                    padding: '0.5rem 1.25rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    borderRadius: '100px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: niche === 'tech' ? '0 4px 10px rgba(0, 0, 0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  Tech Creator
                </button>
                <button 
                  onClick={() => setNiche('fitness')}
                  style={{ 
                    background: niche === 'fitness' ? '#000000' : '#FFFFFF', 
                    color: niche === 'fitness' ? '#FFFFFF' : 'var(--text-main)',
                    border: niche === 'fitness' ? '1px solid #000000' : '1px solid var(--border-subtle)',
                    padding: '0.5rem 1.25rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    borderRadius: '100px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: niche === 'fitness' ? '0 4px 10px rgba(0, 0, 0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  Fitness Coach
                </button>
              </div>

              {/* Pipeline Step 1 */}
              <div className="premium-glass-card" style={{ width: '100%', maxWidth: '600px', background: '#F8FAFC', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Settings size={20} color="#000000" />
                   <span style={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>01. Script</span>
                 </div>
                 <span style={{ color: 'var(--text-muted)' }}>{niche === 'tech' ? '"Top 5 AI Tools..."' : '"3 core exercises..."'}</span>
              </div>
              
              <div style={{ height: '30px', width: '2px', background: 'var(--border-subtle)', margin: '0.5rem 0' }}></div>
              
              {/* Pipeline Step 2 */}
              <div className="premium-glass-card" style={{ width: '100%', maxWidth: '600px', background: '#F8FAFC', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Mic size={20} color="#000000" />
                   <span style={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>02. Voice</span>
                 </div>
                 <span style={{ color: '#000000', fontWeight: 500 }}>Synthesis 100%</span>
              </div>
              
              <div style={{ height: '30px', width: '2px', background: 'var(--border-subtle)', margin: '0.5rem 0' }}></div>
              
              {/* Pipeline Step 3 */}
              <div className="premium-glass-card" style={{ width: '100%', maxWidth: '600px', background: '#F8FAFC', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', border: '1px solid #000000', boxShadow: '0 8px 16px rgba(0, 0, 0,0.1)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Video size={20} color="#000000" />
                   <span style={{ fontWeight: 600, fontFamily: 'var(--font-heading)', color: '#000000' }}>03. Avatar</span>
                 </div>
                 <span style={{ color: '#000000', fontWeight: 600 }}>Rendering...</span>
              </div>
              
              <div style={{ height: '30px', width: '2px', background: 'var(--border-subtle)', margin: '0.5rem 0' }}></div>
              
              {/* Pipeline Step 4 */}
              <div className="premium-glass-card" style={{ width: '100%', maxWidth: '600px', background: '#000000', color: '#FFFFFF', border: '1px solid #000000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', boxShadow: '0 8px 20px rgba(0, 0, 0,0.2)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Share size={20} color="#FFFFFF" />
                   <span style={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>04. Video Output</span>
                 </div>
                 <span style={{ fontWeight: 600 }}>Ready ↗</span>
              </div>
              
           </div>
        </div>
      </div>
    </section>
  );
}
