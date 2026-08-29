"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const niches = [
  { id: 'fitness', label: 'FITNESS', example: '["5 MINUTE AB BLASTER...", "FORM CHECK: DEADLIFTS..."]', color: '#000000' },
  { id: 'finance', label: 'FINANCE', example: '["CRYPTO MARKET UPDATE...", "INDEX FUNDS EXPLAINED..."]', color: '#3B82F6' },
  { id: 'realestate', label: 'REAL ESTATE', example: '["HOUSE TOUR: $1.2M...", "FIRST TIME BUYER TIPS..."]', color: '#F59E0B' },
  { id: 'saas', label: 'SAAS', example: '["NEW FEATURE DROP...", "HOW TO AUTOMATE CRM..."]', color: '#8B5CF6' },
  { id: 'ecommerce', label: 'E-COMMERCE', example: '["TOP 5 SUMMER FINDS...", "BEHIND THE SCENES PACKING..."]', color: '#EC4899' },
  { id: 'coaching', label: 'COACHING', example: '["MINDSET SHIFT FOR 2024...", "OVERCOMING BURNOUT..."]', color: '#64748B' }
];

export default function UseCases() {
  const [activeNiche, setActiveNiche] = useState(niches[0].id);

  const currentNiche = niches.find(n => n.id === activeNiche) || niches[0];

  return (
    <section className="editorial-section grid-container" id="use-cases">
      <div className="col-12 mb-4">
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Built For Every Niche</h2>
      </div>

      <div className="col-12">
        <div className="premium-glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
           <div className="dashboard-bar" style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'transparent' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Select Your Industry</span>
              <span style={{ fontWeight: 500 }}>Output Preview</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'row', minHeight: '400px' }}>
             {/* Left sidebar: Niche List */}
             <div style={{ flex: '0 0 250px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', backgroundColor: '#F9F9F9' }}>
               {niches.map(niche => (
                 <button 
                   key={niche.id}
                   onClick={() => setActiveNiche(niche.id)}
                   style={{
                     background: activeNiche === niche.id ? '#FFFFFF' : 'transparent',
                     color: 'var(--text-main)',
                     border: 'none',
                     borderBottom: '1px solid var(--border-subtle)',
                     borderRight: activeNiche === niche.id ? 'none' : '1px solid transparent',
                     boxShadow: activeNiche === niche.id ? '-4px 0 0 ' + niche.color + ' inset' : 'none',
                     padding: '1.25rem 1.5rem',
                     textAlign: 'left',
                     fontFamily: 'var(--font-body)',
                     fontWeight: activeNiche === niche.id ? 600 : 500,
                     fontSize: '0.9rem',
                     cursor: 'pointer',
                     transition: 'all 0.2s ease',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.75rem'
                   }}
                 >
                   <span style={{ width: '8px', height: '8px', background: niche.color, borderRadius: '50%' }} />
                   {niche.label}
                 </button>
               ))}
             </div>
             
             {/* Right side: Example output */}
             <div style={{ flex: 1, padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
               <motion.div 
                 key={activeNiche}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3 }}
                 style={{ width: '100%', maxWidth: '600px' }}
               >
                 <div style={{ width: '100%', background: '#FAFAF8', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Generated Scripts</span>
                      <span className="mono-text" style={{ color: '#000000', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }}></span>
                        Ready
                      </span>
                    </div>
                    <span className="mono-text" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)', fontFamily: 'monospace' }}>
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
