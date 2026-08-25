"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Integrations() {
  return (
    <section className="section" style={{ background: 'transparent' }}>
      <h2 className="section-title text-dark">Connect your platforms in one click</h2>
      
      <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ 
            width: '200px', 
            height: '112px', 
            background: '#1E2119', 
            border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600
         }}>
           YOUR VIDEO (16:9)
         </div>
         
         <div style={{ width: '2px', height: '40px', background: 'var(--brand-green)' }}></div>
         <div style={{ width: '400px', height: '2px', background: 'var(--brand-green)' }}></div>
         
         <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '40px', background: 'var(--brand-green)' }}></div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 style={{ 
                   width: '120px', 
                   height: '213px', 
                   background: '#15170F', 
                   border: '1px solid var(--brand-green)', 
                   borderRadius: '12px',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '1rem',
                   color: '#fff'
                 }}
               >
                 <span>Instagram</span>
                 <span style={{ fontSize: '0.8rem', color: '#9C9C8C' }}>9:16</span>
               </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '40px', background: 'var(--brand-green)' }}></div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 style={{ 
                   width: '180px', 
                   height: '101px', 
                   background: '#15170F', 
                   border: '1px solid var(--brand-green)', 
                   borderRadius: '12px',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '0.5rem',
                   color: '#fff'
                 }}
               >
                 <span>YouTube</span>
                 <span style={{ fontSize: '0.8rem', color: '#9C9C8C' }}>16:9</span>
               </motion.div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '40px', background: 'var(--brand-green)' }}></div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 style={{ 
                   width: '120px', 
                   height: '213px', 
                   background: '#15170F', 
                   border: '1px solid var(--brand-green)', 
                   borderRadius: '12px',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '1rem',
                   color: '#fff'
                 }}
               >
                 <span>TikTok</span>
                 <span style={{ fontSize: '0.8rem', color: '#9C9C8C' }}>9:16</span>
               </motion.div>
            </div>
         </div>
      </div>
    </section>
  );
}
