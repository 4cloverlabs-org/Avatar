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
          const generatedOnly = data.videos.filter((v: any) => v.status !== 'UPLOADED' && !v.id.startsWith('pub-')).slice(0, 6);
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
          // Do not auto-select to show default placeholder
        }
      })
      .catch(console.error);

    // Fetch Voices
    fetch('/api/voices')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.voices) {
          setAvailableVoices(data.voices);
          // Do not auto-select to show default placeholder
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
        color: 'var(--foreground)',
        letterSpacing: '-0.025em',
        textAlign: 'center'
      }}>
        What do you want to create?
      </h1>

      <div style={{ background: '#F8F8F8', borderRadius: 24, padding: '16px 16px 0 16px' }}>

      {/* YOUR LATEST PROJECTS section */}
      <div style={{ marginBottom: 16 }}>
        
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          
          {/* Card 1 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAvatarOpen(!isAvatarOpen); setIsAspectOpen(false); setIsVoiceOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #EEEEEE', borderRadius: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EEEEEE'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', background: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedAvatar ? (
                  availableAvatars.find(a => a.id === selectedAvatar)?.type === 'system' ? (
                    <img src={availableAvatars.find(a => a.id === selectedAvatar)?.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                  ) : (
                    <video src={`/api/serve_video?type=av&path=${selectedAvatar}#t=0.001`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                  )
                ) : (
                  <video src="/api/serve_video?type=av&path=ffb5f45b-9420-4727-a4cc-06d20ae3d63c#t=0.001" style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAvatar ? getSelectedAvatarName() : "Custom Avatar ffb5"}</h3>
            </div>
            <ChevronDown size={14} color="#475569" />
          </div>

          {/* Card 2 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsVoiceOpen(!isVoiceOpen); setIsAvatarOpen(false); setIsAspectOpen(false); }}
            style={{ background: '#ffffff', border: '1px solid #EEEEEE', borderRadius: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EEEEEE'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={12} color="#475569" />
              </div>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{selectedVoice ? (availableVoices.find(v => v.id === selectedVoice)?.name || "Rachel (Professional)") : "Rachel (Professional)"}</h3>
            </div>
            <ChevronDown size={14} color="#475569" />
          </div>

          {/* Card 3 */}
          <div 
            onClick={(e) => { e.stopPropagation(); setIsAspectOpen(!isAspectOpen); setIsAvatarOpen(false); setIsVoiceOpen(false); }}
            style={{ position: 'relative', background: '#ffffff', border: '1px solid #EEEEEE', borderRadius: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EEEEEE'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedAspect === '16/9' ? <Monitor size={12} color="#475569" /> : selectedAspect === '9/16' ? <Smartphone size={12} color="#475569" /> : <Square size={12} color="#475569" />}
              </div>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{selectedAspect === '16/9' ? '16:9' : selectedAspect === '9/16' ? '9:16' : '1:1'}</h3>
            </div>
            <ChevronDown size={14} color="#475569" />
            
            {/* Aspect Dropdown List overlay */}
            {isAspectOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 140, background: '#fff', border: '1px solid #EEEEEE', borderRadius: 12, padding: 6, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                {[
                  { val: '16/9', label: '16:9 Landscape' },
                  { val: '9/16', label: '9:16 Portrait' },
                  { val: '1/1', label: '1:1 Square' }
                ].map(opt => (
                  <div
                    key={opt.val}
                    style={{ padding: '8px 12px', fontSize: 12, cursor: 'pointer', background: selectedAspect === opt.val ? '#EEEEEE' : 'transparent', color: '#1e293b', borderRadius: 8, fontWeight: selectedAspect === opt.val ? 600 : 400 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAspect(opt.val);
                      localStorage.setItem('ai_assistant_aspect', opt.val);
                      setIsAspectOpen(false);
                    }}
                    onMouseEnter={(e) => { if (selectedAspect !== opt.val) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { if (selectedAspect !== opt.val) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Console Box */}
      <div style={{
        background: '#ffffff',
        borderRadius: 24,
        border: '1px solid #EEEEEE',
        padding: '16px 20px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        marginBottom: 0,
        marginLeft: -16,
        marginRight: -16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        
        {/* Prompt input field */}
        <textarea
          ref={textareaRef}
          placeholder="How can I help you?"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={1}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--foreground)',
            height: '60px',
            minHeight: '60px',
            maxHeight: '300px',
            fontFamily: 'inherit',
            lineHeight: '24px',
            overflowY: 'hidden',
            padding: 0,
            margin: 0
          }}
        />

        {/* Bottom Row - Pills and Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'center' }}>
        
        {/* Left: Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative', alignItems: 'center' }}>
          
          <button style={{ width: 24, height: 24, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EEEEEE', color: '#475569', cursor: 'pointer' }}>
            <Plus size={16} />
          </button>

          {/* Avatar Modal Overlay */}
          {isAvatarOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setIsAvatarOpen(false)}>
              <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 20, width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--foreground)' }}>Select an Avatar</h3>
                  <button onClick={() => setIsAvatarOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                </div>
                
                <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--panel-border)', marginBottom: 20 }}>
                  <button 
                    onClick={() => setActiveAvatarTab('custom')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeAvatarTab === 'custom' ? '2px solid var(--accent)' : '2px solid transparent', color: activeAvatarTab === 'custom' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Your Custom Avatars
                  </button>
                  <button 
                    onClick={() => setActiveAvatarTab('system')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeAvatarTab === 'system' ? '2px solid var(--accent)' : '2px solid transparent', color: activeAvatarTab === 'system' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    From Us
                  </button>
                </div>
                
                {activeAvatarTab === 'custom' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableAvatars.filter(a => a.type !== 'system').length === 0 ? (
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', gridColumn: '1 / -1', padding: '20px', textAlign: 'center', border: '1px dashed var(--panel-border)', borderRadius: 8 }}>
                        No custom avatars yet. Go to the Avatars tab to create one!
                      </div>
                    ) : (
                      availableAvatars.filter(a => a.type !== 'system').map(a => (
                        <div
                          key={a.id}
                          style={{ padding: '12px', border: `2px solid ${selectedAvatar === a.id ? 'var(--accent)' : 'var(--panel-border)'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, background: selectedAvatar === a.id ? 'var(--muted-bg)' : 'var(--panel-bg)', transition: 'all 0.2s' }}
                          onClick={() => {
                            setSelectedAvatar(a.id);
                            localStorage.setItem('ai_assistant_avatar', a.id);
                            setIsAvatarOpen(false);
                          }}
                        >
                          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', background: selectedAvatar === a.id ? 'rgba(79,70,229,0.1)' : 'var(--muted-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <User size={24} color={selectedAvatar === a.id ? '#4f46e5' : 'var(--text-muted)'} style={{ position: 'absolute' }} />
                            {a.id.includes('tpdne') || a.id.length < 20 ? (
                              <img src={`/avatars/${a.id}.jpg`} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                            ) : (
                              <video src={`/api/serve_video?type=av&path=${a.id}#t=0.001`} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} preload="metadata" muted playsInline onError={(e) => e.currentTarget.style.display = 'none'} />
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: selectedAvatar === a.id ? 'var(--accent)' : 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {a.name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Click to select</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {activeAvatarTab === 'system' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { id: 'sys-1', name: 'Professional Anna', image: '/avatars/anna.jpg' },
                      { id: 'sys-2', name: 'Casual Mark', image: '/avatars/mark.jpg' },
                      { id: 'sys-3', name: 'Tech Reviewer', image: '/avatars/reviewer_v2.jpg' },
                      { id: 'sys-4', name: 'Friendly Sarah', image: '/avatars/sarah.jpg' },
                      { id: 'sys-5', name: 'Corporate David', image: '/avatars/david.jpg' },
                      { id: 'sys-6', name: 'Creative Designer', image: '/avatars/mia.jpg' },
                      { id: 'sys-7', name: 'Support Agent', image: '/avatars/alex.jpg' }
                    ].map(a => (
                      <div
                        key={a.id}
                        style={{ padding: '12px', border: `2px solid ${selectedAvatar === a.id ? 'var(--accent)' : 'var(--panel-border)'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, background: selectedAvatar === a.id ? 'var(--muted-bg)' : 'var(--panel-bg)', transition: 'all 0.2s' }}
                        onClick={() => {
                          setSelectedAvatar(a.id);
                          localStorage.setItem('ai_assistant_avatar', a.id);
                          setIsAvatarOpen(false);
                        }}
                      >
                        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', background: selectedAvatar === a.id ? 'rgba(79,70,229,0.1)' : 'var(--muted-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <User size={24} color={selectedAvatar === a.id ? '#4f46e5' : 'var(--text-muted)'} style={{ position: 'absolute' }} />
                          <img src={a.image} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: selectedAvatar === a.id ? 'var(--accent)' : 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Click to select</div>
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
              <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 12, padding: 20, width: 480, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--foreground)' }}>Select a Voice</h3>
                  <button onClick={() => setIsVoiceOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                </div>
                
                <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--panel-border)', marginBottom: 20 }}>
                  <button 
                    onClick={() => setActiveVoiceTab('cloned')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeVoiceTab === 'cloned' ? '2px solid var(--accent)' : '2px solid transparent', color: activeVoiceTab === 'cloned' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Your Cloned Voices
                  </button>
                  <button 
                    onClick={() => setActiveVoiceTab('system')} 
                    style={{ background: 'transparent', border: 'none', borderBottom: activeVoiceTab === 'system' ? '2px solid var(--accent)' : '2px solid transparent', color: activeVoiceTab === 'system' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    System Voices
                  </button>
                </div>
                
                {activeVoiceTab === 'system' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableVoices.filter(v => v.type === 'system').map(v => (
                      <div
                        key={v.id}
                        style={{ padding: '12px', border: `2px solid ${selectedVoice === v.id ? 'var(--accent)' : 'var(--panel-border)'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, background: selectedVoice === v.id ? 'var(--muted-bg)' : 'var(--panel-bg)', transition: 'all 0.2s' }}
                        onClick={() => {
                          setSelectedVoice(v.id);
                          localStorage.setItem('ai_assistant_voice', v.id);
                          localStorage.setItem('ai_assistant_default_voice', v.id);
                          setIsVoiceOpen(false);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: selectedVoice === v.id ? 'var(--accent)' : 'var(--foreground)' }}>
                          <Mic size={12} /> {v.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click to set as default</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeVoiceTab === 'cloned' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {availableVoices.filter(v => v.type !== 'system').length === 0 ? (
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', gridColumn: '1 / -1', padding: '20px', textAlign: 'center', border: '1px dashed var(--panel-border)', borderRadius: 8 }}>
                        No custom cloned voices yet. Go to the Voices tab to create one!
                      </div>
                    ) : (
                      availableVoices.filter(v => v.type !== 'system').map(v => (
                        <div
                          key={v.id}
                          style={{ padding: '12px', border: `2px solid ${selectedVoice === v.id ? 'var(--accent)' : 'var(--panel-border)'}`, borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, background: selectedVoice === v.id ? 'var(--muted-bg)' : 'var(--panel-bg)', transition: 'all 0.2s' }}
                          onClick={() => {
                            setSelectedVoice(v.id);
                            localStorage.setItem('ai_assistant_voice', v.id);
                            localStorage.setItem('ai_assistant_default_voice', v.id);
                            setIsVoiceOpen(false);
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: selectedVoice === v.id ? 'var(--accent)' : 'var(--foreground)' }}>
                            <Mic size={12} /> {v.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click to set as default</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Submit Button */}
        <button
          onClick={handlePromptSubmit}
          disabled={!promptText.trim()}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: promptText.trim() ? '#4f46e5' : '#ffffff',
            border: promptText.trim() ? 'none' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: promptText.trim() ? '#ffffff' : '#EEEEEE',
            cursor: promptText.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { if (promptText.trim()) e.currentTarget.style.backgroundColor = '#4338ca'; else e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseLeave={(e) => { if (promptText.trim()) e.currentTarget.style.backgroundColor = '#4f46e5'; else e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          <ArrowRight size={16} style={{ transform: 'rotate(-90deg)' }} />
        </button>
        </div>
      </div>


      </div>

      {/* Recent Videos Section */}
      <div style={{ marginTop: 48, marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={20} color="var(--accent)" /> Recent Videos
        </h2>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="spinner"></div>
            <style>{`.spinner { width: 40px; height: 40px; border: 4px solid var(--panel-border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : videos.length === 0 ? (
          <div style={{ background: 'var(--panel-bg)', border: '1px dashed var(--panel-border)', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Video size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>No videos yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Your generated videos will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {videos.map(video => (
              <div 
                key={video.id} 
                style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                onClick={() => setPreviewVideo(video)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: 'var(--muted-bg)' }}>
                  {video.thumbnail ? (
                    <img src={video.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={video.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <video src={video.url + '#t=0.001'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.2s' }} className="play-overlay">
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Play size={20} fill="#000" color="#000" style={{ marginLeft: 4 }} />
                    </div>
                  </div>
                  <style>{`.play-overlay:hover { opacity: 1 !important; }`}</style>
                  {videoDurations[video.id] && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
                      {videoDurations[video.id]}
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>{new Date(video.edited).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Video size={12} /> {video.url.endsWith('.mp4') ? 'Video' : 'Media'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            .cancel-btn:hover { background: var(--muted-bg) !important; }
            .download-btn:hover { background: #4338ca !important; }
          `}</style>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setPreviewVideo(null)} />
          
          <div style={{ position: 'relative', width: '100%', maxWidth: 960, background: 'var(--panel-bg)', borderRadius: 16, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Header */}
            <div style={{ padding: '24px 32px 20px', display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.5px' }}>{previewVideo.title}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
                  {new Date(previewVideo.edited).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(previewVideo.edited).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
              </div>
              <button 
                onClick={() => setPreviewVideo(null)} 
                style={{ background: 'var(--muted-bg)', border: 'none', color: 'var(--text-muted)', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} 
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-border)'} 
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--muted-bg)'}
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
                          border: `1.5px solid ${isActive ? '#6366f1' : 'var(--panel-border)'}`, 
                          background: isActive ? '#fefeff' : 'var(--panel-bg)', 
                          cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'none'
                        }}
                      >
                        {/* Custom Radio Button */}
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isActive ? '#6366f1' : 'var(--panel-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isActive && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? '#4f46e5' : 'var(--foreground)' }}>{option.label}</span>
                            {option.hd && (
                              <span style={{ background: isActive ? '#6366f1' : '#3b82f6', color: 'var(--panel-bg)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5 }}>HD</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: isActive ? '#6366f1' : 'var(--text-muted)', opacity: isActive ? 0.8 : 1, fontWeight: 500 }}>{option.res}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Box */}
                <div style={{ marginTop: 16, background: 'var(--muted-bg)', borderRadius: 12, padding: '6px 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Info size={16} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                    Higher quality videos may take longer to download and more storage space.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-start', gap: '8px', alignItems: 'center', background: '#fafafa' }}>
              <button 
                className="cancel-btn"
                onClick={() => setPreviewVideo(null)}
                style={{ padding: '10px 24px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--foreground)', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Cancel
              </button>
              <a 
                href={`/api/videos/download?filename=${previewVideo.filename}&quality=${downloadQuality === '1080p' ? 'original' : downloadQuality}`}
                download
                className="download-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#4f46e5', color: 'var(--panel-bg)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'background 0.2s' }}
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
