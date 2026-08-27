"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Instagram, Heart, MessageSquare, Eye, Users, 
  BarChart2, X, ExternalLink, Play, Calendar, UserCheck, Upload
} from 'lucide-react';
import PublisherWidget from '../components/PublisherWidget';

interface InstagramPost {
  id: string;
  thumbnail: string;
  likes: string;
  comments: string;
  views: string;
  reach: string;
  engagement: string;
  caption: string;
  date: string;
}

export default function InstagramProfilePage() {
  const router = useRouter();
  
  // Instagram posts grid state
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([
    { 
      id: 'ig-1', 
      thumbnail: 'bg-1', 
      likes: '1.2K', 
      comments: '84', 
      views: '12.4K', 
      reach: '9,850', 
      engagement: '5.2%', 
      caption: '🚀 Our new personalized AI avatar outreach workflow is live! Check out the results.', 
      date: '2026-08-24' 
    },
    { 
      id: 'ig-2', 
      thumbnail: 'bg-2', 
      likes: '940', 
      comments: '62', 
      views: '8.5K', 
      reach: '6,420', 
      engagement: '4.7%', 
      caption: 'Why support teams are shifting to video-first customer success. 📹🤖 #CSM', 
      date: '2026-08-23' 
    },
    { 
      id: 'ig-3', 
      thumbnail: 'bg-3', 
      likes: '510', 
      comments: '38', 
      views: '4.8K', 
      reach: '3,860', 
      engagement: '4.2%', 
      caption: 'Behind the scenes: training the new voice cloning model. 🗣️💾 #AIVoices', 
      date: '2026-08-21' 
    },
    { 
      id: 'ig-4', 
      thumbnail: 'bg-4', 
      likes: '420', 
      comments: '24', 
      views: '3.9K', 
      reach: '2,940', 
      engagement: '3.9%', 
      caption: 'Save hours of video production. Prompt, generate, syndicates. 📈', 
      date: '2026-08-19' 
    },
    { 
      id: 'ig-5', 
      thumbnail: 'bg-5', 
      likes: '310', 
      comments: '18', 
      views: '2.8K', 
      reach: '2,150', 
      engagement: '3.6%', 
      caption: 'Talking avatars vs text emails. Which yields higher conversion rates? 📊', 
      date: '2026-08-16' 
    },
    { 
      id: 'ig-6', 
      thumbnail: 'bg-6', 
      likes: '280', 
      comments: '14', 
      views: '2.1K', 
      reach: '1,840', 
      engagement: '3.2%', 
      caption: 'Dynamic support ticketing with automatic video responses. 🎫⚡ #Helpdesk', 
      date: '2026-08-13' 
    }
  ]);

  // Selected post for modal detail dialog
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  return (
    <div className="home-content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* TOP NAVIGATION */}
        <div>
          <button onClick={() => router.push('/socials')} className="soc-back-btn">
            <ArrowLeft size={14} /> Back to Socials
          </button>
        </div>

        {/* INSTAGRAM PROFILE SUMMARY BANNER */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
            
            {/* LARGE AVATAR RING */}
            <div className="ig-avatar-large">
              <div className="ig-avatar-large-inner">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63685A' }}>
                  <Instagram size={40} />
                </div>
              </div>
            </div>

            {/* PROFILE META STATS */}
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>@workspace_avatar_ai</h1>
                <div style={{ background: '#f1f5f9', color: '#475569', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <UserCheck size={12} /> BUSINESS
                </div>
              </div>

              {/* FOLLOWER STATS GRID */}
              <div style={{ display: 'flex', gap: 40, fontSize: 14 }}>
                <div><strong style={{ color: 'var(--foreground)' }}>86</strong> posts</div>
                <div><strong style={{ color: 'var(--foreground)' }}>8,420</strong> followers</div>
                <div><strong style={{ color: 'var(--foreground)' }}>142</strong> following</div>
              </div>

              {/* BIO DETAILS */}
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>Workspace Avatar AI</div>
                <div style={{ color: 'var(--text-muted)' }}>🤖 AI-generated talking head avatars for outreach campaigns.</div>
                <div style={{ color: 'var(--text-muted)' }}>📈 Generate dynamic Reels, scale outreach, boost conversions.</div>
                <a href="https://workspace-avatar-ai.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  workspace-avatar-ai.com <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* METRICS INSIGHTS ROW */}
        <div className="soc-stats-summary">
          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#fdf2f8' }}>
              <Instagram size={22} color="#db2777" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL IMPRESSIONS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>342.8K</div>
            </div>
          </div>

          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#eff6ff' }}>
              <Eye size={22} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>REACH (30D)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>124.5K</div>
            </div>
          </div>

          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#ecfdf5' }}>
              <BarChart2 size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>ENGAGEMENT RATE</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>4.8%</div>
            </div>
          </div>

          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#fffbeb' }}>
              <Users size={22} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>PROFILE VISITS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>18.4K</div>
            </div>
          </div>
        </div>

        {/* PUBLISHER WIDGET */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Instagram size={18} color="var(--accent)" /> Instagram Publisher
          </h2>
          <PublisherWidget 
            lockedPlatform="instagram" 
            ytConnected={false} 
            igConnected={true}
            onPublishSuccess={(pub) => {
              // Optionally handle new publications here
              alert("Reel published successfully!");
            }}
          />
        </div>

        {/* INSIGHTS GRID OF POSTS */}
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Published Reels & Posts</h3>
          
          <div className="ig-grid">
            {instagramPosts.map(post => (
              <div key={post.id} className="ig-grid-item" onClick={() => setSelectedPost(post)}>
                <div style={{ height: '100%', width: '100%', background: '#e2dcc9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63685A' }}>
                  <Play size={24} fill="#63685A" />
                </div>
                {/* Hover overlay with engagement */}
                <div className="ig-grid-overlay">
                  <div className="ig-metric">
                    <Heart size={16} fill="#fff" /> {post.likes}
                  </div>
                  <div className="ig-metric">
                    <MessageSquare size={16} fill="#fff" /> {post.comments}
                  </div>
                  <div className="ig-metric">
                    <Eye size={16} /> {post.views}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POST DETAILS DIALOG MODAL */}
      {selectedPost && (
        <div className="soc-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="soc-modal" style={{ maxWidth: 640, padding: 0, overflow: 'hidden', flexDirection: 'row' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Left side: Post visual mock */}
            <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 380 }}>
              <Play size={40} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 6, color: '#fff', fontSize: 12 }}>
                {selectedPost.caption}
              </div>
            </div>

            {/* Right side: Stats */}
            <div style={{ width: 280, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>Reel Analytics</div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Stats details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Likes count</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={12} fill="#ef4444" color="#ef4444" /> {selectedPost.likes}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Comments</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MessageSquare size={12} fill="#cbd5e1" color="#475569" /> {selectedPost.comments}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total reach</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)' }}>{selectedPost.reach} accounts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Engagement rate</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)' }}>{selectedPost.engagement}</span>
                </div>
              </div>

              {/* Publish details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--text-muted)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} /> Published on {selectedPost.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Users size={12} /> 94% of audience were non-followers
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
