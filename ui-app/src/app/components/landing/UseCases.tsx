"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const niches = [
  { id: 'fitness', label: 'FITNESS', examples: ['"5 MINUTE AB BLASTER..."', '"FORM CHECK: DEADLIFTS..."', '"MEAL PREP FOR FAT LOSS..."'], color: '#000000' },
  { id: 'finance', label: 'FINANCE', examples: ['"CRYPTO MARKET UPDATE..."', '"INDEX FUNDS EXPLAINED..."', '"HOW TO AVOID LIFESTYLE CREEP..."'], color: '#171717' },
  { id: 'realestate', label: 'REAL ESTATE', examples: ['"HOUSE TOUR: $1.2M..."', '"FIRST TIME BUYER TIPS..."', '"NEGOTIATING CLOSING COSTS..."'], color: '#262626' },
  { id: 'saas', label: 'SAAS', examples: ['"NEW FEATURE DROP..."', '"HOW TO AUTOMATE CRM..."', '"BOOSTING RETENTION 20%..."'], color: '#404040' },
  { id: 'ecommerce', label: 'E-COMMERCE', examples: ['"TOP 5 SUMMER FINDS..."', '"BEHIND THE SCENES PACKING..."', '"WHY ABANDONED CARTS HAPPEN..."'], color: '#525252' },
  { id: 'coaching', label: 'COACHING', examples: ['"MINDSET SHIFT FOR 2024..."', '"OVERCOMING BURNOUT..."', '"SETTING HEALTHY BOUNDARIES..."'], color: '#737373' }
];

export default function UseCases() {
  const [activeNiche, setActiveNiche] = useState(niches[0].id);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNiche(current => {
        const currentIndex = niches.findIndex(n => n.id === current);
        const nextIndex = (currentIndex + 1) % niches.length;
        return niches[nextIndex].id;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [activeNiche]);

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
             <div style={{ flex: 1, padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', backgroundColor: '#FFFFFF' }}>
               <span style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Output Preview</span>
               <div style={{ width: '100%', flex: 1, display: 'flex', position: 'relative' }}>
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={activeNiche}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -10 }}
                     transition={{ duration: 0.2 }}
                     style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                   >
                     <div style={{ width: '100%', flex: 1, background: '#FAFAF8', border: '1px solid var(--border-subtle)', borderTop: `3px solid ${currentNiche.color}`, borderRadius: 'var(--radius-lg)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', boxShadow: 'var(--shadow-soft)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                          <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Generated Scripts</span>
                          <span className="mono-text" style={{ color: '#000000', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentNiche.color, transition: 'background-color 0.3s' }}></span>
                            Ready
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                          {currentNiche.examples.map((ex, idx) => (
                             <span key={idx} className="mono-text" style={{ fontSize: '1rem', lineHeight: '1.5', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                               {ex}
                             </span>
                          ))}
                        </div>
                     </div>
                   </motion.div>
                 </AnimatePresence>
               </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
