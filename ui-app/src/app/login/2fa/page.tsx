"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '../../../lib/auth-client';
import '../../landing.css';

export default function TwoFactorPage() {
  const router = useRouter();
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trustDevice, setTrustDevice] = useState(false);

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (totpCode.length === 6) {
      handleVerify();
    }
  }, [totpCode]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (totpCode.length < 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await (authClient.twoFactor as any).verifyTotp({ 
        code: totpCode,
        trustDevice 
      });
      
      if (res.error) {
        setError(res.error.message || 'Invalid 2FA code.');
        setLoading(false);
      } else {
        // Success! User is now fully logged in.
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <nav className="brutalist-nav">
        <Link href="/" className="nav-logo">
          AnClone.
        </Link>
        <Link href="/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Login
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
          <div className="panel-header" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Two-Factor Authentication
          </div>
          
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Enter the 6-digit code from your authenticator app to continue.
          </p>

          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', fontSize: '0.875rem', border: '1px solid #f87171' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Authentication Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  fontSize: '1.5rem', 
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)', 
                  border: '2px solid var(--border-color)', 
                  color: 'var(--text-primary)', 
                  borderRadius: '4px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                disabled={loading}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="trustDevice"
                checked={trustDevice}
                onChange={(e) => setTrustDevice(e.target.checked)}
                style={{ cursor: 'pointer' }}
                disabled={loading}
              />
              <label htmlFor="trustDevice" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Don't ask again on this device for 30 days
              </label>
            </div>

            <button 
              type="submit" 
              className="button-primary"
              style={{ 
                width: '100%', 
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading || totpCode.length < 6}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
