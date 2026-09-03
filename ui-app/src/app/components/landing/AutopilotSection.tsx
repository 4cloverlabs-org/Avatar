"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

const TikTokIcon = ({ size = 24, color = "currentColor", ...props }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
   </svg>
);

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
            backgroundColor: '#000000',
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

const PipelineCard = ({ label, desc, activeDesc, isActive, isDone }: { label: string, desc: string, activeDesc: string, isActive: boolean, isDone: boolean }) => {
   const isPublish = label === 'PUBLISH';
   const isVideo = label === 'VIDEO';

   return (
      <motion.div
         animate={{
            backgroundColor: isActive ? '#ffffff' : (isDone ? 'rgba(255,255,255,0.6)' : 'rgba(250,250,250,0.4)'),
            borderColor: isActive ? 'rgba(16, 185, 129, 0.4)' : (isDone ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)'),
            scale: isActive ? 1.02 : 1,
            y: isActive ? -4 : 0,
            boxShadow: isActive ? '0 10px 25px -5px rgba(16, 185, 129, 0.15)' : 'none'
         }}
         transition={{ type: 'spring', stiffness: 300, damping: 25 }}
         style={{
            height: '86px',
            borderRadius: '16px',
            border: '1px solid',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 1.25rem',
            position: 'relative',
            width: '100%',
            minWidth: '150px',
            boxSizing: 'border-box'
         }}
      >
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: isActive ? '#10B981' : (isDone ? '#374151' : '#9CA3AF') }}>
               {label}
            </span>
            {isActive && !isPublish && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '3px', background: '#10B981', borderRadius: '3px' }} />
                  <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '3px', background: '#10B981', borderRadius: '3px' }} />
                  <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '3px', background: '#10B981', borderRadius: '3px' }} />
               </motion.div>
            )}
            {isDone && !isActive && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#10B981' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </motion.div>
            )}
         </div>
         <div style={{ fontSize: '0.85rem', fontWeight: 500, color: isActive ? '#374151' : (isDone ? '#6B7280' : '#9CA3AF'), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{isActive ? activeDesc : desc}</span>
            {isPublish && isActive && (
               <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ color: '#E1306C' }}><Instagram size={14} /></span>
                  <span style={{ color: '#FF0000' }}><Youtube size={14} /></span>
                  <span style={{ color: '#374151' }}><TikTokIcon size={14} /></span>
               </motion.div>
            )}
         </div>
      </motion.div>
   )
}

const AIEnginePipeline = () => {
   const [activeStage, setActiveStage] = useState<number>(0);
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
   }, []);

   useEffect(() => {
      let raf: number;
      const start = Date.now();
      const cycleDuration = 10000;

      const loop = () => {
         const t = (Date.now() - start) % cycleDuration;
         if (t < 2500) setActiveStage(0);
         else if (t < 5000) setActiveStage(1);
         else if (t < 7500) setActiveStage(2);
         else setActiveStage(3);
         raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
   }, []);

   return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto', background: '#ffffff', borderRadius: '24px', padding: '2.5rem', boxSizing: 'border-box', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)' }}>
         {/* Header */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#374151' }}>AI CONTENT ENGINE</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#6B7280' }}>Automated Production Pipeline</span>
               </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
               <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}
               />
               <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', letterSpacing: '0.05em' }}>ACTIVE</span>
            </div>
         </div>

         {/* Pipeline Container */}
         <div style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
            {isMobile ? (
               <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '43px', bottom: '43px', left: '10px', width: '2px', backgroundColor: '#F3F4F6', transform: 'translateX(-50%)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, paddingLeft: '24px' }}>
                     <PipelineCard label="IDEA" desc="Finding next topic" activeDesc="Generating idea..." isActive={activeStage === 0} isDone={activeStage > 0} />
                     <PipelineCard label="SCRIPT" desc="Writing hook + script" activeDesc="Writing script..." isActive={activeStage === 1} isDone={activeStage > 1} />
                     <PipelineCard label="VIDEO" desc="Generating avatar video" activeDesc="Generating video" isActive={activeStage === 2} isDone={activeStage > 2} />
                     <PipelineCard label="PUBLISH" desc="Publishing everywhere" activeDesc="Publishing everywhere" isActive={activeStage === 3} isDone={false} />
                  </div>
               </div>
            ) : (
               <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Background Track */}
                  <div style={{ position: 'absolute', top: '50%', left: '12%', right: '12%', height: '2px', backgroundColor: '#F3F4F6', borderRadius: '2px', transform: 'translateY(-50%)', zIndex: 0 }} />
                  
                  {/* Animated Progress Track */}
                  <motion.div 
                     style={{ position: 'absolute', top: '50%', left: '12%', height: '2px', background: '#10B981', borderRadius: '2px', transform: 'translateY(-50%)', zIndex: 1 }}
                     animate={{ width: `${(activeStage / 3) * 76}%` }}
                     transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', width: '100%', zIndex: 10 }}>
                     <PipelineCard label="IDEA" desc="Finding next topic" activeDesc="Generating idea..." isActive={activeStage === 0} isDone={activeStage > 0} />
                     <PipelineCard label="SCRIPT" desc="Writing hook + script" activeDesc="Writing hook + script" isActive={activeStage === 1} isDone={activeStage > 1} />
                     <PipelineCard label="VIDEO" desc="Generating video" activeDesc="Generating video" isActive={activeStage === 2} isDone={activeStage > 2} />
                     <PipelineCard label="PUBLISH" desc="Publishing everywhere" activeDesc="Publishing everywhere" isActive={activeStage === 3} isDone={false} />
                  </div>
               </div>
            )}
         </div>

         {/* Footer */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.05em' }}>NEXT RUN</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', background: '#FAFAFA', padding: '6px 14px', borderRadius: '8px', border: '1px solid #F0F0F0' }}>Today · 9:00 AM</span>
         </div>
      </div>
   );
}

const ContentTimeline = ({ settingsVariants }: { settingsVariants: any }) => {
   const [hoveredWeek, setHoveredWeek] = useState<number | null>(2); // Default hover on 3rd node (Aug 18)

   const timelineData = [
      { label: 'Aug 04', count: 5 },
      { label: 'Aug 11', count: 4 },
      { label: 'Aug 18', count: 7 },
      { label: 'Aug 25', count: 6 },
      { label: 'Sep 01', count: 3 },
   ];

   const maxCount = 8; 

   return (
      <motion.div
         variants={settingsVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-100px" }}
         style={{ 
            background: '#ffffff', 
            borderRadius: '24px', 
            padding: '2rem 2.5rem', 
            width: '100%', 
            boxSizing: 'border-box', 
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', 
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
         }}
      >
         {/* Header Row */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
               <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Content Activity</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
         </div>

         {/* Stats Row */}
         <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 500, color: '#111827', lineHeight: 1 }}>25</span>
                  <span style={{ fontSize: '1rem', color: '#6B7280', fontWeight: 500 }}>Posts</span>
               </div>
               <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>12% vs last month</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 500, color: '#111827', lineHeight: 1 }}>5.0</span>
                  <span style={{ fontSize: '1rem', color: '#6B7280', fontWeight: 500 }}>Avg</span>
               </div>
               <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>Consistent</span>
            </div>
         </div>

         {/* Line Chart Area */}
         <div style={{ position: 'relative', height: '180px', marginTop: '1rem' }}>
            
            {/* SVG Drawing Layer */}
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 1 }}>
               {/* Horizontal Grid Lines */}
               {[0, 1, 2, 3, 4].map((i) => (
                  <line key={`grid-${i}`} x1="0%" y1={`${i * 25}%`} x2="100%" y2={`${i * 25}%`} stroke="#E5E7EB" strokeWidth="1" />
               ))}

               {/* Hover Dashed Line */}
               {hoveredWeek !== null && (
                  <line 
                     x1={`${(hoveredWeek / (timelineData.length - 1)) * 100}%`} 
                     y1={`${100 - (timelineData[hoveredWeek].count / maxCount) * 100}%`} 
                     x2={`${(hoveredWeek / (timelineData.length - 1)) * 100}%`} 
                     y2="100%" 
                     stroke="#3B82F6" 
                     strokeWidth="1.5" 
                     strokeDasharray="4 4" 
                  />
               )}

               {/* Main Data Line Segments */}
               {timelineData.slice(0, -1).map((d, i) => (
                  <line 
                     key={`line-${i}`}
                     x1={`${(i / (timelineData.length - 1)) * 100}%`}
                     y1={`${100 - (d.count / maxCount) * 100}%`}
                     x2={`${((i + 1) / (timelineData.length - 1)) * 100}%`}
                     y2={`${100 - (timelineData[i + 1].count / maxCount) * 100}%`}
                     stroke="#3B82F6"
                     strokeWidth="2.5"
                     strokeLinecap="round"
                  />
               ))}

               {/* Data Points (Rendered last to sit on top of lines) */}
               {timelineData.map((d, i) => {
                  const isHovered = hoveredWeek === i;
                  return (
                     <circle 
                        key={`point-${i}`}
                        cx={`${(i / (timelineData.length - 1)) * 100}%`} 
                        cy={`${100 - (d.count / maxCount) * 100}%`} 
                        r={isHovered ? 6 : 5} 
                        fill="#ffffff" 
                        stroke="#3B82F6" 
                        strokeWidth={isHovered ? 3 : 2}
                        style={{ transition: 'all 0.2s ease' }}
                     />
                  )
               })}
            </svg>

            {/* Hover Interaction & Background Pillars Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
               {timelineData.map((_, i) => {
                  const leftPos = (i / (timelineData.length - 1)) * 100;
                  return (
                     <div 
                        key={`hover-${i}`}
                        style={{ 
                           position: 'absolute',
                           left: `${leftPos}%`,
                           top: '-10%',
                           bottom: 0,
                           width: '40px',
                           transform: 'translateX(-50%)'
                        }}
                     >
                        {/* Blue Background Pill */}
                        <div style={{ 
                           width: '100%',
                           height: '100%',
                           background: 'linear-gradient(180deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.02) 100%)',
                           borderRadius: '24px 24px 0 0',
                           opacity: hoveredWeek === i ? 1 : 0,
                           transition: 'opacity 0.2s ease',
                           pointerEvents: 'none'
                        }} />
                     </div>
                  )
               })}
            </div>

            {/* X-Axis Labels */}
            <div style={{ position: 'absolute', bottom: '-30px', left: 0, right: 0, height: '20px' }}>
               {timelineData.map((period, i) => {
                  const isHovered = hoveredWeek === i;
                  const leftPos = (i / (timelineData.length - 1)) * 100;
                  // First label aligns left edge, last label aligns right edge, middle labels center
                  const transform = i === 0 ? 'translateX(0)' : (i === timelineData.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)');
                  
                  return (
                     <div 
                        key={`label-${i}`}
                        style={{ 
                           position: 'absolute',
                           left: `${leftPos}%`,
                           transform,
                           fontSize: '0.85rem', 
                           fontWeight: isHovered ? 700 : 500, 
                           color: isHovered ? '#111827' : '#6B7280',
                           transition: 'all 0.2s ease',
                           whiteSpace: 'nowrap'
                        }}
                     >
                        {period.label}
                     </div>
                  )
               })}
            </div>
         </div>
      </motion.div>
   );
};

export default function AutopilotSection() {
   const [mins, setMins] = useState({ ig: 2, yt: 12, tt: 5 });

   useEffect(() => {
      const timer = setInterval(() => {
         setMins(prev => ({ ig: prev.ig + 1, yt: prev.yt + 1, tt: prev.tt + 1 }));
      }, 60000);
      return () => clearInterval(timer);
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
      <section className="editorial-section" style={{ background: '#F0F0F0', position: 'relative', padding: '4rem 1rem' }}>
         <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Level 1 - Section Intro */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
               <h2 className="editorial-h2" style={{ marginBottom: '1rem' }}>Autopilot</h2>
               <p className="mono-text" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                  Connect your platforms once. The engine generates and publishes content while you sleep.
               </p>
            </div>

            {/* Level 2 - AI Content Engine */}
            <AIEnginePipeline />

            {/* Level 3 - Configuration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', width: '100%', alignItems: 'stretch' }}>

               {/* Left Panel: Automation (Tasks Style) */}
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', overflow: 'hidden', padding: '0.5rem' }}
               >
                  {/* Header Tabs */}
                  <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'relative', margin: '0 0.5rem' }}>
                     <div style={{ padding: '1rem 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#000' }}>Select Your Niche</div>                     <div style={{ marginLeft: 'auto', padding: '1rem 0.5rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        4 / 4 DEFINED
                     </div>
                     <div style={{ position: 'absolute', bottom: -1, left: 0, height: '2px', width: '45%', background: '#000' }} />
                  </div>

                  {/* Settings List */}
                  <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem', flex: 1, minHeight: '200px' }}>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FAFAFA', border: '1px solid #F0F0F0', padding: '1rem 1.25rem', borderRadius: '16px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>Primary Niche</span>
                           <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>Select Niche</span>
                        </div>
                     </div>

                     <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FAFAFA', border: '1px solid #F0F0F0', padding: '1rem 1.25rem', borderRadius: '16px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>Campaign Duration</span>
                           <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>Ongoing</span>
                        </div>
                     </div>

                     <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FAFAFA', border: '1px solid #F0F0F0', padding: '1rem 1.25rem', borderRadius: '16px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>Content Style</span>
                           <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>Educational</span>
                        </div>
                     </div>

                     <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FAFAFA', border: '1px solid #F0F0F0', padding: '1rem 1.25rem', borderRadius: '16px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>Upload Frequency</span>
                           <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>Daily</span>
                        </div>
                     </div>
                  </div>


               </motion.div>

               {/* Center Panel: Connected Platforms (Orbital) */}
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', padding: '1.5rem', position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}
               >
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#000' }}>Connections</div>
                  
                  {/* Subtle Background Pattern */}
                  <div style={{ position: 'absolute', top: 20, right: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 4px)', gap: '6px', opacity: 0.3 }}>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }}/>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }}/>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }}/>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }}/>
                  </div>
                  <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 4px)', gap: '6px', opacity: 0.3 }}>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }}/>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }}/>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }}/>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }}/>
                  </div>

                  {/* Grid Layout Design - 5-Part Spiral (Swastika) Pattern */}
                  <div style={{ position: 'relative', width: '320px', height: '320px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(0,0,0,0.06)', borderRadius: '24px', overflow: 'hidden', marginTop: '1.5rem', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}>
                     
                     {/* 1. Instagram (Top - Spans Right) */}
                     <div style={{ gridColumn: '1 / 4', gridRow: '1 / 2', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Instagram size={28} color="white" strokeWidth={1.5} />
                        </div>
                     </div>

                     {/* 2. Facebook (Top Right - Spans Down) */}
                     <div style={{ gridColumn: '4 / 5', gridRow: '1 / 3', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24">
                           <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                           <path fill="#FFF" d="M16.671 15.542l.532-3.469h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V5.002S16.033 4.767 14.721 4.767c-2.741 0-4.533 1.662-4.533 4.669v2.638H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"/>
                        </svg>
                     </div>

                     {/* 3. YouTube (Bottom Right - Spans Down) */}
                     <div style={{ gridColumn: '4 / 5', gridRow: '3 / 5', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24">
                           <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                           <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                     </div>

                     {/* 4. TikTok (Bottom - Spans Left) */}
                     <div style={{ gridColumn: '2 / 4', gridRow: '4 / 5', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="36" height="36" viewBox="0 0 448 512" fill="#000000" style={{ filter: 'drop-shadow(2px 2px 0px #00f2fe) drop-shadow(-2px -2px 0px #fe0979)' }}>
                           <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
                        </svg>
                     </div>

                     {/* 5. Twitter (Bottom Left - Square) */}
                     <div style={{ gridColumn: '1 / 2', gridRow: '4 / 5', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24">
                           <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="#000"/>
                        </svg>
                     </div>

                     {/* 6. LinkedIn (Left Edge - Spans Up) */}
                     <div style={{ gridColumn: '1 / 2', gridRow: '2 / 4', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24">
                           <path fill="#0A66C2" d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                           <path fill="#FFF" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                        </svg>
                     </div>

                     {/* Center Node (AI Engine) - Central Hole */}
                     <div style={{ gridColumn: '2 / 4', gridRow: '2 / 4', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.1)' }}>
                           <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z"/></svg>
                        </div>
                     </div>

                  </div>
               </motion.div>

               {/* Right Panel: Content Timeline */}
               <ContentTimeline settingsVariants={settingsVariants} />

            </div>

         </div>
      </section>
   );
}

