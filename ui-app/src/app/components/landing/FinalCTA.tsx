"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="brutalist-section" style={{ padding: '8rem 0', background: 'var(--accent-green-dark)', color: 'var(--bg-primary)', borderBottom: 'none' }}>
      <div className="grid-container">
        <div className="col-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="editorial-h1"
         >
           READY?
         </motion.h2>
         
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="mono-text mt-4 mb-4" 
           style={{ color: 'rgba(248, 246, 240, 0.7)' }}
         >
           INITIALIZE YOUR DIGITAL IDENTITY.
         </motion.p>
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
         >
           <button className="btn-highlight" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}>
             START GENERATING
           </button>
           <span className="mono-text" style={{ fontSize: '0.75rem', color: 'rgba(248, 246, 240, 0.7)' }}>No credit card required · Cancel anytime</span>
           <a href="#how-it-works" className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--bg-primary)', textDecoration: 'none', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.2rem', marginTop: '1rem' }}>
             Not ready? See how it works ↓
           </a>
         </motion.div>
      </div>
      </div>
    </section>
  );
}
