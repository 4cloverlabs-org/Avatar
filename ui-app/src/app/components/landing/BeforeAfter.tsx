"use client";

import React from 'react';

export default function BeforeAfter() {
  return (
    <section className="editorial-section grid-container" style={{ background: '#F8FAFC' }}>
      <div className="col-12 mb-4">
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>From hours of content work<br/>to a few minutes of setup.</h2>
      </div>
      
      <div className="col-12" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '2rem' }}>
         
         {/* Before */}
         <div className="premium-glass-card" style={{ background: '#FFFFFF', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'center', fontWeight: 500, fontFamily: 'var(--font-heading)' }}>Before</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Idea</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Write script</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Record yourself</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Retake</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Edit</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Caption</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Upload</div>
               <div>&darr;</div>
               <div style={{ background: '#F1F5F9', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Repeat</div>
            </div>
         </div>
         
         {/* After */}
         <div className="premium-glass-card" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', padding: '3rem', border: '1px solid #000000', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#000000', marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'center', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>With AnClone</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', color: 'var(--text-main)', flex: 1, justifyContent: 'center' }}>
               <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem 3rem', borderRadius: '8px', color: '#000000', fontWeight: 500, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>Idea</div>
               <div style={{ color: '#000000', fontSize: '1.25rem' }}>&darr;</div>
               <div style={{ background: '#000000', color: '#FFFFFF', fontWeight: 600, padding: '1.5rem 3rem', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)', fontSize: '1.1rem' }}>AnClone Engine</div>
               <div style={{ color: '#000000', fontSize: '1.25rem' }}>&darr;</div>
               <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem 3rem', borderRadius: '8px', color: '#000000', fontWeight: 500, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>Video Published</div>
            </div>
         </div>
         
      </div>
    </section>
  );
}
