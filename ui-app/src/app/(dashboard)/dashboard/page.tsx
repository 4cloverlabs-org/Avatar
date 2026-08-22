"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, LayoutGrid, List, Play, MoreVertical } from 'lucide-react';

export default function HomeDashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="home-content">
      <div className="home-hero-title">Hey Kontham, what's your next move?</div>
      <div className="home-hero-actions">
        <button className="home-pill primary" onClick={() => router.push('/studio')}>
          <Plus size={14} /> Create video
        </button>
      </div>

      <div className="home-big-cards">
        <div className="home-big-card" onClick={() => router.push('/studio')}>
          <div style={{ width: 40, height: 40, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Plus size={20} color="#4f46e5" />
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Start a new project</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>From template or blank</div>
        </div>

        <div className="home-big-card" onClick={() => router.push('/studio')}>
          <div style={{ width: 40, height: 40, background: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Sparkles size={20} color="#db2777" />
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Start with Assistant</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Prompt a video</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="home-section-title" style={{ margin: 0 }}>Recents</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div 
            style={{ padding: 4, background: viewMode === 'grid' ? '#e2e8f0' : 'transparent', borderRadius: 4, cursor: 'pointer', transition: '0.2s' }}
            onClick={() => setViewMode('grid')}
          ><LayoutGrid size={16} color={viewMode === 'grid' ? '#0f172a' : '#9ca3af'} /></div>
          <div 
            style={{ padding: 4, background: viewMode === 'list' ? '#e2e8f0' : 'transparent', borderRadius: 4, cursor: 'pointer', transition: '0.2s' }}
            onClick={() => setViewMode('list')}
          ><List size={16} color={viewMode === 'list' ? '#0f172a' : '#9ca3af'} /></div>
        </div>
      </div>

      <div className={`home-recents ${viewMode}`}>
        {/* Recent Project Card */}
        <div className="home-recent-card" onClick={() => router.push('/studio')}>
          <div className="home-recent-img">
            <div className="home-recent-play"><Play size={24} color="#fff" fill="#fff" /></div>
            <div className="home-recent-duration">00:15</div>
          </div>
          <div className="home-recent-info">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="home-recent-title">Project Q3 Marketing</div>
              <div className="home-recent-meta">Updated 2h ago</div>
            </div>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#9ca3af' }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
