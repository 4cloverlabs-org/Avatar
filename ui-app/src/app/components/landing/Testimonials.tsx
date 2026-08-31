"use client";

import React from 'react';

export default function Testimonials() {
  return (
    <section className="editorial-section" style={{ background: '#FAFAF8', position: 'relative' }}>
      <div className="grid-container">
        <div className="col-12 mb-4">
          <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Proof of Work</h2>
        </div>

      <div className="col-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Testimonial 1 */}
        <div className="premium-glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>@Sarah_Codes</span>
            <span className="mono-text" style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 500 }}>Verified User</span>
          </div>
          <p className="mono-text" style={{ lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            "I was skeptical about AI avatars, but the expression sync here is flawless. It literally took 10 minutes to set up and it's saved me 15 hours of filming this month alone."
          </p>
        </div>

        {/* Testimonial 2 */}
        <div className="premium-glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Agency Scaler</span>
            <span className="mono-text" style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 500 }}>Verified User</span>
          </div>
          <p className="mono-text" style={{ lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            "We manage 12 creators. Being able to connect their profiles and auto-publish content at scale while keeping their authentic voice has completely changed our business model."
          </p>
        </div>

        {/* Testimonial 3 */}
        <div className="premium-glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Marcus Realtor</span>
            <span className="mono-text" style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 500 }}>Verified User</span>
          </div>
          <p className="mono-text" style={{ lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            "The autopilot feature is incredible. I just drop in the property details and the system handles the script, video, and posts it across all my socials."
          </p>
        </div>
        
      </div>
      </div>
    </section>
  );
}
