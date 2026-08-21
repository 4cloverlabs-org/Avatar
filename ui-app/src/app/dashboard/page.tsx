"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Video, Trash, Mic, User, Settings, Sparkles, BookOpen, 
  LayoutTemplate, Users, Bell, Search, Plus, Play, ChevronRight, LayoutGrid, List,
  Image as ImageIcon, Menu, X
} from 'lucide-react';

export default function HomeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Home');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="home-layout light-theme">
      {/* LEFT SIDEBAR */}
      <div className={`home-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ padding: '8px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold' }}>W</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>Workspace</span>
              <span style={{ fontSize: 9, background: '#f1f5f9', color: '#64748b', padding: '2px 5px', borderRadius: 4, fontWeight: 600 }}>FREE</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} color="#4b5563" />
          </button>
        </div>

        <div className="home-nav-item active">
          <Home size={16} /> Home
        </div>

        <div className="home-sidebar-section" style={{ marginTop: 16 }}>
          <div className="home-sidebar-title">Videos</div>
          <div className="home-nav-item"><Video size={16} /> Videos</div>
        </div>

        <div className="home-sidebar-section">
          <div className="home-sidebar-title">Tools</div>
          <div className="home-nav-item"><Mic size={16} /> Dubbing</div>
          <div className="home-nav-item"><User size={16} /> Personal Avatars</div>
          <div className="home-nav-item"><Settings size={16} /> Personalization</div>
          <div className="home-nav-item" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Sparkles size={16} /> AI Playground</div>
            <span style={{ fontSize: 9, color: '#3b82f6', fontWeight: 700 }}>BETA</span>
          </div>
        </div>

        <div className="home-sidebar-section">
          <div className="home-sidebar-title">Assets</div>
          <div className="home-nav-item"><BookOpen size={16} /> Library</div>
          <div className="home-nav-item" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><LayoutTemplate size={16} /> Brand Kits</div>
            <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700 }}>UPGRADE</span>
          </div>
          <div className="home-nav-item"><Users size={16} /> Avatars</div>
          <div className="home-nav-item"><Mic size={16} /> Voices</div>
          <div className="home-nav-item"><Trash size={16} /> Trash</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
      <div className="home-main">
        {/* HEADER */}
        <div className="home-header">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} color="#0f172a" />
          </button>
          <div className="home-search">
            <Search size={16} />
            <input type="text" placeholder="Search" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <button className="home-pill" style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px' }} onClick={() => router.push('/studio')}>
              Create
            </button>
            <Bell size={20} color="#6b7280" />
            <div style={{ width: 32, height: 32, background: '#d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>K</div>
          </div>
        </div>

        {/* HERO */}
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
                <div style={{ position: 'absolute', top: 8, left: 8, background: '#374151', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>DRAFT</div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, padding: '2px 4px', borderRadius: 4 }}>00:04</div>
              </div>
              <div className="home-recent-info">
                <div className="home-recent-title">Untitled</div>
                <div className="home-recent-meta">Edited 8 minutes ago</div>
              </div>
            </div>

            <div className="home-recent-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d1d5db', background: 'transparent' }} onClick={() => router.push('/studio')}>
               <span style={{ fontSize: 14, fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 6 }}>See more videos <ChevronRight size={14} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
