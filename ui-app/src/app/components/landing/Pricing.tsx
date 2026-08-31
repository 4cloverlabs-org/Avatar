"use client";

import React, { useState } from 'react';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="editorial-section grid-container" id="pricing">
      <div className="col-12 mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Simple Pricing</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#E5E7EB', padding: '0.25rem', borderRadius: '100px', marginTop: '1rem' }}>
           <button onClick={() => setIsYearly(false)} style={{ background: !isYearly ? '#FFFFFF' : 'transparent', color: 'var(--text-main)', border: 'none', borderRadius: '100px', padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: !isYearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s ease' }}>Monthly</button>
           <button onClick={() => setIsYearly(true)} style={{ background: isYearly ? '#FFFFFF' : 'transparent', color: 'var(--text-main)', border: 'none', borderRadius: '100px', padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: isYearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             Yearly
             <span style={{ backgroundColor: '#000000', color: '#FFF', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem' }}>Save 20%</span>
           </button>
        </div>
      </div>

      {/* Starter */}
      <div className="col-3 premium-glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
         <div className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Starter</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '1.5rem 0' }}>
           {isYearly && <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '0.5rem' }}>$29</span>}
           ${isYearly ? '24' : '29'}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span>
         </div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, fontSize: '0.9rem' }}>
            <li>✓ 30 mins video/mo</li>
            <li>✓ 1 custom avatar</li>
            <li>✓ 1 voice clone</li>
            <li>✓ 1 platform connection</li>
         </ul>
         <button className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>Get Started</button>
      </div>

      {/* Creator */}
      <div className="col-3 premium-glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', backgroundColor: '#1A1A1A', color: '#FFFFFF', borderColor: '#1A1A1A', transform: 'scale(1.05)', zIndex: 10 }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono-text" style={{ fontWeight: 600, color: '#FFFFFF' }}>Creator</span>
            <span style={{ background: '#000000', color: '#FFFFFF', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 600, borderRadius: '100px' }}>POPULAR</span>
         </div>
         <div className="mono-text" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Best for solo creators posting weekly</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '1.5rem 0', color: '#FFFFFF' }}>
           {isYearly && <span style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'line-through', marginRight: '0.5rem' }}>$89</span>}
           ${isYearly ? '69' : '89'}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>/mo</span>
         </div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
            <li style={{ color: '#000000', fontWeight: 600 }}>Everything in Starter, plus:</li>
            <li>✓ 120 mins video/mo</li>
            <li>✓ 3 custom avatars</li>
            <li>✓ 3 platform connections</li>
            <li>✓ Auto-publishing</li>
            <li>✓ No watermark</li>
         </ul>
         <button className="btn-highlight" style={{ width: '100%', textAlign: 'center', backgroundColor: '#FFFFFF', color: '#1A1A1A' }}>Start Free Trial</button>
      </div>

      {/* Pro */}
      <div className="col-3 premium-glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
         <div className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Pro / Agency</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '1.5rem 0' }}>
           {isYearly && <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '0.5rem' }}>$249</span>}
           ${isYearly ? '199' : '249'}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span>
         </div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, fontSize: '0.9rem' }}>
            <li style={{ fontWeight: 600 }}>Everything in Creator, plus:</li>
            <li>✓ 600 mins video/mo</li>
            <li>✓ 10 custom avatars</li>
            <li>✓ Unlimited platforms</li>
            <li>✓ White-label</li>
            <li>✓ Priority render</li>
         </ul>
         <button className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>Get Started</button>
      </div>

      {/* Enterprise */}
      <div className="col-3 premium-glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
         <div className="mono-text" style={{ fontWeight: 600, color: 'var(--text-main)' }}>Enterprise</div>
         <div className="editorial-h2" style={{ fontSize: '3rem', margin: '1.5rem 0' }}>Custom</div>
         <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, fontSize: '0.9rem' }}>
            <li style={{ fontWeight: 600 }}>Everything in Pro, plus:</li>
            <li>✓ Unlimited generation</li>
            <li>✓ API Access</li>
            <li>✓ SSO Security</li>
            <li>✓ Account Manager</li>
         </ul>
         <button className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>Contact Sales</button>
      </div>
    </section>
  );
}
