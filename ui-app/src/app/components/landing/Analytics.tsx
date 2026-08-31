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

  return <div className="editorial-h2" style={{ color: color || 'var(--text-main)', margin: 0, fontSize: '2.5rem' }}>{prefix}{value}{suffix}</div>;
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
      <div className="mono-text mb-1" style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>{label}</div>
      <AnimatedCounter from={from} to={to} duration={1.2} delay={delay} prefix={prefix} suffix={suffix} color={color} inView={inView} reducedMotion={reducedMotion} />
      <div className="mono-text mt-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</div>
    </div>
  )
};

export default function Analytics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  const barsData = [
    { height: "80px", opacity: 0.6, finalBg: "#000000", delay: 0.5, labelDelay: 1.0 },
    { height: "120px", opacity: 0.7, finalBg: "#000000", delay: 0.62, labelDelay: 1.12 },
    { height: "160px", opacity: 0.85, finalBg: "#000000", delay: 0.74, labelDelay: 1.24 },
    { height: "200px", opacity: 1, finalBg: "#000000", delay: 0.86, labelDelay: 1.36, isFinal: true },
  ];

  const statsData = [
    { label: "WATCH TIME", from: 0, to: 42, prefix: "+", suffix: "%", color: "var(--text-main)", subtitle: "vs. last 30 days", delay: 0.65 },
    { label: "ENGAGEMENT", from: 0, to: 18, prefix: "+", suffix: "%", color: "var(--text-main)", subtitle: "vs. last 30 days", delay: 0.75 },
    { label: "VIDEOS", from: 0, to: 27, prefix: "", suffix: "", color: "var(--text-main)", subtitle: "this month", delay: 0.85 },
    { label: "TIME SAVED", from: 0, to: 18, prefix: "", suffix: "h", color: "var(--text-main)", subtitle: "estimated / mo", delay: 0.95 },
  ];

  return (
    <section ref={ref} className="editorial-section grid-container">
      <div className="col-12 mb-4">
        <motion.h2 
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.5, ease: "easeOut" }} 
          className="editorial-h2"
          style={{ textAlign: 'center' }}
        >
          Your Content Is Learning.
        </motion.h2>
      </div>

      <motion.div 
        className="col-8"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="premium-glass-card" style={{ padding: '2rem', height: '100%', minHeight: '300px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
           <div className="flex-between mb-1" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
             <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Content Performance</span>
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
                 style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }}
               />
               <span className="mono-text" style={{ color: '#000000', fontWeight: 500 }}>Live View</span>
             </div>
           </div>
           <p className="mono-text mb-4" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
             Performance across all connected platforms, auto-tracked.
           </p>
           
           <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1.5rem', borderBottom: '1px solid var(--border-subtle)', padding: '1rem', paddingLeft: 0, minHeight: '200px' }}>
              {barsData.map((bar, i) => (
                <motion.div
                  key={i}
                  initial={{ height: "0px", backgroundColor: "#E5E7EB", filter: "brightness(1)" }}
                  animate={inView ? { 
                    height: reducedMotion ? bar.height : ["0px", bar.height],
                    backgroundColor: reducedMotion ? bar.finalBg : ["#E5E7EB", bar.finalBg],
                    filter: (bar.isFinal && !reducedMotion) ? ["brightness(1)", "brightness(1)", "brightness(1.1)", "brightness(1)"] : "brightness(1)"
                  } : {}}
                  transition={{
                    height: { delay: reducedMotion ? 0 : bar.delay, duration: reducedMotion ? 0 : 0.5, ease: "easeOut" },
                    backgroundColor: { delay: reducedMotion ? 0 : bar.delay, duration: reducedMotion ? 0 : 0.5, ease: "easeOut" },
                    filter: { delay: 0, duration: 1.7, ease: "linear", times: [0, 0.8, 0.9, 1] }
                  }}
                  style={{ width: '100%', opacity: bar.opacity, borderRadius: '4px 4px 0 0' }}
                />
              ))}
           </div>
           <div className="flex-between mt-2 mono-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
             {["JAN", "FEB", "MAR", "APR"].map((month, i) => (
               <motion.span 
                 key={month}
                 initial={{ opacity: 0 }} 
                 animate={inView ? { opacity: 1 } : { opacity: 0 }} 
                 transition={{ delay: reducedMotion ? 0 : barsData[i].labelDelay, duration: 0.3 }}
                 style={{ flex: 1, textAlign: 'center' }}
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
        <div className="premium-glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem', padding: '2rem', backgroundColor: '#FFFFFF' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
             <StatBlock {...statsData[0]} inView={inView} reducedMotion={reducedMotion} />
             <StatBlock {...statsData[1]} inView={inView} reducedMotion={reducedMotion} />
           </div>
        </div>
      </motion.div>
    </section>
  );
}
