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
          margin-top: 1.5rem;
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
          .hero-layout {
            padding: 6rem 1rem 3rem;
          }
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

        @media (max-width: 480px) {
          .hero-layout {
            padding: 6.5rem 1rem 2.5rem;
          }
          .hero-headline {
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }
          .media-container {
            border-radius: 14px;
          }
          .media-inner {
            height: 220px;
            border-radius: 10px;
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
              </div>
            </div>
          </motion.div>

        </section>
      </div>
    </>
  );
}
