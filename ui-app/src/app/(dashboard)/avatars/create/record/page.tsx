"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Smartphone, Mic, Video } from 'lucide-react';

export default function RecordAvatarPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'webcam' | 'phone' | null>(null);

  return (
    <div className="home-content">
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 0' }}>
        <button 
          onClick={() => router.push('/avatars/create')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 32, padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Create your Avatar in 15 seconds
        </h1>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40, lineHeight: 1.5 }}>
          Record your motion once, then reuse it across any look for this avatar. Or upload footage.
        </p>

        {/* Methods */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div 
            onClick={() => setSelectedMethod('webcam')}
            style={{ 
              padding: 24, 
              border: `1px solid ${selectedMethod === 'webcam' ? '#4f46e5' : '#e2e8f0'}`, 
              borderRadius: 16, 
              cursor: 'pointer', 
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'all 0.2s',
              boxShadow: selectedMethod === 'webcam' ? '0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)' : 'none',
              transform: selectedMethod === 'webcam' ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: selectedMethod === 'webcam' ? '#4f46e5' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Monitor size={24} color={selectedMethod === 'webcam' ? '#fff' : '#4f46e5'} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>
              Record via webcam
            </div>
          </div>

          <div 
            onClick={() => setSelectedMethod('phone')}
            style={{ 
              padding: 24, 
              border: `1px solid ${selectedMethod === 'phone' ? '#4f46e5' : '#e2e8f0'}`, 
              borderRadius: 16, 
              cursor: 'pointer', 
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'all 0.2s',
              boxShadow: selectedMethod === 'phone' ? '0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)' : 'none',
              transform: selectedMethod === 'phone' ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: selectedMethod === 'phone' ? '#4f46e5' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Smartphone size={24} color={selectedMethod === 'phone' ? '#fff' : '#4f46e5'} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>
              Record via phone
            </div>
          </div>
        </div>

        {/* Requirements Box */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 32, marginBottom: 40, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: -8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={18} color="#64748b" /></div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, border: '2px solid #fff' }}><Mic size={18} color="#64748b" /></div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a' }}>Enable Camera & Microphone</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc', padding: '16px 24px', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: 15, color: '#475569', fontWeight: 500 }}>We'll provide a script on screen in</div>
            <select style={{ padding: '8px 32px 8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontWeight: 600, fontSize: 14, color: '#0f172a', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button 
            onClick={() => router.push('/avatars/create')}
            style={{ padding: '0 24px', height: 48, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
          >
            Back
          </button>
          <button 
            style={{ padding: '0 32px', height: 48, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(79, 70, 229, 0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            I'm ready
          </button>
        </div>

      </div>
    </div>
  );
}
