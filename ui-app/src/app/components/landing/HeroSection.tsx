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
          justify-content: flex-end;
          padding-bottom: 2rem;
          position: relative;
        }
        .hero-grid-item-video {
          grid-column: span 7;
          grid-row: span 2;
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
          margin-top: 2rem;
        }
        
        @media (max-width: 1024px) {
          .hero-grid-item-top { grid-column: span 8; order: 1; padding-bottom: 1rem; }
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
      <section className="brutalist-section grid-container" style={{ minHeight: '80vh', paddingTop: '6rem', position: 'relative' }}>

        {/* TOP TEXT AREA */}
        <div className="hero-grid-item-top">
          <motion.h1
            className="editorial-h1 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            CREATE<br />YOUR<br />AI VERSION.
          </motion.h1>

          <p className="mono-text mb-2" style={{ color: 'var(--text-muted)' }}>
            A digital version of you<br />that creates content on autopilot.
          </p>
        </div>

        {/* VIDEO PANEL */}
        <div className="hero-grid-item-video">
          <motion.div
            className="dashboard-placeholder"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ height: '100%', minHeight: '500px' }}
          >
            <div className="dashboard-bar">
              <span>AVATAR ENGINE</span>
            </div>
            <div className="dashboard-content card-dark" style={{ border: 'none', flexDirection: 'column', padding: '2rem' }}>
              <div style={{ position: 'relative', flex: 1, width: '100%', border: '1px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', minHeight: '200px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--accent-yellow)', color: 'var(--text-main)', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', zIndex: 10 }}>
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--text-main)', borderRadius: '50%', marginRight: '6px' }}
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div style={{ width: '100%', minHeight: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={topics[topicIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mono-text"
                    style={{ fontSize: '0.75rem', color: 'rgba(248, 246, 240, 0.7)', textAlign: 'center', margin: 0, width: '100%' }}
                  >
                    LIVE PREVIEW — SCRIPT GENERATED FROM "{topics[topicIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              <div style={{ width: '100%' }}>
                <div className="flex-between mb-1">
                  <span className="mono-text" style={{ fontSize: '0.75rem' }}>LIP SYNC ACCURACY</span>
                  <span className="mono-text" style={{ fontSize: '0.75rem' }}>98%</span>
                </div>
                <div className="progress-bar-container mb-2" style={{ borderColor: 'var(--bg-primary)', height: '10px' }}>
                  <div className="progress-bar-fill" style={{ background: 'var(--accent)', width: '98%' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ flex: 1, border: '1px solid var(--bg-primary)', padding: '0.75rem' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem', color: 'rgba(248, 246, 240, 0.7)', marginBottom: '0.25rem' }}>RENDER TIME</div>
                    <div className="mono-text" style={{ fontSize: '1rem' }}>45s</div>
                  </div>
                  <div style={{ flex: 1, border: '1px solid var(--bg-primary)', padding: '0.75rem' }}>
                    <div className="mono-text" style={{ fontSize: '0.65rem', color: 'rgba(248, 246, 240, 0.7)', marginBottom: '0.25rem' }}>VOICE MATCH</div>
                    <div className="mono-text" style={{ fontSize: '1rem' }}>96%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM TEXT AREA */}
        <div className="hero-grid-item-bottom">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <a href="/dashboard" className="btn-primary">
              CREATE AVATAR
            </a>
            <button className="btn-secondary" style={{ fontFamily: 'monospace' }}>
              WATCH DEMO
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--bg-primary)', marginLeft: i === 1 ? '0' : '-10px', overflow: 'hidden', zIndex: 10 - i }}>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <span className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Choose from 50+ avatar styles</span>
          </div>

          <div>
            <p className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              [ 1,200+ CREATORS GENERATING CONTENT DAILY ]
            </p>
            <p className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.8, margin: 0 }}>
              [ NO CREDIT CARD REQUIRED ]
            </p>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="hero-scroll-indicator">
          <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>[ SCROLL ]</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.div>
        </div>

      </section>
    </>
  );
}
