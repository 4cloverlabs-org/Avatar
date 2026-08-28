"use client";
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Video, Image as ImageIcon, Mic, Plus, Loader2 } from 'lucide-react';

type Asset = {
  id: string;
  type: string;
  name: string;
  size: string;
  date: string;
  url: string;
};

export default function LibraryView() {
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        await loadAssets();
      }
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredAssets = activeSubTab === 'All' ? assets : assets.filter(a => a.type.toLowerCase() === activeSubTab.toLowerCase().replace(/s$/, ''));

  return (
    <div className="home-content">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Library</h1>
        <div>
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
          <button 
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: isUploading ? '#94a3b8' : '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: isUploading ? 'wait' : 'pointer', transition: '0.2s' }}
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {isUploading ? 'Uploading...' : 'Upload Asset'}
          </button>
        </div>
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
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading assets...</div>
      ) : filteredAssets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
          <BookOpen size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>No {activeSubTab.toLowerCase()} found</div>
          <div style={{ fontSize: 14 }}>Upload some assets to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {filteredAssets.map(asset => (
            <div key={asset.id} className="home-recent-card" style={{ border: '2px solid #F5F5F5', borderRadius: 8, overflow: 'visible', background: '#fff', cursor: 'pointer', transition: 'border-color 0.2s ease-in-out', position: 'relative' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F5F5F5'}>
              <div className="home-recent-img" style={{ width: '100%', height: 140, background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
                {asset.type === 'video' ? (
                  <video src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : asset.type === 'image' ? (
                  <img src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={asset.name} />
                ) : asset.type === 'audio' ? (
                  <Mic size={32} color="#cbd5e1" />
                ) : (
                  <BookOpen size={32} color="#cbd5e1" />
                )}
              </div>
              <div className="home-recent-info" style={{ padding: '16px', position: 'relative', display: 'block' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{asset.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
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
