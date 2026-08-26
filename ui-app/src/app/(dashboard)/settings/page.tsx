'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Profile Form State
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await authClient.getSession();
      if (error || !data?.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setName(data.user.name || '');
    };
    fetchUser();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { data, error } = await authClient.updateUser({ name });
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const container = document.querySelector('.home-main');
    if (!container) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'profile'; // fallback

      // The header is 80px, so anything crossing the 150px threshold from the top of the viewport becomes active
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navRef = React.useRef<HTMLDivElement>(null);
  const [indicatorOffset, setIndicatorOffset] = useState(4);

  useEffect(() => {
    // When active section changes, calculate the exact pixel offset for the indicator
    if (navRef.current) {
      const links = Array.from(navRef.current.querySelectorAll('a'));
      const activeIndex = [
        'profile', 'appearance', 'account-security', 'api-keys', 'connections', 'delete-account'
      ].indexOf(activeSection);
      
      const activeLink = links[activeIndex !== -1 ? activeIndex : 0];
      if (activeLink) {
        // Center the 24px indicator within the link's height
        const offset = activeLink.offsetTop + (activeLink.offsetHeight - 24) / 2;
        setIndicatorOffset(offset);
      }
    }
  }, [activeSection]);

  if (!user) {
    return (
      <div style={{ padding: '48px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
        {/* Skeleton Sidebar */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '100px', height: '14px', background: '#e2e8f0', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
          <div style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: i % 2 === 0 ? '80px' : '110px', height: '14px', background: '#f1f5f9', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
            ))}
          </div>
        </div>

        {/* Skeleton Content Areas */}
        <div style={{ flex: 1, maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {[1, 2, 3].map((section) => (
            <div key={section} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '140px', height: '24px', background: '#e2e8f0', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
              
              {[1, 2].map((row) => (
                <div key={row} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--panel-border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '120px', height: '14px', background: '#e2e8f0', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
                    <div style={{ width: '200px', height: '12px', background: '#f1f5f9', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
                  </div>
                  <div style={{ width: '60px', height: '28px', background: '#f1f5f9', borderRadius: '6px', animation: 'shimmer 1.5s infinite linear' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Common UI components for Render-style settings
  const Section = ({ id, title, children, description }: any) => (
    <section id={id} style={{ marginBottom: '64px', scrollMarginTop: '100px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px 0' }}>{title}</h2>
      {description && <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{description}</p>}
      {!description && <div style={{ height: '24px' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {children}
      </div>
    </section>
  );

  const SettingsRow = ({ label, value, subtext, action, hideBorder, editMode, editContent }: any) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      padding: '16px 0',
      borderBottom: hideBorder ? 'none' : '1px solid var(--panel-border)'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px' }}>{label}</div>
        
        {editMode ? editContent : (
          <>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{value}</div>
            {subtext && <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{subtext}</div>}
          </>
        )}
      </div>
      <div>
        {action}
      </div>
    </div>
  );

  const ActionButton = ({ onClick, children, variant = 'secondary' }: any) => (
    <button 
      onClick={onClick}
      style={{
        background: variant === 'primary' ? 'var(--accent)' : variant === 'danger' ? '#ef4444' : 'transparent',
        color: variant === 'secondary' ? 'var(--accent)' : '#fff',
        border: variant === 'secondary' ? '1px solid var(--accent)' : 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ 
      padding: '48px 40px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      width: '100%',
      display: 'flex',
      gap: '64px',
      alignItems: 'flex-start'
    }}>
      
      {/* Table of Contents (Sticky Sidebar) */}
      <nav style={{ 
        width: '220px', 
        flexShrink: 0, 
        position: 'sticky', 
        top: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 12px 0' }}>
          Table of contents
        </h3>
        <div ref={navRef} style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
          
          {/* Smooth animated active indicator line */}
          <div style={{
            position: 'absolute',
            left: '-1px', // overlap the border
            top: 0,
            width: '2px',
            height: '24px', // height of the line
            backgroundColor: 'var(--foreground)',
            borderRadius: '2px',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateY(${indicatorOffset}px)`
          }} />

          {[
            { id: 'profile', label: 'Profile' },
            { id: 'appearance', label: 'Appearance' },
            { id: 'account-security', label: 'Account Security' },
            { id: 'api-keys', label: 'API Keys' },
            { id: 'connections', label: 'Connections' },
            { id: 'delete-account', label: 'Delete Account' }
          ].map(item => {
            const isActive = activeSection === item.id;
            return (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive ? 'var(--foreground)' : 'var(--text-muted)', 
                  fontSize: '14px',
                  padding: '6px 0',
                  fontWeight: isActive ? 600 : 500,
                  position: 'relative',
                  display: 'block',
                  transition: 'color 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Main Content Areas */}
      <div style={{ flex: 1, maxWidth: '720px' }}>
        
        {/* Profile */}
        <Section id="profile" title="Profile">
          {message && (
            <div style={{ 
              color: message.type === 'success' ? '#15803d' : '#b91c1c', 
              background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', 
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, 
              padding: '12px 16px', 
              borderRadius: '6px', 
              fontSize: '13px', 
              marginBottom: '16px' 
            }}>
              {message.text}
            </div>
          )}
          
          <SettingsRow 
            label="Full Name" 
            editMode={true}
            editContent={
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ 
                  marginTop: '8px', padding: '8px 12px', border: '1px solid var(--panel-border)', 
                  borderRadius: '6px', background: 'var(--panel-bg)', color: 'var(--foreground)',
                  fontSize: '14px', width: '300px'
                }}
              />
            }
            action={<ActionButton onClick={handleUpdateProfile} variant="secondary">{isSaving ? 'Saving...' : 'Save'}</ActionButton>} 
          />
          <SettingsRow 
            label="Email" 
            value={user.email} 
            action={<ActionButton variant="secondary">Edit</ActionButton>} 
          />
          <SettingsRow 
            label="Avatar" 
            value={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                {user.image ? (
                  <img src={user.image} alt="User Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent), #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 600 }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            }
            action={<ActionButton variant="secondary">Edit</ActionButton>} 
            hideBorder={true}
          />
        </Section>

        {/* Appearance */}
        <Section id="appearance" title="Appearance">
          <SettingsRow 
            label="Dashboard Theme" 
            value="Dark" 
            action={<ActionButton variant="secondary">Edit</ActionButton>} 
          />
          <SettingsRow 
            label="Log Explorer Theme" 
            value="Match Dashboard (Default)" 
            action={<ActionButton variant="secondary">Edit</ActionButton>} 
          />
          <SettingsRow 
            label="High Contrast Mode" 
            value="Disabled" 
            subtext="Increase the visibility of interactive elements."
            action={<ActionButton variant="secondary">Edit</ActionButton>} 
            hideBorder={true}
          />
        </Section>

        {/* Account Security */}
        <Section id="account-security" title="Account Security">
          <SettingsRow 
            label="Password" 
            value="" 
            action={<ActionButton variant="primary">Create Password</ActionButton>} 
          />
          <SettingsRow 
            label="Login Methods" 
            value={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', padding: '8px 12px', border: '1px solid var(--panel-border)', borderRadius: '6px', display: 'inline-flex', marginTop: '8px' }}>
                <span>{user.email}</span>
                <span style={{ color: 'var(--text-muted)' }}>• Options</span>
              </div>
            }
            subtext="You can access your account with these login methods."
            action={<ActionButton variant="secondary">Add login method</ActionButton>} 
          />
          <SettingsRow 
            label="Git Deployment Credentials" 
            value={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', padding: '8px 12px', border: '1px solid var(--panel-border)', borderRadius: '6px', display: 'inline-flex', marginTop: '8px' }}>
                <span>AvatarApp</span>
                <span style={{ color: 'var(--text-muted)' }}>• Options</span>
              </div>
            }
            subtext="Credentials are used to detect code changes in your repo and deploy your services."
            action={<ActionButton variant="secondary">Add credential</ActionButton>} 
          />
          <SettingsRow 
            label="Two-Factor Authentication" 
            value="Disabled" 
            subtext="AvatarApp uses time-based one-time passcodes (TOTP) that are compliant with all major authenticator apps and browser extensions including 1Password, Authy, and Google Authenticator."
            action={<ActionButton variant="secondary">Enable 2FA</ActionButton>} 
            hideBorder={true}
          />
        </Section>

        {/* API Keys */}
        <Section id="api-keys" title="API Keys" description="Authenticate your requests to the AvatarApp API.">
          <div style={{ marginBottom: '16px' }}>
            <ActionButton variant="primary">Create API Key</ActionButton>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)', color: 'var(--text-muted)', fontSize: '13px' }}>
            No provisioned API keys.
          </div>
        </Section>

        {/* Connections */}
        <Section id="connections" title="Connections" description="Applications you've connected to your AvatarApp account.">
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)', color: 'var(--text-muted)', fontSize: '13px' }}>
            You haven't authorized any external applications to access your AvatarApp account.
          </div>
        </Section>

        {/* Delete Account */}
        <Section id="delete-account" title="Delete Account">
          <SettingsRow 
            label="Delete AvatarApp Account" 
            value="Permanently remove your account and all associated data." 
            action={<ActionButton variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Account</ActionButton>} 
            hideBorder={true}
          />
        </Section>

      </div>

      {showDeleteModal && (
        <>
          <div 
            onClick={() => setShowDeleteModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9998, transition: 'opacity 0.2s' }} 
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '90%',
            maxWidth: '480px',
            zIndex: 9999,
            padding: '32px',
            animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <style>{`
              @keyframes modalPop {
                0% { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              }
            `}</style>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={24} color="#ef4444" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Delete Account</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>This action cannot be undone.</p>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>
              Are you absolutely sure you want to permanently delete your AvatarApp account? 
              All your generated avatars, voices, personalized campaigns, and API integrations will be immediately and irrevocably destroyed.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Account deletion logic goes here.");
                  setShowDeleteModal(false);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Yes, delete my account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
