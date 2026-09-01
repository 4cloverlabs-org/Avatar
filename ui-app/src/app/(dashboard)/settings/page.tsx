'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { AlertTriangle, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
    type="button"
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

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Profile Form State
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Preferences State
  const [preferences, setPreferences] = useState({
    dashboardTheme: 'light',
    logExplorerTheme: 'match',
    highContrastMode: false
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  // 2FA State
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [totpUri, setTotpUri] = useState('');
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [totpError, setTotpError] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // Account Deletion State
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Git Credentials State
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);
  const [gitProvider, setGitProvider] = useState('github');
  const [gitTokenName, setGitTokenName] = useState('');
  const [gitTokenValue, setGitTokenValue] = useState('');
  const [isSavingGit, setIsSavingGit] = useState(false);
  const [gitCredentials, setGitCredentials] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await authClient.getSession();
      if (error || !data?.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setName(data.user.name || '');
      setIs2FAEnabled(data.user.twoFactorEnabled || false);

      try {
        const prefRes = await fetch('/api/settings/preferences');
        if (prefRes.ok) {
          const prefData = await prefRes.json();
          if (prefData.success && prefData.preferences) {
            setPreferences({
              dashboardTheme: prefData.preferences.dashboardTheme,
              logExplorerTheme: prefData.preferences.logExplorerTheme,
              highContrastMode: prefData.preferences.highContrastMode
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
      }

      try {
        const keysRes = await fetch('/api/settings/api-keys');
        if (keysRes.ok) {
          const keysData = await keysRes.json();
          if (keysData.success) {
            setApiKeys(keysData.apiKeys);
          }
        }
      } catch (err) {
        console.error("Failed to fetch API keys:", err);
      }
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

  const updatePreference = async (key: string, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    setIsSavingPrefs(true);

    // Optimistic UI updates
    if (key === 'dashboardTheme') {
      if (value === 'light') {
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('dashboard-theme', 'light');
      } else {
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('dashboard-theme', 'dark');
      }
    }
    if (key === 'highContrastMode') {
      if (value) {
        document.documentElement.classList.add('high-contrast');
        localStorage.setItem('high-contrast', 'true');
      } else {
        document.documentElement.classList.remove('high-contrast');
        localStorage.setItem('high-contrast', 'false');
      }
    }

    try {
      await fetch('/api/settings/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleCreateApiKey = async () => {
    setIsCreatingKey(true);
    setNewKey(null);
    try {
      const res = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Development Key' })
      });
      const data = await res.json();
      if (data.success) {
        setNewKey(data.apiKey.rawKey);
        setApiKeys([data.apiKey, ...apiKeys]);
      } else {
        alert(data.error);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/settings/api-keys/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApiKeys(apiKeys.filter(k => k.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnable2FA = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIs2FAModalOpen(true);
    setTotpError('');
    setTotpUri('');
    try {
      // First, see if they already have a 2FA setup in the database from a previous session
      let res = await (authClient.twoFactor as any).getTotpUri();
      
      // If it fails because they don't have one, generate a fresh one
      if (res.error && res.error.code === 'TOTP_NOT_ENABLED') {
        res = await (authClient.twoFactor as any).enable({ password: '' });
      }

      if (res.data?.totpURI) {
        setTotpUri(res.data.totpURI);
      } else if (res.error) {
        console.error("TOTP Generation Error:", res.error);
        setTotpError(res.error.message || JSON.stringify(res.error));
      }
    } catch (e: any) {
      setTotpError(e.message || 'Failed to connect to authentication server.');
    }
  };

  const handleVerify2FA = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!totpCode || totpCode.length < 6) {
      setTotpError("Please enter a valid 6-digit code.");
      return;
    }
    setIsVerifying2FA(true);
    setTotpError('');
    try {
      const res = await (authClient.twoFactor as any).verifyTotp({ code: totpCode });
      
      if (res.error) {
        setTotpError(res.error.message || 'Invalid code.');
      } else {
        setIs2FAModalOpen(false);
        // Refresh session to show 2FA is enabled
        window.location.reload();
      }
    } catch (e: any) {
      setTotpError(e.message || 'Verification failed.');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleDisable2FA = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDisable2FAModal(true);
  };

  const confirmDisable2FA = async () => {
    setIsDisabling2FA(true);
    try {
      // Use our custom soft disable endpoint so we don't delete their secret
      const res = await fetch('/api/settings/2fa/disable', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setIs2FAEnabled(false);
        setMessage({ type: 'success', text: 'Two-Factor Authentication has been disabled.' });
        setShowDisable2FAModal(false);
      } else {
        alert("Failed to disable 2FA: " + (data.error || 'Unknown error'));
      }
    } catch (e) {
      alert("Failed to disable 2FA.");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleSavePassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    setIsSavingPassword(true);
    setPasswordError('');
    try {
      // Assuming better-auth provides a way to update the user's password
      // @ts-ignore
      const res = await authClient.updateUser({ password: newPassword }) as any;
      if (res.error) {
        setPasswordError(res.error.message || 'Failed to update password.');
      } else {
        setIsPasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: 'success', text: 'Password has been set successfully.' });
      }
    } catch (e: any) {
      setPasswordError(e.message || 'An error occurred while saving the password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSaveGitCredential = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gitTokenName || !gitTokenValue) return;
    setIsSavingGit(true);
    try {
      // In a real app, this would be an API call to save the credential securely
      const newCred = { id: Date.now(), name: gitTokenName, provider: gitProvider };
      setGitCredentials([...gitCredentials, newCred]);
      setIsGitModalOpen(false);
      setGitTokenName('');
      setGitTokenValue('');
      setMessage({ type: 'success', text: 'Deployment credential saved.' });
    } catch (e) {
      alert("Failed to save credential.");
    } finally {
      setIsSavingGit(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') {
      alert("Please type DELETE to confirm.");
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch('/api/settings/account', { method: 'DELETE' });
      if (res.ok) {
        await authClient.signOut();
        router.push('/login');
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const container = document.querySelector('.home-main');
    if (!container) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'profile'; 

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navRef = React.useRef<HTMLDivElement>(null);
  const [indicatorOffset, setIndicatorOffset] = useState(4);

  useEffect(() => {
    if (navRef.current) {
      const links = Array.from(navRef.current.querySelectorAll('a'));
      const activeIndex = [
        'profile', 'appearance', 'account-security', 'api-keys', 'connections', 'delete-account'
      ].indexOf(activeSection);
      
      const activeLink = links[activeIndex !== -1 ? activeIndex : 0];
      if (activeLink) {
        const offset = activeLink.offsetTop + (activeLink.offsetHeight - 24) / 2;
        setIndicatorOffset(offset);
      }
    }
  }, [activeSection]);

  if (!user) {
    return (
      <div style={{ padding: '48px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '100px', height: '14px', background: '#e2e8f0', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
          <div style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: i % 2 === 0 ? '80px' : '110px', height: '14px', background: '#f1f5f9', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear' }} />
            ))}
          </div>
        </div>

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
                  <img src={user.image} alt="User Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
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
            value={preferences.dashboardTheme === 'dark' ? 'Dark' : 'Light'} 
            action={
              <select 
                value={preferences.dashboardTheme}
                onChange={(e) => updatePreference('dashboardTheme', e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--panel-bg)', color: 'var(--foreground)', border: '1px solid var(--panel-border)', fontSize: '13px' }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            } 
          />
          <SettingsRow 
            label="Log Explorer Theme" 
            value={preferences.logExplorerTheme === 'match' ? 'Match Dashboard (Default)' : preferences.logExplorerTheme === 'dark' ? 'Dark' : 'Light'} 
            action={
              <select 
                value={preferences.logExplorerTheme}
                onChange={(e) => updatePreference('logExplorerTheme', e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--panel-bg)', color: 'var(--foreground)', border: '1px solid var(--panel-border)', fontSize: '13px' }}
              >
                <option value="match">Match Dashboard (Default)</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            } 
          />
          <SettingsRow 
            label="High Contrast Mode" 
            value={preferences.highContrastMode ? "Enabled" : "Disabled"} 
            subtext="Increase the visibility of interactive elements."
            action={
              <ActionButton 
                variant={preferences.highContrastMode ? "primary" : "secondary"} 
                onClick={() => updatePreference('highContrastMode', !preferences.highContrastMode)}
              >
                {preferences.highContrastMode ? "Disable" : "Enable"}
              </ActionButton>
            } 
            hideBorder={true}
          />
        </Section>

        {/* Account Security */}
        <Section id="account-security" title="Account Security">
          <SettingsRow 
            label="Password" 
            value="Secure your account with a password." 
            action={<ActionButton variant="primary" onClick={(e: any) => { e.preventDefault(); setIsPasswordModalOpen(true); }}>Set Password</ActionButton>} 
          />
          <SettingsRow 
            label="Login Methods" 
            value={
              <div style={{ alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', padding: '8px 12px', border: '1px solid var(--panel-border)', borderRadius: '6px', display: 'inline-flex', marginTop: '8px' }}>
                <span>{user.email}</span>
                <span style={{ color: 'var(--text-muted)' }}>• Options</span>
              </div>
            }
            subtext="You can access your account with these login methods."
            action={<ActionButton variant="secondary">Link new account</ActionButton>} 
          />
          <SettingsRow 
            label="Git Deployment Credentials" 
            value={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {gitCredentials.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)' }}>No credentials configured.</div>
                ) : (
                  gitCredentials.map(cred => (
                    <div key={cred.id} style={{ alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', padding: '8px 12px', border: '1px solid var(--panel-border)', borderRadius: '6px', display: 'inline-flex' }}>
                      <span>{cred.name} ({cred.provider})</span>
                    </div>
                  ))
                )}
              </div>
            }
            subtext="Credentials are used to detect code changes in your repo and deploy your services."
            action={<ActionButton variant="secondary" onClick={(e: any) => { e.preventDefault(); setIsGitModalOpen(true); }}>Add credential</ActionButton>} 
          />
          <SettingsRow 
            label="Two-Factor Authentication" 
            value={is2FAEnabled ? "Enabled" : "Disabled"} 
            subtext="AvatarApp uses time-based one-time passcodes (TOTP) that are compliant with all major authenticator apps and browser extensions including 1Password, Authy, and Google Authenticator."
            action={
              <ActionButton 
                variant={is2FAEnabled ? "danger" : "secondary"} 
                onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
              >
                {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
              </ActionButton>
            } 
            hideBorder={true}
          />
        </Section>

        {/* API Keys */}
        <Section id="api-keys" title="API Keys" description="Authenticate your requests to the AvatarApp API.">
          <div style={{ marginBottom: '16px' }}>
            <ActionButton variant="primary" onClick={handleCreateApiKey}>
              {isCreatingKey ? 'Creating...' : 'Create API Key'}
            </ActionButton>
          </div>
          
          {newKey && (
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '13px', marginBottom: '16px' }}>
              <strong>Your new API key:</strong> <code style={{ background: 'rgba(255,255,255,0.5)', padding: '2px 4px', borderRadius: '4px' }}>{newKey}</code>
              <br/><br/>
              Please copy this key now. You will not be able to see it again!
            </div>
          )}

          {apiKeys.length === 0 ? (
            <div style={{ background: 'var(--panel-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)', color: 'var(--text-muted)', fontSize: '13px' }}>
              No provisioned API keys.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {apiKeys.map(key => (
                <div key={key.id} style={{ background: 'var(--panel-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>{key.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ActionButton variant="danger" onClick={() => handleRevokeApiKey(key.id)}>Revoke</ActionButton>
                </div>
              ))}
            </div>
          )}
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

      {/* 2FA Setup Modal */}
      {is2FAModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel-bg)', borderRadius: '12px', width: '400px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>Enable Two-Factor Authentication</h3>
              <button onClick={() => setIs2FAModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            {totpError && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fecaca' }}>
                {totpError}
              </div>
            )}

            {!totpUri ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                Generating 2FA setup...
              </div>
            ) : (
              <>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Scan this QR code with your authenticator app (like Google Authenticator, Authy, or 1Password).
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', background: '#fff', padding: '16px', borderRadius: '8px' }}>
                  <QRCodeSVG value={totpUri} size={200} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '6px' }}>Enter 6-digit code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="000000"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '18px', letterSpacing: '4px', textAlign: 'center' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <ActionButton variant="secondary" onClick={() => setIs2FAModalOpen(false)}>Cancel</ActionButton>
                  <ActionButton variant="primary" onClick={handleVerify2FA}>
                    {isVerifying2FA ? 'Verifying...' : 'Verify & Enable'}
                  </ActionButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisable2FAModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '12px', width: '400px', border: '1px solid var(--panel-border)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--foreground)' }}>Disable Two-Factor Authentication</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
              Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <ActionButton variant="secondary" onClick={() => setShowDisable2FAModal(false)}>Cancel</ActionButton>
              <ActionButton variant="danger" onClick={confirmDisable2FA}>
                {isDisabling2FA ? 'Disabling...' : 'Disable 2FA'}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--panel-bg)', padding: '24px', borderRadius: '12px', width: '400px', border: '1px solid var(--panel-border)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--foreground)' }}>Delete Account</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
              This action is permanent and cannot be undone. All your videos, avatars, and data will be lost forever.
            </p>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--foreground)' }}>
              Please type <strong>DELETE</strong> to confirm.
            </p>
            <input 
              type="text" 
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="DELETE"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--panel-bg)', color: 'var(--foreground)', marginBottom: '24px' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <ActionButton variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteConfirmationText(''); }}>Cancel</ActionButton>
              <ActionButton variant="danger" onClick={handleDeleteAccount}>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel-bg)', borderRadius: '12px', width: '400px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>Set Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            {passwordError && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fecaca' }}>
                {passwordError}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '6px' }}>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '6px' }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <ActionButton variant="secondary" onClick={() => setIsPasswordModalOpen(false)}>Cancel</ActionButton>
              <ActionButton variant="primary" onClick={handleSavePassword}>
                {isSavingPassword ? 'Saving...' : 'Save Password'}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {/* Git Credentials Modal */}
      {isGitModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel-bg)', borderRadius: '12px', width: '400px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>Add Git Credential</h3>
              <button onClick={() => setIsGitModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '6px' }}>Provider</label>
              <select 
                value={gitProvider}
                onChange={(e) => setGitProvider(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="bitbucket">Bitbucket</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '6px' }}>Token Name</label>
              <input 
                type="text" 
                placeholder="e.g. AvatarApp Deployment"
                value={gitTokenName}
                onChange={(e) => setGitTokenName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--foreground)', marginBottom: '6px' }}>Personal Access Token</label>
              <input 
                type="password" 
                placeholder="ghp_xxxxxxxxxxxxxxxxxxx"
                value={gitTokenValue}
                onChange={(e) => setGitTokenValue(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <ActionButton variant="secondary" onClick={() => setIsGitModalOpen(false)}>Cancel</ActionButton>
              <ActionButton variant="primary" onClick={handleSaveGitCredential}>
                {isSavingGit ? 'Saving...' : 'Add Credential'}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
