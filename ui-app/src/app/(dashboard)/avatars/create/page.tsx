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
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 32, padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Avatars
        </button>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12, letterSpacing: '-0.02em' }}>Create a new avatar</h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 48, lineHeight: 1.5, maxWidth: 600 }}>
          Create an identity that looks, moves, and sounds consistently in any outfit and setting.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
          {/* Option 1 */}
          <div 
            onClick={() => router.push('/avatars/create/record')}
            style={{ display: 'flex', flexDirection: 'column', padding: 32, border: '1px solid var(--panel-border)', borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s', background: 'var(--panel-bg)', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.querySelector('.arrow')?.setAttribute('stroke', '#4f46e5'); e.currentTarget.querySelector('.arrow')?.setAttribute('transform', 'translateX(4px)'); }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--panel-border)'; e.currentTarget.querySelector('.arrow')?.setAttribute('stroke', 'var(--panel-border)'); e.currentTarget.querySelector('.arrow')?.setAttribute('transform', 'translateX(0)'); }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--foreground)', marginBottom: 8 }}>Clone a real person</div>
            <div style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, marginBottom: 24 }}>Use real video footage to create an avatar that looks, moves, and sounds like you.</div>
            
            <div style={{ display: 'flex', alignItems: 'center', color: '#4f46e5', fontWeight: 600, fontSize: 14 }}>
              Get started
              <svg className="arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--panel-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s', marginLeft: 4 }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
