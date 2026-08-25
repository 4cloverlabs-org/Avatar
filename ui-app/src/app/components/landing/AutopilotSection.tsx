"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ConnectedStatus = () => (
  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
      style={{
        display: 'inline-block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
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
          backgroundColor: 'var(--accent)',
        }}
      />
    </motion.span>
    CONNECTED
  </span>
);

const PipelineNode = ({ label, index, isActive, isLast, annotation }: { label: string, index: number, isActive: boolean, isLast?: boolean, annotation: string }) => {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
      
      {/* Left Rail Dot */}
      <div style={{ position: 'absolute', top: '50%', left: '0', display: 'flex', alignItems: 'center', transform: 'translateY(-50%)', zIndex: 5 }}>
         <div style={{ 
           width: '8px', height: '8px', borderRadius: '50%', 
           background: isLast ? 'var(--accent)' : '#666'
         }} />
         <span style={{ marginLeft: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
           0{index + 1}
         </span>
      </div>

      <div style={{ position: 'relative' }}>
        <motion.div
          animate={isActive ? { 
            height: 96,
            scale: 1.05, 
            boxShadow: isLast ? '0 0 25px var(--accent)' : '0 0 15px rgba(255,255,255,0.3)', 
            borderColor: isLast ? 'var(--accent)' : '#fff' 
          } : { 
            height: 44,
            scale: 1, 
            boxShadow: '0 0 0px rgba(0,0,0,0)', 
            borderColor: isLast ? 'var(--accent)' : (index % 2 !== 0 ? 'var(--text-main)' : 'rgba(0,0,0,0)')
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            background: isLast ? 'var(--accent)' : (index % 2 === 0 ? 'var(--text-main)' : 'rgba(0,0,0,0)'),
            color: isLast ? '#fff' : (index % 2 === 0 ? 'var(--bg-primary)' : 'var(--text-main)'),
            border: `1px solid ${isLast ? 'var(--accent)' : 'var(--text-main)'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 1.25rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            zIndex: 2,
            position: 'relative',
            minWidth: '170px',
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          <div style={{ transform: isActive ? 'translateY(-12px)' : 'translateY(0)', transition: 'transform 0.25s ease-out' }}>
            {label}
          </div>
          
          <motion.div
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.15, delay: isActive ? 0.1 : 0 }}
            style={{
               position: 'absolute',
               bottom: '18px',
               width: '100%',
               display: 'flex',
               justifyContent: 'center',
               fontWeight: 400
            }}
          >
              {index === 0 && <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>5 morning habits that...</span>}
              {index === 1 && <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>Generating<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span></span>}
              {index === 2 && (
                <div style={{ display: 'flex', gap: '3px', height: '10px', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['4px', '10px', '4px'] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      style={{ width: '3px', background: 'currentColor', borderRadius: '1px' }}
                    />
                  ))}
                </div>
              )}
              {index === 3 && <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}><span>✓</span> Posted to TikTok</span>}
          </motion.div>
        </motion.div>

        {/* Right Annotation */}
        <div style={{ position: 'absolute', top: '50%', left: '100%', display: 'flex', alignItems: 'center', transform: 'translateY(-50%)', zIndex: 1 }}>
           <div style={{ width: '30px', height: '1px', borderTop: '1px dashed var(--border-color)', opacity: 0.5 }} />
           <span style={{ marginLeft: '0.5rem', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              {annotation}
           </span>
        </div>


      </div>
    </div>
  );
};

const PipelineLine = ({ index, linesDrawn }: { index: number, linesDrawn: boolean }) => {
  return (
    <div style={{ position: 'relative', height: '80px', display: 'flex', justifyContent: 'center', width: '100%' }}>
      {/* Left Rail Connector */}
      <div style={{ position: 'absolute', top: 0, left: '3px', bottom: 0, width: '2px', background: 'var(--border-color)', opacity: 0.3 }} />
      
      {/* Center Animated Line */}
      <div style={{ position: 'relative', width: '2px', height: '100%', background: 'var(--border-color)', opacity: 0.3 }}>
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.5, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--text-main)', transformOrigin: 'top' }}
        />
      </div>
    </div>
  );
};

export default function AutopilotSection() {
  const [mins, setMins] = useState({ ig: 2, yt: 12, tt: 5 });
  const [linesDrawn, setLinesDrawn] = useState(false);
  const [activeNode, setActiveNode] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setMins(prev => ({ ig: prev.ig + 1, yt: prev.yt + 1, tt: prev.tt + 1 }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const drawTimer = setTimeout(() => {
      setLinesDrawn(true);
      setActiveNode(0);
    }, 2000);

    return () => clearTimeout(drawTimer);
  }, []);

  useEffect(() => {
    if (!linesDrawn) return;
    
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % 4;
      setActiveNode(current);
    }, 2000); // 2 second cycle
    
    return () => clearInterval(interval);
  }, [linesDrawn]);

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
    visible: { opacity: 1, transition: { delay: 1.0, duration: 0.8 } }
  };

  const pipelineData = [
    { label: "IDEA", annotation: "Niche + topic input" },
    { label: "SCRIPT", annotation: "AI drafts script" },
    { label: "VIDEO", annotation: "Renders avatar + voice" },
    { label: "PUBLISH", annotation: "Publishes to platforms" }
  ];

  return (
    <section className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>03</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">AUTOPILOT</h2>
      </div>

      <div className="col-5">
        <p className="mono-text mb-4" style={{ color: 'var(--text-muted)' }}>
          Connect your platforms once. The engine generates and publishes content while you sleep.
        </p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}
        >
           <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>INSTAGRAM REELS</span>
                 <ConnectedStatus />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced {mins.ig} min ago</span>
           </motion.div>
           
           <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>YOUTUBE SHORTS</span>
                 <ConnectedStatus />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced {mins.yt} min ago</span>
           </motion.div>
           
           <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>TIKTOK</span>
                 <ConnectedStatus />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced {mins.tt} min ago</span>
           </motion.div>
           
           <motion.div variants={platformVariants} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span>LINKEDIN</span>
              <span style={{ color: 'var(--text-muted)' }}>OFFLINE</span>
           </motion.div>
        </motion.div>

        <motion.div 
          variants={settingsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginTop: '2rem', padding: '1.25rem', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.8rem' }}
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>POSTING SCHEDULE</span>
              <span style={{ color: 'var(--text-muted)' }}>3X/WEEK, MON/WED/FRI 9AM</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>AUTO-PUBLISH</span>
              <span style={{ color: 'var(--accent)' }}>ON</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>REVIEW REQUIRED</span>
              <span style={{ color: 'var(--text-muted)' }}>OFF</span>
           </div>
        </motion.div>
      </div>

      <div className="col-7">
        <div className="dashboard-placeholder" style={{ 
          padding: '3rem 2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          minHeight: '400px'
        }}>
           {pipelineData.map((node, i) => (
             <React.Fragment key={node.label}>
               <PipelineNode 
                 label={node.label} 
                 annotation={node.annotation}
                 index={i} 
                 isActive={activeNode === i} 
                 isLast={i === pipelineData.length - 1} 
               />
               {i < pipelineData.length - 1 && (
                 <PipelineLine 
                   index={i} 
                   linesDrawn={linesDrawn} 
                 />
               )}
             </React.Fragment>
           ))}
        </div>
      </div>
    </section>
  );
}
