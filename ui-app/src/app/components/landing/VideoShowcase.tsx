"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function VideoShowcase() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Creators', 'Education', 'Marketing', 'Product', 'Social'];

  return (
    <section className="section" style={{ background: '#15170F' }}>
      <h2 className="section-title">See what your AI can create.</h2>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
         {categories.map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: filter === c ? 'var(--brand-green)' : '#15170F',
                color: filter === c ? '#fff' : '#9C9C8C',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {c}
            </button>
         ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>
         {['Fitness', 'Finance', 'E-commerce', 'Education', 'Real Estate', 'SaaS'].map((niche, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              style={{ 
                aspectRatio: '9/16', 
                background: '#1E2119', 
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
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
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                     <Play fill="#fff" color="#fff" />
                  </div>
               </div>
               
               <div 
                 className="template-btn"
                 style={{ 
                   position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                   background: 'var(--brand-green)', color: '#15170F', padding: '0.75rem 1.5rem',
                   borderRadius: '999px', fontWeight: 600, opacity: 0, transition: 'opacity 0.2s',
                   whiteSpace: 'nowrap'
                 }}
               >
                 Use this template
               </div>

               <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Avatar {i+1}</h4>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>{niche}</p>
               </div>
            </motion.div>
         ))}
      </div>
    </section>
  );
}
