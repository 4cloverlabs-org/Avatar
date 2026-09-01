"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu, Undo2, Redo2, Cloud, Play, Plus, Image as ImageIcon,
  User, Type, Square, LayoutTemplate, Film, MessageSquare, MousePointer2,
  Mic, Settings, Upload, Check, Volume2, Wand2, X, Trash2, ChevronDown, ArrowLeft, Video, Music, Layers, Keyboard, FileText,
  AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal, AlignStartVertical, AlignCenterVertical, AlignEndVertical, Pipette, Link as LinkIcon, Diamond, Wrench, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export type CanvasElement = {
  id: string;
  type: 'text' | 'shape' | 'media';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  props: any;
  motion?: { entrance?: string, exit?: string, type?: string, duration?: number, delay?: number };
};

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const baseUrl = url.split('?')[0].split('#')[0];
  return /\.(mp4|webm|ogg|mov)$/i.test(baseUrl) || url.includes('blob:') || url.includes('/api/serve_video') || url.includes('/preview');
};

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);

  const pollForVideo = async (targetAvatarId: string, aspect: string) => {
    // Poll every 10 seconds for up to 60 minutes
    for (let i = 0; i < 360; i++) {
      try {
        const res = await fetch(`/api/check_video?avatarId=${targetAvatarId}&aspect=${encodeURIComponent(aspect)}`);
        const data = await res.json();
        if (data.success && data.ready) {
           setResultVideo(data.url);
           setActiveTab('result');
           setIsGenerating(false);
           return true;
        }
      } catch (e) {}
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    setIsGenerating(false);
    return false;
  };

  useEffect(() => {
    // Check for an avatar image passed from the avatars page
    const params = new URLSearchParams(window.location.search);
    const avatarUrl = params.get('avatar');
    if (avatarUrl) {
      setVideoPreview(avatarUrl);
    }

    fetch('/api/voices')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.voices) {
          setAvailableVoices(data.voices);
          const passedVoice = localStorage.getItem('ai_assistant_voice');
          if (passedVoice && data.voices.some((v: any) => v.id === passedVoice)) {
            setSelectedVoiceId(passedVoice);
          } else if (data.voices.length > 0) {
            setSelectedVoiceId(data.voices[0].id);
          }
          localStorage.removeItem('ai_assistant_voice');
        }
      })
      .catch(console.error);
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const file = new File([audioBlob], 'recorded_audio.webm', { type: 'audio/webm' });
          setAudioFile(file);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied or unavailable.");
      }
    }
  };

  // New UI States
  const [isBgMediaOn, setIsBgMediaOn] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [activeTool, setActiveTool] = useState('Avatar');
  const [sceneColor, setSceneColor] = useState('#ffffff');
  const [documentTitle, setDocumentTitle] = useState('Untitled');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectAspectRatio, setProjectAspectRatio] = useState('16/9');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Drag and Resize State
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoBox, setVideoBox] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [copiedElements, setCopiedElements] = useState<CanvasElement[]>([]);

  // Keyboard shortcuts [mediaLibrary, setMediaLibrary] = useState<{src: string, isVideo: boolean}[]>([]);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<{src: string, isVideo: boolean}[]>([]);
  const [isLibraryEditMode, setIsLibraryEditMode] = useState(false);
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null); // 'main_video' or element id
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playKey, setPlayKey] = useState('0');
  const [interactionState, setInteractionState] = useState<string>('none');
  const interactionStartRef = useRef({ startX: 0, startY: 0, initialBox: { x: 0, y: 0, width: 100, height: 100 }, elementId: '', initialFontSize: 24 });

  const handlePointerDown = (e: React.PointerEvent, type: string, elementId: string) => {
    e.stopPropagation();
    setSelectedId(elementId);
    setInteractionState(type);

    let initialBox = { x: 0, y: 0, width: 100, height: 100 };
    let initialFontSize = 24;
    if (elementId === 'main_video') {
      initialBox = { ...videoBox };
    } else {
      const el = elements.find(el => el.id === elementId);
      if (el) {
        initialBox = { x: el.x, y: el.y, width: el.width, height: el.height };
        if (el.type === 'text') {
          setActiveTool('Text');
          initialFontSize = el.props.fontSize || 24;
          // For text, grab the actual DOM width so we can scale accurately
          const domEl = document.getElementById(`element-${elementId}`);
          if (domEl) {
            initialBox.width = domEl.getBoundingClientRect().width;
          }
        }
        if (el.type === 'shape') setActiveTool('Shape');
        if (el.type === 'media') setActiveTool('Media');
      }
    }

    interactionStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialBox,
      elementId,
      initialFontSize
    };
  };

  const addMediaToCanvas = (src: string, isVideo: boolean = false) => {
    if (isVideo) {
      setElements(prev => [...prev, {
        id: 'media_' + Date.now(),
        type: 'media',
        x: 20 + (prev.length * 2),
        y: 20 + (prev.length * 2),
        width: 40,
        height: 40, // Default for video until metadata loads, or we can just use 16:9 roughly
        zIndex: prev.length,
        props: { src, isVideo }
      }]);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalHeight / img.naturalWidth;
      const defaultWidth = 40;
      setElements(prev => [...prev, {
        id: 'media_' + Date.now(),
        type: 'media',
        x: 20 + (prev.length * 2),
        y: 20 + (prev.length * 2),
        width: defaultWidth,
        height: defaultWidth * ratio,
        zIndex: prev.length,
        props: { src, isVideo }
      }]);
    };
    img.onerror = () => {
      setElements(prev => [...prev, {
        id: 'media_' + Date.now(),
        type: 'media',
        x: 20 + (prev.length * 2),
        y: 20 + (prev.length * 2),
        width: 40,
        height: 40,
        zIndex: prev.length,
        props: { src, isVideo }
      }]);
    };
    img.src = src;
  };


  useEffect(() => {
    // Read AI Assistant handoff data from dashboard
    const script = localStorage.getItem('ai_assistant_script');
    const aspect = localStorage.getItem('ai_assistant_aspect');
    const avatar = localStorage.getItem('ai_assistant_avatar');
    const autoGen = localStorage.getItem('ai_assistant_auto_generate');
    const hasCustomVoice = localStorage.getItem('ai_assistant_has_custom_voice');

    if (aspect) setProjectAspectRatio(aspect);
    if (script) setScriptText(script);
    if (avatar) setAvatarId(avatar);

    if (autoGen === 'true') {
      if (hasCustomVoice === 'true') {
        // Load file from IndexedDB (Legacy)
        const request = indexedDB.open("VoiceDB", 1);
        request.onsuccess = (e: any) => {
          const db = e.target.result;
          const tx = db.transaction("voice", "readonly");
          const store = tx.objectStore("voice");
          const getReq = store.get("dashboardVoice");
          getReq.onsuccess = () => {
            const customVoiceFile = getReq.result;
            if (customVoiceFile) {
              setAudioFile(customVoiceFile);
              setAudioPreview(URL.createObjectURL(customVoiceFile));
            }
          };
        };
      } else if (script) {
        // Voice ID passed from dashboard
        const passedVoice = localStorage.getItem('ai_assistant_voice');
        if (passedVoice) {
           // It will be handled below when fetching voices
           // but we need to ensure the auto-generate still triggers if they want.
           // However, if they pass a voice ID, we just want it to be pre-selected in the dropdown.
           // Auto-generating TTS immediately might be confusing if they haven't reviewed it, 
           // but we'll leave it as is for now.
        }
      }
    }

    // Fetch Avatars immediately and set preview based on the handed-off avatar
    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          const readyAvatars = data.avatars.filter((a: any) => a.status === 'ready');
          setAvailableAvatars(readyAvatars);
          
          const isValidAvatar = avatar && readyAvatars.some((a: any) => a.id === avatar);
          const targetId = isValidAvatar ? avatar : (readyAvatars.length > 0 ? readyAvatars[readyAvatars.length - 1].id : null);
          
          if (targetId) {
            setAvatarId(targetId);
            const found = readyAvatars.find((a: any) => a.id === targetId);
            if (found && found.preview) {
               setVideoPreview(found.preview);
            } else if (targetId.length === 36) { // Custom UUID avatar
               setVideoPreview(`/api/serve_video?type=av&path=${targetId}`);
            } else {
               setVideoPreview(`/avatars/${targetId}.jpg`);
            }
          }
        }
      })
      .catch(console.error);

    // Clear after reading so it doesn't pollute subsequent visits
    localStorage.removeItem('ai_assistant_script');
    localStorage.removeItem('ai_assistant_aspect');
    localStorage.removeItem('ai_assistant_avatar');
    localStorage.removeItem('ai_assistant_auto_generate');
    localStorage.removeItem('ai_assistant_has_custom_voice');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingId) return; // Don't delete if actively editing inline text
      if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedId && selectedId !== 'main_video') {
          setElements(prev => prev.filter(el => el.id !== selectedId));
          setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, editingId]);

  useEffect(() => {
    if (interactionState === 'none') return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - interactionStartRef.current.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - interactionStartRef.current.startY) / rect.height) * 100;

      const { elementId, initialBox, initialFontSize } = interactionStartRef.current;

      const updateBox = (box: typeof initialBox) => {
        if (interactionState === 'dragging') {
          return { ...box, x: initialBox.x + deltaX, y: initialBox.y + deltaY };
        } else if (interactionState.startsWith('resize')) {
          let newX = initialBox.x;
          let newY = initialBox.y;
          let newW = initialBox.width;
          let newH = initialBox.height;

          // For text elements, we use pixel deltas to calculate scale since their state width is ignored visually
          const isText = elements.find(el => el.id === elementId)?.type === 'text';
          
          if (isText) {
             const pixelDeltaX = e.clientX - interactionStartRef.current.startX;
             const pixelDeltaY = e.clientY - interactionStartRef.current.startY;
             if (interactionState.includes('w')) {
               newW = initialBox.width - pixelDeltaX;
             }
             if (interactionState.includes('e')) {
               newW = initialBox.width + pixelDeltaX;
             }
             // For corners, just use width to drive the uniform font size scale
             return { ...box, width: Math.max(1, newW) };
          }

          if (interactionState.includes('w')) {
            newX = initialBox.x + deltaX;
            newW = initialBox.width - deltaX;
          }
          if (interactionState.includes('e')) {
            newW = initialBox.width + deltaX;
          }
          if (interactionState.includes('n')) {
            newY = initialBox.y + deltaY;
            newH = initialBox.height - deltaY;
          }
          if (interactionState.includes('s')) {
            newH = initialBox.height + deltaY;
          }

          if (e.shiftKey) {
            const ratio = initialBox.width / initialBox.height;
            if (interactionState.includes('e') || interactionState.includes('w')) {
               newH = newW / ratio;
               if (interactionState.includes('n')) newY = initialBox.y + (initialBox.height - newH);
            } else if (interactionState.includes('s') || interactionState.includes('n')) {
               newW = newH * ratio;
               if (interactionState.includes('w')) newX = initialBox.x + (initialBox.width - newW);
            }
          }

          if (newW < 1) { if (interactionState.includes('w')) newX -= (1 - newW); newW = 1; }
          if (newH < 1) { if (interactionState.includes('n')) newY -= (1 - newH); newH = 1; }
          
          return { ...box, x: newX, y: newY, width: Math.max(1, newW), height: Math.max(1, newH) };
        }
        return box;
      };

      if (elementId === 'main_video') {
        setVideoBox(updateBox(initialBox));
      } else {
        setElements(prev => prev.map(el => {
          if (el.id === elementId) {
            const newBox = updateBox(initialBox);
            let updatedProps = el.props;
            
            if (el.type === 'text' && interactionState.startsWith('resize')) {
              // Any resize just scales the font size uniformly for text, keeping max-content bounding box
              const scaleRatio = newBox.width / initialBox.width;
              updatedProps = { ...updatedProps, fontSize: Math.max(8, initialFontSize * scaleRatio) };
              // We do not update x, y, width, height for text in state during resize, to let max-content flow naturally
              // Actually, we DO need to update x,y if they drag west/north, but for now we let it scale from center.
              return { ...el, props: updatedProps };
            }
            
            return { ...el, x: newBox.x, y: newBox.y, width: newBox.width, height: newBox.height, props: updatedProps };
          }
          return el;
        }));
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

  // Avatar fetch is now handled in the main initialization effect above
  const [scriptText, setScriptText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'result'>('canvas');

  const [bboxShift, setBboxShift] = useState(0);
  const [extraMargin, setExtraMargin] = useState(10);
  const [parsingMode, setParsingMode] = useState("jaw");
  const [leftCheekWidth, setLeftCheekWidth] = useState(100);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateVoice = async () => {
    if (!scriptText.trim()) return alert("Please enter a script to generate voice");
    if (!selectedVoiceId) return alert("Please select a voice from the dropdown");
    setIsGeneratingVoice(true);
    try {
      const formData = new FormData();
      formData.append('text', scriptText);
      formData.append('voiceId', selectedVoiceId);

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
      formData.append('aspectRatio', projectAspectRatio);

      const res = await fetch('/api/generate_video', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.data && data.data[0]) {
        const videoData = data.data[0];
        let videoUrl = videoData.url || videoData.video?.url || videoData.path || videoData.video?.path || videoData;
        
        // Convert local absolute paths to the streaming API
        if (typeof videoUrl === 'string') {
          // Normalize slashes for reliable splitting
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
        
        setResultVideo(videoUrl);
        setActiveTab('result');
      } else {
        alert(data.error || 'Failed to generate');
      }
    } catch (e) {
      console.log("Connection closed or timed out, switching to background polling...");
      await pollForVideo(avatarId, projectAspectRatio);
    }
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
          {['Avatar', 'Text', 'Shape', 'Media', 'Captions'].map(tool => {
            const IconMap: Record<string, React.ElementType> = {
              Avatar: User, Text: Type, Shape: Square,
              Media: ImageIcon, Captions: MessageSquare
            };
            const Icon = IconMap[tool];
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
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EDF2E9', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>K</div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--panel-border)' }} onClick={() => alert("Invite a collaborator (Stub)")}>
            <Plus size={14} /> Invite
          </button>
          <button className="syn-btn-primary" onClick={handleGenerateVideo} disabled={isGenerating || !avatarId || !audioFile}>
            <Play size={14} fill="#fff" /> Generate
          </button>
        </div>
      </header>

      <div className="syn-main">
        {/* LEFT SIDEBAR: Script Input Area */}
        <div className="syn-sidebar-left" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 15, borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Voice Script</span>
            <div 
              style={{ padding: '4px 8px', borderRadius: 4, background: '#F0EBDD', border: '1px solid #E2DCC9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#63685A', cursor: 'pointer', gap: 4 }}
              onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
            >
              {selectedVoiceId ? (availableVoices.find(v => v.id === selectedVoiceId)?.name || 'Custom Voice') : 'No Voices'}
              <ChevronDown size={12} />
            </div>
            
            {isVoiceDropdownOpen && (
              <div style={{ position: 'absolute', top: 50, right: 15, background: '#fff', border: '1px solid var(--panel-border)', borderRadius: 8, padding: 6, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: 180, maxHeight: 200, overflowY: 'auto' }}>
                {availableVoices.length === 0 ? (
                  <div style={{ padding: '6px', fontSize: 11, color: '#64748b' }}>No custom voices found</div>
                ) : (
                  availableVoices.map(v => (
                    <div 
                      key={v.id}
                      style={{ padding: '6px', fontSize: 12, cursor: 'pointer', background: selectedVoiceId === v.id ? 'var(--accent)' : 'transparent', color: selectedVoiceId === v.id ? '#fff' : '#000', borderRadius: 4 }}
                      onClick={() => { setSelectedVoiceId(v.id); setIsVoiceDropdownOpen(false); }}
                      onMouseEnter={e => { if (selectedVoiceId !== v.id) e.currentTarget.style.background = '#f1f5f9' }}
                      onMouseLeave={e => { if (selectedVoiceId !== v.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      {v.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div style={{ flex: 1, padding: 15, display: 'flex', flexDirection: 'column' }}>
            {audioFile ? (
              <div style={{ background: '#F8F6F0', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--foreground)', minWidth: 0, flex: 1 }}>
                    <Mic size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', flex: 1 }}>{audioFile.name}</span>
                  </div>
                  <button onClick={() => setAudioFile(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                    <X size={14} />
                  </button>
                </div>
                <audio src={URL.createObjectURL(audioFile)} controls style={{ width: '100%', height: 32, minWidth: 0 }} />
              </div>
            ) : (
              <textarea
                style={{
                  flex: 1,
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  resize: 'none',
                  outline: 'none',
                  fontSize: 14,
                  color: 'var(--foreground)',
                  lineHeight: 1.5,
                }}
                placeholder="Type your script here. To keep this scene with no voice-over, add a pause."
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
              />
            )}
            
            {!audioFile && (
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}>
                <button 
                  onClick={handleGenerateVoice} 
                  disabled={isGeneratingVoice || !scriptText.trim()}
                  className="syn-btn-primary" 
                  style={{ fontSize: 12, padding: '6px 12px', background: 'var(--accent)', opacity: (!scriptText.trim() || isGeneratingVoice) ? 0.6 : 1 }}
                >
                  <Wand2 size={12} /> {isGeneratingVoice ? "Generating..." : "Generate Audio"}
                </button>
              </div>
            )}
          </div>

          <div style={{ padding: 15, borderTop: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-secondary" style={{ width: '100%', padding: '8px 10px', fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, background: '#F8F6F0', border: '1px solid var(--panel-border)', overflow: 'hidden' }} onClick={() => audioInputRef.current?.click()}>
              <Upload size={14} style={{ flexShrink: 0 }} /> 
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                {audioFile ? audioFile.name : "Upload Audio"}
              </span>
            </button>
            <button className="btn-secondary" style={{ width: '100%', padding: '8px 0', fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, background: isRecording ? '#ffebee' : '#F8F6F0', color: isRecording ? '#d32f2f' : 'inherit', border: isRecording ? '1px solid #ffcdd2' : '1px solid var(--panel-border)', transition: 'all 0.2s' }} onClick={toggleRecording}>
              <Mic size={14} color={isRecording ? '#d32f2f' : 'currentColor'} /> {isRecording ? "Stop Recording" : "Record Audio"}
            </button>
          </div>
        </div>

        {/* CENTER WORKSPACE */}
        <div className="syn-workspace">
          {/* Canvas Area */}
          <div className="syn-canvas-area" onClick={() => { setSelectedId(null); if (!isGenerating && activeTab === 'canvas' && !videoPreview) videoInputRef.current?.click() }}>
            <div ref={containerRef} className="syn-video-container" style={
              projectAspectRatio === '9/16' ? { background: sceneColor, width: 'min(100cqw, 100cqh * 9 / 16)', height: 'min(100cqh, 100cqw * 16 / 9)' } :
                projectAspectRatio === '1/1' ? { background: sceneColor, width: 'min(100cqw, 100cqh)', height: 'min(100cqh, 100cqw)' } :
                  { background: sceneColor, width: 'min(100cqw, 100cqh * 16 / 9)', height: 'min(100cqh, 100cqw * 9 / 16)' }
            }>
              {isGenerating ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15, background: '#fff' }}>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <div style={{ width: 40, height: 40, border: '4px solid #E2DCC9', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <div style={{ color: '#1E2119', fontSize: 15, fontWeight: 500 }}>Generating AI Video...</div>
                </div>
              ) : activeTab === 'result' && resultVideo ? (
                <div style={{ position: 'absolute', left: `${videoBox.x}%`, top: `${videoBox.y}%`, width: `${videoBox.width}%`, height: `${videoBox.height}%`, border: selectedId === 'main_video' ? '2px solid #3B5D3B' : 'none', cursor: selectedId === 'main_video' ? (interactionState === 'dragging' ? 'grabbing' : 'grab') : 'pointer', touchAction: 'none' }} onPointerDown={(e) => handlePointerDown(e, 'dragging', 'main_video')} onClick={(e) => e.stopPropagation()}>
                  <video id="main_video_element" src={resultVideo} controls={selectedId !== 'main_video'} autoPlay style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: selectedId === 'main_video' ? 'none' : 'auto' }} />
                  {selectedId === 'main_video' && ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(dir => {
                    const isN = dir.includes('n'); const isS = dir.includes('s');
                    const isW = dir.includes('w'); const isE = dir.includes('e');
                    const cursorMap: any = { nw: 'nwse', ne: 'nesw', sw: 'nesw', se: 'nwse', n: 'ns', s: 'ns', w: 'ew', e: 'ew' };
                    return <div key={dir} onPointerDown={(e) => handlePointerDown(e, `resize-${dir}`, 'main_video')} style={{
                      position: 'absolute', top: isN ? -6 : (isS ? 'auto' : 'calc(50% - 6px)'), bottom: isS ? -6 : 'auto',
                      left: isW ? -6 : (isE ? 'auto' : 'calc(50% - 6px)'), right: isE ? -6 : 'auto',
                      width: 12, height: 12, background: '#3B5D3B', borderRadius: '50%', cursor: `${cursorMap[dir]}-resize`
                    }} />;
                  })}
                </div>
              ) : videoPreview ? (
                <div style={{ position: 'absolute', left: `${videoBox.x}%`, top: `${videoBox.y}%`, width: `${videoBox.width}%`, height: `${videoBox.height}%`, border: selectedId === 'main_video' ? '2px solid #3B5D3B' : 'none', cursor: selectedId === 'main_video' ? (interactionState === 'dragging' ? 'grabbing' : 'grab') : 'pointer', touchAction: 'none' }} onPointerDown={(e) => handlePointerDown(e, 'dragging', 'main_video')} onClick={(e) => e.stopPropagation()}>
                  {isVideoUrl(videoPreview) ? (
                    <video id="main_video_element" src={videoPreview} controls={selectedId !== 'main_video'} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: selectedId === 'main_video' ? 'none' : 'auto' }} />
                  ) : (
                    <img id="main_video_element" src={videoPreview} alt="Selected Avatar" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: selectedId === 'main_video' ? 'none' : 'auto' }} />
                  )}
                  {selectedId === 'main_video' && ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(dir => {
                    const isN = dir.includes('n'); const isS = dir.includes('s');
                    const isW = dir.includes('w'); const isE = dir.includes('e');
                    const cursorMap: any = { nw: 'nwse', ne: 'nesw', sw: 'nesw', se: 'nwse', n: 'ns', s: 'ns', w: 'ew', e: 'ew' };
                    return <div key={dir} onPointerDown={(e) => handlePointerDown(e, `resize-${dir}`, 'main_video')} style={{
                      position: 'absolute', top: isN ? -6 : (isS ? 'auto' : 'calc(50% - 6px)'), bottom: isS ? -6 : 'auto',
                      left: isW ? -6 : (isE ? 'auto' : 'calc(50% - 6px)'), right: isE ? -6 : 'auto',
                      width: 12, height: 12, background: '#3B5D3B', borderRadius: '50%', cursor: `${cursorMap[dir]}-resize`
                    }} />;
                  })}
                </div>
              ) : null}

              {/* Render Canvas Elements */}
              {elements.map((el) => {
                const isElSelected = selectedId === el.id;
                return (
                  <div
                    id={`element-${el.id}`}
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: el.type === 'text' ? 'max-content' : `${el.width}%`,
                      height: el.type === 'text' ? 'max-content' : `${el.height}%`,
                      whiteSpace: el.type === 'text' ? 'pre-wrap' : 'normal',
                      zIndex: el.zIndex,
                      border: isElSelected ? '2px solid #3B5D3B' : 'none',
                      cursor: isElSelected ? (interactionState === 'dragging' ? 'grabbing' : 'grab') : 'pointer',
                      touchAction: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...el.props.style
                    }}
                    onPointerDown={(e) => {
                      if (editingId !== el.id) handlePointerDown(e, 'dragging', el.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => {
                      if (el.type === 'text') {
                        e.stopPropagation();
                        setEditingId(el.id);
                      }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {(() => {
                        const animType = el.motion?.type || el.motion?.entrance || 'none';
                        const duration = el.motion?.duration !== undefined ? el.motion.duration : (animType === 'typewriter' ? 1.5 : 0.5);
                        const delay = el.motion?.delay || 0;
                        
                        return (
                          <motion.div
                            key={`${animType}_${playKey}`}
                            initial={
                              animType === 'fade-in' || animType === 'fade_in' ? { opacity: 0 } :
                              animType === 'fade_out' ? { opacity: 1 } :
                              animType === 'slide-up' ? { opacity: 0, y: 20 } :
                              animType === 'slide_in_left' ? { opacity: 0, x: -50 } :
                              animType === 'slide_in_right' ? { opacity: 0, x: 50 } :
                              animType === 'scale-in' || animType === 'zoom_in' ? { opacity: 0, scale: 0.5 } :
                              animType === 'typewriter' ? { clipPath: 'inset(0 100% 0 0)' } :
                              animType === 'spin' ? { opacity: 0, rotate: -180 } :
                              false
                            }
                            animate={
                              animType === 'fade-in' || animType === 'fade_in' ? { opacity: 1 } :
                              animType === 'fade_out' ? { opacity: 0 } :
                              animType === 'slide-up' ? { opacity: 1, y: 0 } :
                              animType === 'slide_in_left' ? { opacity: 1, x: 0 } :
                              animType === 'slide_in_right' ? { opacity: 1, x: 0 } :
                              animType === 'scale-in' || animType === 'zoom_in' ? { opacity: 1, scale: 1 } :
                              animType === 'typewriter' ? { clipPath: 'inset(0 0% 0 0)' } :
                              animType === 'spin' ? { opacity: 1, rotate: 0 } :
                              false
                            }
                            transition={{ duration, delay }}
                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                        {el.type === 'text' && (() => {
                          const textStyle = {
                            fontSize: el.props.fontSize || 24,
                            color: el.props.color || '#fff',
                            fontWeight: el.props.fontWeight || 'normal',
                            fontFamily: el.props.fontFamily || 'Inter',
                            fontStyle: el.props.fontStyle || 'normal',
                            textAlign: (el.props.textAlign || 'center') as any,
                            letterSpacing: `${el.props.letterSpacing || 0}px`,
                            lineHeight: el.props.lineHeight || 1.2,
                            textDecoration: el.props.textDecoration || 'none',
                            backgroundColor: el.props.backgroundColor || 'transparent',
                            WebkitTextStroke: el.props.outlineWidth ? `${el.props.outlineWidth}px ${el.props.outlineColor || '#000'}` : 'none',
                            textShadow: (el.props.shadowBlur || el.props.shadowX || el.props.shadowY) ? `${el.props.shadowX || 0}px ${el.props.shadowY || 0}px ${el.props.shadowBlur || 4}px ${el.props.shadowColor || 'rgba(0,0,0,0.5)'}` : (el.props.shadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'),
                            padding: el.props.bgPadding ? `${el.props.bgPadding}px` : '4px 8px',
                            borderRadius: el.props.bgRadius || 4,
                            wordBreak: 'break-word' as const,
                            transform: `scale(${el.props.scale ?? 1}) rotate(${el.props.rotation || 0}deg)`,
                            opacity: el.props.opacity ?? 1,
                          };
                          return editingId === el.id ? (
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                setEditingId(null);
                                setElements(elements.map(e_ => e_.id === el.id ? { ...e_, props: { ...e_.props, text: e.currentTarget.innerText } } : e_));
                              }}
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                              style={{
                                ...textStyle,
                                display: 'block',
                                minWidth: '20px',
                                outline: 'none',
                                cursor: 'text'
                              }}
                              ref={node => {
                                if (node && document.activeElement !== node) {
                                  node.focus();
                                  if (typeof window !== 'undefined') {
                                    const selection = window.getSelection();
                                    const range = document.createRange();
                                    range.selectNodeContents(node);
                                    range.collapse(false);
                                    selection?.removeAllRanges();
                                    selection?.addRange(range);
                                  }
                                }
                              }}
                            >
                              {el.props.text}
                            </span>
                          ) : (
                            <span style={{ ...textStyle, display: 'block', width: '100%' }}>
                              {el.props.text || "Double click to edit"}
                            </span>
                          );
                        })()}
                        {el.type === 'shape' && (() => {
                          const isComplexShape = el.props.shape === 'triangle' || el.props.shape === 'star';
                          const commonStyle = {
                            width: '100%', height: '100%',
                            opacity: el.props.opacity ?? 1,
                            filter: `${el.props.shadow ? `drop-shadow(${el.props.shadowOffsetX || 2}px ${el.props.shadowOffsetY || 2}px ${el.props.shadowBlur || 4}px ${el.props.shadowColor || 'rgba(0,0,0,0.5)'})` : ''} ${el.props.blurAmount ? `blur(${el.props.blurAmount}px)` : ''}`.trim() || 'none',
                            mixBlendMode: (el.props.blendMode || 'normal') as any,
                            transform: `scale(${el.props.scale ?? 1}) rotate(${el.props.rotation || 0}deg) skew(${el.props.skewX || 0}deg, ${el.props.skewY || 0}deg)`,
                          };
                          
                          if (isComplexShape) {
                            const fillValue = el.props.fillType === 'none' ? 'none' : (
                              el.props.fillType === 'gradient' ? `url(#grad-${el.id})` : (el.props.color || '#3B5D3B')
                            );
                            const strokeDasharray = el.props.strokeType === 'dashed' ? '10,10' : (el.props.strokeType === 'dotted' ? '4,4' : 'none');
                            const points = el.props.shape === 'triangle' 
                              ? "50,0 0,100 100,100"
                              : "50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35";
                            
                            const alignment = el.props.strokeAlignment || 'outer';
                            const hasStroke = el.props.strokeWidth > 0;
                            const baseStroke = hasStroke ? el.props.strokeWidth : (el.props.borderRadius ? el.props.borderRadius * 2 : 0);
                            
                            // For SVG, simulate outer/inner stroke with double width and paint-order
                            const svgStrokeWidth = alignment !== 'center' && hasStroke ? baseStroke * 2 : baseStroke;
                            const paintOrder = alignment === 'outer' ? 'stroke fill' : 'fill stroke';
                            
                            const strokeColor = hasStroke ? (el.props.strokeColor || '#000000') : (fillValue === 'none' ? 'none' : fillValue);
                            const strokeLinejoin = el.props.borderRadius ? 'round' : 'miter';
                            
                            return (
                              <div style={commonStyle}>
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                  {el.props.fillType === 'gradient' && (
                                    <defs>
                                      <linearGradient id={`grad-${el.id}`} gradientTransform={`rotate(${el.props.gradientAngle || 90})`}>
                                        <stop offset="0%" stopColor={el.props.gradientColors?.[0] || el.props.color || '#3B5D3B'} />
                                        <stop offset="100%" stopColor={el.props.gradientColors?.[1] || '#000000'} />
                                      </linearGradient>
                                    </defs>
                                  )}
                                  <polygon 
                                    points={points} 
                                    fill={fillValue}
                                    stroke={baseStroke > 0 ? strokeColor : 'none'}
                                    strokeWidth={svgStrokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    strokeLinejoin={strokeLinejoin}
                                    vectorEffect="non-scaling-stroke"
                                    paintOrder={paintOrder}
                                  />
                                </svg>
                              </div>
                            );
                          }

                          if (el.props.shape === 'line') {
                            const strokeW = el.props.strokeWidth || 4;
                            const strokeColor = el.props.strokeColor || el.props.color || '#3B5D3B';
                            const strokeDasharray = el.props.strokeType === 'dashed' ? '10,10' : (el.props.strokeType === 'dotted' ? '4,4' : 'none');
                            return (
                              <div style={commonStyle}>
                                <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                  <line 
                                    x1="0" y1="50%" x2="100%" y2="50%" 
                                    stroke={strokeColor} 
                                    strokeWidth={strokeW} 
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap={el.props.borderRadius ? 'round' : 'butt'}
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </svg>
                              </div>
                            );
                          }

                          const alignment = el.props.strokeAlignment || 'outer';
                          const strokeW = el.props.strokeWidth || 0;
                          const outlineOffset = alignment === 'inner' ? -strokeW : (alignment === 'center' ? -(strokeW / 2) : 0);

                          const shapeStyle = {
                            ...commonStyle,
                            background: el.props.fillType === 'none' ? 'transparent' : (
                              el.props.fillType === 'gradient' ? 
                                `linear-gradient(${el.props.gradientAngle || 90}deg, ${el.props.gradientColors?.[0] || el.props.color || '#3B5D3B'} 0%, ${el.props.gradientColors?.[1] || '#000000'} 100%)` : 
                                (el.props.color || '#3B5D3B')
                            ), 
                            border: 'none',
                            outline: strokeW ? `${strokeW}px ${el.props.strokeType || 'solid'} ${el.props.strokeColor || '#000000'}` : 'none',
                            outlineOffset: strokeW ? `${outlineOffset}px` : '0px',
                            borderRadius: (el.props.shape === 'circle' || el.props.shape === 'oval') ? '50%' : (el.props.borderRadius ? `${el.props.borderRadius}px` : 0),
                          };
                          return <div style={shapeStyle} />;
                        })()}
                        {el.type === 'media' && el.props.src && (
                          el.props.isVideo ? (
                            <video src={el.props.src} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }} autoPlay loop muted playsInline />
                          ) : (
                            <img src={el.props.src} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }} alt="Media Layer" />
                          )
                        )}
                        {isElSelected && ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(dir => {
                          const cursorMap: Record<string, string> = { nw: 'nwse', n: 'ns', ne: 'nesw', e: 'ew', se: 'nwse', s: 'ns', sw: 'nesw', w: 'ew' };
                          const posMap: Record<string, any> = {
                            nw: { top: -6, left: -6 }, n: { top: -6, left: 'calc(50% - 6px)' }, ne: { top: -6, right: -6 },
                            e: { top: 'calc(50% - 6px)', right: -6 }, se: { bottom: -6, right: -6 }, s: { bottom: -6, left: 'calc(50% - 6px)' },
                            sw: { bottom: -6, left: -6 }, w: { top: 'calc(50% - 6px)', left: -6 }
                          };
                          return <div key={dir} onPointerDown={(e) => handlePointerDown(e, `resize-${dir}`, el.id)} style={{
                            position: 'absolute', ...posMap[dir],
                            width: 12, height: 12, background: '#3B5D3B', borderRadius: '50%', cursor: `${cursorMap[dir]}-resize`
                          }} />;
                        })}
                      </motion.div>
                      );
                    })()}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM PANEL: Scenes Timeline */}
          <div className="syn-timeline-area" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="syn-timeline-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, borderRight: '1px solid var(--panel-border)', paddingRight: 15 }}>
                {isPlaying ? (
                  <Square size={14} style={{ cursor: 'pointer' }} onClick={() => {
                    setIsPlaying(false);
                    const videoEl = document.getElementById('main_video_element') as HTMLVideoElement;
                    if (videoEl) {
                      videoEl.pause();
                    }
                  }} />
                ) : (
                  <Play size={14} style={{ cursor: 'pointer' }} onClick={() => {
                    setIsPlaying(true);
                    setPlayKey(Date.now().toString());
                    const videoEl = document.getElementById('main_video_element') as HTMLVideoElement;
                    if (videoEl) {
                      videoEl.currentTime = 0;
                      videoEl.play();
                    }
                  }} />
                )}
                <span style={{ color: 'var(--foreground)', fontSize: 13, fontWeight: 600 }}>Scenes Timeline</span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '10px 15px', gap: 15, overflowX: 'auto' }}>
              {/* Scene 1 */}
              <div style={{ width: 120, height: 68, flexShrink: 0, background: '#EDF2E9', borderRadius: 8, border: '2px solid var(--accent)', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 10, fontWeight: 600, color: '#1E2119', background: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: 4 }}>1</span>
                <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#1E2119', color: '#fff', padding: 3, borderRadius: 4, display: 'flex', alignItems: 'center' }}><User size={10} /></div>
                {videoPreview && (
                  isVideoUrl(videoPreview) ? 
                    <video src={videoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                    <img src={videoPreview} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {/* Add Scene Button */}
              <button
                className="btn-secondary"
                style={{ width: 120, height: 68, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, background: '#F8F6F0', border: '1px dashed var(--panel-border)', borderRadius: 8, color: 'var(--text-muted)' }}
                onClick={() => alert("Add a new scene (Stub)")}
              >
                <Plus size={16} />
                <span style={{ fontSize: 11, fontWeight: 500 }}>Add scene</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="syn-sidebar-right">


          {activeTool === 'Text' && (
            <>
              <div className="syn-panel-section">
                <button
                  className="syn-btn-primary"
                  style={{ width: '100%', marginBottom: 15 }}
                  onClick={() => setElements(prev => [...prev, { id: 'text_' + Date.now(), type: 'text', x: 20, y: 20, width: 60, height: 20, zIndex: prev.length, props: { text: 'New Text', fontSize: 32, color: '#000000', fontWeight: 'bold' } }])}
                >
                  <Plus size={14} /> Add Text Box
                </button>
              </div>
              {selectedId && elements.find(el => el.id === selectedId)?.type === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15, paddingBottom: 20 }}>

                  {/* TEXT SECTION */}
                  <div className="syn-panel-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <div style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Text</div>
                      <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                        e.stopPropagation();
                        setElements(elements.map(el => el.id === selectedId ? {
                          ...el,
                          props: {
                            ...el.props,
                            fontFamily: 'Inter',
                            fontWeight: 'bold',
                            fontSize: 32,
                            textAlign: 'center',
                            letterSpacing: 0,
                            lineHeight: 1.2,
                            fontStyle: 'normal'
                          }
                        } : el));
                      }} />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                      <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Edit Text</span>
                      <textarea value={elements.find(el => el.id === selectedId)?.props.text} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, text: e.target.value } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)', background: 'transparent', color: 'var(--foreground)', minHeight: 60, resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Font Family</span>
                        <select value={elements.find(el => el.id === selectedId)?.props.fontFamily || 'Inter'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, fontFamily: e.target.value } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)', background: '#fff' }}>
                          <option value="Inter">Inter</option><option value="Arial">Arial</option><option value="Helvetica">Helvetica</option><option value="Times New Roman">Times New Roman</option><option value="Courier New">Courier New</option><option value="Georgia">Georgia</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Weight</span>
                        <select value={elements.find(el => el.id === selectedId)?.props.fontWeight || 'normal'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, fontWeight: e.target.value } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)', background: '#fff' }}>
                          <option value="100">Thin</option><option value="normal">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="bold">Bold</option><option value="900">Black</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Size</span>
                        <input type="number" value={elements.find(el => el.id === selectedId)?.props.fontSize || 24} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, fontSize: parseInt(e.target.value) } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Align</span>
                        <select value={elements.find(el => el.id === selectedId)?.props.textAlign || 'center'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, textAlign: e.target.value } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)', background: '#fff' }}>
                          <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Tracking</span>
                        <input type="number" step="0.5" value={elements.find(el => el.id === selectedId)?.props.letterSpacing || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, letterSpacing: parseFloat(e.target.value) } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Leading</span>
                        <input type="number" step="0.1" value={elements.find(el => el.id === selectedId)?.props.lineHeight || 1.2} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, lineHeight: parseFloat(e.target.value) } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Style</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        <input type="checkbox" checked={elements.find(el => el.id === selectedId)?.props.fontStyle === 'italic'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, fontStyle: e.target.checked ? 'italic' : 'normal' } } : el))} /> Italic
                      </label>
                    </div>
                  </div>

                  {/* APPEARANCE SECTION */}
                  <div className="syn-panel-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <div style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Appearance</div>
                      <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                        e.stopPropagation();
                        setElements(elements.map(el => el.id === selectedId ? {
                          ...el,
                          props: {
                            ...el.props,
                            color: '#ffffff',
                            outlineColor: '#000000',
                            outlineWidth: 0,
                            shadowColor: '#000000',
                            shadowBlur: 0,
                            shadowX: 0,
                            shadowY: 0,
                            backgroundColor: 'transparent',
                            bgPadding: 0,
                            bgRadius: 0
                          }
                        } : el));
                      }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Fill (Color)</span>
                      <input type="color" value={elements.find(el => el.id === selectedId)?.props.color || '#ffffff'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, color: e.target.value } } : el))} />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Stroke (Outline)</span>
                        <input type="color" value={elements.find(el => el.id === selectedId)?.props.outlineColor || '#000000'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, outlineColor: e.target.value } } : el))} style={{ width: 20, height: 20, padding: 0, border: 'none' }} />
                      </div>
                      <input type="range" min="0" max="10" step="0.5" value={elements.find(el => el.id === selectedId)?.props.outlineWidth || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, outlineWidth: parseFloat(e.target.value) } } : el))} style={{ width: '100%' }} />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Shadow</span>
                        <input type="color" value={elements.find(el => el.id === selectedId)?.props.shadowColor || '#000000'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, shadowColor: e.target.value } } : el))} style={{ width: 20, height: 20, padding: 0, border: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                        <div style={{ flex: 1 }}>Blur <input type="number" value={elements.find(el => el.id === selectedId)?.props.shadowBlur || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, shadowBlur: parseInt(e.target.value) } } : el))} style={{ width: '100%', padding: '2px 4px', border: '1px solid var(--panel-border)', borderRadius: 2 }} /></div>
                        <div style={{ flex: 1 }}>X <input type="number" value={elements.find(el => el.id === selectedId)?.props.shadowX || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, shadowX: parseInt(e.target.value) } } : el))} style={{ width: '100%', padding: '2px 4px', border: '1px solid var(--panel-border)', borderRadius: 2 }} /></div>
                        <div style={{ flex: 1 }}>Y <input type="number" value={elements.find(el => el.id === selectedId)?.props.shadowY || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, shadowY: parseInt(e.target.value) } } : el))} style={{ width: '100%', padding: '2px 4px', border: '1px solid var(--panel-border)', borderRadius: 2 }} /></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Background</span>
                        <input type="color" value={elements.find(el => el.id === selectedId)?.props.backgroundColor || 'transparent'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, backgroundColor: e.target.value } } : el))} style={{ width: 20, height: 20, padding: 0, border: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                        <div style={{ flex: 1 }}>Padding <input type="number" value={elements.find(el => el.id === selectedId)?.props.bgPadding || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, bgPadding: parseInt(e.target.value) } } : el))} style={{ width: '100%', padding: '2px 4px', border: '1px solid var(--panel-border)', borderRadius: 2 }} /></div>
                        <div style={{ flex: 1 }}>Radius <input type="number" value={elements.find(el => el.id === selectedId)?.props.bgRadius || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, bgRadius: parseInt(e.target.value) } } : el))} style={{ width: '100%', padding: '2px 4px', border: '1px solid var(--panel-border)', borderRadius: 2 }} /></div>
                      </div>
                    </div>
                  </div>

                  {/* TRANSFORM SECTION */}
                  <div className="syn-panel-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <div style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Transform</div>
                      <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                        e.stopPropagation();
                        setElements(elements.map(el => el.id === selectedId ? {
                          ...el,
                          props: {
                            ...el.props,
                            scale: 1,
                            rotation: 0,
                            opacity: 1
                          }
                        } : el));
                      }} />
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Position X</span>
                        <input type="number" value={Math.round(elements.find(el => el.id === selectedId)?.x || 0)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, x: parseFloat(e.target.value) } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Position Y</span>
                        <input type="number" value={Math.round(elements.find(el => el.id === selectedId)?.y || 0)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, y: parseFloat(e.target.value) } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Scale</span>
                        <input type="number" step="0.1" value={elements.find(el => el.id === selectedId)?.props.scale || 1} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, scale: parseFloat(e.target.value) } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Rotation (deg)</span>
                        <input type="number" value={elements.find(el => el.id === selectedId)?.props.rotation || 0} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, rotation: parseFloat(e.target.value) } } : el))} style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid var(--panel-border)' }} />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Opacity</span>
                      <input type="range" min="0" max="1" step="0.05" value={elements.find(el => el.id === selectedId)?.props.opacity ?? 1} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, opacity: parseFloat(e.target.value) } } : el))} style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* ANIMATION SECTION */}
                  <div className="syn-panel-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <div style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>Animation</div>
                      <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                        e.stopPropagation();
                        setElements(elements.map(el => el.id === selectedId ? {
                          ...el,
                          motion: { ...el.motion, entrance: 'none', type: 'none', duration: 1, delay: 0 }
                        } as any : el));
                      }} />
                    </div>

                    <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 5 }}>Entrance</span>
                    <select style={{ width: '100%', padding: 6, borderRadius: 4, marginBottom: 15, background: '#fff' }} value={elements.find(el => el.id === selectedId)?.motion?.entrance || 'none'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, motion: { ...el.motion, entrance: e.target.value } } as any : el))}>
                      <option value="none">None</option>
                      <option value="fade-in">Fade In</option>
                      <option value="slide-up">Slide Up</option>
                      <option value="scale-in">Scale In</option>
                      <option value="typewriter">Typewriter</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTool === 'Shape' && (
            <>
              <div className="syn-panel-section" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button className="btn-secondary" style={{ flex: '1 1 45%', padding: 8 }} onClick={() => setElements(prev => [...prev, { id: 'shape_' + Date.now(), type: 'shape', x: 20 + (prev.length * 2), y: 20 + (prev.length * 2), width: 25, height: 26.6, zIndex: prev.length, props: { shape: 'rect', color: '#3B5D3B' } }])}>Rectangle</button>
                <button className="btn-secondary" style={{ flex: '1 1 45%', padding: 8 }} onClick={() => setElements(prev => [...prev, { id: 'shape_' + Date.now(), type: 'shape', x: 20 + (prev.length * 2), y: 20 + (prev.length * 2), width: 15, height: 26.6, zIndex: prev.length, props: { shape: 'circle', color: '#3B5D3B' } }])}>Circle</button>
                <button className="btn-secondary" style={{ flex: '1 1 45%', padding: 8 }} onClick={() => setElements(prev => [...prev, { id: 'shape_' + Date.now(), type: 'shape', x: 20 + (prev.length * 2), y: 20 + (prev.length * 2), width: 30, height: 2, zIndex: prev.length, props: { shape: 'line', color: '#3B5D3B' } }])}>Line</button>
                <button className="btn-secondary" style={{ flex: '1 1 45%', padding: 8 }} onClick={() => setElements(prev => [...prev, { id: 'shape_' + Date.now(), type: 'shape', x: 20 + (prev.length * 2), y: 20 + (prev.length * 2), width: 15, height: 23, zIndex: prev.length, props: { shape: 'triangle', color: '#3B5D3B' } }])}>Triangle</button>
                <button className="btn-secondary" style={{ flex: '1 1 45%', padding: 8 }} onClick={() => setElements(prev => [...prev, { id: 'shape_' + Date.now(), type: 'shape', x: 20 + (prev.length * 2), y: 20 + (prev.length * 2), width: 15, height: 26.6, zIndex: prev.length, props: { shape: 'star', color: '#3B5D3B' } }])}>Star</button>
                <button className="btn-secondary" style={{ flex: '1 1 45%', padding: 8 }} onClick={() => setElements(prev => [...prev, { id: 'shape_' + Date.now(), type: 'shape', x: 20 + (prev.length * 2), y: 20 + (prev.length * 2), width: 25, height: 26.6, zIndex: prev.length, props: { shape: 'oval', color: '#3B5D3B' } }])}>Oval</button>
              </div>
              {selectedId && elements.find(el => el.id === selectedId)?.type === 'shape' && (() => {
                const activeShape = elements.find(el => el.id === selectedId)!;
                const updateProp = (key: string, value: any) => setElements(elements.map(el => el.id === selectedId ? { ...el, props: { ...el.props, [key]: value } } as any : el));
                const updateMotion = (key: string, value: any) => setElements(elements.map(el => el.id === selectedId ? { ...el, motion: { ...el.motion, [key]: value } } as any : el));
                
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
                    {/* APPEARANCE SECTION */}
                    <div className="syn-panel-section" style={{ borderBottom: '1px solid var(--panel-border)', padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsedSections['appearance'] ? 0 : 15, cursor: 'pointer' }} onClick={() => setCollapsedSections(prev => ({ ...prev, appearance: !prev.appearance }))}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
                          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: collapsedSections['appearance'] ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} /> Appearance
                        </div>
                        <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                          e.stopPropagation();
                          setElements(elements.map(el => el.id === selectedId ? {
                            ...el,
                            props: {
                              ...el.props,
                              fillType: 'solid',
                              color: '#3B5D3B',
                              strokeWidth: 0,
                              shadow: false
                            }
                          } : el));
                        }} />
                      </div>

                      {!collapsedSections['appearance'] && (
                        <>

                      {/* Fill Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Fill</span>
                        <input type="checkbox" checked={activeShape.props.fillType !== 'none'} onChange={(e) => updateProp('fillType', e.target.checked ? 'solid' : 'none')} style={{ cursor: 'pointer', flexShrink: 0 }} />
                        <input type="color" value={activeShape.props.color || '#3B5D3B'} onChange={(e) => updateProp('color', e.target.value)} style={{ width: 40, height: 24, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 }} disabled={activeShape.props.fillType === 'none'} />
                        <Pipette size={14} color="var(--text-muted)" cursor="pointer" style={{ flexShrink: 0 }} />
                      </div>

                      {/* Stroke Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Stroke</span>
                        <Plus size={14} color="var(--text-muted)" cursor="pointer" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 15, paddingLeft: 4 }}>
                        <input type="checkbox" checked={!!activeShape.props.strokeWidth} onChange={(e) => updateProp('strokeWidth', e.target.checked ? 4 : 0)} style={{ cursor: 'pointer', flexShrink: 0 }} />
                        <input type="color" value={activeShape.props.strokeColor || '#ffffff'} onChange={(e) => updateProp('strokeColor', e.target.value)} style={{ width: 24, height: 24, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 }} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <input type="number" value={activeShape.props.strokeWidth || 0} onChange={(e) => updateProp('strokeWidth', Number(e.target.value))} style={{ width: 28, padding: 0, background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: 13, textAlign: 'right', outline: 'none' }} />
                          <span style={{fontSize: 11, color: 'var(--text-muted)', marginLeft: 2}}>px</span>
                        </div>
                        
                        <select style={{ flex: 1, minWidth: 60, background: '#f1f1f1', border: '1px solid #e2e2e2', color: 'var(--foreground)', fontSize: 11, padding: '4px 2px', borderRadius: 4, outline: 'none', cursor: 'pointer' }} value={activeShape.props.strokeType || 'solid'} onChange={(e) => updateProp('strokeType', e.target.value)}>
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                        <select style={{ flex: 1, minWidth: 60, background: '#f1f1f1', border: '1px solid #e2e2e2', color: 'var(--foreground)', fontSize: 11, padding: '4px 2px', borderRadius: 4, outline: 'none', cursor: 'pointer' }} value={activeShape.props.strokeAlignment || 'outer'} onChange={(e) => updateProp('strokeAlignment', e.target.value)}>
                          <option value="outer">Outer</option>
                          <option value="inner">Inner</option>
                          <option value="center">Center</option>
                        </select>
                      </div>

                      {/* Shadow Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Shadow</span>
                        <Plus size={14} color="var(--text-muted)" cursor="pointer" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingLeft: 4 }}>
                        <input type="checkbox" checked={!!activeShape.props.shadow} onChange={(e) => {
                          updateProp('shadow', e.target.checked);
                          if (e.target.checked && !activeShape.props.shadowColor) updateProp('shadowColor', '#000000');
                        }} style={{ cursor: 'pointer' }} />
                        <input type="color" value={activeShape.props.shadowColor || '#000000'} onChange={(e) => updateProp('shadowColor', e.target.value)} style={{ width: 40, height: 24, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} disabled={!activeShape.props.shadow} />
                        <Pipette size={14} color="var(--text-muted)" cursor="pointer" />
                      </div>


                        </>
                      )}
                    </div>

                    {/* ALIGN AND TRANSFORM SECTION */}
                    <div className="syn-panel-section" style={{ borderBottom: '1px solid var(--panel-border)', padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsedSections['transform'] ? 0 : 20, cursor: 'pointer' }} onClick={() => setCollapsedSections(prev => ({ ...prev, transform: !prev.transform }))}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
                          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: collapsedSections['transform'] ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} /> Align and Transform
                        </div>
                        <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                          e.stopPropagation();
                          setElements(elements.map(el => el.id === selectedId ? {
                            ...el,
                            props: {
                              ...el.props,
                              scale: 1,
                              rotation: 0,
                              opacity: 1,
                              borderRadius: 0
                            }
                          } : el));
                        }} />
                      </div>

                      {!collapsedSections['transform'] && (
                        <>

                      {/* Align Toolbar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 25 }}>
                        <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Align</span>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <AlignStartVertical size={16} color="var(--text-muted)" cursor="pointer" onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, x: 0 } : el))} />
                          <AlignCenterVertical size={16} color="var(--text-muted)" cursor="pointer" onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, x: 50 - (activeShape.width/2) } : el))} />
                          <AlignEndVertical size={16} color="var(--text-muted)" cursor="pointer" onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, x: 100 - activeShape.width } : el))} />
                          <AlignStartHorizontal size={16} color="var(--text-muted)" cursor="pointer" onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, y: 0 } : el))} />
                          <AlignCenterHorizontal size={16} color="var(--text-muted)" cursor="pointer" onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, y: 50 - (activeShape.height/2) } : el))} />
                          <AlignEndHorizontal size={16} color="var(--text-muted)" cursor="pointer" onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, y: 100 - activeShape.height } : el))} />
                        </div>
                      </div>

                      {/* Transforms Grid */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Position</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1.5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="number" value={Math.round(activeShape.x * 19.2)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, x: Number(e.target.value) / 19.2 } : el))} style={{ width: 45, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} /> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>X</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="number" value={Math.round(activeShape.y * 10.8)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, y: Number(e.target.value) / 10.8 } : el))} style={{ width: 45, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} /> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Y</span></div>
                          </div>

                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Anchor point</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1.5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="number" value={Math.round((activeShape.x + activeShape.width/2) * 19.2)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, x: (Number(e.target.value) / 19.2) - (activeShape.width/2) } : el))} style={{ width: 45, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} /> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>X</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="number" value={Math.round((activeShape.y + activeShape.height/2) * 10.8)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, y: (Number(e.target.value) / 10.8) - (activeShape.height/2) } : el))} style={{ width: 45, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} /> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Y</span></div>
                          </div>

                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Scale</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1.5 }}>
                            <span style={{ color: '#2b82f6', fontSize: 13, display: 'flex', alignItems: 'center' }}><input type="number" value={Math.round((activeShape.props.scale ?? 1) * 100)} onChange={(e) => updateProp('scale', Number(e.target.value) / 100)} style={{ width: 35, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} />%</span>
                            <LinkIcon size={14} color="var(--text-muted)" cursor="pointer" />
                            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>100%</span>
                          </div>

                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Rotation</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1.5 }}>
                            <span style={{ color: '#2b82f6', fontSize: 13, display: 'flex', alignItems: 'center' }}><input type="number" value={activeShape.props.rotation || 0} onChange={(e) => updateProp('rotation', Number(e.target.value))} style={{ width: 35, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} />°</span>
                          </div>

                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Opacity</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1.5 }}>
                            <span style={{ color: '#2b82f6', fontSize: 13, display: 'flex', alignItems: 'center' }}><input type="number" value={Math.round((activeShape.props.opacity ?? 1) * 100)} onChange={(e) => updateProp('opacity', Number(e.target.value) / 100)} style={{ width: 35, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} />%</span>
                          </div>

                        </div>
                      </div>

                      {/* Dimensions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 25, paddingLeft: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)' }}>W</span>
                          <input type="number" value={Math.round(activeShape.width * 19.2)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, width: Number(e.target.value) / 19.2 } : el))} style={{ width: 45, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 13, color: 'var(--foreground)' }}>H</span>
                          <input type="number" value={Math.round(activeShape.height * 10.8)} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, height: Number(e.target.value) / 10.8 } : el))} style={{ width: 45, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} />
                        </div>
                        <LinkIcon size={14} color="var(--text-muted)" cursor="pointer" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 15 }}>
                          <Square size={14} color="var(--text-muted)" style={{ borderRadius: 4 }} />
                          <input type="number" value={activeShape.props.borderRadius || 0} onChange={(e) => updateProp('borderRadius', Number(e.target.value))} style={{ width: 30, background: 'transparent', border: 'none', color: '#2b82f6', fontSize: 13, textAlign: 'right', outline: 'none', padding: 0 }} />
                        </div>
                      </div>
                        </>
                      )}
                    </div>

                    {/* ANIMATION SECTION */}
                    <div className="syn-panel-section" style={{ borderBottom: 'none', padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsedSections['animation'] ? 0 : 15, cursor: 'pointer' }} onClick={() => setCollapsedSections(prev => ({ ...prev, animation: !prev.animation }))}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
                          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: collapsedSections['animation'] ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} /> Animation
                        </div>
                        <Undo2 size={14} color="var(--text-muted)" cursor="pointer" onClick={(e) => {
                          e.stopPropagation();
                          setElements(elements.map(el => el.id === selectedId ? {
                            ...el,
                            motion: { type: 'none', duration: 1, delay: 0 }
                          } : el));
                        }} />
                      </div>

                      {!collapsedSections['animation'] && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                            <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Type</span>
                            <select style={{ flex: 2, background: '#f1f1f1', border: '1px solid #e2e2e2', color: 'var(--foreground)', fontSize: 12, padding: '6px', borderRadius: 4, outline: 'none', cursor: 'pointer' }} value={activeShape.motion?.type || 'none'} onChange={(e) => updateMotion('type', e.target.value)}>
                              <option value="none">None</option>
                              <option value="fade_in">Fade In</option>
                              <option value="fade_out">Fade Out</option>
                              <option value="slide_in_left">Slide In Left</option>
                              <option value="slide_in_right">Slide In Right</option>
                              <option value="zoom_in">Zoom In</option>
                              <option value="spin">Spin</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                            <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Duration (s)</span>
                            <input type="number" step="0.1" min="0" max="10" style={{ flex: 2, background: '#f1f1f1', border: '1px solid #e2e2e2', color: 'var(--foreground)', fontSize: 12, padding: '6px', borderRadius: 4, outline: 'none' }} value={activeShape.motion?.duration || 1} onChange={(e) => updateMotion('duration', Number(e.target.value))} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>Delay (s)</span>
                            <input type="number" step="0.1" min="0" max="10" style={{ flex: 2, background: '#f1f1f1', border: '1px solid #e2e2e2', color: 'var(--foreground)', fontSize: 12, padding: '6px', borderRadius: 4, outline: 'none' }} value={activeShape.motion?.delay || 0} onChange={(e) => updateMotion('delay', Number(e.target.value))} />
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                );
              })()}
            </>
          )}

          {activeTool === 'Media' && (
            <div className="syn-panel-section">
              <input type="file" id="media-upload-input" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  const isVid = file.type.startsWith('video/');
                  setMediaLibrary(prev => prev.some(m => m.src === url) ? prev : [...prev, { src: url, isVideo: isVid }]);
                  addMediaToCanvas(url, isVid);
                  e.target.value = ''; // Reset
                }
              }} />
              <button style={{ width: '100%', padding: '30px 20px', border: '1px dashed var(--accent)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'transparent', color: 'var(--accent)', cursor: 'pointer', transition: 'background 0.2s', marginBottom: 15 }} onClick={() => {
                document.getElementById('media-upload-input')?.click();
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(43, 130, 246, 0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Upload size={22} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Upload Media</span>
              </button>

              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/assets');
                    const data = await res.json();
                    if (data.success && data.assets) {
                      data.assets.forEach((asset: any) => {
                        const isVid = asset.type === 'video';
                        setMediaLibrary(prev => prev.some(m => m.src === asset.url) ? prev : [...prev, { src: asset.url, isVideo: isVid }]);
                      });
                    }
                  } catch (e) { console.error(e); }
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--panel-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--surface-color)', color: 'var(--foreground)', cursor: 'pointer', marginBottom: 15 }}
              >
                <BookOpen size={16} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Load My Assets</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="text" id="media-url-input" placeholder="Or paste URL..." style={{ flex: 1, padding: '8px', borderRadius: 4, border: '1px solid var(--panel-border)', background: 'transparent', color: 'var(--foreground)', fontSize: 13, outline: 'none' }} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    let val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      if (!/^https?:\/\//i.test(val) && !val.startsWith('data:') && !val.startsWith('blob:')) {
                        val = 'https://' + val;
                      }
                      const isVid = /\.(mp4|webm|ogg|mov)$/i.test(val);
                      setMediaLibrary(prev => prev.some(m => {
                        const s = typeof m === 'string' ? m : m.src;
                        return s === val;
                      }) ? prev : [...prev, { src: val, isVideo: isVid }]);
                      addMediaToCanvas(val, isVid);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }} />
                <button className="btn-primary" style={{ padding: '8px 12px' }} onClick={() => {
                  const input = document.getElementById('media-url-input') as HTMLInputElement;
                  if (input && input.value) {
                    let val = input.value.trim();
                    if (val) {
                      if (!/^https?:\/\//i.test(val) && !val.startsWith('data:') && !val.startsWith('blob:')) {
                        val = 'https://' + val;
                      }
                      const isVid = /\.(mp4|webm|ogg|mov)$/i.test(val);
                      setMediaLibrary(prev => prev.some(m => {
                        const s = typeof m === 'string' ? m : m.src;
                        return s === val;
                      }) ? prev : [...prev, { src: val, isVideo: isVid }]);
                      addMediaToCanvas(val, isVid);
                      input.value = '';
                    }
                  }
                }}>Add</button>
              </div>

              {mediaLibrary.length > 0 && (
                <div style={{ marginTop: 25 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Library</div>
                    <button style={{ fontSize: 11, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }} onClick={() => {
                      if (isLibraryEditMode) {
                        setIsLibraryEditMode(false);
                        setSelectedLibraryItems([]);
                      } else {
                        setIsLibraryEditMode(true);
                      }
                    }}>
                      {isLibraryEditMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isLibraryEditMode && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setSelectedLibraryItems(mediaLibrary.map(m => m.src))}>Select All</button>
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11, color: selectedLibraryItems.length ? 'red' : 'inherit', borderColor: selectedLibraryItems.length ? 'red' : '' }} disabled={!selectedLibraryItems.length} onClick={() => {
                        setMediaLibrary(prev => prev.filter(m => !selectedLibraryItems.includes(m.src)));
                        setSelectedLibraryItems([]);
                        setIsLibraryEditMode(false);
                      }}>Delete ({selectedLibraryItems.length})</button>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {mediaLibrary.map((item, i) => {
                      if (!item) return null;
                      
                      let actualSrc = '';
                      let actualIsVideo = false;
                      
                      if (typeof item === 'string') {
                        actualSrc = item;
                        actualIsVideo = /\.(mp4|webm|ogg|mov)$/i.test(item); // Guess if it's a string
                      } else if (typeof item === 'object') {
                        actualSrc = item.src || '';
                        actualIsVideo = !!item.isVideo;
                      }

                      if (!actualSrc || typeof actualSrc !== 'string' || actualSrc.trim() === '') return null;
                      
                      const isSelected = selectedLibraryItems.includes(actualSrc);
                      
                      return (
                        <div key={i} style={{ width: '100%', borderRadius: 6, border: isSelected ? '2px solid var(--accent)' : '1px solid var(--panel-border)', overflow: 'hidden', cursor: 'pointer', position: 'relative', display: 'flex', background: '#e0e0e0' }} onClick={() => {
                          if (isLibraryEditMode) {
                            setSelectedLibraryItems(prev => prev.includes(actualSrc) ? prev.filter(s => s !== actualSrc) : [...prev, actualSrc]);
                          } else {
                            addMediaToCanvas(actualSrc, actualIsVideo);
                          }
                        }}
                        onMouseOver={(e) => {
                          const delBtn = e.currentTarget.querySelector('.library-item-delete') as HTMLElement;
                          if (delBtn) delBtn.style.opacity = '1';
                        }}
                        onMouseOut={(e) => {
                          const delBtn = e.currentTarget.querySelector('.library-item-delete') as HTMLElement;
                          if (delBtn) delBtn.style.opacity = '0';
                        }}
                        >
                          {actualIsVideo ? (
                            <video src={actualSrc} style={{ width: '100%', height: 'auto', display: 'block', opacity: isLibraryEditMode && !isSelected ? 0.6 : 1 }} muted playsInline />
                          ) : (
                            <img src={actualSrc} style={{ width: '100%', height: 'auto', display: 'block', opacity: isLibraryEditMode && !isSelected ? 0.6 : 1, minHeight: 40 }} alt={actualSrc.substring(0, 20) + "..."} />
                          )}
                          {!isLibraryEditMode && (
                            <>
                              <div className="library-item-delete" style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.2s', zIndex: 2 }} onClick={(e) => {
                                e.stopPropagation();
                                setMediaLibrary(prev => prev.filter(s => {
                                  const sSrc = typeof s === 'string' ? s : s.src;
                                  return sSrc !== actualSrc;
                                }));
                              }}>
                                <Trash2 size={12} color="#fff" />
                              </div>
                              <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'var(--accent)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                <Plus size={14} color="#fff" />
                              </div>
                            </>
                          )}
                          {isLibraryEditMode && (
                            <div style={{ position: 'absolute', top: 6, left: 6, width: 16, height: 16, borderRadius: 4, border: '1px solid #fff', background: isSelected ? 'var(--accent)' : 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isSelected && <Check size={12} color="#fff" />}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'Motion' && (
            <div className="syn-panel-section">
              <span style={{ fontSize: 13, color: 'var(--foreground)', display: 'block', marginBottom: 15 }}>Select an element on canvas to animate.</span>
              {selectedId && selectedId !== 'main_video' && (
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Entrance Animation</span>
                  <select style={{ width: '100%', padding: 6, borderRadius: 4, marginBottom: 15 }} value={elements.find(el => el.id === selectedId)?.motion?.entrance || 'none'} onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, motion: { ...el.motion, entrance: e.target.value } } as any : el))}>
                    <option value="none">None</option>
                    <option value="fade-in">Fade In</option>
                    <option value="slide-up">Slide Up</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {activeTool === 'Captions' && (
            <div className="syn-panel-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Auto-Captions</span>
                <div className={`syn-toggle-switch`} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generate captions automatically from your script or audio.</span>
            </div>
          )}

          {activeTool === 'Avatar' && (
            <>
              <div className="syn-panel-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Aspect Ratio</span>
                  <select
                    style={{ background: '#fff', border: '1px solid var(--panel-border)', borderRadius: 6, padding: '4px 8px', fontSize: 12, outline: 'none', color: 'var(--foreground)' }}
                    value={projectAspectRatio}
                    onChange={(e) => setProjectAspectRatio(e.target.value)}
                  >
                    <option value="16/9">16:9 Landscape</option>
                    <option value="9/16">9:16 Portrait</option>
                    <option value="1/1">1:1 Square</option>
                  </select>
                </div>
              </div>

              <div className="syn-panel-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Background Color</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8F6F0', padding: '4px 8px', borderRadius: 6, fontSize: 12, border: '1px solid var(--panel-border)', cursor: 'pointer', position: 'relative' }}>
                  <input type="color" value={sceneColor} onChange={(e) => setSceneColor(e.target.value)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', top: 0, left: 0 }} />
                  <div style={{ width: 14, height: 14, background: sceneColor, border: '1px solid #E2DCC9', borderRadius: 2 }} />
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
            </>
          )}

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
