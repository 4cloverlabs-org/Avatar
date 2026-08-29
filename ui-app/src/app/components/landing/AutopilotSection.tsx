"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ConnectedStatus = () => (
  <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
      style={{
        display: 'inline-block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#000000', // Green indicator
        position: 'relative'
      }}
    >
      <motion.span
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: '50%',
          backgroundColor: '#000000',
        }}
      />
    </motion.span>
    Connected
  </span>
);

const CycleNode = ({ label, index, isActive, isLast, annotation }: { label: string, index: number, isActive: boolean, isLast?: boolean, annotation: string }) => {
  return (
    <div style={{ position: 'relative' }}>
        <motion.div
          animate={isActive ? { 
            scale: 1.05, 
            boxShadow: 'var(--shadow-float)', 
            borderColor: '#1A1A1A' 
          } : { 
            scale: 1, 
            boxShadow: 'var(--shadow-soft)', 
            borderColor: 'var(--border-subtle)'
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            height: isActive ? 80 : 60,
            background: isActive ? '#1A1A1A' : '#FFFFFF',
            color: isActive ? '#FFFFFF' : 'var(--text-main)',
            border: `1px solid var(--border-subtle)`,
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 1rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            zIndex: 2,
            position: 'relative',
            width: '140px',
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          <div style={{ transform: isActive ? 'translateY(-8px)' : 'translateY(0)', transition: 'transform 0.25s ease-out' }}>
            {label}
          </div>
          
          <motion.div
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.15, delay: isActive ? 0.1 : 0 }}
            style={{
               position: 'absolute',
               bottom: '12px',
               width: '100%',
               display: 'flex',
               justifyContent: 'center',
               fontWeight: 400
            }}
          >
              {index === 0 && <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>5 morning habits that...</span>}
              {index === 1 && <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>Generating<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span></span>}
              {index === 2 && (
                <div style={{ display: 'flex', gap: '2px', height: '8px', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['3px', '8px', '3px'] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      style={{ width: '2px', background: 'currentColor', borderRadius: '1px' }}
                    />
                  ))}
                </div>
              )}
              {index === 3 && <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}><span>✓</span> Published</span>}
          </motion.div>
        </motion.div>
        
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: 'absolute', top: '100%', left: '0', width: '100%', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
          >
            {annotation}
          </motion.div>
        )}
    </div>
  );
};

const CycleDiagram = ({ activeNode }: { activeNode: number }) => {
  return (
    <div style={{ position: 'relative', width: '380px', height: '320px', margin: '0 auto', marginTop: '2rem' }}>
      
      {/* SVG Track */}
      <svg style={{ position: 'absolute', top: '45px', left: '80px', width: '220px', height: '180px', zIndex: 0, overflow: 'visible' }}>
        <rect x="0" y="0" width="220" height="180" rx="32" fill="none" stroke="var(--border-subtle)" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Animated Active Line */}
        <motion.rect 
           x="0" y="0" width="220" height="180" rx="32" fill="none" 
           stroke="#1A1A1A" strokeWidth="2.5"
           strokeDasharray="800"
           animate={{ strokeDashoffset: [800, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Static Arrowheads */}
        <polygon points="105,-6 115,0 105,6" fill="#1A1A1A" />
        <polygon points="226,85 220,95 214,85" fill="#1A1A1A" />
        <polygon points="115,186 105,180 115,174" fill="#1A1A1A" />
        <polygon points="-6,95 0,85 6,95" fill="#1A1A1A" />
      </svg>

      {/* Node 0: IDEA */}
      <div style={{ position: 'absolute', top: '15px', left: '10px', width: '140px', display: 'flex', justifyContent: 'center' }}>
        <CycleNode label="IDEA" index={0} isActive={activeNode === 0} annotation="Niche + topic input" />
      </div>

      {/* Node 1: SCRIPT */}
      <div style={{ position: 'absolute', top: '15px', right: '10px', width: '140px', display: 'flex', justifyContent: 'center' }}>
        <CycleNode label="SCRIPT" index={1} isActive={activeNode === 1} annotation="AI drafts script" />
      </div>

      {/* Node 2: VIDEO */}
      <div style={{ position: 'absolute', top: '195px', right: '10px', width: '140px', display: 'flex', justifyContent: 'center' }}>
        <CycleNode label="VIDEO" index={2} isActive={activeNode === 2} annotation="Renders avatar" />
      </div>

      {/* Node 3: PUBLISH */}
      <div style={{ position: 'absolute', top: '195px', left: '10px', width: '140px', display: 'flex', justifyContent: 'center' }}>
        <CycleNode label="PUBLISH" index={3} isActive={activeNode === 3} isLast={true} annotation="Posts to platforms" />
      </div>
    </div>
  );
};

const UpcomingPosts = ({ settingsVariants }: { settingsVariants: any }) => (
  <motion.div 
    variants={settingsVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="premium-glass-card"
    style={{ marginTop: '1rem', padding: '1.5rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', fontWeight: 500, fontSize: '0.85rem' }}>
      <span>UPCOMING QUEUE</span>
      <span>3 SCHEDULED</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>Today, 9:00 AM</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>IG, YT, TT</span>
           <span style={{ color: '#F59E0B', fontSize: '0.75rem', width: '80px', textAlign: 'right', fontWeight: 600 }}>GENERATING</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>Wed, 9:00 AM</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>IG, YT, TT</span>
           <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '80px', textAlign: 'right', fontWeight: 600 }}>QUEUED</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>Fri, 9:00 AM</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>IG, YT, TT</span>
           <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '80px', textAlign: 'right', fontWeight: 600 }}>QUEUED</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function AutopilotSection() {
  const [mins, setMins] = useState({ ig: 2, yt: 12, tt: 5 });
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMins(prev => ({ ig: prev.ig + 1, yt: prev.yt + 1, tt: prev.tt + 1 }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(current => (current + 1) % 4);
    }, 2000); // 2 second cycle
    return () => clearInterval(interval);
  }, []);

  const platformVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const settingsVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.4, duration: 0.8 } }
  };

  return (
    <section className="editorial-section" style={{ background: '#F0F0F0', position: 'relative' }}>
      <div className="grid-container">
        <div className="col-12 mb-4">
          <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Autopilot</h2>
        </div>

        <div className="col-6">
          <p className="mono-text mb-4" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Connect your platforms once. The engine generates and publishes content while you sleep.
          </p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="premium-glass-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', padding: '1.5rem' }}
          >
             <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontWeight: 600 }}>Instagram Reels</span>
                   <ConnectedStatus />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced {mins.ig} min ago</span>
             </motion.div>
             
             <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontWeight: 600 }}>YouTube Shorts</span>
                   <ConnectedStatus />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced {mins.yt} min ago</span>
             </motion.div>
             
             <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontWeight: 600 }}>TikTok</span>
                   <ConnectedStatus />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced {mins.tt} min ago</span>
             </motion.div>
             
             <motion.div variants={platformVariants} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>LinkedIn</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Offline</span>
             </motion.div>
          </motion.div>

          <motion.div 
            variants={settingsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="premium-glass-card"
            style={{ marginTop: '2rem', padding: '1.5rem', fontSize: '0.85rem' }}
          >
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Posting Schedule</span>
                <span style={{ color: 'var(--text-muted)' }}>3x/week, Mon/Wed/Fri 9AM</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Auto-Publish</span>
                <span style={{ color: '#000000', fontWeight: 600 }}>ON</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Review Required</span>
                <span style={{ color: 'var(--text-muted)' }}>OFF</span>
             </div>
          </motion.div>

          <UpcomingPosts settingsVariants={settingsVariants} />
        </div>

        <div className="col-6">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            minHeight: '600px'
          }}>
             <CycleDiagram activeNode={activeNode} />
          </div>
        </div>
      </div>
    </section>
  );
}
