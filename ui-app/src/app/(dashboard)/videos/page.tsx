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

  const [sortBy, setSortBy] = useState('date-desc');

  const loadVideos = () => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.videos) {
          setVideos(data.videos.filter((v: any) => v.status !== 'UPLOADED'));
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.edited).getTime() - new Date(a.edited).getTime();
    if (sortBy === 'date-asc') return new Date(a.edited).getTime() - new Date(b.edited).getTime();
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'size-desc') return b.sizeBytes - a.sizeBytes;
    return 0;
  });

  const handleDelete = async (video: any, trash: boolean) => {
    const msg = trash ? 'Are you sure you want to move this video to trash?' : 'Are you sure you want to permanently delete this video?';
    if (!confirm(msg)) return;
    try {
      const res = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: video.filename, id: video.id, trash })
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

  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'size-desc', label: 'Size (Largest)' }
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Sort By';

  return (
    <div className="home-content">
      {/* HEADER SECTION WITH SORTING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 8px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Generated Videos</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Sort by:</span>
          
          {/* Custom Professional Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px', 
                borderRadius: 8, 
                border: isSortOpen ? '1px solid #3b82f6' : '1px solid #e2e8f0', 
                background: '#fff', 
                fontSize: 14, 
                fontWeight: 500,
                color: '#334155',
                cursor: 'pointer',
                minWidth: 160,
                transition: 'all 0.2s',
                boxShadow: isSortOpen ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              {currentSortLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isSortOpen && (
              <>
                <div 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}
                  onClick={() => setIsSortOpen(false)}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: 6,
                  background: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 10, 
                  zIndex: 21, 
                  width: '100%', 
                  overflow: 'hidden', 
                  padding: 6,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}>
                  {sortOptions.map(option => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: 14,
                        fontWeight: 500,
                        color: sortBy === option.value ? '#3b82f6' : '#475569',
                        background: sortBy === option.value ? '#eff6ff' : 'transparent',
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== option.value) e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option.value) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {option.label}
                      {sortBy === option.value && <Check size={14} color="#3b82f6" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* VIDEOS GRID */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading generated videos...</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: 20, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Video size={28} color="#94a3b8" strokeWidth={1.5} />
          </div>
          <div style={{ color: '#1e293b', fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>No generated videos found</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {sortedVideos.map(video => (
            <div key={video.id} className="home-recent-card" style={{ border: '2px solid #F5F5F5', borderRadius: 8, overflow: 'visible', background: '#fff', transition: 'border-color 0.2s ease-in-out', position: 'relative' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F5F5F5'}>
              <div className="home-recent-img" style={{ width: '100%', background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
                <video 
                  src={`${video.url}#t=0.001`} 
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
                          <div 
                            onClick={() => { handleDelete(video, true); setMenuOpenId(null); }}
                            style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Trash2 size={14} color="#f59e0b" /> Move to Trash
                          </div>
                          <div 
                            onClick={() => { handleDelete(video, false); setMenuOpenId(null); }}
                            style={{ padding: '8px 12px', fontSize: 13, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <X size={14} color="#ef4444" /> Delete Permanently
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
