"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Video } from 'lucide-react';

export default function Integrations() {
  return (
    <section className="editorial-section grid-container" style={{ background: '#FAFAF8' }}>
      <div className="col-12 mb-4">
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Connect your platforms in one click</h2>
      </div>
      
      <div className="col-12" style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div className="premium-glass-card" style={{ 
            width: '240px', 
            height: '135px', 
            background: '#FFFFFF', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            fontWeight: 600,
            gap: '0.5rem'
         }}>
           <Video size={24} color="#000000" />
           Your Video (16:9)
         </div>
         
         <div style={{ width: '2px', height: '40px', background: '#000000', opacity: 0.5 }}></div>
         <div style={{ width: '400px', height: '2px', background: '#000000', opacity: 0.5 }}></div>
         
         <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '40px', background: '#000000', opacity: 0.5 }}></div>
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="premium-glass-card"
                 style={{ 
                   width: '120px', 
                   height: '213px', 
                   background: '#FFFFFF', 
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '1rem',
                   color: 'var(--text-main)',
                   border: '1px solid #000000'
                 }}
               >
                 <Instagram size={28} color="#E1306C" />
                 <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Instagram</span>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>9:16</span>
               </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '40px', background: '#000000', opacity: 0.5 }}></div>
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="premium-glass-card"
                 style={{ 
                   width: '180px', 
                   height: '101px', 
                   background: '#FFFFFF', 
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '0.5rem',
                   color: 'var(--text-main)',
                   border: '1px solid #000000'
                 }}
               >
                 <Youtube size={28} color="#FF0000" />
                 <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>YouTube</span>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>16:9</span>
               </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '40px', background: '#000000', opacity: 0.5 }}></div>
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="premium-glass-card"
                 style={{ 
                   width: '120px', 
                   height: '213px', 
                   background: '#FFFFFF', 
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '1rem',
                   color: 'var(--text-main)',
                   border: '1px solid #000000'
                 }}
               >
                 <div style={{ width: '28px', height: '28px', background: '#000000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '12px', fontWeight: 700 }}>t</div>
                 <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>TikTok</span>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>9:16</span>
               </motion.div>
            </div>
         </div>
      </div>
    </section>
  );
}
