"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Youtube, Instagram, ExternalLink } from 'lucide-react';

export default function SocialsPage() {
  const router = useRouter();
  
  // Connection states
  const [ytConnected, setYtConnected] = useState(false);
  const [ytChannel, setYtChannel] = useState({ name: '', subs: '', views: '', avatar: '' });
  
  const [igConnected, setIgConnected] = useState(false);
  const [igAccount, setIgAccount] = useState({ handle: '', followers: '', posts: '', avatar: '' });

  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Persist connection state — fetch from API
  useEffect(() => {
    try {
      const cached = localStorage.getItem('socials_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.yt) {
          setYtConnected(true);
          setYtChannel(parsed.yt);
        }
        if (parsed.ig) {
          setIgConnected(true);
          setIgAccount(parsed.ig);
        }
        setLoadingAccounts(false);
      }
    } catch(e) {}

    async function fetchConnectedAccounts() {
      try {
        const res = await fetch('/api/socials/accounts');
        const data = await res.json();
        if (data.success && data.accounts) {
          let ytData = null;
          let igData = null;

          for (const acc of data.accounts) {
            if (acc.platform === 'youtube') {
              setYtConnected(true);
              const meta = acc.metadata || {};
              ytData = {
                name: acc.accountName,
                subs: `${Number(meta.subscribers || 0).toLocaleString()} subscribers`,
                views: `${Number(meta.views || 0).toLocaleString()} lifetime views`,
                avatar: acc.accountAvatar || ''
              };
              setYtChannel(ytData);
            }
            if (acc.platform === 'instagram') {
              setIgConnected(true);
              const meta = acc.metadata || {};
              igData = {
                handle: acc.accountName,
                followers: `${Number(meta.followers || 0).toLocaleString()} followers`,
                posts: `${Number(meta.posts || 0).toLocaleString()} posts`,
                avatar: acc.accountAvatar || ''
              };
              setIgAccount(igData);
            }
          }
          localStorage.setItem('socials_cache', JSON.stringify({ yt: ytData, ig: igData }));
        }
      } catch (err) {
        console.error('Failed to fetch social accounts:', err);
      } finally {
        setLoadingAccounts(false);
      }
    }
    fetchConnectedAccounts();
  }, []);

  const handleConnect = (platform: 'youtube' | 'instagram') => {
    if (platform === 'youtube') {
      window.location.href = '/api/socials/youtube/connect';
    } else if (platform === 'instagram') {
      window.location.href = '/api/socials/instagram/connect';
    }
  };

  const handleDisconnect = async (platform: 'youtube' | 'instagram') => {
    if (!confirm(`Are you sure you want to disconnect your ${platform === 'youtube' ? 'YouTube' : 'Instagram'} account?`)) return;
    
    try {
      const res = await fetch(`/api/socials/${platform}/disconnect`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (platform === 'youtube') {
          setYtConnected(false);
          setYtChannel({ name: '', subs: '', views: '', avatar: '' });
        } else {
          setIgConnected(false);
          setIgAccount({ handle: '', followers: '', posts: '', avatar: '' });
        }
      } else {
        alert('Failed to disconnect: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to disconnect. Please try again.');
    }
  };

  if (loadingAccounts) {
    return <div style={{ padding: 40, color: '#64748b' }}>Loading connected accounts...</div>;
  }

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
        .soc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
          margin-top: 32px;
        }
        .soc-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 12px 40px -12px rgba(0,0,0,0.05);
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .soc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -12px rgba(0,0,0,0.1);
          border-color: rgba(226, 232, 240, 1);
        }
        .soc-platform-bg {
          position: absolute;
          right: -24px;
          bottom: -24px;
          color: #f1f5f9;
          opacity: 0.6;
          z-index: 0;
          pointer-events: none;
          transition: all 0.4s ease;
        }
        .soc-card:hover .soc-platform-bg {
          transform: scale(1.1) rotate(-5deg);
        }
        .soc-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .soc-platform-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: -0.02em;
        }
        .soc-platform-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .soc-platform-icon.youtube {
          background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        }
        .soc-platform-icon.instagram {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }
        .soc-status-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .soc-status-badge.connected {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }
        .soc-status-badge.disconnected {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        .soc-card-body {
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
        }
        .soc-channel-info {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          transition: background 0.3s ease;
        }
        .soc-channel-info:hover {
          background: #f1f5f9;
        }
        .soc-channel-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          background: #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .soc-metric-row {
          display: flex;
          gap: 20px;
          margin-top: 8px;
        }
        .soc-metric-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .soc-metric-val {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }
        .soc-metric-lbl {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .soc-btn-connect {
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: #0f172a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        .soc-btn-connect:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2);
        }
        .soc-btn-connect.connected {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
          box-shadow: none;
        }
        .soc-btn-connect.connected:hover {
          background: #f1f5f9;
          color: #ef4444;
          border-color: #ef4444;
        }
        .soc-btn-connect.outline {
          background: transparent;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          box-shadow: none;
        }
        .soc-btn-connect.outline:hover {
          background: #f8fafc;
          border-color: #0f172a;
        }
      `}</style>
      
      <div style={{ paddingTop: 32, marginBottom: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>Connect Socials</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 15 }}>Link your accounts to enable automated publishing and metrics tracking.</p>
      </div>

      <div className="soc-grid">
        {/* YouTube Card */}
        <div className="soc-card">
          <div className="soc-platform-bg"><Youtube size={120} /></div>
          <div className="soc-card-header">
            <div className="soc-platform-title">
              <div className="soc-platform-icon youtube"><Youtube size={20} /></div>
              YouTube Integration
            </div>
            <span className={`soc-status-badge ${ytConnected ? 'connected' : 'disconnected'}`}>
              {ytConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="soc-card-body" style={{ flex: 1 }}>
            {ytConnected ? (
              <div className="soc-channel-info">
                <div className="soc-channel-avatar" style={{ background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>
                  {ytChannel.name ? ytChannel.name.charAt(0) : '?'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{ytChannel.name}</div>
                  <div className="soc-metric-row">
                    <div className="soc-metric-item">
                      <span className="soc-metric-val">{ytChannel.subs ? ytChannel.subs.split(' ')[0] : '0'}</span>
                      <span className="soc-metric-lbl">Subs</span>
                    </div>
                    <div className="soc-metric-item">
                      <span className="soc-metric-val">{ytChannel.views ? ytChannel.views.split(' ')[0] : '0'}</span>
                      <span className="soc-metric-lbl">Views</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Connect your YouTube channel to post shorts directly to your feed. Enables scheduled posts, automated description updates, and tags.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button 
              className={`soc-btn-connect ${ytConnected ? 'connected' : ''}`}
              onClick={() => ytConnected ? handleDisconnect('youtube') : handleConnect('youtube')}
              style={{ flex: 1 }}
            >
              {ytConnected ? 'Disconnect' : 'Connect YouTube Channel'}
            </button>
            {ytConnected && (
              <button 
                onClick={() => window.open('https://youtube.com', '_blank')}
                className="soc-btn-connect outline"
                style={{ flex: 1 }}
              >
                View Channel <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Instagram Card */}
        <div className="soc-card">
          <div className="soc-platform-bg"><Instagram size={120} /></div>
          <div className="soc-card-header">
            <div className="soc-platform-title">
              <div className="soc-platform-icon instagram"><Instagram size={20} /></div>
              Instagram Business
            </div>
            <span className={`soc-status-badge ${igConnected ? 'connected' : 'disconnected'}`}>
              {igConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="soc-card-body" style={{ flex: 1 }}>
            {igConnected ? (
              <div className="soc-channel-info">
                <div className="soc-channel-avatar" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>
                  {igAccount.handle ? (igAccount.handle.startsWith('@') ? igAccount.handle.charAt(1).toUpperCase() : igAccount.handle.charAt(0).toUpperCase()) : '?'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{igAccount.handle}</div>
                  <div className="soc-metric-row">
                    <div className="soc-metric-item">
                      <span className="soc-metric-val">{igAccount.followers ? igAccount.followers.split(' ')[0] : '0'}</span>
                      <span className="soc-metric-lbl">Followers</span>
                    </div>
                    <div className="soc-metric-item">
                      <span className="soc-metric-val">{igAccount.posts ? igAccount.posts.split(' ')[0] : '0'}</span>
                      <span className="soc-metric-lbl">Posts</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Link your Instagram Business profile via Facebook. Once linked, you can upload reels, schedule posts, and configure automatic hashtag captions.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button 
              className={`soc-btn-connect ${igConnected ? 'connected' : ''}`}
              onClick={() => igConnected ? handleDisconnect('instagram') : handleConnect('instagram')}
              style={{ flex: 1 }}
            >
              {igConnected ? 'Disconnect' : 'Connect Instagram Profile'}
            </button>
            {igConnected && (
              <button 
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="soc-btn-connect outline"
                style={{ flex: 1 }}
              >
                View Profile <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
