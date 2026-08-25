"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Sparkles, LayoutGrid, List, Play, MoreVertical,
  Clock, Video, X, Monitor, Smartphone, Square, ArrowRight,
  User, Mic, Settings, ChevronDown
} from 'lucide-react';

export default function HomeDashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // AI Assistant States
  const [promptText, setPromptText] = useState('');
  const [selectedAspect, setSelectedAspect] = useState('16/9');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [availableAvatars, setAvailableAvatars] = useState<any[]>([]);
  const [isAspectOpen, setIsAspectOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

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
          setVideos(data.videos);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Fetch Avatars
    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          setAvailableAvatars(data.avatars);
          if (data.avatars.length > 0) {
            setSelectedAvatar(data.avatars[data.avatars.length - 1].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handlePromptSubmit = () => {
    if (!promptText.trim()) return;
    localStorage.setItem('ai_assistant_script', promptText);
    localStorage.setItem('ai_assistant_aspect', selectedAspect);
    if (selectedAvatar) {
      localStorage.setItem('ai_assistant_avatar', selectedAvatar);
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
              padding: '6px 14px',
              fontSize: 12,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAvatarOpen(!isAvatarOpen);
              setIsAspectOpen(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={12} color="#475569" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>Avatar</div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {getSelectedAvatarName()} <ChevronDown size={10} color="#64748b" />
              </div>
            </div>
          </div>

          {/* Voice Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#f8fafc',
            border: 'none',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 12,
            color: '#0f172a',
            cursor: 'default'
          }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={12} color="#475569" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>Voice</div>
              <div style={{ fontWeight: 600 }}>Auto Voice</div>
            </div>
          </div>

          {/* Aspect Ratio Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f8fafc',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAspectOpen(!isAspectOpen);
              setIsAvatarOpen(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ffffff', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={12} color="#475569" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>Aspect Ratio</div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {selectedAspect === '16/9' ? '16:9 Landscape' : selectedAspect === '9/16' ? '9:16 Portrait' : '1:1 Square'} <ChevronDown size={10} color="#64748b" />
              </div>
            </div>
          </div>

          {/* Avatar Dropdown List overlay */}
          {isAvatarOpen && (
            <div style={{ position: 'absolute', top: 44, left: 0, width: 200, background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: 8, padding: 6, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.08)', maxHeight: 150, overflowY: 'auto' }}>
              {availableAvatars.length === 0 ? (
                <div style={{ padding: '8px 12px', fontSize: 11, color: '#64748b' }}>No avatars built yet</div>
              ) : (
                availableAvatars.map(a => (
                  <div
                    key={a.id}
                    style={{ padding: '8px 12px', fontSize: 11, cursor: 'pointer', background: selectedAvatar === a.id ? 'var(--accent)' : 'transparent', color: selectedAvatar === a.id ? '#ffffff' : '#334155', borderRadius: 6, fontWeight: selectedAvatar === a.id ? 600 : 400 }}
                    onClick={() => {
                      setSelectedAvatar(a.id);
                      setIsAvatarOpen(false);
                    }}
                    onMouseEnter={(e) => { if (selectedAvatar !== a.id) e.currentTarget.style.background = 'var(--background)'; }}
                    onMouseLeave={(e) => { if (selectedAvatar !== a.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {a.name}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Aspect Dropdown List overlay */}
          {isAspectOpen && (
            <div style={{ position: 'absolute', top: 44, left: 240, width: 160, background: '#ffffff', border: '1px solid var(--panel-border)', borderRadius: 8, padding: 6, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
              {[
                { val: '16/9', label: '16:9 Landscape' },
                { val: '9/16', label: '9:16 Portrait' },
                { val: '1/1', label: '1:1 Square' }
              ].map(opt => (
                <div
                  key={opt.val}
                  style={{ padding: '8px 12px', fontSize: 11, cursor: 'pointer', background: selectedAspect === opt.val ? 'var(--accent)' : 'transparent', color: selectedAspect === opt.val ? '#ffffff' : '#334155', borderRadius: 6, fontWeight: selectedAspect === opt.val ? 600 : 400 }}
                  onClick={() => {
                    setSelectedAspect(opt.val);
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
                cursor: promptText.trim() ? 'pointer' : 'not-allowed',
                opacity: promptText.trim() ? 1 : 0.5,
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
      {viewMode === 'grid' ? (
        <div className="home-recents grid">
          {/* Default/Simulated marketing project card */}
          <div
            className="home-recent-card"
            onClick={() => router.push('/studio')}
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
            <div className="home-recent-img" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
              <div className="home-recent-play">
                <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
              </div>
              <div className="home-recent-duration">00:15</div>
              <Video size={36} color="#60a5fa" style={{ opacity: 0.8 }} />
            </div>
            <div className="home-recent-info">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="home-recent-title">Project Q3 Marketing</div>
                <div className="home-recent-meta">
                  <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Updated 2h ago
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); alert("Project Options Menu (Stub)"); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}>
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Dynamic Generated Videos */}
          {videos.map((vid, idx) => (
            <div
              key={idx}
              className="home-recent-card"
              onClick={() => setPreviewVideoUrl(vid.url)}
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
              <div className="home-recent-img" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
                <div className="home-recent-play">
                  <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                </div>
                <div className="home-recent-duration">00:15</div>
                <Video size={36} color="#4ade80" style={{ opacity: 0.8 }} />
              </div>
              <div className="home-recent-info">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="home-recent-title">{vid.filename}</div>
                  <div className="home-recent-meta">
                    <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> Generated video
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); alert("Video Options Menu (Stub)"); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}>
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '2px solid #F5F5F5', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', padding: '12px 20px', borderBottom: '2px solid #F5F5F5', background: '#f8fafc', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
            <div>Name</div>
            <div>Duration</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* Default list item */}
          <div
            onClick={() => router.push('/studio')}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
              padding: '16px 20px',
              borderBottom: '2px solid #F5F5F5',
              alignItems: 'center',
              fontSize: 13,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, color: '#0f172a' }}>
              <Video size={16} color="var(--accent)" />
              Project Q3 Marketing
            </div>
            <div style={{ color: '#475569' }}>00:15</div>
            <div style={{ color: '#64748b' }}>Updated 2h ago</div>
            <button onClick={(e) => { e.stopPropagation(); alert("Options (Stub)"); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}>
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Dynamic list items */}
          {videos.map((vid, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewVideoUrl(vid.url)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr auto',
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
                {vid.filename}
              </div>
              <div style={{ color: '#475569' }}>00:15</div>
              <div style={{ color: '#64748b' }}>Generated video</div>
              <button onClick={(e) => { e.stopPropagation(); alert("Options (Stub)"); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}>
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setPreviewVideoUrl(null)}>
          <div style={{ background: '#ffffff', borderRadius: 8, width: '90%', maxWidth: '640px', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', position: 'relative', border: '2px solid #F5F5F5' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewVideoUrl(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} />
            </button>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Video Preview</h3>
            <video src={previewVideoUrl} controls autoPlay style={{ width: '100%', borderRadius: 8, aspectRatio: '16/9', objectFit: 'contain', background: '#000' }} />
          </div>
        </div>
      )}
    </div>
  );
}
