"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function AutopilotSection() {
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>INSTAGRAM REELS</span>
                 <span style={{ color: 'var(--accent)' }}>CONNECTED</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced 2 min ago</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>YOUTUBE SHORTS</span>
                 <span style={{ color: 'var(--accent)' }}>CONNECTED</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced 12 min ago</span>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>TIKTOK</span>
                 <span style={{ color: 'var(--accent)' }}>CONNECTED</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>OAuth connected · Last synced 5 min ago</span>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span>LINKEDIN</span>
              <span>OFFLINE</span>
           </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.25rem', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
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
        </div>
      </div>

      <div className="col-7">
        <div className="dashboard-placeholder" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', padding: '1rem 2rem', fontFamily: 'monospace', fontWeight: 700 }}>IDEA</div>
              <div style={{ height: '2px', flex: 1, background: 'var(--text-main)' }}></div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ height: '2px', flex: 1, background: 'var(--border-color)', opacity: 0.2 }}></div>
              <div style={{ border: '1px solid var(--text-main)', padding: '1rem 2rem', fontFamily: 'monospace', fontWeight: 700 }}>SCRIPT</div>
              <div style={{ height: '2px', flex: 1, background: 'var(--text-main)' }}></div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ height: '2px', flex: 1, background: 'var(--border-color)', opacity: 0.2 }}></div>
              <div style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', padding: '1rem 2rem', fontFamily: 'monospace', fontWeight: 700 }}>VIDEO</div>
              <div style={{ height: '2px', flex: 1, background: 'var(--text-main)' }}></div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ height: '2px', flex: 1, background: 'var(--border-color)', opacity: 0.2 }}></div>
              <div style={{ background: 'var(--accent)', color: '#fff', padding: '1rem 2rem', fontFamily: 'monospace', fontWeight: 700 }}>PUBLISH</div>
           </div>
           
        </div>
      </div>
    </section>
  );
}
