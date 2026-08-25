"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Share2, Youtube, Instagram, Upload, CheckCircle, RefreshCw, 
  Play, ExternalLink, AlertTriangle, Link as LinkIcon, Trash, Info, Lock
} from 'lucide-react';

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

  // Persist connection state
  useEffect(() => {
    const yt = localStorage.getItem('yt_connected') === 'true';
    const ig = localStorage.getItem('ig_connected') === 'true';
    if (yt) {
      setYtConnected(true);
      setYtChannel({
        name: 'Workspace Avatar AI Creator',
        subs: '14.8K subscribers',
        views: '240.5K lifetime views',
        avatar: '/youtube-avatar'
      });
    }
    if (ig) {
      setIgConnected(true);
      setIgAccount({
        handle: '@workspace_avatar_ai',
        followers: '8,420 followers',
        posts: '86 posts',
        avatar: '/instagram-avatar'
      });
    }
  }, []);

  // Publishing form state
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platformType, setPlatformType] = useState<'youtube' | 'instagram' | 'both'>('youtube');
  
  // Publishing progress states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStep, setPublishStep] = useState('');
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

  // Load videos on mount
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (data.success && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          setSelectedVideoFile(data.videos[0].filename);
        } else {
          // Fallback static videos
          const fallback = [
            { id: 1, filename: 'personalized_outreach_25fps.mp4', title: 'Personalized Outreach', edited: '2h ago', sizeBytes: 1548000 },
            { id: 2, filename: 'demo_avatar_result.mp4', title: 'Demo Avatar Result', edited: '1d ago', sizeBytes: 2420000 }
          ];
          setVideos(fallback);
          setSelectedVideoFile(fallback[0].filename);
        }
      } catch (err) {
        console.error("Failed to fetch videos from API, using fallback:", err);
        const fallback = [
          { id: 1, filename: 'personalized_outreach_25fps.mp4', title: 'Personalized Outreach', edited: '2h ago', sizeBytes: 1548000 }
        ];
        setVideos(fallback);
        setSelectedVideoFile(fallback[0].filename);
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideos();
  }, []);

  // Connect Simulation
  const handleConnect = (platform: 'youtube' | 'instagram') => {
    setAuthModal(platform);
    setModalLoading(false);
  };

  const handleDisconnect = (platform: 'youtube' | 'instagram') => {
    if (confirm(`Are you sure you want to disconnect your ${platform === 'youtube' ? 'YouTube' : 'Instagram'} account?`)) {
      if (platform === 'youtube') {
        localStorage.setItem('yt_connected', 'false');
        setYtConnected(false);
        setYtChannel({ name: '', subs: '', views: '', avatar: '' });
      } else {
        localStorage.setItem('ig_connected', 'false');
        setIgConnected(false);
        setIgAccount({ handle: '', followers: '', posts: '', avatar: '' });
      }
    }
  };

  const submitAuth = async () => {
    setModalLoading(true);
    // Simulate OAuth handshake
    await new Promise(resolve => setTimeout(resolve, 1800));

    if (authModal === 'youtube') {
      localStorage.setItem('yt_connected', 'true');
      setYtConnected(true);
      setYtChannel({
        name: 'Workspace Avatar AI Creator',
        subs: '14.8K subscribers',
        views: '240.5K lifetime views',
        avatar: '/youtube-avatar' // Staged image fallback
      });
    } else if (authModal === 'instagram') {
      localStorage.setItem('ig_connected', 'true');
      setIgConnected(true);
      setIgAccount({
        handle: '@workspace_avatar_ai',
        followers: '8,420 followers',
        posts: '86 posts',
        avatar: '/instagram-avatar'
      });
    }
    
    setModalLoading(false);
    setAuthModal(null);
  };

  // Publish video simulation
  const handlePublish = async () => {
    if (!ytConnected && platformType === 'youtube') {
      alert("Please connect your YouTube account first.");
      return;
    }
    if (!igConnected && platformType === 'instagram') {
      alert("Please connect your Instagram account first.");
      return;
    }
    if (platformType === 'both' && (!ytConnected || !igConnected)) {
      alert("Please connect both YouTube and Instagram accounts to publish to both.");
      return;
    }
    if (!selectedVideoFile) {
      alert("Please select a video to upload.");
      return;
    }
    if (!title && platformType !== 'instagram') {
      alert("Please enter a video title for YouTube.");
      return;
    }

    setIsPublishing(true);
    setPublishProgress(0);
    setPublishStep('Preparing video file for export...');

    // Progress bar milestones
    const steps = [
      { prg: 20, txt: 'Initializing API connections and setting metadata...' },
      { prg: 50, txt: 'Uploading video payload to server (CDN cache)...' },
      { prg: 80, txt: 'Processing video compression and stabilization...' },
      { prg: 95, txt: 'Submitting metadata and publishing post live...' },
      { prg: 100, txt: 'Video published successfully!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setPublishProgress(step.prg);
      setPublishStep(step.txt);
    }

    // Add to publications history
    const newPubs: Publication[] = [];
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const videoTitle = videos.find(v => v.filename === selectedVideoFile)?.title || 'Custom Video';

    if (platformType === 'youtube' || platformType === 'both') {
      newPubs.push({
        id: `pub-yt-${Date.now()}`,
        title: title || videoTitle,
        platform: 'youtube',
        account: ytChannel.name || 'Workspace Creator',
        date: dateStr,
        status: 'Live',
        link: 'https://youtube.com/shorts/simulated_upload'
      });
    }

    if (platformType === 'instagram' || platformType === 'both') {
      newPubs.push({
        id: `pub-ig-${Date.now()}`,
        title: caption.substring(0, 30) || videoTitle,
        platform: 'instagram',
        account: igAccount.handle || '@workspace_creator',
        date: dateStr,
        status: 'Live',
        link: 'https://instagram.com/reel/simulated_upload'
      });
    }

    setPublications(prev => [...newPubs, ...prev]);
    setIsPublishing(false);
    setTitle('');
    setCaption('');
  };

  return (
    <div className="home-content">
      <div className="soc-container">
        
        {/* HEADER */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Share2 size={24} color="var(--accent)" /> Social Integrations & Publishing
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Connect your channels and publish your generated avatar videos directly to YouTube Shorts and Instagram Reels.
          </p>
        </div>

        {/* STEP 1: CHANNELS */}
        <div className="soc-grid">
          
          {/* YOUTUBE CARD */}
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

          {/* INSTAGRAM CARD */}
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

        </div>

        {/* STEP 2: PUBLISHER WORKSPACE */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={18} color="var(--accent)" /> Cross-Platform Video Publisher
          </h2>

          <div className="soc-publisher-layout">
            
            {/* Publisher Form fields */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Video selector */}
                <div className="soc-field-group">
                  <label>Select Generated Video</label>
                  {loadingVideos ? (
                    <div style={{ padding: '10px 14px', border: '1px solid var(--panel-border)', borderRadius: 8, background: '#f8fafc', fontSize: 13, color: 'var(--text-muted)' }}>
                      Loading Library Videos...
                    </div>
                  ) : (
                    <select 
                      value={selectedVideoFile} 
                      onChange={(e) => setSelectedVideoFile(e.target.value)}
                      className="soc-select"
                    >
                      {videos.map(v => (
                        <option key={v.id} value={v.filename}>{v.title} ({v.filename})</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Platform select */}
                <div className="soc-field-group">
                  <label>Target Publication Platform</label>
                  <select 
                    value={platformType} 
                    onChange={(e) => setPlatformType(e.target.value as any)}
                    className="soc-select"
                  >
                    <option value="youtube">YouTube (Shorts)</option>
                    <option value="instagram">Instagram (Reels)</option>
                    <option value="both">Both (YouTube & Instagram)</option>
                  </select>
                </div>
              </div>

              {/* Title input - YouTube only */}
              {(platformType === 'youtube' || platformType === 'both') && (
                <div className="soc-field-group">
                  <label>Video Title (YouTube)</label>
                  <input 
                    type="text" 
                    placeholder="Enter short, engaging title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="soc-input"
                  />
                </div>
              )}

              {/* Caption text area */}
              <div className="soc-field-group">
                <label>{platformType === 'youtube' ? 'Video Description' : 'Post Caption / Hashtags'}</label>
                <textarea 
                  placeholder="Tell your audience about this video. Add hashtags for visibility (e.g. #AI #Outreach)..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="soc-textarea"
                />
              </div>

              {/* Publish triggers */}
              <button 
                onClick={handlePublish}
                disabled={isPublishing || (!ytConnected && !igConnected)}
                style={{
                  background: 'var(--accent)',
                  color: '#1E2119',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 24px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: (isPublishing || (!ytConnected && !igConnected)) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: (!ytConnected && !igConnected) ? 0.5 : 1
                }}
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="pers-anim-pulse" size={14} /> Publishing...
                  </>
                ) : (
                  <>
                    <Share2 size={14} /> Publish Video Now
                  </>
                )}
              </button>

              {/* Uploader progress box */}
              {isPublishing && (
                <div style={{ marginTop: 16, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid var(--panel-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw className="pers-anim-pulse" size={12} /> {publishStep}
                    </span>
                    <span>{publishProgress}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${publishProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Video preview pane */}
            <div style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Selected Video Preview</div>
              <div style={{ background: '#000000', borderRadius: 8, aspectRatio: '9/16', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Play size={40} color="#ffffff" fill="#ffffff" style={{ opacity: 0.8, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1 }}></div>
                {/* Simulated vertical canvas background */}
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 2, color: '#fff', fontSize: 11, background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: 4 }}>
                  <div style={{ fontWeight: 600 }}>{videos.find(v => v.filename === selectedVideoFile)?.title || 'Video Title'}</div>
                  <div style={{ opacity: 0.8, marginTop: 2, fontSize: 10 }}>{selectedVideoFile}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 3: PUBLICATIONS HISTORY */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkIcon size={18} color="var(--accent)" /> Recent Publications History
          </h2>
          
          <div className="pers-table-wrapper">
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
