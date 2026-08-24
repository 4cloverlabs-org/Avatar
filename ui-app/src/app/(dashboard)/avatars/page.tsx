"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Copy, Edit2, Trash } from 'lucide-react';

export default function AvatarsView() {
  const [avatarTab, setAvatarTab] = useState('My Avatars');
  
  return (
    <div className="home-content">
      {/* TABS */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        {['My Avatars', 'From Us'].map(tab => (
          <div 
            key={tab}
            onClick={() => setAvatarTab(tab)}
            style={{ 
              paddingBottom: 12, 
              cursor: 'pointer', 
              fontSize: 14, 
              fontWeight: 500,
              color: avatarTab === tab ? '#0f172a' : '#64748b',
              borderBottom: avatarTab === tab ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {avatarTab === 'My Avatars' && <MyAvatarsUI />}
      {avatarTab === 'From Us' && <FromUsAvatarsUI />}
    </div>
  );
}

function FromUsAvatarsUI() {
  return (
    <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
      <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>System Avatars</div>
      <div style={{ fontSize: 14 }}>Coming soon...</div>
    </div>
  );
}

function MyAvatarsUI() {
  const router = useRouter();
  const [avatars, setAvatars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fetchAvatars = () => {
    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          setAvatars(data.avatars);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAvatars();
    
    // Poll every 5 seconds if there are any avatars currently processing
    const interval = setInterval(() => {
      setAvatars(currentAvatars => {
        if (currentAvatars.some(a => a.status === 'processing')) {
          fetch('/api/avatars')
            .then(res => res.json())
            .then(data => {
              if (data.success && data.avatars) {
                setAvatars(data.avatars);
              }
            });
        }
        return currentAvatars;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    setAvatars(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/avatars/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
      fetchAvatars();
    }
  };

  const handleDuplicate = async (id: string) => {
    const originalName = avatars.find(a => a.id === id)?.name || 'Custom Avatar';
    setAvatars(prev => [...prev, { id: 'temp-' + Date.now(), name: originalName + ' (Copy)' }]);
    try {
      await fetch(`/api/avatars/${id}`, { method: 'POST' });
      fetchAvatars(); // Refresh to get the actual new UUID
    } catch (e) {
      console.error(e);
      fetchAvatars();
    }
  };

  const saveName = async (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    
    setAvatars(prev => prev.map(a => a.id === id ? { ...a, name: editName } : a));
    setEditingId(null);

    try {
      await fetch(`/api/avatars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });
    } catch (e) {
      console.error("Failed to rename:", e);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading avatars...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
          {/* Create New Card */}
          <div 
            style={{ border: '2px dashed #F3F3F3', borderRadius: 12, overflow: 'hidden', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}
            onClick={() => router.push('/avatars/create')}
          >
            <div style={{ aspectRatio: '9/16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Plus size={28} color="#4f46e5" />
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>Create New Avatar</div>
            </div>
            <div style={{ padding: 12, borderTop: '2px dashed #F3F3F3', background: '#fff', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Upload Video</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Generate AI Avatar</div>
            </div>
          </div>

          {avatars.map(avatar => (
            <div 
              key={avatar.id} 
              style={{ border: '2px solid #F3F3F3', borderRadius: 12, background: '#fff', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
              onMouseEnter={(e) => {
                if (editingId === avatar.id) return;
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  const playPromise = video.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                  }
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  video.pause();
                  video.currentTime = 0.001;
                }
              }}
            >
              <div style={{ aspectRatio: '9/16', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' }}>
                {avatar.status === 'processing' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#4f46e5' }}>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {avatar.progress ? `Generating... ${avatar.progress}%` : 'Generating...'}
                    </div>
                  </div>
                ) : avatar.status === 'error' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#ef4444' }}>
                    <div style={{ width: 40, height: 40, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Failed</div>
                  </div>
                ) : failedVideos[avatar.id] ? (
                  <img 
                    src={`/api/avatars/${avatar.id}/thumbnail`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.background = '#f1f5f9';
                        e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                      }
                    }}
                    alt="Avatar Thumbnail"
                  />
                ) : (
                  <video 
                    src={`/api/avatars/${avatar.id}/preview#t=0.001`} 
                    loop muted playsInline preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={() => setFailedVideos(prev => ({ ...prev, [avatar.id]: true }))}
                  />
                )}
              </div>
              <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} onClick={(e) => e.stopPropagation()}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === avatar.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => saveName(avatar.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName(avatar.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      style={{ width: '100%', fontWeight: 600, fontSize: 14, color: '#0f172a', border: '2px solid #4f46e5', borderRadius: 6, padding: '6px 8px', outline: 'none', background: '#fff', boxSizing: 'border-box', marginTop: '-4px', marginBottom: '-4px' }}
                    />
                  ) : (
                    <div 
                      onClick={() => { setEditingId(avatar.id); setEditName(avatar.name); }}
                      title="Click to rename"
                      style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '2px 4px', marginLeft: '-4px', borderRadius: 4 }}
                    >
                      {avatar.name}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Custom Avatar</div>
                </div>

                {/* THREE DOTS MENU */}
                <div style={{ position: 'relative' }}>
                  <button 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === avatar.id ? null : avatar.id);
                    }}
                  >
                    <MoreVertical size={16} color="#64748b" />
                  </button>
                  
                  {openMenuId === avatar.id && (
                    <>
                      {/* Transparent overlay to catch outside clicks */}
                      <div 
                        style={{ position: 'fixed', inset: 0, zIndex: 9 }} 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} 
                      />
                      <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 10, minWidth: 160, overflow: 'hidden' }}>
                        <div 
                          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#0f172a', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                          onClick={(e) => { e.stopPropagation(); setEditingId(avatar.id); setEditName(avatar.name); setOpenMenuId(null); }}
                        >
                          <Edit2 size={14} /> Rename
                        </div>
                        <div 
                          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#0f172a', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                          onClick={(e) => { e.stopPropagation(); handleDuplicate(avatar.id); setOpenMenuId(null); }}
                        >
                          <Copy size={14} /> Duplicate
                        </div>
                        <div 
                          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ef4444', cursor: 'pointer' }}
                          onClick={(e) => { e.stopPropagation(); handleDelete(avatar.id); setOpenMenuId(null); }}
                        >
                          <Trash size={14} /> Delete
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
