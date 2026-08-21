"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, Undo2, Redo2, Cloud, Play, Plus, Image as ImageIcon,
  User, Type, Square, LayoutTemplate, Film, MessageSquare, MousePointer2,
  Mic, Settings, Upload, Check, Volume2, Wand2, X, ChevronDown, ArrowLeft, Video, Music, Layers, Keyboard, FileText
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
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
  
  // New UI States
  const [isBgMediaOn, setIsBgMediaOn] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [activeTool, setActiveTool] = useState('Avatar');
  const [sceneColor, setSceneColor] = useState('#FFFFFF');
  const [documentTitle, setDocumentTitle] = useState('Untitled');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectAspectRatio, setProjectAspectRatio] = useState('16/9');

  // Drag and Resize State
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoBox, setVideoBox] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [interactionState, setInteractionState] = useState<'none' | 'dragging' | 'resizing'>('none');
  const [isSelected, setIsSelected] = useState(false);
  const interactionStartRef = useRef({ startX: 0, startY: 0, initialBox: { x: 0, y: 0, width: 100, height: 100 } });

  const handlePointerDown = (e: React.PointerEvent, type: 'dragging' | 'resizing') => {
    e.stopPropagation();
    setIsSelected(true);
    setInteractionState(type);
    interactionStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...videoBox }
    };
  };

  useEffect(() => {
    if (interactionState === 'none') return;
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - interactionStartRef.current.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - interactionStartRef.current.startY) / rect.height) * 100;
      
      if (interactionState === 'dragging') {
        setVideoBox({
          ...interactionStartRef.current.initialBox,
          x: interactionStartRef.current.initialBox.x + deltaX,
          y: interactionStartRef.current.initialBox.y + deltaY,
        });
      } else if (interactionState === 'resizing') {
        setVideoBox({
          ...interactionStartRef.current.initialBox,
          width: Math.max(10, interactionStartRef.current.initialBox.width + deltaX),
          height: Math.max(10, interactionStartRef.current.initialBox.height + deltaY),
        });
      }
    };
    
    const handlePointerUp = () => setInteractionState('none');
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [interactionState, videoBox]);

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
    <div className="light-theme syn-layout">
      {/* HEADER */}
      <header className="syn-header">
         <div className="syn-header-left">
           <ArrowLeft size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => router.push('/dashboard')} />
           
           {isEditingTitle ? (
             <input 
               autoFocus
               type="text" 
               value={documentTitle} 
               onChange={(e) => setDocumentTitle(e.target.value)}
               onBlur={() => setIsEditingTitle(false)}
               onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
               style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: 'var(--foreground)', background: 'transparent', border: '1px solid var(--accent)', outline: 'none', borderRadius: 4, padding: '2px 4px', width: 100 }}
             />
           ) : (
             <span 
               onClick={() => setIsEditingTitle(true)}
               style={{ fontWeight: 600, fontSize: 13, color: "var(--foreground)", marginLeft: 8, cursor: 'text', padding: '3px 5px', borderRadius: 4 }}
               className="hover-bg-gray"
             >
               {documentTitle}
             </span>
           )}

           <Cloud size={16} color="var(--text-muted)" style={{ marginLeft: 8 }} />
           <div style={{ width: 1, height: 16, background: "var(--panel-border)", margin: "0 12px" }} />
           <Undo2 size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => alert("Undo function (Stub)")} />
           <Redo2 size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => alert("Redo function (Stub)")} />
         </div>
         
         <div className="syn-header-center">
           {['Avatar', 'Text', 'Shape', 'Motion', 'Media', 'Captions', 'Interactivity', 'Record'].map(tool => {
             const Icon = {
               Avatar: User, Text: Type, Shape: Square, Motion: LayoutTemplate,
               Media: ImageIcon, Captions: MessageSquare, Interactivity: MousePointer2, Record: Mic
             }[tool as keyof typeof Icon];
             return (
               <div 
                 key={tool}
                 className={`syn-tool ${activeTool === tool ? 'syn-tool-active' : ''}`}
                 onClick={() => setActiveTool(tool)}
               >
                 <Icon size={20} />{tool}
               </div>
             )
           })}
         </div>
         
         <div className="syn-header-right">
           <Play size={18} color="var(--text-muted)" style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => setActiveTab(activeTab === 'canvas' ? 'result' : 'canvas')} />
           <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>K</div>
           <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--panel-border)' }} onClick={() => alert("Invite a collaborator (Stub)")}>
             <Plus size={14} /> Invite
           </button>
           <button className="syn-btn-primary" onClick={handleGenerateVideo} disabled={isGenerating || !avatarId || !audioFile}>
             <Play size={14} fill="#fff" /> Generate
           </button>
         </div>
      </header>

      <div className="syn-main">
        {/* LEFT SIDEBAR */}
        <div className="syn-sidebar-left">
           <div style={{ padding: 15 }}>
             <button className="btn-secondary" style={{ width: '100%', padding: '8px 0', fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, border: '1px solid var(--panel-border)' }} onClick={() => alert("Add a new scene (Stub)")}>
               <Plus size={14} /> Add scene
             </button>
           </div>
           
           <div style={{ flex: 1, padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 10 }}>
             <div style={{ background: '#e0e7ff', height: 100, borderRadius: 8, border: '2px solid var(--accent)', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
               <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 11, fontWeight: 600, color: '#111827', background: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: 4 }}>1</span>
               <div style={{ position: 'absolute', bottom: 6, left: 6, background: '#111827', color: '#fff', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}><User size={12} /></div>
               {videoPreview && <video src={videoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
             </div>
           </div>

           <div style={{ padding: 15, borderTop: '1px solid var(--panel-border)', fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => alert("Help Center (Stub)")}>
             <div style={{ border: '1px solid currentColor', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>?</div> Help
           </div>
        </div>

        {/* CENTER WORKSPACE */}
        <div className="syn-workspace">
           {/* Canvas Area */}
           <div className="syn-canvas-area" onClick={() => { setIsSelected(false); if (!isGenerating && activeTab === 'canvas' && !videoPreview) videoInputRef.current?.click() }}>
              <div ref={containerRef} className="syn-video-container" style={
                projectAspectRatio === '9/16' ? { background: sceneColor, width: 'min(100cqw, 100cqh * 9 / 16)', height: 'min(100cqh, 100cqw * 16 / 9)' } :
                projectAspectRatio === '1/1' ? { background: sceneColor, width: 'min(100cqw, 100cqh)', height: 'min(100cqh, 100cqw)' } :
                { background: sceneColor, width: 'min(100cqw, 100cqh * 16 / 9)', height: 'min(100cqh, 100cqw * 9 / 16)' }
              }>
                 {isGenerating ? (
                   <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15, background: '#fff' }}>
                     <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                     <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                     <div style={{ color: '#111827', fontSize: 15, fontWeight: 500 }}>Generating AI Video...</div>
                   </div>
                 ) : activeTab === 'result' && resultVideo ? (
                   <div style={{ position: 'absolute', left: `${videoBox.x}%`, top: `${videoBox.y}%`, width: `${videoBox.width}%`, height: `${videoBox.height}%`, border: isSelected ? '2px solid #3b82f6' : 'none', cursor: isSelected ? (interactionState === 'dragging' ? 'grabbing' : 'grab') : 'pointer', touchAction: 'none' }} onPointerDown={(e) => handlePointerDown(e, 'dragging')}>
                     <video src={resultVideo} controls={!isSelected} autoPlay style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: isSelected ? 'none' : 'auto' }} />
                     {isSelected && <div onPointerDown={(e) => handlePointerDown(e, 'resizing')} style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#3b82f6', borderRadius: '50%', cursor: 'nwse-resize' }} />}
                   </div>
                 ) : videoPreview ? (
                   <div style={{ position: 'absolute', left: `${videoBox.x}%`, top: `${videoBox.y}%`, width: `${videoBox.width}%`, height: `${videoBox.height}%`, border: isSelected ? '2px solid #3b82f6' : 'none', cursor: isSelected ? (interactionState === 'dragging' ? 'grabbing' : 'grab') : 'pointer', touchAction: 'none' }} onPointerDown={(e) => handlePointerDown(e, 'dragging')}>
                     <video src={videoPreview} controls={!isSelected} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: isSelected ? 'none' : 'auto' }} />
                     {isSelected && <div onPointerDown={(e) => handlePointerDown(e, 'resizing')} style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#3b82f6', borderRadius: '50%', cursor: 'nwse-resize' }} />}
                   </div>
                 ) : (
                   <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280', background: '#f9fafb' }}>
                     <Upload size={32} style={{ marginBottom: 15, color: 'var(--accent)' }} />
                     <div style={{ textAlign: 'center', fontSize: 14 }}>
                       <span style={{ color: '#111827', fontWeight: 500 }}>Drop Video Here</span><br/><br/>
                       <span style={{ color: '#9ca3af' }}>- or -</span><br/><br/>
                       <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>Click to Upload</span>
                     </div>
                   </div>
                 )}
              </div>
           </div>

           {/* Timeline & Script Area */}
           <div className="syn-timeline-area">
             <div className="syn-timeline-header">
               <div style={{ display: 'flex', alignItems: 'center', gap: 15, borderRight: '1px solid var(--panel-border)', paddingRight: 15 }}>
                 <Play size={14} style={{ cursor: 'pointer' }} /> <Volume2 size={14} style={{ cursor: 'pointer' }} />
                 <span style={{ color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Play size={12} fill="currentColor" /> Preview</span>
               </div>
               <div className="syn-timeline-ticks">
                 <span>|</span><span>00:01</span><span>|</span><span>00:02</span><span>|</span><span>00:03</span><span>|</span><span>00:04</span><span>|</span>
               </div>
             </div>
             
             <div className="syn-script-area">
               <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                 <div style={{ width: 32, height: 32, borderRadius: 16, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#111827', cursor: 'pointer' }}>
                   <User size={16} color="var(--text-muted)" />
                 </div>
                 <div style={{ width: 32, height: 20, borderRadius: 4, background: '#f3f4f6', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}>EN</div>
               </div>
               <textarea 
                 className="syn-script-textarea"
                 placeholder="Type your script here. To keep this scene with no voice-over, add a pause."
                 value={scriptText}
                 onChange={(e) => setScriptText(e.target.value)}
               />
             </div>
           </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="syn-sidebar-right">
           <div className="syn-panel-section">
             <div className="syn-panel-title">Scene layout</div>
             <button className="btn-secondary" style={{ width: '100%', padding: '8px 0', fontSize: 13, background: '#f4f5f7', border: '1px solid var(--panel-border)', marginBottom: 15 }} onClick={() => videoInputRef.current?.click()}>
               <Undo2 size={12} style={{ display: 'inline', marginRight: 6, transform: 'rotate(180deg)' }} /> Replace
             </button>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Aspect Ratio</span>
               <select 
                 style={{ background: '#fff', border: '1px solid var(--panel-border)', borderRadius: 6, padding: '4px 8px', fontSize: 12, outline: 'none', color: 'var(--foreground)' }}
                 value={projectAspectRatio}
                 onChange={(e) => setProjectAspectRatio(e.target.value)}
                 onClick={(e) => e.stopPropagation()}
               >
                 <option value="16/9">16:9 Landscape</option>
                 <option value="9/16">9:16 Portrait</option>
                 <option value="1/1">1:1 Square</option>
               </select>
             </div>
           </div>
           
           <div className="syn-panel-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Color</span>
             <div 
               style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f4f5f7', padding: '4px 8px', borderRadius: 6, fontSize: 12, border: '1px solid var(--panel-border)', cursor: 'pointer' }}
               onClick={() => {
                 const newColor = prompt("Enter a hex color code (e.g. #FFFFFF)", sceneColor);
                 if (newColor) setSceneColor(newColor);
               }}
             >
               <div style={{ width: 14, height: 14, background: sceneColor, border: '1px solid #d1d5db', borderRadius: 2 }} />
               {sceneColor.replace('#', '')}
             </div>
           </div>

           <div className="syn-panel-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Background media</span>
             <div className={`syn-toggle-switch ${isBgMediaOn ? 'on' : ''}`} onClick={() => setIsBgMediaOn(!isBgMediaOn)} />
           </div>

           <div className="syn-panel-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Music</span>
             <div className={`syn-toggle-switch ${isMusicOn ? 'on' : ''}`} onClick={() => setIsMusicOn(!isMusicOn)} />
           </div>

           {/* Avatar Generation Integration (Collapsible) */}
           <div className="syn-panel-section">
             <div className="syn-panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               Avatar Engine <Settings size={14} color="var(--text-muted)" />
             </div>
             
             {availableAvatars.length > 0 && (
               <div style={{ marginBottom: 15 }}>
                 <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Selected Avatar</div>
                 <div style={{ background: '#f4f5f7', padding: '8px 12px', borderRadius: 6, fontSize: 12, border: '1px solid var(--panel-border)' }}>
                   {avatarId ? `Avatar: ${avatarId.substring(0,8)}...` : "Select Avatar (Dropdown)"}
                 </div>
               </div>
             )}

             <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Voice Source</div>
             <div style={{ background: '#f4f5f7', padding: '8px 12px', borderRadius: 6, fontSize: 12, border: '1px dashed var(--panel-border)', cursor: 'pointer', marginBottom: 15 }} onClick={() => audioInputRef.current?.click()}>
               <Upload size={14} style={{ display: 'inline', marginRight: 4 }} /> 
               {audioFile ? audioFile.name : "Upload Voice File"}
             </div>
             
             <button className="btn-secondary" style={{ width: '100%', padding: '8px 0', fontSize: 13, background: 'var(--panel-bg)' }} onClick={handlePrepareAvatar} disabled={isPreparing}>
               <User size={14} style={{ display: 'inline', marginRight: 4 }} />
               {isPreparing ? "Building Avatar..." : "Build Avatar"}
             </button>
           </div>
        </div>

      </div>

      <input type="file" hidden ref={videoInputRef} accept="video/*" onChange={(e) => {
        if (e.target.files?.[0]) {
          const file = e.target.files[0];
          setVideoFile(file);
          const url = URL.createObjectURL(file);
          setVideoPreview(url);
          setResultVideo(null);
          setActiveTab('canvas');
          setAvatarId(null);
          
          const video = document.createElement('video');
          video.src = url;
          video.onloadedmetadata = () => {
            if (video.videoHeight > video.videoWidth * 1.2) {
              setProjectAspectRatio('9/16');
            } else if (Math.abs(video.videoWidth - video.videoHeight) < video.videoWidth * 0.1) {
              setProjectAspectRatio('1/1');
            } else {
              setProjectAspectRatio('16/9');
            }
          };
        }
      }} />
      <input type="file" hidden ref={audioInputRef} accept="audio/*" onChange={(e) => {
        if (e.target.files?.[0]) {
          setAudioFile(e.target.files[0]);
        }
      }} />
    </div>
  );
}
