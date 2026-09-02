"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Sparkles, LayoutGrid, List, Play, MoreVertical,
  Clock, Video, X, Monitor, Smartphone, Square, ArrowRight,
  User, Mic, Settings, ChevronDown, Trash, Info, Download
} from 'lucide-react';

export default function HomeDashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [videos, setVideos] = useState<any[]>([]);
  const [videoDurations, setVideoDurations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [previewVideo, setPreviewVideo] = useState<any | null>(null);
  const [downloadQuality, setDownloadQuality] = useState('1080p');

  // AI Assistant States
  const [promptText, setPromptText] = useState('');
  const [selectedAspect, setSelectedAspect] = useState('16/9');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [availableAvatars, setAvailableAvatars] = useState<any[]>([]);
  const [isAspectOpen, setIsAspectOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [activeAvatarTab, setActiveAvatarTab] = useState<'system' | 'custom'>('custom');
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [activeVoiceTab, setActiveVoiceTab] = useState<'system' | 'cloned'>('cloned');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [promptText]);

  useEffect(() => {
    // Fetch Recents
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.videos) {
          const generatedOnly = data.videos.filter((v: any) => v.status !== 'UPLOADED' && !v.id.startsWith('pub-'));
          setVideos(generatedOnly);
          
          // Asynchronously fetch video durations
          generatedOnly.forEach((vid: any) => {
            const videoElement = document.createElement('video');
            videoElement.src = vid.url;
            videoElement.addEventListener('loadedmetadata', () => {
              const seconds = Math.round(videoElement.duration);
              if (!isNaN(seconds)) {
                const m = Math.floor(seconds / 60);
                const s = seconds % 60;
                setVideoDurations(prev => ({ ...prev, [vid.id]: `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` }));
              }
            });
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Fetch Avatars
    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          const readyAvatars = data.avatars.filter((a: any) => a.status === 'ready');
          setAvailableAvatars(readyAvatars);
          if (readyAvatars.length > 0) {
            const defaultId = readyAvatars[readyAvatars.length - 1].id;
            setSelectedAvatar(defaultId);
            localStorage.setItem('ai_assistant_avatar', defaultId);
          }
        }
      })
      .catch(console.error);

    // Fetch Voices
    fetch('/api/voices')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.voices) {
          setAvailableVoices(data.voices);
          if (data.voices.length > 0) {
            setSelectedVoice(data.voices[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handlePromptSubmit = () => {
    if (!promptText.trim()) return;
    localStorage.setItem('ai_assistant_script', promptText);
    localStorage.setItem('ai_assistant_aspect', selectedAspect);
    localStorage.setItem('ai_assistant_auto_generate', 'true');
    
    if (selectedAvatar) {
      localStorage.setItem('ai_assistant_avatar', selectedAvatar);
    }

    if (selectedVoice) {
      localStorage.setItem('ai_assistant_voice', selectedVoice);
    }

    router.push('/studio');
  };

  const getSelectedAvatarName = () => {
    if (!selectedAvatar) return "Auto Avatar";
    const found = availableAvatars.find(a => a.id === selectedAvatar);
    return found ? found.name : "Auto Avatar";
  };

  return (
    <div className="home-content" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px' }}>

      {/* Heading */}
      <h1 style={{
        margin: '0 0 20px 0',
        fontSize: 28,
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.025em',
        textAlign: 'center'
      }}>
        What do you want to create?
      </h1>

      {/* Console Box */}
      <div style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '2px solid #F5F5F5',
        padding: '20px 24px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        marginBottom: 48
      }}>
        {/* Top Pills Row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>

          {/* Avatar Selector Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f8fafc',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 12,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAvatarOpen(!isAvatarOpen);
              setIsAspectOpen(false);
              setIsVoiceOpen(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <User size={18} color="#475569" style={{ position: 'absolute' }} />
              {selectedAvatar && (
                selectedAvatar.includes('tpdne') || selectedAvatar.length < 20 ? (
                  <img src={`/avatars/${selectedAvatar}.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                ) : (
                  <video src={`/api/serve_video?type=av&path=${selectedAvatar}#t=0.001`} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                )
              )}
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>Avatar</div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {getSelectedAvatarName()}
              </div>
            </div>
          </div>

          {/* Voice Pill */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsVoiceOpen(!isVoiceOpen);
              setIsAvatarOpen(false);
              setIsAspectOpen(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f8fafc',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 12,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={18} color="#475569" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>Voice</div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {selectedVoice ? (availableVoices.find(v => v.id === selectedVoice)?.name || "Custom Voice") : "Auto Voice"}
              </div>
            </div>
          </div>

          {/* Aspect Ratio Pill */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f8fafc',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 12,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAspectOpen(!isAspectOpen);
              setIsAvatarOpen(false);
              setIsVoiceOpen(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={18} color="#475569" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>Aspect Ratio</div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {selectedAspect === '16/9' ? '16:9 Landscape' : selectedAspect === '9/16' ? '9:16 Portrait' : '1:1 Square'} <ChevronDown size={10} color="#64748b" style={{ transform: isAspectOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {/* Aspect Dropdown List overlay */}
            {isAspectOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 160, background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: 8, padding: 6, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                {[
                  { val: '16/9', label: '16:9 Landscape' },
                  { val: '9/16', label: '9:16 Portrait' },
                  { val: '1/1', label: '1:1 Square' }
                ].map(opt => (
                  <div
                    key={opt.val}
                    style={{ padding: '8px 12px', fontSize: 11, cursor: 'pointer', background: selectedAspect === opt.val ? 'var(--accent)' : 'transparent', color: selectedAspect === opt.val ? '#ffffff' : '#334155', borderRadius: 6, fontWeight: selectedAspect === opt.val ? 600 : 400 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAspect(opt.val);
                      localStorage.setItem('ai_assistant_aspect', opt.val);
                      setIsAspectOpen(false);
                    }}
                    onMouseEnter={(e) => { if (selectedAspect !== opt.val) e.currentTarget.style.background = 'var(--background)'; }}
                    onMouseLeave={(e) => { if (selectedAspect !== opt.val) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar Modal Overlay */}
          {isAvatarOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setIsAvatarOpen(false)}>
              <div style={{ background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 20, width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>Select an Avatar</h3>
                  <button onClick={() => setIsAvatarOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                </div>
                
                <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
                  <button 
                    onClick={() => setActiveAvatarTab('custom')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeAvatarTab === 'custom' ? '2px solid var(--accent)' : '2px solid transparent', color: activeAvatarTab === 'custom' ? 'var(--accent)' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Your Custom Avatars
                  </button>
                  <button 
                    onClick={() => setActiveAvatarTab('system')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeAvatarTab === 'system' ? '2px solid var(--accent)' : '2px solid transparent', color: activeAvatarTab === 'system' ? 'var(--accent)' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    System Avatars
                  </button>
                </div>
                
                {activeAvatarTab === 'custom' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableAvatars.filter(a => a.type !== 'system').length === 0 ? (
                      <div style={{ fontSize: 13, color: '#64748b', gridColumn: '1 / -1', padding: '20px', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 8 }}>
                        No custom avatars yet. Go to the Avatars tab to create one!
                      </div>
                    ) : (
                      availableAvatars.filter(a => a.type !== 'system').map(a => (
                        <div
                          key={a.id}
                          style={{ padding: '12px', border: `2px solid ${selectedAvatar === a.id ? 'var(--accent)' : '#e2e8f0'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, background: selectedAvatar === a.id ? '#eff6ff' : '#fff', transition: 'all 0.2s' }}
                          onClick={() => {
                            setSelectedAvatar(a.id);
                            localStorage.setItem('ai_assistant_avatar', a.id);
                            setIsAvatarOpen(false);
                          }}
                        >
                          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', background: selectedAvatar === a.id ? 'rgba(79,70,229,0.1)' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <User size={24} color={selectedAvatar === a.id ? '#4f46e5' : '#94a3b8'} style={{ position: 'absolute' }} />
                            {a.id.includes('tpdne') || a.id.length < 20 ? (
                              <img src={`/avatars/${a.id}.jpg`} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                            ) : (
                              <video src={`/api/serve_video?type=av&path=${a.id}#t=0.001`} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: selectedAvatar === a.id ? 'var(--accent)' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {a.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Click to select</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {activeAvatarTab === 'system' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableAvatars.filter(a => a.type === 'system').map(a => (
                      <div
                        key={a.id}
                        style={{ padding: '12px', border: `2px solid ${selectedAvatar === a.id ? 'var(--accent)' : '#e2e8f0'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, background: selectedAvatar === a.id ? '#eff6ff' : '#fff', transition: 'all 0.2s' }}
                        onClick={() => {
                          setSelectedAvatar(a.id);
                          localStorage.setItem('ai_assistant_avatar', a.id);
                          setIsAvatarOpen(false);
                        }}
                      >
                        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', background: selectedAvatar === a.id ? 'rgba(79,70,229,0.1)' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <User size={24} color={selectedAvatar === a.id ? '#4f46e5' : '#94a3b8'} style={{ position: 'absolute' }} />
                          {a.id.includes('tpdne') || a.id.length < 20 ? (
                            <img src={`/avatars/${a.id}.jpg`} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                          ) : (
                            <video src={`/api/serve_video?type=av&path=${a.id}#t=0.001`} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: selectedAvatar === a.id ? 'var(--accent)' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Click to select</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Voice Modal Overlay */}
          {isVoiceOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setIsVoiceOpen(false)}>
              <div style={{ background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 20, width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>Select a Voice</h3>
                  <button onClick={() => setIsVoiceOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                </div>
                
                <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
                  <button 
                    onClick={() => setActiveVoiceTab('cloned')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeVoiceTab === 'cloned' ? '2px solid var(--accent)' : '2px solid transparent', color: activeVoiceTab === 'cloned' ? 'var(--accent)' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Your Cloned Voices
                  </button>
                  <button 
                    onClick={() => setActiveVoiceTab('system')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeVoiceTab === 'system' ? '2px solid var(--accent)' : '2px solid transparent', color: activeVoiceTab === 'system' ? 'var(--accent)' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    System Voices
                  </button>
                </div>
                
                {activeVoiceTab === 'system' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableVoices.filter(v => v.type === 'system').map(v => (
                      <div
                        key={v.id}
                        style={{ padding: '12px', border: `2px solid ${selectedVoice === v.id ? 'var(--accent)' : '#e2e8f0'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, background: selectedVoice === v.id ? '#eff6ff' : '#fff', transition: 'all 0.2s' }}
                        onClick={() => {
                          setSelectedVoice(v.id);
                          localStorage.setItem('ai_assistant_voice', v.id);
                          localStorage.setItem('ai_assistant_default_voice', v.id);
                          setIsVoiceOpen(false);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: selectedVoice === v.id ? 'var(--accent)' : '#334155' }}>
                          <Mic size={16} /> {v.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Click to set as default</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeVoiceTab === 'cloned' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableVoices.filter(v => v.type !== 'system').length === 0 ? (
                      <div style={{ fontSize: 13, color: '#64748b', gridColumn: '1 / -1', padding: '20px', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 8 }}>
                        No custom cloned voices yet. Go to the Voices tab to create one!
                      </div>
                    ) : (
                      availableVoices.filter(v => v.type !== 'system').map(v => (
                        <div
                          key={v.id}
                          style={{ padding: '12px', border: `2px solid ${selectedVoice === v.id ? 'var(--accent)' : '#e2e8f0'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, background: selectedVoice === v.id ? '#eff6ff' : '#fff', transition: 'all 0.2s' }}
                          onClick={() => {
                            setSelectedVoice(v.id);
                            localStorage.setItem('ai_assistant_voice', v.id);
                            localStorage.setItem('ai_assistant_default_voice', v.id);
                            setIsVoiceOpen(false);
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: selectedVoice === v.id ? 'var(--accent)' : '#334155' }}>
                            <Mic size={16} /> {v.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Click to set as default</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Prompt input field */}
        <textarea
          ref={textareaRef}
          placeholder="Ask for a video, an avatar, or anything in between I can get you started."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={1}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 14,
            color: '#0f172a',
            height: '24px',
            minHeight: '24px',
            maxHeight: '200px',
            fontFamily: 'inherit',
            lineHeight: '24px',
            overflowY: 'hidden',
            padding: 0,
            margin: 0
          }}
        />

        {/* Bottom actions row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: 'none', paddingTop: 12 }}>

          {/* Right button */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

            <button
              onClick={handlePromptSubmit}
              disabled={!promptText.trim()}
              style={{
                background: 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 24px',
                fontSize: 13,
                fontWeight: 700,
                cursor: (promptText.trim()) ? 'pointer' : 'not-allowed',
                opacity: (promptText.trim()) ? 1 : 0.5,
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => { if (promptText.trim()) e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseLeave={(e) => { if (promptText.trim()) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Recents section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="home-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={18} color="#64748b" /> Recent Videos
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          <div
            style={{
              padding: '4px 8px',
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: '0.2s'
            }}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={14} color={viewMode === 'grid' ? '#0f172a' : '#64748b'} />
          </div>
          <div
            style={{
              padding: '4px 8px',
              background: viewMode === 'list' ? '#ffffff' : 'transparent',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: '0.2s'
            }}
            onClick={() => setViewMode('list')}
          >
            <List size={14} color={viewMode === 'list' ? '#0f172a' : '#64748b'} />
          </div>
        </div>
      </div>

      {/* Grid or List content */}
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: 20, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Video size={28} color="#94a3b8" strokeWidth={1.5} />
          </div>
          <div style={{ color: '#1e293b', fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>No recent videos</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="home-recents grid">


          {/* Dynamic Generated Videos */}
          {videos.map((vid, idx) => (
            <div
              key={idx}
              className="home-recent-card"
              onClick={() => setPreviewVideo(vid)}
              style={{ minHeight: 240, borderRadius: 8, border: '2px solid #F5F5F5', overflow: 'hidden', transition: 'transform 0.2s ease-in-out, border-color 0.2s ease-in-out' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = '#F5F5F5';
              }}
            >
              <div className="home-recent-img" style={{ background: '#0f172a', position: 'relative' }}>
                <video 
                  src={`${vid.url}#t=0.001`} 
                  preload="metadata" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  muted 
                  playsInline 
                />
                <div className="home-recent-play">
                  <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                </div>
                <div className="home-recent-duration">{videoDurations[vid.id] || '00:00'}</div>
              </div>
              <div className="home-recent-info">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="home-recent-title">{vid.title}</div>
                  <div className="home-recent-meta">
                    <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> {new Date(vid.edited).toLocaleDateString()} at {new Date(vid.edited).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <button 
                  onClick={async (e) => { 
                    e.stopPropagation(); 
                    if (confirm("Move this video to trash?")) {
                      try {
                        const res = await fetch(`/api/videos`, { 
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ filename: vid.filename, id: vid.id, trash: true })
                        });
                        if (res.ok) {
                          setVideos(videos.filter(v => v.filename !== vid.filename));
                        } else {
                          alert('Failed to move video to trash');
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }
                  }} 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}
                  title="Move to Trash"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '2px solid #F5F5F5', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '12px 20px', borderBottom: '2px solid #F5F5F5', background: '#f8fafc', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
            <div>Name</div>
            <div>Duration</div>
            <div>Date Created</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Dynamic list items */}
          {videos.map((vid, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewVideo(vid)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                padding: '16px 20px',
                borderBottom: idx === videos.length - 1 ? 'none' : '2px solid #F5F5F5',
                alignItems: 'center',
                fontSize: 13,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, color: '#0f172a' }}>
                <Video size={16} color="#10b981" />
                {vid.title}
              </div>
              <div style={{ color: '#475569' }}>{videoDurations[vid.id] || '00:00'}</div>
              <div style={{ color: '#475569' }}>{new Date(vid.edited).toLocaleDateString()} at {new Date(vid.edited).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div style={{ color: '#64748b' }}>AI Generated</div>
              <button 
                onClick={async (e) => { 
                  e.stopPropagation(); 
                  if (confirm("Move this video to trash?")) {
                    try {
                      const res = await fetch(`/api/videos`, { 
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: vid.filename, id: vid.id, trash: true })
                      });
                      if (res.ok) {
                        setVideos(videos.filter(v => v.filename !== vid.filename));
                      } else {
                        alert('Failed to move video to trash');
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}
                title="Move to Trash"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.2s ease-out' }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; backdrop-filter: blur(0px); }
              to { opacity: 1; backdrop-filter: blur(4px); }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .quality-radio:hover { border-color: #6366f1 !important; }
            .cancel-btn:hover { background: #f8fafc !important; }
            .download-btn:hover { background: #4338ca !important; }
          `}</style>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setPreviewVideo(null)} />
          
          <div style={{ position: 'relative', width: '100%', maxWidth: 960, background: '#ffffff', borderRadius: 16, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Header */}
            <div style={{ padding: '24px 32px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>{previewVideo.title}</h3>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
                  {new Date(previewVideo.edited).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(previewVideo.edited).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
              </div>
              <button 
                onClick={() => setPreviewVideo(null)} 
                style={{ background: '#f1f5f9', border: 'none', color: '#64748b', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} 
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'} 
                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', padding: '0 32px 24px', gap: 32 }}>
              
              {/* Left Side: Video */}
              <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center' }}>
                <video 
                  src={previewVideo.url} 
                  style={{ width: '100%', maxHeight: '480px', display: 'block', objectFit: 'contain' }} 
                  controls
                  autoPlay
                />
              </div>

              {/* Right Side: Options */}
              <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                
                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { id: '1080p', label: 'Original (1080p)', res: '1920 × 1080 • MP4', hd: true },
                    { id: '720p', label: 'High (720p)', res: '1280 × 720 • MP4', hd: false },
                    { id: '480p', label: 'Medium (480p)', res: '854 × 480 • MP4', hd: false },
                    { id: '360p', label: 'Low (360p)', res: '640 × 360 • MP4', hd: false }
                  ].map(option => {
                    const isActive = downloadQuality === option.id;
                    return (
                      <div 
                        key={option.id}
                        className="quality-radio"
                        onClick={() => setDownloadQuality(option.id)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 12, 
                          border: `1.5px solid ${isActive ? '#6366f1' : '#e2e8f0'}`, 
                          background: isActive ? '#fefeff' : '#fff', 
                          cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'none'
                        }}
                      >
                        {/* Custom Radio Button */}
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isActive ? '#6366f1' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isActive && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? '#4f46e5' : '#1e293b' }}>{option.label}</span>
                            {option.hd && (
                              <span style={{ background: isActive ? '#6366f1' : '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5 }}>HD</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: isActive ? '#6366f1' : '#64748b', opacity: isActive ? 0.8 : 1, fontWeight: 500 }}>{option.res}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Box */}
                <div style={{ marginTop: 16, background: '#eff6ff', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Info size={16} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, fontWeight: 500 }}>
                    Higher quality videos may take longer to download and more storage space.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <button 
                className="cancel-btn"
                onClick={() => setPreviewVideo(null)}
                style={{ padding: '10px 24px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#334155', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Cancel
              </button>
              <a 
                href={`/api/videos/download?filename=${previewVideo.filename}&quality=${downloadQuality === '1080p' ? 'original' : downloadQuality}`}
                download
                className="download-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'background 0.2s' }}
                onClick={() => setPreviewVideo(null)}
              >
                <Download size={16} /> 
                Download ({downloadQuality})
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
