"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const topics = [
  "productivity tips",
  "5-minute workouts",
  "market update",
  "skincare routine"
];

const pipelineStates = ["GENERATING", "RENDERING", "SYNCING", "READY"];

export default function HeroSection() {
  const [topicIndex, setTopicIndex] = useState(0);
  const [pipelineIndex, setPipelineIndex] = useState(0);

  useEffect(() => {
    const topicInterval = setInterval(() => {
      setTopicIndex((prev) => (prev + 1) % topics.length);
    }, 4000);
    return () => clearInterval(topicInterval);
  }, []);

  useEffect(() => {
    const pipelineInterval = setInterval(() => {
      setPipelineIndex((prev) => (prev + 1) % pipelineStates.length);
    }, 2500);
    return () => clearInterval(pipelineInterval);
  }, []);

  return (
    <>
      <style>{`
        .hero-grid-item-top {
          grid-column: span 5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-bottom: 2rem;
          position: relative;
        }
        .hero-grid-item-video {
          grid-column: span 7;
          grid-row: span 2;
          display: flex;
          align-items: center;
        }
        .hero-grid-item-bottom {
          grid-column: span 5;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .hero-scroll-indicator {
          grid-column: span 12;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 4rem;
        }
        
        @media (max-width: 1024px) {
          .hero-grid-item-top { grid-column: span 8; order: 1; padding-bottom: 1rem; justify-content: flex-end; }
          .hero-grid-item-video { grid-column: span 8; grid-row: auto; order: 2; margin-bottom: 2rem; }
          .hero-grid-item-bottom { grid-column: span 8; order: 3; }
          .hero-scroll-indicator { grid-column: span 8; order: 4; }
        }

        @media (max-width: 768px) {
          .hero-grid-item-top, .hero-grid-item-video, .hero-grid-item-bottom, .hero-scroll-indicator {
            grid-column: span 4 !important;
          }
        }
      `}</style>
      <section className="editorial-section grid-container" style={{ minHeight: '85vh', position: 'relative' }}>

        {/* TOP TEXT AREA */}
        <div className="hero-grid-item-top">
          <motion.h1
            className="editorial-h1 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Create Your<br />AI Version.
          </motion.h1>

          <p className="mono-text mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            A digital twin that creates<br />content on autopilot.
          </p>
        </div>

        {/* VIDEO PANEL */}
        <div className="hero-grid-item-video">
          <motion.div
            className="product-island w-100"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ width: '100%', padding: '0.5rem', background: '#fff' }}
          >
            <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '450px', backgroundColor: '#f0f0f0' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', color: 'var(--text-main)', padding: '6px 12px', fontSize: '0.7rem', fontWeight: '600', borderRadius: '100px', display: 'flex', alignItems: 'center', zIndex: 10, boxShadow: 'var(--shadow-soft)' }}>
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: 'inline-block', width: '8px', height: '8px', background: '#1A1A1A', borderRadius: '50%', marginRight: '8px' }}
                />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '70px', height: '1em' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={pipelineStates[pipelineIndex]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ position: 'absolute' }}
                    >
                      {pipelineStates[pipelineIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '450px' }}
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="glass-floating-element" style={{ bottom: '20px', left: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={topics[topicIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mono-text"
                    style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, fontWeight: 500 }}
                  >
                    Generating script: "{topics[topicIndex]}"...
                  </motion.p>
                </AnimatePresence>
                <div className="progress-bar-container" style={{ height: '4px' }}>
                  <div className="progress-bar-fill" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM TEXT AREA */}
        <div className="hero-grid-item-bottom">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary">
              Create Avatar
            </a>
            <button className="btn-secondary">
              Watch Demo
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #FAFAF8', marginLeft: i === 1 ? '0' : '-12px', overflow: 'hidden', zIndex: 10 - i }}>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Join 1,200+ creators</span>
          </div>

          <div>
            <p className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.8, margin: 0 }}>
              No credit card required. Free 14-day trial.
            </p>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="hero-scroll-indicator">
          <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.div>
        </div>

      </section>
    </>
  );
}
