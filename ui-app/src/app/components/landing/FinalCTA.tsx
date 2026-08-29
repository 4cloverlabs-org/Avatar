"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="editorial-section" style={{ padding: '8rem 0', background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', color: 'var(--text-main)', borderBottom: 'none', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative gradient orb */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
      
      <div className="grid-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="col-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="editorial-h1"
           style={{ color: 'var(--text-main)' }}
         >
           Ready?
         </motion.h2>
         
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="mono-text mt-2 mb-4" 
           style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}
         >
           Initialize your digital identity today.
         </motion.p>
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}
         >
           <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem', borderRadius: '100px', background: 'var(--text-main)', color: '#FFFFFF', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
             Start Generating
           </button>
           <span className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No credit card required · Cancel anytime</span>
           <a href="#how-it-works" className="mono-text" style={{ fontSize: '0.9rem', color: 'var(--text-main)', textDecoration: 'none', borderBottom: '1px solid var(--text-main)', paddingBottom: '0.2rem', marginTop: '1rem' }}>
             Not ready? See how it works ↓
           </a>
         </motion.div>
      </div>
      </div>
    </section>
  );
}
