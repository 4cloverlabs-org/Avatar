"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Menu, Monitor, Undo2, Redo2, Sparkles, User, 
  Keyboard, FileText, Mic, Image as ImageIcon, Volume2, 
  Settings, ChevronDown, Check, X, Play, Upload, Plus,
  Wand2, Music, MessageSquare, Video, LayoutTemplate, Layers, MousePointer2
} from 'lucide-react';

export default function Dashboard() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [availableAvatars, setAvailableAvatars] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [referenceVoice, setReferenceVoice] = useState<File | null>(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [audioMode, setAudioMode] = useState<'upload' | 'clone'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          setAvailableAvatars(data.avatars);
          if (data.avatars.length > 0 && !avatarId) {
            setAvatarId(data.avatars[data.avatars.length - 1]);
          }
        }
      })
      .catch(console.error);
  }, []);
  const [scriptText, setScriptText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'result'>('canvas');
  
  const [bboxShift, setBboxShift] = useState(0);
  const [extraMargin, setExtraMargin] = useState(10);
  const [parsingMode, setParsingMode] = useState("jaw");
  const [leftCheekWidth, setLeftCheekWidth] = useState(100);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'recorded_voice.webm', { type: 'audio/webm' });
        setReferenceVoice(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!scriptText.trim()) return alert("Please enter a script to generate voice");
    setIsGeneratingVoice(true);
    try {
      const formData = new FormData();
      formData.append('text', scriptText);
      if (referenceVoice) {
        formData.append('audio', referenceVoice);
      }
      
      const res = await fetch('/api/tts', { method: 'POST', body: formData });
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], 'generated_voice.wav', { type: 'audio/wav' });
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(file));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to generate voice");
      }
    } catch (e) {
      alert("Error generating voice");
    }
    setIsGeneratingVoice(false);
  };

  const handlePrepareAvatar = async () => {
    if (!videoFile) return alert('Please upload a video to build the avatar.');
    setIsPreparing(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('bboxShift', bboxShift.toString());
      formData.append('extraMargin', extraMargin.toString());
      formData.append('parsingMode', parsingMode);
      formData.append('leftCheekWidth', leftCheekWidth.toString());
      
      const res = await fetch('/api/prepare_avatar', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.avatarId) {
        setAvatarId(data.avatarId);
        alert("Avatar built successfully! You can now upload audio and generate.");
      } else {
        alert(data.error || 'Failed to prepare avatar');
      }
    } catch (e) {
      alert('Error preparing avatar');
    }
    setIsPreparing(false);
  };

  const handleGenerateVideo = async () => {
    if (!avatarId) return alert('Please build the avatar first.');
    if (!audioFile) return alert('Please upload audio.');
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('avatarId', avatarId);
      formData.append('audio', audioFile);

      const res = await fetch('/api/generate_video', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.data && data.data[0]) {
        const videoData = data.data[0];
        const videoUrl = videoData.url || videoData.video?.url || videoData.path || videoData.video?.path || videoData;
        setResultVideo(videoUrl);
        setActiveTab('result');
      } else {
        alert(data.error || 'Failed to generate');
      }
    } catch (e) {
      alert('Error generating video');
    }
    setIsGenerating(false);
  };

  return (
    <>
      <header className="header" style={{ justifyContent: 'flex-end' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {availableAvatars.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button 
                className="btn-dropdown"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                  {avatarId ? `Avatar: ${avatarId.substring(0,8)}...` : "Select Avatar"}
                </div>
                <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding: '8px 12px', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>
                    Available Avatars
                  </div>
                  {availableAvatars.map(id => (
                    <div 
                      key={id}
                      className={`dropdown-item ${avatarId === id ? 'active' : ''}`}
                      onClick={() => { setAvatarId(id); setIsDropdownOpen(false); }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {avatarId === id ? <Check size={14} color="var(--accent)" /> : <div style={{width: 14}} />}
                        {id.substring(0,8)}...
                      </div>
                      <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div style={{ width: '1px', height: '24px', background: 'var(--panel-border)' }} />

          <button className="btn-secondary" onClick={handlePrepareAvatar} disabled={isPreparing} style={{ opacity: isPreparing ? 0.7 : 1 }}>
            <User size={16} />
            {isPreparing ? "Building Avatar..." : "Build Avatar"}
          </button>
          <button className="btn-primary" onClick={handleGenerateVideo} disabled={isGenerating || !avatarId} style={{ opacity: isGenerating || !avatarId ? 0.7 : 1 }}>
            <Sparkles size={16} />
            {isGenerating ? "Generating..." : "Generate Video"}
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        
        {/* Left Panel - Script */}
        <div className="panel" style={{ flex: '0 0 350px' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Script</h3>
            <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
              <Keyboard size={16} />
              <FileText size={16} />
            </div>
          </div>
          
          <div className="scroll-area" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <textarea 
              style={{
                width: '100%', height: '180px', background: 'transparent', border: 'none', 
                color: 'var(--foreground)', fontSize: 14, resize: 'none', outline: 'none',
                lineHeight: '1.5'
              }}
              placeholder={isTranscribing ? "Transcribing audio..." : "Enter your script here..."}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
            />

            <div className="layout-toggle" style={{ display: 'flex', background: '#222', borderRadius: '8px', padding: '4px' }}>
              <button 
                className={audioMode === 'upload' ? 'active' : ''} 
                onClick={() => setAudioMode('upload')}
                style={{ flex: 1, padding: '6px 0', borderRadius: '6px', border: 'none', background: audioMode === 'upload' ? '#333' : 'transparent', color: audioMode === 'upload' ? '#fff' : 'var(--text-muted)', cursor: 'pointer' }}
              >
                Upload Audio
              </button>
              <button 
                className={audioMode === 'clone' ? 'active' : ''} 
                onClick={() => setAudioMode('clone')}
                style={{ flex: 1, padding: '6px 0', borderRadius: '6px', border: 'none', background: audioMode === 'clone' ? '#333' : 'transparent', color: audioMode === 'clone' ? '#fff' : 'var(--text-muted)', cursor: 'pointer' }}
              >
                Clone Audio
              </button>
            </div>

            {audioMode === 'upload' ? (
              <div 
                style={{
                  border: '1px dashed var(--panel-border)', borderRadius: '8px', padding: '30px 15px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                onClick={() => audioInputRef.current?.click()}
              >
                <Upload size={24} />
                <div style={{ textAlign: 'center', fontSize: 13 }}>
                  <span style={{ color: '#fff' }}>{audioFile ? audioFile.name : 'Drop Audio Here'}</span><br/>
                  - or -<br/>
                  Click to Upload
                </div>
                <input type="file" hidden ref={audioInputRef} accept="audio/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAudioFile(file);
                    setAudioPreview(URL.createObjectURL(file));
                    
                    // Auto-transcribe
                    if (!scriptText.trim()) {
                      setIsTranscribing(true);
                      const fd = new FormData();
                      fd.append("audio", file);
                      fetch("/api/transcribe", { method: "POST", body: fd })
                        .then(r => r.json())
                        .then(d => {
                          if (d.success && d.text) setScriptText(d.text);
                        })
                        .catch(err => console.error(err))
                        .finally(() => setIsTranscribing(false));
                    }
                  }
                }} />
              </div>
            ) : (
              <div style={{ border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '15px', background: 'var(--panel-bg)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Reference Voice</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div 
                    style={{ flex: 1, background: '#222', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: 13, cursor: 'pointer', border: '1px dashed var(--panel-border)' }}
                    onClick={() => document.getElementById('reference-voice-upload')?.click()}
                  >
                    <Upload size={14} /> {referenceVoice && !referenceVoice.name.includes('recorded_voice') ? "Change File" : "Upload"}
                  </div>
                  <div 
                    style={{ flex: 1, background: isRecording ? '#ef4444' : '#222', color: isRecording ? '#fff' : 'inherit', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: 13, cursor: 'pointer', border: '1px dashed var(--panel-border)', transition: '0.2s' }}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    <Mic size={14} /> {isRecording ? "Stop Rec" : "Record"}
                  </div>
                </div>
                
                {referenceVoice && (
                  <div style={{ marginTop: 10, fontSize: 12, color: '#10b981', textAlign: 'center' }}>
                    ✓ {referenceVoice.name} selected
                  </div>
                )}

                <input type="file" id="reference-voice-upload" hidden accept="audio/*" onChange={(e) => {
                  if (e.target.files?.[0]) setReferenceVoice(e.target.files[0]);
                }} />
                
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={handleGenerateVoice}
                  disabled={isGeneratingVoice || !referenceVoice}
                >
                  <Wand2 size={14} /> {isGeneratingVoice ? "Generating Audio..." : "Generate Cloned Audio"}
                </button>
              </div>
            )}
            {audioPreview && <audio controls src={audioPreview} style={{ width: '100%', marginTop: 10, height: 30 }} />}

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                <Plus size={14} /> Add scene
              </button>
              <button className="btn-secondary" style={{ padding: '8px 12px' }}>
                <Mic size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="panel" style={{ flex: 1, background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ display: 'flex', gap: '20px', padding: '0 10px', borderBottom: '1px solid var(--panel-border)', fontSize: 13 }}>
            <div onClick={() => setActiveTab('canvas')} style={{ padding: '10px 0', color: activeTab === 'canvas' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === 'canvas' ? '2px solid var(--accent)' : 'none', cursor: 'pointer' }}>Canvas</div>
            <div onClick={() => setActiveTab('result')} style={{ padding: '10px 0', color: activeTab === 'result' ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === 'result' ? '2px solid var(--accent)' : 'none', cursor: 'pointer' }}>Result</div>
          </div>

          <div style={{ flex: 1, background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', overflow: 'hidden', position: 'relative' }} onClick={() => { if (!isGenerating && activeTab === 'canvas') videoInputRef.current?.click() }}>
            {isGenerating ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ width: 40, height: 40, border: '4px solid #333', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <div style={{ color: '#fff', fontSize: 15 }}>Generating AI Video...</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>This usually takes a few minutes</div>
              </div>
            ) : (
              <div className="panel" style={{ flex: 1, width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 40px rgba(0, 210, 255, 0.1), inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
            {activeTab === 'result' ? (
              resultVideo ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <video src={resultVideo} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                </div>
              ) : (
                <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-muted)' }}>No result generated yet.</div>
              )
            ) : videoPreview ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <video src={videoPreview} controls style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
              </div>
            ) : (
              <>
                <Upload size={32} style={{ marginBottom: 15 }} />
                <div style={{ textAlign: 'center', fontSize: 15 }}>
                  <span style={{ color: '#fff' }}>Drop Video Here</span><br/><br/>
                  - or -<br/><br/>
                  Click to Upload
                </div>
              </>
            )}
            </div>
            )}
            <input type="file" hidden ref={videoInputRef} accept="video/*" onChange={(e) => {
              if (e.target.files?.[0]) {
                setVideoFile(e.target.files[0]);
                setVideoPreview(URL.createObjectURL(e.target.files[0]));
                setResultVideo(null);
                setActiveTab('canvas');
                setAvatarId(null);
              }
            }} />
          </div>

          <div className="panel" style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: 13 }}>
              <Play size={14} />
              <span>00:00 / 00:00</span>
              <span style={{ color: 'var(--text-muted)' }}>1x <ChevronDown size={12} style={{ display: 'inline' }} /></span>
              <Volume2 size={16} color="var(--text-muted)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 30, height: 40, background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={14} />
              </div>
              <Plus size={14} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="panel" style={{ flex: '0 0 320px' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Avatar & Voice (Scene 1)</h3>
            <X size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div className="scroll-area" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Avatar Section */}
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Avatar</div>
              <div style={{ background: '#222', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Select Avatar</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No avatar selected</div>
                  </div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: 'rotate(-90deg)' }} />
              </div>
            </div>

            {/* Voice Section */}
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Voice Output</div>
              <div style={{ background: '#222', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13, cursor: 'pointer' }}>
                <Volume2 size={14} /> {audioFile ? audioFile.name : "No Audio Selected"}
              </div>
            </div>

            {/* Motion Engine */}
            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Motion Engine</div>
                <ChevronDown size={16} color="var(--text-muted)" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13, marginBottom: 15 }}>
                <Wand2 size={14} color="#ffb347" /> Avatar V <ChevronDown size={12} /> <Settings size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </div>

              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>BBox Shift Value</div>
                <input type="number" value={bboxShift} onChange={(e) => setBboxShift(Number(e.target.value))} style={{ width: '100%', background: '#222', border: '1px solid #333', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: 13, outline: 'none' }} />
              </div>
            </div>

            {/* Avatar Background */}
            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Avatar Background</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, border: '1px dashed #fff' }} /> Customize
                </button>
                <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: 12 }}>
                  <User size={12} /> Remove
                </button>
              </div>
              <button className="btn-secondary" style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: 12 }}>
                <div style={{ width: 12, height: 12, background: '#4169E1' }} /> Color
              </button>
            </div>

            {/* Layout */}
            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Layout</div>
              <div className="layout-toggle">
                <button className="active">Original</button>
                <button>Circle</button>
              </div>
            </div>

            {/* Face Parameters */}
            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Face Parameters</div>
                <ChevronDown size={16} color="var(--text-muted)" />
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Parsing Mode</div>
                <div className="layout-toggle" style={{ display: 'inline-flex', background: '#222' }}>
                  <button className={parsingMode === 'jaw' ? 'active' : ''} onClick={() => setParsingMode('jaw')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000' }} /> jaw
                  </button>
                  <button className={parsingMode === 'raw' ? 'active' : ''} onClick={() => setParsingMode('raw')} style={{ padding: '6px 12px' }}>raw</button>
                </div>
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Radius</span>
                  <span style={{ background: '#222', padding: '2px 6px', borderRadius: 4 }}>{extraMargin} ↻</span>
                </div>
                <input type="range" min="0" max="40" value={extraMargin} onChange={(e) => setExtraMargin(Number(e.target.value))} className="custom-slider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginTop: 4 }}>
                  <span>0</span><span>40</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Zoom</span>
                  <span style={{ background: '#222', padding: '2px 6px', borderRadius: 4 }}>{leftCheekWidth} ↻</span>
                </div>
                <input type="range" min="20" max="160" value={leftCheekWidth} onChange={(e) => setLeftCheekWidth(Number(e.target.value))} className="custom-slider" />
              </div>
            </div>

          </div>
        </div>

        {/* Icon Sidebar */}
        <nav className="icon-sidebar">
          <button className="icon-btn"><User size={20} />Avatar</button>
          <button className="icon-btn"><Sparkles size={20} />AI tools</button>
          <button className="icon-btn"><ImageIcon size={20} />Media</button>
          <button className="icon-btn"><Layers size={20} />Elements</button>
          <button className="icon-btn"><Music size={20} />Music</button>
          <button className="icon-btn"><MessageSquare size={20} />Captions</button>
          <button className="icon-btn"><Video size={20} />Screen Recorder</button>
          <button className="icon-btn"><LayoutTemplate size={20} />Templates</button>
          <button className="icon-btn"><Layers size={20} />Layers</button>
          <button className="icon-btn"><MousePointer2 size={20} />Interactivity</button>
        </nav>

      </div>
    </>
  );
}
