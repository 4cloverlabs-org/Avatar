"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Copy, Edit2, Trash, X } from 'lucide-react';

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
  const router = useRouter();
  const [previewAvatar, setPreviewAvatar] = useState<any>(null);
  const avatars = [
    { id: 'sys-1', name: 'Professional Anna', image: '/avatars/anna.jpg' },
    { id: 'sys-2', name: 'Casual Mark', image: '/avatars/mark.jpg' },
    { id: 'sys-3', name: 'Tech Reviewer', image: '/avatars/reviewer_v2.jpg' },
    { id: 'sys-4', name: 'Friendly Sarah', image: '/avatars/sarah.jpg' },
    { id: 'sys-5', name: 'Corporate David', image: '/avatars/david.jpg' },
    { id: 'sys-6', name: 'Creative Designer', image: '/avatars/mia.jpg' },
    { id: 'sys-7', name: 'Support Agent', image: '/avatars/alex.jpg' }
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
        {avatars.map(avatar => (
          <div 
            key={avatar.id} 
            style={{ border: '2px solid #F3F3F3', borderRadius: 12, background: '#fff', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', display: 'flex', flexDirection: 'column' }}
            onClick={() => setPreviewAvatar(avatar)}
          >
            <div style={{ aspectRatio: '9/16', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' }}>
              <img 
                src={avatar.image} 
                alt={avatar.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTop: '2px dashed #F3F3F3' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div 
                  style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '2px 4px', marginLeft: '-4px', borderRadius: 4 }}
                >
                  {avatar.name}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>System Avatar</div>
              </div>
              
              <button 
                style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewAvatar(avatar);
                }}
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* POPUP PREVIEW for System Avatars */}
      {previewAvatar && (
        <QuickGenerateModal previewAvatar={previewAvatar} setPreviewAvatar={setPreviewAvatar} isSystemAvatar={true} router={router} />
      )}
    </>
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
  const [previewAvatar, setPreviewAvatar] = useState<any>(null);

  const fetchAvatars = () => {
    fetch('/api/avatars', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          // Only show fully ready avatars on the dashboard
          setAvatars(data.avatars.filter((a: any) => a.status === 'ready'));
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
    // Optimistically hide from UI while trying to delete
    setAvatars(prev => prev.filter(a => a.id !== id));
    try {
      const res = await fetch(`/api/avatars/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (e: any) {
      console.error(e);
      alert(`Failed to delete avatar. It might be in use by the system.\n\nError: ${e.message}`);
      // Refresh to put it back in the UI since deletion failed
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
              onClick={() => setPreviewAvatar(avatar)}
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
                <video 
                  src={`/api/avatars/${avatar.id}/preview#t=0.001`} 
                  loop muted playsInline preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={() => setFailedVideos(prev => ({ ...prev, [avatar.id]: true }))}
                />
                
                {avatar.status === 'processing' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', gap: 12, zIndex: 10 }}>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ width: 32, height: 32, border: '3px solid #e0e7ff', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {avatar.progress ? `Generating... ${avatar.progress}%` : 'Generating...'}
                    </div>
                  </div>
                )}
                
                {avatar.status === 'error' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444', gap: 12, zIndex: 10 }}>
                    <div style={{ width: 40, height: 40, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Failed</div>
                  </div>
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

      {/* POPUP PREVIEW for My Avatars */}
      {previewAvatar && (
        <QuickGenerateModal previewAvatar={previewAvatar} setPreviewAvatar={setPreviewAvatar} isSystemAvatar={false} router={router} />
      )}
    </div>
  );
}

function QuickGenerateModal({ previewAvatar, setPreviewAvatar, isSystemAvatar, router }: any) {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [scriptText, setScriptText] = useState<string>('');
  const [step, setStep] = useState<'preview' | 'configure' | 'generating' | 'result'>('preview');
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/voices')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.voices) {
          setVoices(data.voices);
          if (data.voices.length > 0) setSelectedVoiceId(data.voices[0].id);
        }
      });
  }, []);

  const handleGenerate = async () => {
    if (!scriptText.trim()) return alert("Please enter a script.");
    if (!selectedVoiceId) return alert("Please select a voice.");
    setStep('generating');
    
    try {
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scriptText, voiceId: selectedVoiceId })
      });
      const ttsData = await ttsRes.json();
      if (!ttsData.success) throw new Error("TTS failed");
      
      const audioUrl = ttsData.url;
      const avatarId = isSystemAvatar ? previewAvatar.image : previewAvatar.id;

      const audioFetch = await fetch(audioUrl);
      const audioBlob = await audioFetch.blob();
      
      const formData = new FormData();
      formData.append('avatarId', avatarId);
      formData.append('audio', audioBlob, 'tts.wav');
      formData.append('aspectRatio', '9:16');

      const genRes = await fetch('/api/generate_video', {
        method: 'POST',
        body: formData
      });
      const genData = await genRes.json();
      if (!genData.success) throw new Error(genData.error || "Video generation failed");

      if (genData.data && genData.data.length > 0) {
         let videoUrl = genData.data[0];
         if (typeof videoUrl === 'object' && videoUrl.path) videoUrl = videoUrl.path;
         
         if (typeof videoUrl === 'string') {
            const normalizedUrl = videoUrl.replace(/\\/g, '/');
            if (normalizedUrl.includes('/results/avatars/')) {
               const parts = normalizedUrl.split('/results/avatars/');
               if (parts.length > 1) {
                 videoUrl = `/api/serve_video?type=av&path=${encodeURIComponent(parts[1])}`;
               }
            } else if (normalizedUrl.includes('/results/output/')) {
               const parts = normalizedUrl.split('/results/output/');
               if (parts.length > 1) {
                 videoUrl = `/api/serve_video?type=gen&path=${encodeURIComponent(parts[1])}`;
               }
            }
         }
         
         setResultVideoUrl(videoUrl);
         setStep('result');
         return; // Done!
      }

      const targetId = avatarId || 'sys';
      let found = false;
      for (let i = 0; i < 60; i++) {
        const checkRes = await fetch(`/api/check_video?avatarId=${targetId}&aspect=9:16`);
        const checkData = await checkRes.json();
        if (checkData.success && checkData.ready) {
           setResultVideoUrl(checkData.url);
           setStep('result');
           found = true;
           break;
        }
        await new Promise(r => setTimeout(r, 5000));
      }
      
      if (!found) throw new Error("Timeout waiting for video");
    } catch (e: any) {
      alert("Error: " + e.message);
      setStep('configure');
    }
  };

  const previewMedia = isSystemAvatar ? (
    <img src={previewAvatar.image} alt={previewAvatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    <video src={`/api/avatars/${previewAvatar.id}/preview`} controls autoPlay loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 24 }} onClick={() => setPreviewAvatar(null)}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 16, width: step === 'configure' ? 640 : 340, position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', transition: 'width 0.3s ease' }} onClick={e => e.stopPropagation()}>
        <button style={{ position: 'absolute', top: 12, right: 12, background: '#f1f5f9', border: 'none', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }} onClick={() => setPreviewAvatar(null)}>
          <X size={16} />
        </button>
        <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{previewAvatar.name}</h3>
        
        {step === 'preview' && (
          <>
            <div style={{ width: '100%', aspectRatio: '9/16', background: '#000', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', maxHeight: '50vh', display: 'flex', justifyContent: 'center' }}>
              {previewMedia}
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button 
                style={{ flex: 1, padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: (previewAvatar.status === 'error' && !isSystemAvatar) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
                onClick={() => setStep('configure')}
                disabled={previewAvatar.status === 'error' && !isSystemAvatar}
              >
                Quick Generate
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); router.push(`/studio?avatar=${encodeURIComponent(isSystemAvatar ? previewAvatar.image : previewAvatar.id)}`); }} style={{ color: '#4f46e5', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Open in Full Studio &rarr;</a>
            </div>
          </>
        )}

        {step === 'configure' && (
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ width: 220, aspectRatio: '9/16', background: '#000', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
              {previewMedia}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Select Voice</label>
                <select value={selectedVoiceId} onChange={(e) => setSelectedVoiceId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none' }}>
                  {voices.map(v => <option key={v.id} value={v.id}>{v.name} {v.type === 'cloned' ? '(Cloned)' : ''}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Script</label>
                <textarea 
                  value={scriptText} 
                  onChange={(e) => setScriptText(e.target.value)} 
                  placeholder="Type what you want the avatar to say..."
                  style={{ width: '100%', flex: 1, minHeight: 120, padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <button 
                onClick={handleGenerate}
                style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 16 }}
              >
                Generate Video
              </button>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e0e7ff', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 24, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>Generating your video...</div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>This might take a minute depending on the length of your script.</div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {step === 'result' && resultVideoUrl && (
          <>
            <div style={{ width: '100%', aspectRatio: '9/16', background: '#000', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', maxHeight: '50vh', display: 'flex', justifyContent: 'center' }}>
              <video src={resultVideoUrl} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ marginTop: 20 }}>
              <a href={resultVideoUrl} download style={{ display: 'block', width: '100%', padding: '12px', background: '#10b981', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
                Download Result
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
