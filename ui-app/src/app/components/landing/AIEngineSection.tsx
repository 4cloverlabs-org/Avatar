"use client";

import React from 'react';
import { motion } from 'framer-motion';

const SvgIdea = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
    <line x1="20" y1="60" x2="100" y2="60" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
    <line x1="60" y1="20" x2="60" y2="100" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
    <line x1="30" y1="90" x2="90" y2="30" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
    <ellipse cx="40" cy="60" rx="10" ry="25" stroke="#111827" strokeWidth="1" />
    <line x1="40" y1="35" x2="60" y2="60" stroke="#111827" strokeWidth="1" />
    <line x1="40" y1="85" x2="60" y2="60" stroke="#111827" strokeWidth="1" />
    <ellipse cx="90" cy="60" rx="15" ry="35" stroke="#111827" strokeWidth="1" />
    <line x1="90" y1="25" x2="60" y2="60" stroke="#111827" strokeWidth="1" />
    <line x1="90" y1="95" x2="60" y2="60" stroke="#111827" strokeWidth="1" />
  </svg>
);

const SvgScript = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
    <rect x="30" y="30" width="60" height="60" stroke="#111827" strokeWidth="1" />
    <rect x="45" y="15" width="60" height="60" stroke="#111827" strokeWidth="1" />
    <line x1="30" y1="30" x2="45" y2="15" stroke="#111827" strokeWidth="1" />
    <line x1="90" y1="30" x2="105" y2="15" stroke="#111827" strokeWidth="1" />
    <line x1="30" y1="90" x2="45" y2="75" stroke="#111827" strokeWidth="1" />
    <line x1="90" y1="90" x2="105" y2="75" stroke="#111827" strokeWidth="1" />
    <line x1="60" y1="30" x2="60" y2="90" stroke="#111827" strokeWidth="0.5" />
    <line x1="30" y1="60" x2="90" y2="60" stroke="#111827" strokeWidth="0.5" />
    <line x1="75" y1="15" x2="75" y2="75" stroke="#111827" strokeWidth="0.5" />
    <line x1="45" y1="45" x2="105" y2="45" stroke="#111827" strokeWidth="0.5" />
    <line x1="60" y1="30" x2="75" y2="15" stroke="#111827" strokeWidth="0.5" />
    <line x1="60" y1="90" x2="75" y2="75" stroke="#111827" strokeWidth="0.5" />
    <line x1="30" y1="60" x2="45" y2="45" stroke="#111827" strokeWidth="0.5" />
    <line x1="90" y1="60" x2="105" y2="45" stroke="#111827" strokeWidth="0.5" />
    <line x1="60" y1="60" x2="75" y2="45" stroke="#111827" strokeWidth="0.5" />
    <line x1="30" y1="30" x2="105" y2="75" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
    <line x1="30" y1="90" x2="105" y2="15" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

const SvgVideo = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
    <circle cx="65" cy="60" r="45" stroke="#111827" strokeWidth="0.5" strokeDasharray="1 3" />
    <circle cx="60" cy="60" r="40" stroke="#111827" strokeWidth="1" />
    <circle cx="55" cy="60" r="35" stroke="#111827" strokeWidth="1" />
    <circle cx="50" cy="60" r="30" stroke="#111827" strokeWidth="1" />
    <circle cx="45" cy="60" r="25" stroke="#111827" strokeWidth="1" />
    <circle cx="40" cy="60" r="20" stroke="#111827" strokeWidth="1" />
    <circle cx="35" cy="60" r="15" stroke="#111827" strokeWidth="1" />
  </svg>
);

const SvgPublish = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="40" stroke="#111827" strokeWidth="1" />
    <ellipse cx="60" cy="60" rx="15" ry="40" stroke="#111827" strokeWidth="1" />
    <ellipse cx="60" cy="60" rx="40" ry="15" stroke="#111827" strokeWidth="1" />
    <ellipse cx="60" cy="60" rx="6" ry="40" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
    <ellipse cx="60" cy="60" rx="40" ry="6" stroke="#111827" strokeWidth="0.5" strokeDasharray="2 2" />
    <line x1="20" y1="60" x2="100" y2="60" stroke="#111827" strokeWidth="0.5" />
    <line x1="60" y1="20" x2="60" y2="100" stroke="#111827" strokeWidth="0.5" />
    <line x1="32" y1="32" x2="88" y2="88" stroke="#111827" strokeWidth="0.5" strokeDasharray="1 3" />
    <line x1="32" y1="88" x2="88" y2="32" stroke="#111827" strokeWidth="0.5" strokeDasharray="1 3" />
  </svg>
);

const PipelineCardUI = ({ title, desc, svg }: { title: string, desc: string, svg: React.ReactNode }) => (
   <motion.div 
      style={{ 
         background: 'rgba(248, 147, 77, 0.1)',
         borderRadius: '20px',
         padding: '3rem 2rem',
         display: 'flex',
         flexDirection: 'column',
         minHeight: '420px',
         boxShadow: 'inset 0 0 0 1px rgba(248, 147, 77, 0.15)'
      }}
   >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
         <div style={{ width: '240px', height: '240px' }}>
            {svg}
         </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
         <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', margin: '0 0 0.4rem 0' }}>{title}</h4>
         <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
   </motion.div>
);

export default function AIEngineSection() {
   return (
      <section className="editorial-section" style={{ background: '#F0F0F0', position: 'relative', padding: '4rem 1rem' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
               <h2 className="editorial-h2" style={{ marginBottom: '1rem' }}>Avatar Production Pipeline</h2>
               <p className="mono-text" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                  Automated Creation Process
               </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto', borderRadius: '24px', boxSizing: 'border-box' }}>

               {/* 4 Cards Grid */}
               <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.25rem', 
                  width: '100%' 
               }}>
                  <PipelineCardUI title="Idea" desc="Finding next topic" svg={<SvgIdea />} />
                  <PipelineCardUI title="Script" desc="Writing hook + script" svg={<SvgScript />} />
                  <PipelineCardUI title="Video" desc="Generating video" svg={<SvgVideo />} />
                  <PipelineCardUI title="Publish" desc="Publishing everywhere" svg={<SvgPublish />} />
               </div>
            </div>
         </div>
      </section>
   );
}
