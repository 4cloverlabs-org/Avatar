"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Share2, Youtube, Instagram, Upload, CheckCircle, RefreshCw, 
  Play, ExternalLink, AlertTriangle, Link as LinkIcon, Trash, Info, Lock
} from 'lucide-react';
import PublisherWidget from './components/PublisherWidget';

interface VideoFile {
  id: number;
  filename: string;
  title: string;
  edited: string;
  sizeBytes: number;
}

interface Publication {
  id: string;
  title: string;
  platform: 'youtube' | 'instagram';
  account: string;
  date: string;
  status: 'Live' | 'Scheduled' | 'Failed';
  link: string;
}

export default function SocialsPage() {
  const router = useRouter();
  // Connection states
  const [ytConnected, setYtConnected] = useState(false);
  const [ytChannel, setYtChannel] = useState({ name: '', subs: '', views: '', avatar: '' });
  
  const [igConnected, setIgConnected] = useState(false);
  const [igAccount, setIgAccount] = useState({ handle: '', followers: '', posts: '', avatar: '' });

  // Modal control
  const [authModal, setAuthModal] = useState<'youtube' | 'instagram' | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Videos from workspace library
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideoFile, setSelectedVideoFile] = useState<string>('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Persist connection state — fetch from API
  useEffect(() => {
    // 1. Try to load from cache instantly
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

    // 2. Fetch fresh from server
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
          // Update cache
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

  const [activeTab, setActiveTab] = useState<'cross-platform' | 'youtube' | 'instagram'>('cross-platform');
  
  const searchParams = useSearchParams();
  const platformQuery = searchParams?.get('platform');
  
  useEffect(() => {
    if (platformQuery === 'youtube') {
      setActiveTab('cross-platform');
    } else if (platformQuery === 'instagram') {
      setActiveTab('cross-platform');
    }
  }, [platformQuery]);
  
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: 'pub-1',
      title: 'AI Talking Face Demo',
      platform: 'youtube',
      account: 'Avatar Studio AI',
      date: '2026-08-24 18:30',
      status: 'Live',
      link: 'https://youtube.com/shorts/demo1'
    },
    {
      id: 'pub-2',
      title: 'Q3 Product Teaser',
      platform: 'instagram',
      account: '@avatar_studio_ai',
      date: '2026-08-23 14:15',
      status: 'Live',
      link: 'https://instagram.com/reel/demo2'
    }
  ]);

  // Connect — redirect to real OAuth
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

  const submitAuth = async () => {
    // This is only used for Instagram (simulated for now)
    setModalLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setModalLoading(false);
    setAuthModal(null);
  };



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
      `}</style>
      <div className="soc-container">
        
        
        <div className="soc-page-layout">
          {/* INTERNAL SIDEBAR */}
          <div className="soc-internal-sidebar">
            <div 
              className={`soc-sidebar-item ${activeTab === 'cross-platform' ? 'active' : ''}`}
              onClick={() => setActiveTab('cross-platform')}
            >
              <Share2 size={18} /> Cross Platform
            </div>

            <div className="soc-sidebar-section-title">Platforms</div>
            
            <div 
              className={`soc-sidebar-item ${activeTab === 'youtube' ? 'active' : ''}`}
              onClick={() => setActiveTab('youtube')}
            >
              <Youtube size={18} /> YouTube
            </div>
            
            <div 
              className={`soc-sidebar-item ${activeTab === 'instagram' ? 'active' : ''}`}
              onClick={() => setActiveTab('instagram')}
            >
              <Instagram size={18} /> Instagram
            </div>
          </div>

          <div className="soc-main-content">
            {activeTab === 'youtube' && (
              loadingAccounts ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
              ) : (<>
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
                    {ytChannel.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{ytChannel.name}</div>
                    <div className="soc-metric-row">
                      <div className="soc-metric-item">
                        <span className="soc-metric-val">{ytChannel.subs.split(' ')[0]}</span>
                        <span className="soc-metric-lbl">Subs</span>
                      </div>
                      <div className="soc-metric-item">
                        <span className="soc-metric-val">{ytChannel.views.split(' ')[0]}</span>
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
                    onClick={() => router.push('/socials/youtube')}
                    className="soc-btn-connect"
                    style={{ flex: 1, borderColor: 'var(--accent)', color: 'var(--accent)', background: 'transparent' }}
                  >
                    View Channel <ExternalLink size={14} />
                  </button>
              )}
            </div>
          </div>
          
          {ytConnected && (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Youtube size={18} color="var(--accent)" /> YouTube Publisher
              </h2>
              <PublisherWidget 
                lockedPlatform="youtube" 
                ytConnected={ytConnected} 
                igConnected={igConnected} 
                onPublishSuccess={(pub) => setPublications(prev => [pub, ...prev])} 
              />
            </div>
          )}
              </>)
            )}

            {activeTab === 'instagram' && (
              loadingAccounts ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
              ) : (<>
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
                    {igAccount.handle.charAt(1).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{igAccount.handle}</div>
                    <div className="soc-metric-row">
                      <div className="soc-metric-item">
                        <span className="soc-metric-val">{igAccount.followers.split(' ')[0]}</span>
                        <span className="soc-metric-lbl">Followers</span>
                      </div>
                      <div className="soc-metric-item">
                        <span className="soc-metric-val">{igAccount.posts.split(' ')[0]}</span>
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
                    onClick={() => router.push('/socials/instagram')}
                    className="soc-btn-connect"
                    style={{ flex: 1, borderColor: 'var(--accent)', color: 'var(--accent)', background: 'transparent' }}
                  >
                    View Profile <ExternalLink size={14} />
                  </button>
              )}
            </div>
          </div>
          
          {igConnected && (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Instagram size={18} color="var(--accent)" /> Instagram Publisher
              </h2>
              <PublisherWidget 
                lockedPlatform="instagram" 
                ytConnected={ytConnected} 
                igConnected={igConnected} 
                onPublishSuccess={(pub) => setPublications(prev => [pub, ...prev])} 
              />
            </div>
          )}
              </>)
            )}

            {activeTab === 'cross-platform' && (
              <>
                {/* STEP 2: PUBLISHER WORKSPACE */}
                <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={18} color="var(--accent)" /> Cross-Platform Video Publisher
          </h2>

          <PublisherWidget 
            initialPlatform={platformQuery as any}
            ytConnected={ytConnected} 
            igConnected={igConnected} 
            onPublishSuccess={(pub) => setPublications(prev => [pub, ...prev])} 
          />
        </div>

        {/* STEP 3: PUBLICATIONS HISTORY */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkIcon size={18} color="var(--accent)" /> Recent Publications History
          </h2>
          
          <div className="pers-table-wrapper" style={{ border: '1px solid var(--panel-border)', borderRadius: 8, overflow: 'hidden' }}>
            <table className="pers-table">
              <thead>
                <tr>
                  <th>Post Name</th>
                  <th>Destination Channel</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Live Link</th>
                </tr>
              </thead>
              <tbody>
                {publications.map(pub => (
                  <tr key={pub.id}>
                    <td style={{ fontWeight: 600 }}>{pub.title}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {pub.platform === 'youtube' ? (
                          <Youtube size={14} color="#ff0000" />
                        ) : (
                          <Instagram size={14} color="#d6249f" />
                        )}
                        <span style={{ fontSize: 12 }}>{pub.account}</span>
                      </div>
                    </td>
                    <td>{pub.date}</td>
                    <td>
                      <span className="pers-badge success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={10} /> {pub.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a 
                        href={pub.link} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          fontSize: 12,
                          color: 'var(--accent)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4
                        }}
                      >
                        Open Post <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
              </>
            )}
          </div>
        </div>

        {/* OAUTH SIMULATED MODAL */}
        {authModal && (
          <div className="soc-modal-overlay">
            <div className="soc-modal">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Lock size={20} color="var(--accent)" /> Authorize Connection
              </h3>
              
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Workspace App is requesting permission to access your {authModal === 'youtube' ? 'YouTube channel' : 'Instagram page insights and publishing feeds'}.
              </p>

              {modalLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0' }}>
                  <RefreshCw className="pers-anim-pulse" size={32} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Connecting to platform API...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                  {authModal === 'youtube' ? (
                    <button onClick={submitAuth} className="soc-platform-auth-btn google">
                      <Youtube size={16} /> Sign in with Google Auth
                    </button>
                  ) : (
                    <button onClick={submitAuth} className="soc-platform-auth-btn facebook">
                      <Instagram size={16} /> Connect Facebook Page Manager
                    </button>
                  )}
                  <button 
                    onClick={() => setAuthModal(null)}
                    style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel Connection
                  </button>
                </div>
              )}

              <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>
                Secure OAuth connection via workspace services.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
