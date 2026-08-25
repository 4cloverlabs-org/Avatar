"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration: number;
  delay: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
  reducedMotion: boolean | null;
  color?: string;
}

const AnimatedCounter = ({ from, to, duration, delay, suffix = "", prefix = "", inView, reducedMotion, color }: AnimatedCounterProps) => {
  const [value, setValue] = useState(reducedMotion ? to : from);

  useEffect(() => {
    if (reducedMotion) {
      setValue(to);
      return;
    }
    if (inView) {
      const controls = animate(from, to, {
        duration,
        delay,
        ease: "easeOut",
        onUpdate: (latest) => {
          setValue(Math.round(Number(latest)));
        }
      });
      return controls.stop;
    }
  }, [from, to, duration, delay, inView, reducedMotion]);

  return <div className="editorial-h2" style={{ color: color || 'inherit', margin: 0, fontSize: '2.5rem' }}>{prefix}{value}{suffix}</div>;
};

interface StatBlockProps {
  label: string;
  subtitle: string;
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  delay: number;
  inView: boolean;
  reducedMotion: boolean | null;
}

const StatBlock = ({ label, subtitle, from, to, prefix, suffix, color, delay, inView, reducedMotion }: StatBlockProps) => {
  return (
    <div>
      <div className="mono-text mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <AnimatedCounter from={from} to={to} duration={1.2} delay={delay} prefix={prefix} suffix={suffix} color={color} inView={inView} reducedMotion={reducedMotion} />
      <div className="mono-text mt-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{subtitle}</div>
    </div>
  )
};

export default function Analytics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  const barsData = [
    { height: "40%", opacity: 0.2, finalBg: "var(--border-color)", delay: 0.5, labelDelay: 1.0 },
    { height: "60%", opacity: 0.5, finalBg: "var(--border-color)", delay: 0.62, labelDelay: 1.12 },
    { height: "80%", opacity: 0.8, finalBg: "var(--border-color)", delay: 0.74, labelDelay: 1.24 },
    { height: "100%", opacity: 1, finalBg: "var(--accent)", delay: 0.86, labelDelay: 1.36, isFinal: true },
  ];

  const statsData = [
    { label: "WATCH TIME", from: 0, to: 42, prefix: "+", suffix: "%", color: "var(--accent)", subtitle: "vs. last 30 days", delay: 0.65 },
    { label: "ENGAGEMENT", from: 0, to: 18, prefix: "+", suffix: "%", color: "var(--accent)", subtitle: "vs. last 30 days", delay: 0.75 },
    { label: "VIDEOS", from: 0, to: 27, prefix: "", suffix: "", color: "inherit", subtitle: "this month", delay: 0.85 },
    { label: "TIME SAVED", from: 0, to: 18, prefix: "", suffix: "h", color: "inherit", subtitle: "estimated / mo", delay: 0.95 },
  ];

  return (
    <section ref={ref} className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>05</span>
      </div>
      <div className="col-12 mb-4">
        <motion.hr 
          initial={{ scaleX: reducedMotion ? 1 : 0, opacity: reducedMotion ? 0 : 1 }} 
          animate={inView ? { scaleX: 1, opacity: 1 } : {}} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="h-rule" 
          style={{ marginBottom: '1rem', transformOrigin: 'left' }} 
        />
        <motion.h2 
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.5, ease: "easeOut" }} 
          className="editorial-h2"
        >
          YOUR CONTENT<br/>IS LEARNING.
        </motion.h2>
      </div>

      <motion.div 
        className="col-8"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="dashboard-placeholder" style={{ padding: '2rem', height: '100%', minHeight: '300px' }}>
           <div className="flex-between mb-1">
             <span className="mono-text">CONTENT PERFORMANCE</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={inView ? (reducedMotion ? { opacity: 1 } : { opacity: [1, 0.3, 1] }) : { opacity: 0 }}
                 transition={{
                   delay: reducedMotion ? 0 : 0.5,
                   duration: 1.5,
                   ease: "easeInOut",
                   repeat: (inView && !reducedMotion) ? Infinity : 0
                 }}
                 style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}
               />
               <span className="mono-text" style={{ color: 'var(--accent)' }}>LIVE VIEW</span>
             </div>
           </div>
           <p className="mono-text mb-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
             Performance across all connected platforms, auto-tracked.
           </p>
           
           <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1rem', borderBottom: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)', padding: '1rem' }}>
              {barsData.map((bar, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0, backgroundColor: "#666666", filter: "brightness(1)" }}
                  animate={inView ? { 
                    height: reducedMotion ? bar.height : [0, bar.height],
                    backgroundColor: reducedMotion ? bar.finalBg : ["#666666", bar.finalBg],
                    filter: (bar.isFinal && !reducedMotion) ? ["brightness(1)", "brightness(1)", "brightness(1.5)", "brightness(1)"] : "brightness(1)"
                  } : {}}
                  transition={{
                    height: { delay: reducedMotion ? 0 : bar.delay, duration: reducedMotion ? 0 : 0.5, ease: "easeOut" },
                    backgroundColor: { delay: reducedMotion ? 0 : bar.delay, duration: reducedMotion ? 0 : 0.5, ease: "easeOut" },
                    filter: { delay: 0, duration: 1.7, ease: "linear", times: [0, 0.8, 0.9, 1] }
                  }}
                  style={{ width: '100%', opacity: bar.opacity }}
                />
              ))}
           </div>
           <div className="flex-between mt-1 mono-text" style={{ fontSize: '0.75rem' }}>
             {["JAN", "FEB", "MAR", "APR"].map((month, i) => (
               <motion.span 
                 key={month}
                 initial={{ opacity: 0 }} 
                 animate={inView ? { opacity: 1 } : { opacity: 0 }} 
                 transition={{ delay: reducedMotion ? 0 : barsData[i].labelDelay, duration: 0.3 }}
               >
                 {month}
               </motion.span>
             ))}
           </div>
        </div>
      </motion.div>

      <motion.div 
        className="col-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.15, duration: 0.5, ease: "easeOut" }}
      >
        <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem', padding: '1.5rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <StatBlock {...statsData[0]} inView={inView} reducedMotion={reducedMotion} />
             <StatBlock {...statsData[1]} inView={inView} reducedMotion={reducedMotion} />
           </div>
           
           <motion.hr 
             initial={{ scaleX: reducedMotion ? 1 : 0, opacity: reducedMotion ? 0 : 1 }}
             animate={inView ? { scaleX: 1, opacity: 1 } : {}}
             transition={{ delay: reducedMotion ? 0 : 1.95, duration: 0.5, ease: "easeOut" }}
             className="h-rule" 
             style={{ margin: '0', transformOrigin: 'left' }} 
           />
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <StatBlock {...statsData[2]} inView={inView} reducedMotion={reducedMotion} />
             <StatBlock {...statsData[3]} inView={inView} reducedMotion={reducedMotion} />
           </div>
        </div>
      </motion.div>
    </section>
  );
}
