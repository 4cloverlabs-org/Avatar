"use client";

import React from 'react';

export default function Testimonials() {
  return (
    <section className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>06</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">PROOF OF WORK</h2>
      </div>

      <div className="col-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Testimonial 1 */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <span className="mono-text" style={{ fontWeight: 700 }}>@SARAH_CODES</span>
            <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>[ VERIFIED USER ]</span>
          </div>
          <p className="mono-text" style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            "I was skeptical about AI avatars, but the expression sync here is flawless. It literally took 10 minutes to set up and it's saved me 15 hours of filming this month alone."
          </p>
        </div>

        {/* Testimonial 2 */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <span className="mono-text" style={{ fontWeight: 700 }}>AGENCY SCALER</span>
            <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>[ VERIFIED USER ]</span>
          </div>
          <p className="mono-text" style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            "We manage 12 creators. Being able to connect their profiles and auto-publish content at scale while keeping their authentic voice has completely changed our business model."
          </p>
        </div>

        {/* Testimonial 3 */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', background: 'var(--text-main)', color: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-primary)', paddingBottom: '0.5rem' }}>
            <span className="mono-text" style={{ fontWeight: 700 }}>MARCUS REALTOR</span>
            <span className="mono-text" style={{ fontSize: '0.75rem', opacity: 0.7 }}>[ VERIFIED USER ]</span>
          </div>
          <p className="mono-text" style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
            "The autopilot feature is incredible. I just drop in the property details and the system handles the script, video, and posts it across all my socials."
          </p>
        </div>
        
      </div>
    </section>
  );
}
