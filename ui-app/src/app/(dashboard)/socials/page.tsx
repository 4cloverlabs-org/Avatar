"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Youtube, Instagram, Facebook, Twitter, Settings, X, Plus } from 'lucide-react';

const TikTokIcon = ({ size = 18, color = "#000000" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="-32 -32 512 576" 
    fill="none" 
    stroke={color} 
    strokeWidth="32" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

export default function SocialsPage() {
  const router = useRouter();
  
  // All connected accounts
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Settings Modal state
  const [modalState, setModalState] = useState<{ isOpen: boolean; platform: string | null; }>({
    isOpen: false,
    platform: null
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pausedIntegrations, setPausedIntegrations] = useState<Record<string, boolean>>({});

  // Persist connection state — fetch from API
  useEffect(() => {
    try {
      const cached = localStorage.getItem('socials_cache_v2');
      if (cached) {
        setAccounts(JSON.parse(cached));
        setLoadingAccounts(false);
      }
    } catch(e) {}

    async function fetchConnectedAccounts() {
      try {
        const res = await fetch('/api/socials/accounts');
        const data = await res.json();
        if (data.success && data.accounts) {
          setAccounts(data.accounts);
          localStorage.setItem('socials_cache_v2', JSON.stringify(data.accounts));
        }
        const savedPaused = localStorage.getItem('socials_paused_v2');
        if (savedPaused) {
          setPausedIntegrations(JSON.parse(savedPaused));
        }
      } catch (err) {
        console.error('Failed to fetch social accounts:', err);
      } finally {
        setLoadingAccounts(false);
      }
    }
    fetchConnectedAccounts();
  }, []);

  const handleConnect = (platform: string) => {
    if (platform === 'youtube') {
      window.location.href = '/api/socials/youtube/connect';
    } else if (platform === 'instagram') {
      window.location.href = '/api/socials/instagram/connect';
    } else if (platform === 'facebook') {
      window.location.href = '/api/socials/facebook/connect';
    } else if (platform === 'twitter') {
      window.location.href = '/api/socials/twitter/connect';
    } else {
      alert(`${platform} integration is coming soon!`);
    }
  };

  const handleDisconnect = async (platform: string, accountId?: string) => {
    if (!accountId) {
      if (!confirm(`Are you sure you want to disconnect ALL your ${platform} accounts?`)) return;
    } else {
      if (!confirm(`Are you sure you want to disconnect this account?`)) return;
    }
    
    try {
      const res = await fetch(`/api/socials/${platform}/disconnect`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountId ? { accountId } : {})
      });
      const data = await res.json();
      if (data.success) {
        if (accountId) {
          setAccounts(prev => prev.filter(a => a.id !== accountId));
        } else {
          setAccounts(prev => prev.filter(a => a.platform !== platform));
        }
      } else {
        alert('Failed to disconnect: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to disconnect. Please try again.');
    }
  };

  const toggleConnection = (platform: string, isConnected: boolean) => {
    if (!isConnected) {
      // Prompt to connect first
      handleConnect(platform);
      return;
    }
    setPausedIntegrations(prev => {
      const next = { ...prev, [platform]: !prev[platform] };
      localStorage.setItem('socials_paused_v2', JSON.stringify(next));
      return next;
    });
  };

  if (loadingAccounts) {
    return <div style={{ padding: 40, color: '#64748b' }}>Loading connected accounts...</div>;
  }

  const integrations = [
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Track posts & insights.',
      icon: <Instagram size={18} color="#E1306C" />,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      desc: 'Track reach & interactions.',
      icon: <TikTokIcon size={18} color="#000000" />,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      desc: 'Monitor views & growth.',
      icon: <Youtube size={18} color="#FF0000" />,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      desc: 'Measure page engagement.',
      icon: <Facebook size={18} color="#1877F2" />,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      desc: 'Track reach & interactions.',
      icon: <Twitter size={18} color="#000000" />,
    }
  ];

  return (
    <div style={{ 
      padding: '0px 40px 40px 40px',
      marginTop: '-16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: '100%',
      minHeight: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '32px',
      animation: 'fadeIn 0.5s ease-out',
      color: '#111'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .header-title {
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin: 0 0 4px 0;
        }
        .header-subtitle {
          color: #666;
          font-size: 15px;
          margin: 0 0 24px 0;
        }
        .divider {
          height: 1px;
          background: #eaeaea;
          margin-bottom: 24px;
          width: 100%;
        }
        .section-label {
          font-size: 16px;
          color: #333;
          margin-bottom: 16px;
          font-weight: 400;
        }
        .integration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .integration-card {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
        .unconnected-card:hover {
          border-color: #94a3b8;
        }
        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .platform-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .platform-name {
          font-weight: 500;
          font-size: 15px;
          color: #000;
        }
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: #e4e4e4;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .toggle-switch.active {
          background: #34c759;
        }
        .toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .toggle-switch.active .toggle-knob {
          transform: translateX(20px);
        }
        .card-desc {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .status-badge {
          background: #f4f4f4;
          color: #000;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 16px;
        }
        .settings-btn {
          color: #666;
          cursor: pointer;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .settings-btn:hover {
          color: #000;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 600;
        }
        .modal-close {
          cursor: pointer;
          color: #666;
          padding: 4px;
        }
        .modal-close:hover {
          color: #000;
        }
        .account-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .account-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .account-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #eee;
          object-fit: cover;
        }
        .account-name {
          font-weight: 500;
          font-size: 14px;
        }
        .disconnect-btn {
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          background: #fef2f2;
          transition: background 0.2s;
        }
        .disconnect-btn:hover {
          background: #fee2e2;
        }
        .add-account-btn {
          margin-top: 20px;
          width: 100%;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          color: #334155;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-account-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .top-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #0f172a;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .top-add-btn:hover {
          background: #334155;
        }
        .platform-select-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .platform-select-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
      `}</style>
      
      <div style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="header-title">Connect Social Account</h1>
            <p className="header-subtitle">Save time by linking your existing social account.</p>
          </div>
          <button className="top-add-btn" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} /> Add New Account
          </button>
        </div>
        
        <div className="divider" />
        
        <div className="section-label">Integration:</div>

        <div className="integration-grid">
          {integrations.map(int => {
            const connectedAccs = accounts.filter(a => a.platform === int.id);
            const hasAccount = connectedAccs.length > 0;
            const isConnected = hasAccount && !pausedIntegrations[int.id];
            
            let badgeText = 'Not Connected';
            if (hasAccount) {
              if (isConnected) {
                if (connectedAccs.length === 1) {
                  badgeText = connectedAccs[0].accountName || 'Connected';
                } else {
                  badgeText = `${connectedAccs.length} Accounts`;
                }
              } else {
                badgeText = 'Paused';
              }
            }

            return (
              <div 
                className={`integration-card ${!hasAccount ? 'unconnected-card' : ''}`}
                key={int.id}
                style={!hasAccount ? { cursor: 'pointer', transition: 'border-color 0.2s' } : {}}
                onClick={() => {
                  if (!hasAccount) {
                    handleConnect(int.id);
                  }
                }}
              >
                <div className="card-top">
                  <div className="platform-info">
                    {int.icon}
                    <span className="platform-name">{int.name}</span>
                  </div>
                  <div 
                    className={`toggle-switch ${isConnected ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleConnection(int.id, hasAccount);
                    }}
                  >
                    <div className="toggle-knob" />
                  </div>
                </div>
                
                <div className="card-desc">
                  {int.desc}
                </div>
                
                <div className="card-bottom">
                  <div className="status-badge" style={isConnected ? { background: '#e8f5e9', color: '#2e7d32' } : {}}>
                    {badgeText}
                  </div>
                  <div className="settings-btn" onClick={(e) => {
                    e.stopPropagation();
                    if (hasAccount) {
                      setModalState({ isOpen: true, platform: int.id });
                    } else {
                      handleConnect(int.id);
                    }
                  }}>
                    <Settings size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Modal */}
      {modalState.isOpen && modalState.platform && (
        <div className="modal-overlay" onClick={() => setModalState({ isOpen: false, platform: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                Manage {integrations.find(i => i.id === modalState.platform)?.name}
              </div>
              <div className="modal-close" onClick={() => setModalState({ isOpen: false, platform: null })}>
                <X size={20} />
              </div>
            </div>
            
            <div>
              {accounts.filter(a => a.platform === modalState.platform).map(acc => (
                <div className="account-item" key={acc.id}>
                  <div className="account-item-left">
                    {acc.accountAvatar ? (
                      <img src={acc.accountAvatar} className="account-avatar" alt="Avatar" />
                    ) : (
                      <div className="account-avatar" />
                    )}
                    <span className="account-name">{acc.accountName || 'Unknown'}</span>
                  </div>
                  <div className="disconnect-btn" onClick={() => {
                    handleDisconnect(modalState.platform!, acc.id);
                  }}>
                    Disconnect
                  </div>
                </div>
              ))}
            </div>

            <button className="add-account-btn" onClick={() => handleConnect(modalState.platform!)}>
              <Plus size={16} /> Add another account
            </button>
          </div>
        </div>
      )}

      {/* Add New Account Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <div className="modal-title">
                Connect New Account
              </div>
              <div className="modal-close" onClick={() => setAddModalOpen(false)}>
                <X size={20} />
              </div>
            </div>
            
            <div className="integration-grid">
              {integrations.map(int => (
                <div 
                  className="integration-card" 
                  key={int.id} 
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => {
                    setAddModalOpen(false);
                    handleConnect(int.id);
                  }}
                >
                  <div>
                    <div className="card-top" style={{ marginBottom: 0 }}>
                      <div className="platform-info">
                        {int.icon}
                        <span className="platform-name">{int.name}</span>
                      </div>
                    </div>
                    
                    <div className="card-desc" style={{ marginBottom: 0, marginTop: 4 }}>
                      {int.desc}
                    </div>
                  </div>

                  <div className="status-badge">
                    Connect
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
