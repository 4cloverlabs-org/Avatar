"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Youtube, Users, Eye, Clock, BarChart2, 
  ExternalLink, Play, ChevronRight, X, Heart, MessageSquare, Info
} from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  views: string;
  likes: string;
  comments: string;
  ctr: string;
  date: string;
  duration: string;
  avgWatch: string;
}

export default function YouTubeChannelPage() {
  const router = useRouter();
  
  // Video list state
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([
    { id: 'yt-1', title: 'AI Talking Face Demo', views: '124,520', likes: '8,420', comments: '412', ctr: '9.2%', date: '2026-08-24', duration: '0:15', avgWatch: '94%' },
    { id: 'yt-2', title: 'Q3 Product Teaser', views: '85,210', likes: '5,210', comments: '286', ctr: '8.6%', date: '2026-08-23', duration: '0:30', avgWatch: '82%' },
    { id: 'yt-3', title: 'Customer Agent Walkthrough', views: '30,850', likes: '1,850', comments: '105', ctr: '7.4%', date: '2026-08-21', duration: '0:45', avgWatch: '76%' },
    { id: 'yt-4', title: 'Personalized Outreach Reel', views: '12,410', likes: '940', comments: '34', ctr: '6.8%', date: '2026-08-18', duration: '0:12', avgWatch: '98%' }
  ]);

  // Selected video for detail drawer
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  return (
    <div className="home-content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* BACK NAVIGATION */}
        <button onClick={() => router.push('/socials')} className="soc-back-btn">
          <ArrowLeft size={14} /> Back to Socials
        </button>

        {/* CHANNEL PROFILE HEADER */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Youtube size={36} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px 0' }}>Workspace Avatar AI Creator</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
                Connected channel for bulk video syndication
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--panel-border)', padding: '8px 16px', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>SUBSCRIBERS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>14,820</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid var(--panel-border)', padding: '8px 16px', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>UPLOADS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>32 videos</div>
            </div>
          </div>
        </div>

        {/* ANALYTICS HIGHLIGHTS */}
        <div className="soc-stats-summary">
          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#eff6ff' }}>
              <Eye size={22} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL VIEWS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>240.5K</div>
            </div>
          </div>

          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#ecfdf5' }}>
              <Users size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>NEW SUBS (30D)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>+1.8K</div>
            </div>
          </div>

          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#fffbeb' }}>
              <Clock size={22} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>WATCH HOURS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>42.8K</div>
            </div>
          </div>

          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#fdf2f8' }}>
              <BarChart2 size={22} color="#ec4899" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>AVG CTR</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>8.4%</div>
            </div>
          </div>
        </div>

        {/* SUBSCRIBER GROWTH CHART */}
        <div className="soc-chart-card">
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Subscriber Growth Trend (Last 30 Days)</h3>
          <div style={{ height: 180, width: '100%', position: 'relative', marginTop: 10 }}>
            {/* SVG line chart */}
            <svg width="100%" height="100%" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff0000" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ff0000" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="45" x2="600" y2="45" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="135" x2="600" y2="135" stroke="#f1f5f9" strokeWidth="1" />
              {/* Fill Area */}
              <path d="M 0 150 Q 100 130 200 110 T 400 80 T 600 30 L 600 180 L 0 180 Z" fill="url(#gradient)" />
              {/* Draw Trend Line */}
              <path d="M 0 150 Q 100 130 200 110 T 400 80 T 600 30" fill="none" stroke="#ff0000" strokeWidth="3" />
              {/* Nodes */}
              <circle cx="200" cy="110" r="5" fill="#ff0000" stroke="#ffffff" strokeWidth="2" />
              <circle cx="400" cy="80" r="5" fill="#ff0000" stroke="#ffffff" strokeWidth="2" />
              <circle cx="600" cy="30" r="5" fill="#ff0000" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              <span>Aug 01</span>
              <span>Aug 10</span>
              <span>Aug 20</span>
              <span>Today (Aug 25)</span>
            </div>
          </div>
        </div>

        {/* VIDEOS FEED TABLE */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Published Videos Feed</h3>
          
          <div className="pers-table-wrapper">
            <table className="pers-table">
              <thead>
                <tr>
                  <th>Video Title</th>
                  <th>Publish Date</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>CTR</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Analytics Details</th>
                </tr>
              </thead>
              <tbody>
                {youtubeVideos.map(video => (
                  <tr key={video.id}>
                    <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 4, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={12} color="#fff" fill="#fff" />
                      </div>
                      {video.title}
                    </td>
                    <td>{video.date}</td>
                    <td style={{ fontWeight: 700 }}>{video.views}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Heart size={12} color="#ef4444" fill="#ef4444" /> {video.likes}
                      </span>
                    </td>
                    <td>{video.ctr}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => setSelectedVideo(video)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          margin: '0 auto'
                        }}
                      >
                        Inspect <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SLIDE-OUT VIDEO ANALYTICS DRAWER */}
      {selectedVideo && (
        <>
          <div className="yt-video-drawer-backdrop" onClick={() => setSelectedVideo(null)} />
          <div className={`yt-video-drawer ${selectedVideo ? 'open' : ''}`}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: 15 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Video Insights</h3>
              <button 
                onClick={() => setSelectedVideo(null)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
              <div style={{ background: '#000', borderRadius: 8, aspectRatio: '16/9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={32} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />
              </div>

              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px 0', color: 'var(--foreground)' }}>{selectedVideo.title}</h4>
                <span style={{ fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                  Short ({selectedVideo.duration})
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid var(--panel-border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>VIEWS</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginTop: 2 }}>{selectedVideo.views}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid var(--panel-border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>ENGAGEMENT (LIKES)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', marginTop: 2 }}>{selectedVideo.likes}</div>
                </div>
              </div>

              {/* Retention Panel */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={14} color="#3b82f6" /> Audience Retention
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#1d4ed8', flexShrink: 0 }}>
                    {selectedVideo.avgWatch}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>Average percentage viewed</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>High completion rate; video matches viewer intent.</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#475569', background: '#ffffff', padding: 8, borderRadius: 4, border: '1px solid #e2e8f0', borderLeft: '3px solid #10b981' }}>
                  Audience retention is <strong>above average</strong> compared to similar duration shorts.
                </div>
              </div>

              {/* Meta stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, borderTop: '1px solid var(--panel-border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Publish date:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVideo.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Impressions CTR:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVideo.ctr}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Comments count:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVideo.comments} comments</span>
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}
