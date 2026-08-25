"use client";

import React from 'react';

export default function Analytics() {
  return (
    <section className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>05</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">YOUR CONTENT<br/>IS LEARNING.</h2>
      </div>

      <div className="col-8">
        <div className="dashboard-placeholder" style={{ padding: '2rem', height: '100%', minHeight: '300px' }}>
           <div className="flex-between mb-1">
             <span className="mono-text">CONTENT PERFORMANCE</span>
             <span className="mono-text" style={{ color: 'var(--accent)' }}>LIVE VIEW</span>
           </div>
           <p className="mono-text mb-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
             Performance across all connected platforms, auto-tracked.
           </p>
           
           {/* Simple CSS Chart Placeholder */}
           <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1rem', borderBottom: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)', padding: '1rem' }}>
              <div style={{ width: '100%', height: '40%', background: 'var(--border-color)', opacity: 0.2 }}></div>
              <div style={{ width: '100%', height: '60%', background: 'var(--border-color)', opacity: 0.5 }}></div>
              <div style={{ width: '100%', height: '80%', background: 'var(--border-color)', opacity: 0.8 }}></div>
              <div style={{ width: '100%', height: '100%', background: 'var(--accent)' }}></div>
           </div>
           <div className="flex-between mt-1 mono-text" style={{ fontSize: '0.75rem' }}>
             <span>JAN</span>
             <span>FEB</span>
             <span>MAR</span>
             <span>APR</span>
           </div>
        </div>
      </div>

      <div className="col-4">
        <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem', padding: '1.5rem' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div>
                <div className="mono-text mb-1" style={{ color: 'var(--text-muted)' }}>WATCH TIME</div>
                <div className="editorial-h2" style={{ color: 'var(--accent)', margin: 0, fontSize: '2.5rem' }}>+42%</div>
                <div className="mono-text mt-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>vs. last 30 days</div>
             </div>
             <div>
                <div className="mono-text mb-1" style={{ color: 'var(--text-muted)' }}>ENGAGEMENT</div>
                <div className="editorial-h2" style={{ margin: 0, fontSize: '2.5rem' }}>+18%</div>
                <div className="mono-text mt-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>vs. last 30 days</div>
             </div>
           </div>
           
           <hr className="h-rule" style={{ margin: '0' }} />
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div>
                <div className="mono-text mb-1" style={{ color: 'var(--text-muted)' }}>VIDEOS</div>
                <div className="editorial-h2" style={{ margin: 0, fontSize: '2.5rem' }}>27</div>
                <div className="mono-text mt-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>this month</div>
             </div>
             <div>
                <div className="mono-text mb-1" style={{ color: 'var(--text-muted)' }}>TIME SAVED</div>
                <div className="editorial-h2" style={{ margin: 0, fontSize: '2.5rem' }}>18h</div>
                <div className="mono-text mt-1" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>estimated / mo</div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
