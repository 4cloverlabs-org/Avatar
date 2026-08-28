"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, MoreVertical, Download, Edit2, Trash2, Check, X, Clock } from 'lucide-react';

export default function VideosView() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const loadVideos = () => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.videos) {
          setVideos(data.videos);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleDelete = async (video: any) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: video.filename, id: video.id })
      });
      if (res.ok) loadVideos();
    } catch (e) {}
  };

  const handleRename = async (video: any) => {
    if (!editTitle || editTitle === video.title) {
      setEditModeId(null);
      return;
    }
    try {
      const res = await fetch('/api/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: video.filename, id: video.id, newTitle: editTitle })
      });
      if (res.ok) {
        setEditModeId(null);
        loadVideos();
      }
    } catch (e) {}
  };

  return (
    <div className="home-content">
      {/* VIDEOS GRID */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading generated videos...</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
          <Video size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>No generated videos found</div>
          <div style={{ fontSize: 14 }}>Your MuseTalk generations will appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {videos.map(video => (
            <div key={video.id} className="home-recent-card" style={{ border: '2px solid #F5F5F5', borderRadius: 8, overflow: 'visible', background: '#fff', transition: 'border-color 0.2s ease-in-out', position: 'relative' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F5F5F5'}>
              <div className="home-recent-img" style={{ width: '100%', background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
                <video 
                  src={`/api/videos/${video.filename}#t=0.001`} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                  preload="metadata"
                  onMouseEnter={(e) => { 
                    const playPromise = e.currentTarget.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0.001; }}
                  muted
                  loop
                  playsInline
                />

              </div>
              <div className="home-recent-info" style={{ padding: '16px', position: 'relative', display: 'block' }}>
                {editModeId === video.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <input 
                      autoFocus
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}
                    />
                    <button onClick={() => handleRename(video)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Check size={14}/></button>
                    <button onClick={() => setEditModeId(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14}/></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div className="home-recent-title" style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 15, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 16, letterSpacing: '-0.3px' }}>{video.title}</div>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <button onClick={() => setMenuOpenId(menuOpenId === video.id ? null : video.id)} style={{ background: menuOpenId === video.id ? '#f1f5f9' : 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#64748b', display: 'flex', transition: 'all 0.2s' }}>
                        <MoreVertical size={18} />
                      </button>
                      {menuOpenId === video.id && (
                        <>
                          <div 
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }}
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }}
                          />
                          <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, zIndex: 10, width: 180, overflow: 'hidden', padding: 4 }}>
                          <div 
                            onClick={() => { setEditTitle(video.title); setEditModeId(video.id); setMenuOpenId(null); }}
                            style={{ padding: '8px 12px', fontSize: 13, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Edit2 size={14} color="#64748b" /> Rename
                          </div>
                          <div style={{ margin: '4px 0', borderBottom: '1px solid #f1f5f9' }}></div>
                          <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Download</div>
                          <a href={`/api/videos/download?filename=${video.filename}&quality=original`} download style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#334155', textDecoration: 'none', borderRadius: 6, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Original Quality</a>
                          <a href={`/api/videos/download?filename=${video.filename}&quality=4k`} download style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#334155', textDecoration: 'none', borderRadius: 6, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>4K (UHD)</a>
                          <a href={`/api/videos/download?filename=${video.filename}&quality=1080p`} download style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#334155', textDecoration: 'none', borderRadius: 6, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>1080p (HD)</a>
                          <a href={`/api/videos/download?filename=${video.filename}&quality=720p`} download style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#334155', textDecoration: 'none', borderRadius: 6, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>720p (SD)</a>
                          <div style={{ margin: '4px 0', borderBottom: '1px solid #f1f5f9' }}></div>
                          <div 
                            onClick={() => { handleDelete(video); setMenuOpenId(null); }}
                            style={{ padding: '8px 12px', fontSize: 13, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Trash2 size={14} color="#ef4444" /> Delete
                          </div>
                        </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="home-recent-meta" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', margin: 0, marginTop: 6, fontWeight: 500 }}>
                  <Clock size={12} color="#94a3b8" />
                  {new Date(video.edited).toLocaleDateString()} at {new Date(video.edited).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
