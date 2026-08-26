"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, LayoutGrid, List, ChevronRight } from 'lucide-react';

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
          <div style={{ width: 40, height: 40, background: '#EDF2E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Plus size={20} color="#2C482C" />
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Start a new project</div>
          <div style={{ fontSize: 13, color: '#63685A' }}>From template or blank</div>
        </div>

        <div className="home-big-card" onClick={() => router.push('/studio')}>
          <div style={{ width: 40, height: 40, background: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Sparkles size={20} color="#db2777" />
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Start with Assistant</div>
          <div style={{ fontSize: 13, color: '#63685A' }}>Prompt a video</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="home-section-title" style={{ margin: 0 }}>Recents</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div 
            style={{ padding: 4, background: viewMode === 'grid' ? '#e2e8f0' : 'transparent', borderRadius: 4, cursor: 'pointer', transition: '0.2s' }}
            onClick={() => setViewMode('grid')}
          ><LayoutGrid size={16} color={viewMode === 'grid' ? '#1E2119' : '#9C9C8C'} /></div>
          <div 
            style={{ padding: 4, background: viewMode === 'list' ? '#e2e8f0' : 'transparent', borderRadius: 4, cursor: 'pointer', transition: '0.2s' }}
            onClick={() => setViewMode('list')}
          ><List size={16} color={viewMode === 'list' ? '#1E2119' : '#9C9C8C'} /></div>
        </div>
      </div>

      <div className={`home-recents ${viewMode}`}>
        {/* Recent Project Card */}
        <div className="home-recent-card" onClick={() => router.push('/studio')}>
          <div className="home-recent-img">
            <div style={{ position: 'absolute', top: 8, left: 8, background: '#63685A', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>DRAFT</div>
            <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, padding: '2px 4px', borderRadius: 4 }}>00:04</div>
          </div>
          <div className="home-recent-info">
            <div className="home-recent-title">Untitled</div>
            <div className="home-recent-meta">Edited 8 minutes ago</div>
          </div>
        </div>

        <div className="home-recent-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #E2DCC9', background: 'transparent' }} onClick={() => router.push('/studio')}>
           <span style={{ fontSize: 14, fontWeight: 500, color: '#63685A', display: 'flex', alignItems: 'center', gap: 6 }}>See more videos <ChevronRight size={14} /></span>
        </div>
      </div>
    </div>
  );
}
