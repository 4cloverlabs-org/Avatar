"use client";

import React, { useState } from 'react';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="brutalist-section grid-container" id="pricing">
      <div className="col-12 mb-4">
        <h2 className="editorial-h2">PRICING</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <button onClick={() => setIsYearly(false)} style={{ background: !isYearly ? 'var(--text-main)' : 'transparent', color: !isYearly ? 'var(--bg-primary)' : 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', fontFamily: 'monospace', cursor: 'pointer' }}>MONTHLY</button>
           <button onClick={() => setIsYearly(true)} style={{ background: isYearly ? 'var(--text-main)' : 'transparent', color: isYearly ? 'var(--bg-primary)' : 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', fontFamily: 'monospace', cursor: 'pointer' }}>YEARLY (SAVE 20%)</button>
        </div>
      </div>

      {/* Starter */}
      <div className="col-3 panel" style={{ display: 'flex', flexDirection: 'column' }}>
         <div className="panel-header">STARTER</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '2rem 0' }}>
           {isYearly && <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '0.5rem' }}>$29</span>}
           ${isYearly ? '24' : '29'}
         </div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <li>30 MINS VIDEO/MO</li>
            <li>1 CUSTOM AVATAR</li>
            <li>1 VOICE CLONE</li>
            <li>1 PLATFORM CONNECTION</li>
         </ul>
         <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>GET STARTED</button>
      </div>

      {/* Creator */}
      <div className="col-3 card-dark" style={{ display: 'flex', flexDirection: 'column' }}>
         <div className="panel-header" style={{ borderBottomColor: 'var(--bg-primary)' }}>
            CREATOR <span style={{ background: 'var(--accent-yellow)', color: 'var(--text-main)', padding: '2px 8px', fontSize: '0.65rem', marginLeft: '0.5rem', display: 'inline-block', transform: 'translateY(-2px)' }}>POPULAR</span>
         </div>
         <div className="mono-text" style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>Best for solo creators posting weekly</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '1.5rem 0', color: 'var(--accent-green-light)' }}>
           {isYearly && <span style={{ fontSize: '1.5rem', color: 'rgba(248, 246, 240, 0.5)', textDecoration: 'line-through', marginRight: '0.5rem' }}>$89</span>}
           ${isYearly ? '69' : '89'}
         </div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <li style={{ color: 'var(--accent-green-light)' }}>EVERYTHING IN STARTER, PLUS:</li>
            <li>120 MINS VIDEO/MO</li>
            <li>3 CUSTOM AVATARS</li>
            <li>3 PLATFORM CONNECTIONS</li>
            <li>AUTO-PUBLISHING</li>
            <li>NO WATERMARK</li>
         </ul>
         <button className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>START FREE TRIAL</button>
      </div>

      {/* Pro */}
      <div className="col-3 panel" style={{ display: 'flex', flexDirection: 'column' }}>
         <div className="panel-header">PRO / AGENCY</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '2.5rem 0 2rem 0' }}>
           {isYearly && <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '0.5rem' }}>$249</span>}
           ${isYearly ? '199' : '249'}
         </div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <li style={{ fontWeight: 700 }}>EVERYTHING IN CREATOR, PLUS:</li>
            <li>600 MINS VIDEO/MO</li>
            <li>10 CUSTOM AVATARS</li>
            <li>UNLIMITED PLATFORMS</li>
            <li>WHITE-LABEL</li>
            <li>PRIORITY RENDER</li>
         </ul>
         <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>GET STARTED</button>
      </div>

      {/* Enterprise */}
      <div className="col-3 panel" style={{ display: 'flex', flexDirection: 'column' }}>
         <div className="panel-header">ENTERPRISE</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '2.5rem 0 2rem 0' }}>CUSTOM</div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <li style={{ fontWeight: 700 }}>EVERYTHING IN PRO, PLUS:</li>
            <li>UNLIMITED GEN</li>
            <li>API ACCESS</li>
            <li>SSO SECURITY</li>
            <li>ACCOUNT MANAGER</li>
         </ul>
         <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>CONTACT SALES</button>
      </div>
    </section>
  );
}
