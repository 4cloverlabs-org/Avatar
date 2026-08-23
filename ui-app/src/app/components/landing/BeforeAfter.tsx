"use client";

import React from 'react';

export default function BeforeAfter() {
  return (
    <section className="section" style={{ background: '#15170F' }}>
      <h2 className="section-title">From hours of content work<br/>to a few minutes of setup.</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '4rem', maxWidth: '1000px', width: '100%' }}>
         
         {/* Before */}
         <div style={{ background: '#15170F', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: '#9C9C8C', marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'center' }}>Before</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#63685A' }}>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>IDEA</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Write script</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Record yourself</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Retake</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Edit</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Caption</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Upload</div>
               <div>&darr;</div>
               <div style={{ background: '#1E2119', padding: '0.75rem 2rem', borderRadius: '8px' }}>Repeat</div>
            </div>
         </div>
         
         {/* After */}
         <div style={{ background: 'linear-gradient(135deg, rgba(59, 93, 59,0.1), transparent)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--brand-green)' }}>
            <h3 style={{ color: 'var(--brand-green)', marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'center' }}>With AI Content Engine</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#fff' }}>
               <div style={{ background: 'rgba(59, 93, 59,0.2)', padding: '1rem 3rem', borderRadius: '8px', color: 'var(--brand-green)' }}>IDEA</div>
               <div style={{ color: 'var(--brand-green)' }}>&darr;</div>
               <div style={{ background: 'var(--brand-green)', color: '#15170F', fontWeight: 600, padding: '1.5rem 3rem', borderRadius: '12px' }}>AI CONTENT ENGINE</div>
               <div style={{ color: 'var(--brand-green)' }}>&darr;</div>
               <div style={{ background: 'rgba(59, 93, 59,0.2)', padding: '1rem 3rem', borderRadius: '8px', color: 'var(--brand-green)' }}>VIDEO PUBLISHED</div>
            </div>
         </div>
         
      </div>
    </section>
  );
}
