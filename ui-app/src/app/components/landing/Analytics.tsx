"use client";

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import FunnelChart from './FunnelChart';
import ViewerRetentionChart from './ViewerRetentionChart';

export default function Analytics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

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
        className="col-7"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="premium-glass-card" style={{ padding: '2rem', height: '100%', minHeight: '380px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
           <FunnelChart inView={inView} />
        </div>
      </motion.div>

      <motion.div 
        className="col-5"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.15, duration: 0.5, ease: "easeOut" }}
      >
        <div className="premium-glass-card" style={{ height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column', padding: '2rem', backgroundColor: '#FFFFFF' }}>
           <ViewerRetentionChart inView={inView} />
        </div>
      </motion.div>
    </section>
  );
}
