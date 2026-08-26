"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import PrivacyPolicyContent from '../components/PrivacyPolicyContent';
import { authClient } from '../../lib/auth-client';
import { useRouter } from 'next/navigation';
import '../landing.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: '/dashboard'
        });
        if (signInError) {
          setError(signInError.message || 'Failed to log in');
          setLoading(false);
        }
      } else {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: '/dashboard'
        });
        if (signUpError) {
          setError(signUpError.message || 'Failed to sign up');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Simple Nav for Login Page */}
      <nav className="brutalist-nav">
        <Link href="/" className="nav-logo">
          AnClone.
        </Link>
        <Link href="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
          <div className="panel-header" style={{ marginBottom: '2rem' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', fontSize: '0.875rem', border: '1px solid #f87171' }}>
                {error}
              </div>
            )}
            
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="nav-cta" 
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem', 
                background: 'transparent', 
                color: 'var(--text-main)', 
                border: '1px solid var(--text-main)',
                cursor: googleLoading ? 'not-allowed' : 'pointer',
                opacity: googleLoading ? 0.7 : 1,
                padding: '0.75rem'
              }}
              onMouseOver={(e) => {
                if (!googleLoading) {
                  e.currentTarget.style.background = 'var(--text-main)';
                  e.currentTarget.style.color = 'var(--bg-primary)';
                }
              }}
              onMouseOut={(e) => {
                if (!googleLoading) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ backgroundColor: 'white', borderRadius: '50%', padding: '2px' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="h-rule" style={{ flex: 1 }}></div>
              <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
              <div className="h-rule" style={{ flex: 1 }}></div>
            </div>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="mono-text" style={{ fontSize: '0.75rem' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    style={{ padding: '0.75rem', border: '1px solid var(--border-color)', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontFamily: 'inherit' }} 
                  />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="mono-text" style={{ fontSize: '0.75rem' }}>Email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '1px solid var(--border-color)', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontFamily: 'inherit' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="mono-text" style={{ fontSize: '0.75rem' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '1px solid var(--border-color)', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontFamily: 'inherit' }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="nav-cta" 
                style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', textAlign: 'center', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>

              {!isLogin && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" id="accept-privacy" required style={{ marginTop: '0.1rem', cursor: 'pointer' }} />
                  <label htmlFor="accept-privacy" className="mono-text" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '1.4', cursor: 'pointer' }}>
                    I agree to the <button type="button" onClick={() => setShowPrivacyModal(true)} style={{ color: 'inherit', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>Privacy Policy</button> and <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</Link>.
                  </label>
                </div>
              )}
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(null); }}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-main)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {showPrivacyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: 'var(--bg-primary)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem', display: 'flex', justifyContent: 'flex-end', zIndex: 10 }}>
              <button type="button" onClick={() => setShowPrivacyModal(false)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}>
                CLOSE [X]
              </button>
            </div>
            <div style={{ padding: '2rem' }}>
              <PrivacyPolicyContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
