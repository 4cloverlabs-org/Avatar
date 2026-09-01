"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Instagram, Youtube } from 'lucide-react';

const TikTokIcon = ({ size = 24, color = "currentColor", ...props }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3 3v5a4 4 0 0 1-4-4Z" />
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

const PipelineCard = ({ label, desc, activeDesc, isActive }: { label: string, desc: string, activeDesc: string, isActive: boolean }) => {
   const isPublish = label === 'PUBLISH';
   const isVideo = label === 'VIDEO';

   return (
      <motion.div
         animate={{
            backgroundColor: '#FFFFFF',
            color: 'var(--text-main)',
            borderColor: isActive ? '#1A1A1A' : 'var(--border-subtle)',
            scale: isActive ? 1.02 : 1,
            boxShadow: isActive ? 'var(--shadow-float)' : 'none',
         }}
         transition={{ duration: 0.3 }}
         style={{
            height: '72px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 1rem',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            minWidth: '140px',
            boxSizing: 'border-box'
         }}
      >
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: isActive ? '#000000' : 'var(--text-muted)' }}>
               {label}
            </span>
            {isActive && !isPublish && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center' }}>
                  {isVideo ? (
                     <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: ['0%', '72%'] }} transition={{ duration: 1.2, ease: 'easeOut' }} style={{ height: '100%', backgroundColor: '#000000' }} />
                     </div>
                  ) : (
                     <div style={{ display: 'flex', gap: '3px' }}>
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#000000' }} />
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#000000' }} />
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#000000' }} />
                     </div>
                  )}
               </motion.div>
            )}
         </div>
         <div style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: '0.3rem', color: isActive ? '#000000' : 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{isActive ? activeDesc : desc}</span>
            {isPublish && isActive && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'flex', gap: '0.5rem', fontSize: '0.65rem', opacity: 0.9, alignItems: 'center' }}
               >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Instagram size={10} /> ✓</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Youtube size={10} /> ✓</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><TikTokIcon size={10} /> ✓</span>
               </motion.div>
            )}
         </div>
      </motion.div>
   )
}

const AIEnginePipeline = () => {
   const [activeStage, setActiveStage] = useState<number | null>(0);
   const dotProgress = useMotionValue(0);
   const dotOpacity = useMotionValue(1);
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

      const loop = () => {
         const t = (Date.now() - start) % 8000;

         let newStage: number | null = null;
         if (t < 1500) newStage = 0;
         else if (t < 2000) newStage = null;
         else if (t < 3500) newStage = 1;
         else if (t < 4000) newStage = null;
         else if (t < 5500) newStage = 2;
         else if (t < 6000) newStage = null;
         else if (t < 7500) newStage = 3;
         else newStage = null;

         setActiveStage(prev => prev !== newStage ? newStage : prev);

         if (t < 1500) { dotProgress.set(0); dotOpacity.set(1); }
         else if (t < 2000) {
            const progress = (t - 1500) / 500;
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            dotProgress.set(ease * 33.33);
         }
         else if (t < 3500) { dotProgress.set(33.33); }
         else if (t < 4000) {
            const progress = (t - 3500) / 500;
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            dotProgress.set(33.33 + ease * 33.33);
         }
         else if (t < 5500) { dotProgress.set(66.66); }
         else if (t < 6000) {
            const progress = (t - 5500) / 500;
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            dotProgress.set(66.66 + ease * 33.33);
         }
         else if (t < 7500) { dotProgress.set(100); dotOpacity.set(1); }
         else {
            dotOpacity.set(0);
         }

         raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
   }, [dotProgress, dotOpacity]);

   return (
      <div className="premium-glass-card" style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto', padding: '2rem', boxSizing: 'border-box' }}>
         {/* Header */}
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-main)' }}>AI CONTENT ENGINE</span>
               <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <motion.span
                     animate={{ opacity: [1, 0.4, 1] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                     style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}
                  />
                  ACTIVE
               </span>
            </div>
         </div>

         {/* Pipeline Container */}
         <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
            {isMobile ? (
               // Vertical Layout for Mobile
               <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '36px', bottom: '36px', left: '6px', width: '2px', backgroundColor: 'var(--border-subtle)', transform: 'translateX(-50%)' }} />
                  <motion.div style={{
                     position: 'absolute',
                     top: '36px',
                     left: '6px',
                     x: '-50%',
                     y: useMotionValue(0), // Would need separate calc for vertical, simplifying for now
                     opacity: dotOpacity,
                     width: '8px',
                     height: '8px',
                     borderRadius: '50%',
                     backgroundColor: '#000000',
                     zIndex: 10
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, paddingLeft: '24px' }}>
                     <PipelineCard label="IDEA" desc="Finding next topic" activeDesc="Generating idea..." isActive={activeStage === 0} />
                     <PipelineCard label="SCRIPT" desc="Writing hook + script" activeDesc="Writing script..." isActive={activeStage === 1} />
                     <PipelineCard label="VIDEO" desc="Generating avatar video" activeDesc="Rendering 72%" isActive={activeStage === 2} />
                     <PipelineCard label="PUBLISH" desc="Publishing everywhere" activeDesc="Published ✓" isActive={activeStage === 3} />
                  </div>
               </div>
            ) : (
               // Horizontal Layout for Desktop
               <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-subtle)', transform: 'translateY(-50%)' }} />
                  <motion.div style={{
                     position: 'absolute',
                     top: '50%',
                     left: '10%',
                     width: '80%', // Path width
                     height: '2px',
                     zIndex: 5
                  }}>
                     <motion.div style={{
                        position: 'absolute',
                        top: '50%',
                        left: useMotionValue(0),
                        x: '-50%',
                        y: '-50%',
                        opacity: dotOpacity,
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#000000',
                     }}
                        // Hack to map progress 0-100 to left %
                        animate={{ left: `${dotProgress.get()}%` }}
                        transition={{ duration: 0 }}
                     />
                  </motion.div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', width: '100%', zIndex: 10 }}>
                     <PipelineCard label="IDEA" desc="Finding next topic" activeDesc="Generating idea..." isActive={activeStage === 0} />
                     <PipelineCard label="SCRIPT" desc="Writing hook + script" activeDesc="Writing script..." isActive={activeStage === 1} />
                     <PipelineCard label="VIDEO" desc="Generating video" activeDesc="Rendering 72%" isActive={activeStage === 2} />
                     <PipelineCard label="PUBLISH" desc="Publishing" activeDesc="Published ✓" isActive={activeStage === 3} />
                  </div>
               </div>
            )}
         </div>

         {/* Footer */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '1rem 0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>NEXT RUN</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)' }}>Today · 9:00 AM</span>
         </div>
      </div>
   );
}

const ContentTimeline = ({ settingsVariants }: { settingsVariants: any }) => {
   const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

   const timelineData = [
      { label: 'AUG 04', count: 5, status: 'published', platforms: { ig: 2, yt: 2, tt: 1 } },
      { label: 'AUG 11', count: 4, status: 'published', platforms: { ig: 2, yt: 1, tt: 1 } },
      { label: 'AUG 18', count: 7, status: 'published', platforms: { ig: 3, yt: 2, tt: 2 } },
      { label: 'AUG 25', count: 6, status: 'published', platforms: { ig: 2, yt: 2, tt: 2 } },
      { label: 'SEP 01', count: 3, status: 'scheduled', platforms: { ig: 1, yt: 1, tt: 1 } },
   ];

   return (
      <motion.div
         variants={settingsVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-100px" }}
         className="premium-glass-card"
         style={{ padding: '1.5rem', width: '100%', boxSizing: 'border-box', position: 'relative' }}
      >
         {/* Header */}
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            <span style={{ color: 'var(--text-main)' }}>CONTENT ACTIVITY</span>
            <span>24 POSTS THIS MONTH</span>
         </div>

         {/* Timeline Container */}
         <div style={{ position: 'relative', width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            {/* Subtle horizontal line */}
            <div style={{ position: 'absolute', top: '50%', left: '2%', right: '2%', height: '1px', backgroundColor: 'var(--border-subtle)', opacity: 0.6, transform: 'translateY(-50%)', zIndex: 0 }} />

            {/* Today Marker */}
            <div style={{ position: 'absolute', left: '87.5%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#000000', marginBottom: '2px' }} />
               <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--border-subtle)', opacity: 0.8 }} />
               <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#000000', letterSpacing: '0.1em', margin: '4px 0', backgroundColor: '#F0F0F0', padding: '0 4px', zIndex: 1 }}>TODAY</span>
               <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--border-subtle)', opacity: 0.8 }} />
            </div>

            {timelineData.map((period, i) => {
               const isCurrent = period.label === 'AUG 25';
               return (
               <div
                  key={i}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, width: '18%' }}
                  onMouseEnter={() => setHoveredWeek(i)}
                  onMouseLeave={() => setHoveredWeek(null)}
               >
                  <span style={{ fontSize: '0.65rem', fontWeight: isCurrent ? 700 : 600, color: isCurrent ? '#000000' : 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                     {period.label}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px', minHeight: '80px', position: 'relative', width: '100%' }}>
                     {Object.entries(period.platforms).map(([platform, count], j) => {
                        if (count === 0) return null;
                        const isScheduled = period.status === 'scheduled';
                        const platformLabel = platform.toUpperCase();

                        return (
                           <motion.div
                              key={platform}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 + j * 0.1 }}
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '6px',
                                 backgroundColor: '#ffffff',
                                 border: isScheduled ? '1px dashed #10B981' : '1px solid rgba(16, 185, 129, 0.2)',
                                 padding: '3px 8px 3px 3px',
                                 borderRadius: '12px',
                                 boxShadow: isScheduled ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.08)',
                                 zIndex: 10
                              }}
                           >
                              <div style={{
                                 width: '16px',
                                 height: '16px',
                                 borderRadius: '50%',
                                 backgroundColor: isScheduled ? '#ffffff' : '#10B981',
                                 border: isScheduled ? '1.5px solid #10B981' : 'none',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}>
                                 <span style={{ fontSize: '0.4rem', fontWeight: 800, color: isScheduled ? '#10B981' : '#ffffff' }}>
                                    {platformLabel}
                                 </span>
                              </div>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isScheduled ? 'var(--text-main)' : '#10B981' }}>
                                 {count}
                              </span>
                           </motion.div>
                        );
                     })}
                  </div>

                  <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1rem' }}>
                     {period.count} {period.status === 'published' ? 'POSTS' : 'SCHEDULED'}
                  </span>

                  {/* Tooltip */}
                  {hoveredWeek === i && (
                     <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        style={{
                           position: 'absolute',
                           top: '100%',
                           marginTop: '0.25rem',
                           backgroundColor: '#ffffff',
                           border: '1px solid var(--border-subtle)',
                           borderRadius: '6px',
                           padding: '0.75rem',
                           boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                           zIndex: 20,
                           minWidth: '120px',
                           pointerEvents: 'none'
                        }}
                     >
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>{period.label}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-main)' }}>
                           {period.platforms.ig > 0 && <div>Instagram · {period.platforms.ig} post{period.platforms.ig > 1 ? 's' : ''}</div>}
                           {period.platforms.yt > 0 && <div>YouTube · {period.platforms.yt} post{period.platforms.yt > 1 ? 's' : ''}</div>}
                           {period.platforms.tt > 0 && <div>TikTok · {period.platforms.tt} post{period.platforms.tt > 1 ? 's' : ''}</div>}
                        </div>
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontWeight: 600, color: period.status === 'published' ? '#10B981' : 'var(--text-muted)' }}>
                           {period.count} {period.status === 'published' ? 'published' : 'scheduled'}
                        </div>
                     </motion.div>
                  )}
               </div>
            )})}
         </div>

         {/* Bottom Statistics */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-main)', flexWrap: 'wrap', alignItems: 'center' }}>
               <span>18 PUBLISHED</span>
               <div style={{ width: '1px', height: '10px', backgroundColor: 'var(--border-subtle)' }} />
               <span>6 SCHEDULED</span>
               <div style={{ width: '1px', height: '10px', backgroundColor: 'var(--border-subtle)' }} />
               <span>3 PLATFORMS</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Published
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #10B981', backgroundColor: '#ffffff' }} />
                  Scheduled
               </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="premium-glass-card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', padding: '1.5rem', height: '100%' }}
               >
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CONNECTED PLATFORMS</div>

                  <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <Instagram size={18} />
                           <span style={{ fontWeight: 600 }}>Instagram</span>
                        </div>
                        <ConnectedStatus />
                     </div>
                  </motion.div>

                  <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <Youtube size={18} />
                           <span style={{ fontWeight: 600 }}>YouTube</span>
                        </div>
                        <ConnectedStatus />
                     </div>
                  </motion.div>

                  <motion.div variants={platformVariants} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <TikTokIcon size={18} />
                           <span style={{ fontWeight: 600 }}>TikTok</span>
                        </div>
                        <ConnectedStatus />
                     </div>
                  </motion.div>

               </motion.div>

               <motion.div
                  variants={settingsVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="premium-glass-card"
                  style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', fontSize: '0.9rem', height: '100%' }}
               >
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>AUTOMATION</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                     <span style={{ fontWeight: 600 }}>Posting schedule</span>
                     <span style={{ color: 'var(--text-muted)' }}>3x / week</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                     <span style={{ fontWeight: 600 }}>Auto-publish</span>
                     <span style={{ color: '#000000', fontWeight: 600 }}>ON</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontWeight: 600 }}>Review required</span>
                     <span style={{ color: 'var(--text-muted)' }}>OFF</span>
                  </div>
               </motion.div>

            </div>

            {/* Level 4 - Content Timeline */}
            <ContentTimeline settingsVariants={settingsVariants} />

         </div>
      </section>
   );
}

