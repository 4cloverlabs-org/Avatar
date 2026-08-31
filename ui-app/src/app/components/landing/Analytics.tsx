"use client";

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import FunnelChart from './FunnelChart';
import ViewerRetentionChart from './ViewerRetentionChart';
import ChartInsightsGrid from './ChartInsightsGrid';

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

      <div className="col-12 mt-8">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ChartInsightsGrid>
            <div className="premium-glass-card" style={{ padding: '2rem', height: '100%', minHeight: '380px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
              <FunnelChart inView={inView} />
            </div>
            <div className="premium-glass-card" style={{ height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column', padding: '2rem', backgroundColor: '#FFFFFF' }}>
              <ViewerRetentionChart inView={inView} />
            </div>
          </ChartInsightsGrid>
        </motion.div>
      </div>
    </section>
  );
}
