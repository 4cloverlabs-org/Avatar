"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function CreateAvatarPage() {
  const router = useRouter();

  return (
    <div className="home-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8vh', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 900 }}>
        <button 
          onClick={() => router.push('/avatars')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 32, padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={16} /> Back to Avatars
        </button>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.02em' }}>Create a new avatar</h1>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 48, lineHeight: 1.5, maxWidth: 600 }}>
          Create an identity that looks, moves, and sounds consistently in any outfit and setting.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
          {/* Option 1 */}
          <div 
            onClick={() => router.push('/avatars/create/record')}
            style={{ display: 'flex', flexDirection: 'column', padding: 32, border: '1px solid #e2e8f0', borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s', background: '#fff', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.querySelector('.arrow')?.setAttribute('stroke', '#4f46e5'); e.currentTarget.querySelector('.arrow')?.setAttribute('transform', 'translateX(4px)'); }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.querySelector('.arrow')?.setAttribute('stroke', '#cbd5e1'); e.currentTarget.querySelector('.arrow')?.setAttribute('transform', 'translateX(0)'); }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a', marginBottom: 8 }}>Clone a real person</div>
            <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.5, flex: 1, marginBottom: 24 }}>Use real video footage to create an avatar that looks, moves, and sounds like you.</div>
            
            <div style={{ display: 'flex', alignItems: 'center', color: '#4f46e5', fontWeight: 600, fontSize: 14 }}>
              Get started
              <svg className="arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s', marginLeft: 4 }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

          {/* Option 2 */}
          <div 
            style={{ display: 'flex', flexDirection: 'column', padding: 32, border: '1px solid #e2e8f0', borderRadius: 20, cursor: 'not-allowed', transition: 'all 0.2s', background: '#f8fafc', position: 'relative', overflow: 'hidden', opacity: 0.7 }}
          >
            <div style={{ position: 'absolute', top: 24, right: 24, background: '#f1f5f9', color: '#64748b', fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.05em' }}>COMING SOON</div>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a', marginBottom: 8 }}>Create a virtual character</div>
            <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.5, flex: 1, marginBottom: 24 }}>Start with an image, and bring it to life with unique motion and voice.</div>
            
            <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>
              Get started
              <svg className="arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s', marginLeft: 4 }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
