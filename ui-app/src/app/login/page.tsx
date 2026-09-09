"use client";

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Calling getSession will trigger the twoFactorClient interceptor 
    // if the user's session requires 2FA (e.g. returning from Google OAuth)
    authClient.getSession().catch(() => {});
    
    // Check if URL has ?mode=signup
    if (typeof window !== 'undefined' && window.location.search.includes('mode=signup')) {
      setIsLogin(false);
    }
  }, []);

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
    <div className="landing-container" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'row', backgroundColor: 'var(--bg-primary)' }}>
      <style>{`
        .login-image-section { display: none; }
        @media (min-width: 768px) {
          .login-image-section { display: block; }
        }
      `}</style>
      
      <div className="login-image-section" style={{ flex: 1, position: 'relative', borderRight: '1px solid rgba(0,0,0,0.05)', height: '100%', overflow: 'hidden' }}>
        <img src="/avatar.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} alt="Background" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8) 100%)' }} />
        
        {/* Professional Overlay Content */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', color: 'white' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              "The most realistic AI avatars we've ever seen. It completely transformed our content pipeline and saved us hundreds of hours."
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-orange, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>J</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>James Carter</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Creative Director, StudioX</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#ffffff' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <Link href="/" style={{ display: 'inline-block', textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.04em', marginBottom: '1.25rem' }}>
              AnClone.
            </Link>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', fontFamily: 'var(--font-body)' }}>
              {isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start generating AI videos.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', fontSize: '0.875rem', border: '1px solid #f87171' }}>
                {error}
              </div>
            )}
            
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: '#FFFFFF', color: '#111827', border: '1px solid #E5E7EB', borderRadius: '100px', cursor: googleLoading ? 'not-allowed' : 'pointer', opacity: googleLoading ? 0.7 : 1, padding: '0.75rem', fontSize: '0.9rem', fontWeight: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
              onMouseOver={(e) => { if (!googleLoading) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
              onMouseOut={(e) => { if (!googleLoading) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ backgroundColor: 'white', borderRadius: '50%', padding: '1px' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }}></div>
            </div>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.3)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                  />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>Email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', outline: 'none', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem', textAlign: 'center', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, background: 'var(--brand-orange, #ff6b35)', color: 'white', border: 'none', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 600, transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25)', fontFamily: 'var(--font-body)' }}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>

              {!isLogin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" id="accept-privacy" required style={{ margin: 0, cursor: 'pointer', accentColor: 'var(--brand-orange, #ff6b35)' }} />
                  <label htmlFor="accept-privacy" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    I agree to the <button type="button" onClick={() => setShowPrivacyModal(true)} style={{ color: 'var(--text-main)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', fontWeight: 500 }}>Privacy Policy</button> and <Link href="/terms" style={{ color: 'var(--text-main)', textDecoration: 'underline', fontWeight: 500 }}>Terms of Service</Link>.
                  </label>
                </div>
              )}
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(null); }}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--brand-orange, #ff6b35)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, transition: 'opacity 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
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
