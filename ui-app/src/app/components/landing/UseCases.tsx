"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const niches = [
  { id: 'fitness', label: 'FITNESS', example: '["5 MINUTE AB BLASTER...", "FORM CHECK: DEADLIFTS..."]' },
  { id: 'finance', label: 'FINANCE', example: '["CRYPTO MARKET UPDATE...", "INDEX FUNDS EXPLAINED..."]' },
  { id: 'realestate', label: 'REAL ESTATE', example: '["HOUSE TOUR: $1.2M...", "FIRST TIME BUYER TIPS..."]' },
  { id: 'saas', label: 'SAAS', example: '["NEW FEATURE DROP...", "HOW TO AUTOMATE CRM..."]' },
  { id: 'ecommerce', label: 'E-COMMERCE', example: '["TOP 5 SUMMER FINDS...", "BEHIND THE SCENES PACKING..."]' },
  { id: 'coaching', label: 'COACHING', example: '["MINDSET SHIFT FOR 2024...", "OVERCOMING BURNOUT..."]' }
];

export default function UseCases() {
  const [activeNiche, setActiveNiche] = useState(niches[0].id);

  const currentNiche = niches.find(n => n.id === activeNiche) || niches[0];

  return (
    <section className="brutalist-section grid-container" id="use-cases">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>04</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">BUILT FOR EVERY NICHE</h2>
      </div>

      <div className="col-12">
        <div className="dashboard-placeholder" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
           <div className="dashboard-bar" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span>SELECT YOUR INDUSTRY</span>
              <span>OUTPUT PREVIEW</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'row' }}>
             {/* Left sidebar: Niche List */}
             <div style={{ flex: '0 0 250px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
               {niches.map(niche => (
                 <button 
                   key={niche.id}
                   onClick={() => setActiveNiche(niche.id)}
                   style={{
                     background: activeNiche === niche.id ? 'var(--accent)' : 'transparent',
                     color: activeNiche === niche.id ? '#fff' : 'var(--text-main)',
                     border: 'none',
                     borderBottom: '1px solid var(--border-color)',
                     padding: '1.25rem 1rem',
                     textAlign: 'left',
                     fontFamily: 'monospace',
                     fontSize: '0.9rem',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease'
                   }}
                 >
                   [ {niche.label} ]
                 </button>
               ))}
             </div>
             
             {/* Right side: Example output */}
             <div style={{ flex: 1, padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <motion.div 
                 key={activeNiche}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3 }}
                 style={{ width: '100%' }}
               >
                 <div className="panel" style={{ width: '100%', background: 'var(--bg-primary)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span className="mono-text" style={{ fontWeight: 700 }}>GENERATED SCRIPTS</span>
                      <span className="mono-text" style={{ color: 'var(--text-muted)' }}>STATUS: READY</span>
                    </div>
                    <span className="mono-text" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                      {currentNiche.example}
                    </span>
                 </div>
               </motion.div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
