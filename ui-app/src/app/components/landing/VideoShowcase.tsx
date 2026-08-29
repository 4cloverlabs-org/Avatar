"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function VideoShowcase() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Creators', 'Education', 'Marketing', 'Product', 'Social'];

  return (
    <section className="editorial-section grid-container" style={{ background: '#FFFFFF' }}>
      <div className="col-12 mb-4">
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>See what your AI can create.</h2>
      </div>
      
      <div className="col-12" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
         {categories.map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: filter === c ? 'var(--text-main)' : '#F1F5F9',
                color: filter === c ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '100px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)'
              }}
            >
              {c}
            </button>
         ))}
      </div>
      
      <div className="col-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
         {['Fitness', 'Finance', 'E-commerce', 'Education', 'Real Estate', 'SaaS'].map((niche, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4, boxShadow: 'var(--shadow-medium)' }}
              className="premium-glass-card"
              style={{ 
                aspectRatio: '9/16', 
                background: '#F8FAFC', 
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseEnter={(e) => {
                 const btn = e.currentTarget.querySelector('.template-btn') as HTMLElement;
                 if(btn) btn.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                 const btn = e.currentTarget.querySelector('.template-btn') as HTMLElement;
                 if(btn) btn.style.opacity = '0';
              }}
            >
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                     <Play fill="#000000" color="#000000" size={24} style={{ marginLeft: '4px' }} />
                  </div>
               </div>
               
               <div 
                 className="template-btn"
                 style={{ 
                   position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                   background: '#000000', color: '#FFFFFF', padding: '0.75rem 1.5rem',
                   borderRadius: '100px', fontWeight: 600, opacity: 0, transition: 'opacity 0.2s',
                   whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                 }}
               >
                 Use this template
               </div>

               <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>Avatar {i+1}</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{niche}</p>
               </div>
            </motion.div>
         ))}
      </div>
    </section>
  );
}
