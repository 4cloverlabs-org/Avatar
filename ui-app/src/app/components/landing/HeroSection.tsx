"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  return (
    <>
      <style>{`
        .hero-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8rem 2rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-headline {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(3rem, 6vw, 4.5rem);
          line-height: 1.1;
          font-weight: 500;
          color: #1A1A1A;
          text-align: center;
          max-width: 800px;
          margin: 0 0 2rem 0;
          letter-spacing: -0.02em;
        }
        
        .pill-button {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1A1A1A;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }
        
        .pill-button:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transform: translateY(-1px);
        }

        .media-container {
          width: 100%;
          max-width: 900px;
          background: #FAFAFA;
          border: 1px dashed rgba(0, 0, 0, 0.15);
          border-radius: 20px;
          padding: 1rem;
          margin-top: 3rem;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .media-inner {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          height: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .media-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0.5rem 0.5rem;
          width: 100%;
        }

        .thumbnail-row {
          display: flex;
          gap: 1rem;
          overflow: hidden;
          margin-top: 2rem;
          width: 100%;
          justify-content: center;
        }
        
        .thumbnail-card {
          width: 180px;
          height: 100px;
          border-radius: 12px;
          background-color: #E5E7EB;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .thumbnail-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.5rem;
          }
          .media-container {
            padding: 0.5rem;
          }
          .media-inner {
            height: 300px;
          }
          .thumbnail-card {
            width: 140px;
            height: 80px;
          }
        }
      `}</style>
      
      <div className="hero-wrapper" style={{ width: '100%', overflow: 'hidden' }}>
        <section className="hero-layout">
          
          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Create videos with a face that feels real.
          </motion.h1>



          <motion.div 
            className="media-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="media-inner">
              {/* Central Video */}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                </video>
                
                {/* Overlay card in center */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div style={{ width: '45px', height: '65px', background: '#E5E7EB', borderRadius: '8px', transform: 'rotate(-12deg) translateX(10px)', zIndex: 1, overflow: 'hidden', border: '2px solid #FFF' }}>
                        <img src="https://i.pravatar.cc/100?img=1" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/>
                     </div>
                     <div style={{ width: '55px', height: '75px', background: '#F3F4F6', borderRadius: '8px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                     </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4B5563', marginTop: '0.5rem' }}>Add footage to start</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="media-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                   Avatar Pro
                </div>
              </div>
              
              <button style={{ background: '#F3F4F6', color: '#9CA3AF', padding: '0.6rem 1.25rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                Create my video
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </motion.div>

          {/* Thumbnails Row */}
          <motion.div 
            className="thumbnail-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="thumbnail-card">
                <img src={`https://i.pravatar.cc/300?img=${num}`} alt="Thumbnail" />
              </div>
            ))}
          </motion.div>

        </section>
      </div>
    </>
  );
}
