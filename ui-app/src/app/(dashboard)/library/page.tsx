"use client";
import React, { useState } from 'react';
import { BookOpen, Video, Image as ImageIcon, Mic, Plus } from 'lucide-react';

export default function LibraryView() {
  const [activeSubTab, setActiveSubTab] = useState('All');
  
  const mockAssets = [
    { id: 1, type: 'video', name: 'Intro_Sequence.mp4', size: '12 MB', date: '2 days ago', color: '#fca5a5' },
    { id: 2, type: 'image', name: 'Logo_Transparent.png', size: '2 MB', date: '1 week ago', color: '#93c5fd' },
    { id: 3, type: 'audio', name: 'Background_Music.mp3', size: '5 MB', date: '3 weeks ago', color: '#fcd34d' },
    { id: 4, type: 'image', name: 'Product_Shot_1.jpg', size: '3.4 MB', date: '1 month ago', color: '#86efac' },
    { id: 5, type: 'video', name: 'Testimonial_Raw.mov', size: '450 MB', date: '1 month ago', color: '#d8b4fe' },
    { id: 6, type: 'image', name: 'Banner_BG.png', size: '4 MB', date: '2 months ago', color: '#99f6e4' },
  ];

  const filteredAssets = activeSubTab === 'All' ? mockAssets : mockAssets.filter(a => a.type.toLowerCase() === activeSubTab.toLowerCase().replace(/s$/, ''));

  return (
    <div className="home-content">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Library</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', transition: '0.2s' }}>
          <Plus size={16} /> Upload Asset
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        {['All', 'Videos', 'Images', 'Audio'].map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{ 
              paddingBottom: 12, 
              cursor: 'pointer', 
              fontSize: 14, 
              fontWeight: 500,
              color: activeSubTab === tab ? '#0f172a' : '#64748b',
              borderBottom: activeSubTab === tab ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* ASSET GRID */}
      {filteredAssets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
          <BookOpen size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>No {activeSubTab.toLowerCase()} found</div>
          <div style={{ fontSize: 14 }}>Upload some assets to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
          {filteredAssets.map(asset => (
            <div key={asset.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ height: 140, background: asset.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {asset.type === 'video' && <Video size={32} color="rgba(255,255,255,0.7)" />}
                {asset.type === 'image' && <ImageIcon size={32} color="rgba(255,255,255,0.7)" />}
                {asset.type === 'audio' && <Mic size={32} color="rgba(255,255,255,0.7)" />}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#64748b' }}>
                  <span>{asset.size}</span>
                  <span>{asset.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
