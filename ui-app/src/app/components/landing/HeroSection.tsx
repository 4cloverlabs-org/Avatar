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
        .hero-layout {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 3rem;
          align-items: center;
          padding: 8rem 2rem 4rem;
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          min-height: 85vh;
        }

        .hero-content-left {
          grid-column: span 5;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hero-content-right {
          grid-column: span 7;
          position: relative;
          z-index: 1;
        }
        
        .avatar-glow {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140%;
          height: 140%;
          background: 
            radial-gradient(
              ellipse 60% 55% at 50% 20%,
              rgba(205, 230, 255, 0.9),
              transparent 70%
            ),
            radial-gradient(
              ellipse 45% 40% at 20% 45%,
              rgba(225, 215, 255, 0.7),
              transparent 70%
            ),
            radial-gradient(
              ellipse 45% 40% at 80% 45%,
              rgba(215, 245, 245, 0.6),
              transparent 70%
            );
          z-index: -1;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.8;
        }

        .product-island {
          z-index: 2;
          position: relative;
        }

        @media (max-width: 1024px) {
          .hero-layout {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 6rem;
            gap: 4rem;
          }
          .hero-content-left {
            grid-column: span 1;
            align-items: center;
            text-align: center;
          }
          .hero-content-right {
            grid-column: span 1;
          }
        }
      `}</style>
      
      <div 
        className="hero-wrapper"
        style={{
          width: '100%',
          backgroundImage: 'radial-gradient(circle at -10% -10%, rgba(205, 180, 255, 0.5), transparent 50%), radial-gradient(circle at -10% 40%, rgba(190, 235, 255, 0.5), transparent 60%)',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden'
        }}
      >
        <section className="hero-layout">
          <div className="hero-content-left">
            <motion.h1
              className="editorial-h1 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            Create videos with a face that feels real.
          </motion.h1>

          <motion.p
            className="mono-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '500px' }}
          >
            A digital twin that creates content on autopilot. No studio required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <a href="/dashboard" className="btn-primary">
              Create Avatar
            </a>
            <button className="btn-secondary">
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}
          >
            <div style={{ display: 'flex' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #FAFAF8', marginLeft: i === 1 ? '0' : '-12px', overflow: 'hidden', zIndex: 10 - i }}>
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="mono-text" style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>Join 1,200+ creators</span>
              <span className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No credit card required</span>
            </div>
          </motion.div>
        </div>

        <div className="hero-content-right">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <div className="avatar-glow"></div>
            <div className="product-island" style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
              <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '450px', backgroundColor: '#fff', border: '1px solid var(--border-subtle)' }}>
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '500px', display: 'block' }}
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="glass-floating-element" style={{ position: 'relative', marginTop: '0.5rem', bottom: 'auto', left: 'auto', transform: 'none', width: '100%', maxWidth: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.9)' }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={topics[topicIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mono-text"
                    style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, fontWeight: 500, textAlign: 'center' }}
                  >
                    Generating script: "{topics[topicIndex]}"...
                  </motion.p>
                </AnimatePresence>
                <div className="progress-bar-container" style={{ height: '4px' }}>
                  <div className="progress-bar-fill" style={{ width: '98%', background: 'var(--text-main)' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}
