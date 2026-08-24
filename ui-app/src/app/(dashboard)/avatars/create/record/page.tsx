"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Smartphone, Mic, Video, Loader2, Play, Square, CheckCircle } from 'lucide-react';

export default function RecordAvatarPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'webcam' | 'phone' | 'upload' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Webcam State
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setRecordedVideoUrl(null);
    setSelectedFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  const handleMethodSelect = (method: 'webcam' | 'phone') => {
    setSelectedMethod(method);
    if (method === 'webcam') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleStartRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    let mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm'; // fallback
    }
    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      
      if (blob.size < 10000) { // Less than 10KB means basically empty
        alert("Your recording was too short! Please make sure to record for at least 3-5 seconds so the AI can track your face.");
        chunksRef.current = [];
        return;
      }
      
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      
      const file = new File([blob], "webcam_recording.webm", { type: 'video/webm' });
      setSelectedFile(file);
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    setRecordedVideoUrl(null);
    setSelectedFile(null);
    startCamera();
  };


  const [trackingAvatarId, setTrackingAvatarId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Poll for progress when tracking an avatar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (uploadSuccess && trackingAvatarId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/avatars', { cache: 'no-store' });
          const data = await res.json();
          if (data.success && data.avatars) {
            const avatar = data.avatars.find((a: any) => a.id === trackingAvatarId);
            if (avatar) {
              setGenerationProgress(avatar.progress || 0);
              if (avatar.status === 'ready') {
                clearInterval(interval);
                router.push('/avatars');
              } else if (avatar.status === 'error') {
                clearInterval(interval);
                alert("Generation failed!");
                setUploadSuccess(false);
              }
            }
          }
        } catch (e) {}
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [uploadSuccess, trackingAvatarId, router]);

  const handleReadyClick = async () => {
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('video', selectedFile);

      try {
        const res = await fetch('/api/avatars', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) throw new Error("Upload failed");
        
        const data = await res.json();
        const trackingId = data.avatarId;
        setTrackingAvatarId(trackingId);

        // Fire the request to build the avatar in the background
        fetch(`/api/avatars/${trackingId}/build`, {
          method: 'POST'
        }).catch(err => console.error("Background processing error:", err));
        
        // Show the success screen immediately so the user can watch the progress
        setIsUploading(false);
        setUploadSuccess(true);
        
      } catch (err) {
        console.error("Upload error:", err);
        alert('Upload failed. Please try again.');
        setIsUploading(false);
      }
    }
  };

  if (uploadSuccess) {
    return (
      <div className="home-content">
        <div style={{ maxWidth: 600, margin: '80px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#fff', padding: '64px 32px', borderRadius: 24, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, border: '4px solid #e0e7ff', borderTopColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, animation: 'spin 1s linear infinite' }}>
             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Cloning your Avatar...</h1>
          <p style={{ fontSize: 16, color: '#4f46e5', fontWeight: 600, marginBottom: 16 }}>
            {generationProgress}%
          </p>
          <div style={{ width: '100%', maxWidth: 400, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 32 }}>
            <div style={{ width: `${generationProgress}%`, height: '100%', background: '#4f46e5', transition: 'width 0.5s ease-out' }} />
          </div>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 400, lineHeight: 1.6 }}>
            The AI is processing your video and creating a perfect digital clone. You will be redirected to your dashboard automatically when it finishes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-content">
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 0' }}>
        <button 
          onClick={() => { stopCamera(); router.push('/avatars/create'); }} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 32, padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Create your Avatar in 15 seconds
        </h1>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 40, lineHeight: 1.5 }}>
          Record your motion once, then reuse it across any look for this avatar. Or upload footage.
        </p>

        {/* Methods */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div 
            onClick={() => handleMethodSelect('webcam')}
            style={{ 
              padding: 24, 
              border: `1px solid ${selectedMethod === 'webcam' ? '#4f46e5' : '#e2e8f0'}`, 
              borderRadius: 16, 
              cursor: 'pointer', 
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              transition: 'all 0.2s',
              boxShadow: selectedMethod === 'webcam' ? '0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)' : 'none',
              transform: selectedMethod === 'webcam' ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: selectedMethod === 'webcam' ? '#4f46e5' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Monitor size={24} color={selectedMethod === 'webcam' ? '#fff' : '#4f46e5'} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', textAlign: 'center' }}>
              Record via webcam
            </div>
          </div>

          <div 
            onClick={() => handleMethodSelect('phone')}
            style={{ 
              padding: 24, 
              border: `1px solid ${selectedMethod === 'phone' ? '#4f46e5' : '#e2e8f0'}`, 
              borderRadius: 16, 
              cursor: 'pointer', 
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              transition: 'all 0.2s',
              boxShadow: selectedMethod === 'phone' ? '0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)' : 'none',
              transform: selectedMethod === 'phone' ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: selectedMethod === 'phone' ? '#4f46e5' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Smartphone size={24} color={selectedMethod === 'phone' ? '#fff' : '#4f46e5'} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', textAlign: 'center' }}>
              Record via phone
            </div>
          </div>
        </div>

        {selectedMethod === 'webcam' ? (
          <div style={{ maxWidth: 800, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Camera Viewfinder */}
            <div style={{ position: 'relative', width: '100%', borderRadius: 24, overflow: 'hidden', background: '#0f172a', aspectRatio: '16/9', boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.2)', border: '1px solid #1e293b' }}>
              
              {/* Teleprompter Overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '40px 60px', background: 'linear-gradient(to bottom, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)', zIndex: 10 }}>
                <p style={{ fontSize: 24, fontWeight: 500, color: '#f8fafc', textAlign: 'center', lineHeight: 1.5, textShadow: '0 4px 12px rgba(0,0,0,0.5)', margin: 0 }}>
                  "Hi, my name is [Your Name], and I am creating my custom AI avatar. I am looking directly into the camera, speaking clearly, and maintaining a natural expression."
                </p>
              </div>

              {/* Status Indicator */}
              <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8, background: isRecording ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, zIndex: 10, backdropFilter: 'blur(8px)' }}>
                {isRecording ? (
                  <>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>REC</span>
                  </>
                ) : (
                  <>
                    <Video size={14} color="#fff" />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>READY</span>
                  </>
                )}
              </div>

              {/* Video Element */}
              {!streamRef.current && !recordedVideoUrl && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <Loader2 size={32} className="animate-spin" style={{ marginBottom: 16 }} />
                  <span style={{ fontSize: 15, fontWeight: 500 }}>Connecting to Camera...</span>
                </div>
              )}

              {recordedVideoUrl ? (
                <video src={recordedVideoUrl} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              )}
              
              {/* Overlay Controls */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px', background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                {!recordedVideoUrl ? (
                  isRecording ? (
                    <button 
                      onClick={handleStopRecording} 
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 32px', height: 56, borderRadius: 28, background: '#ef4444', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)', backdropFilter: 'blur(8px)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                    >
                      <Square size={18} fill="#fff" /> Stop Recording
                    </button>
                  ) : (
                    <button 
                      onClick={handleStartRecording} 
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 32px', height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.95)', color: '#0f172a', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.background = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; }}
                    >
                      <div style={{ width: 14, height: 14, borderRadius: 7, background: '#ef4444' }} /> Start Recording
                    </button>
                  )
                ) : (
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button 
                      onClick={handleRetake} 
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 32px', height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(12px)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    >
                      <ArrowLeft size={18} /> Retake
                    </button>
                    <button 
                      onClick={handleReadyClick}
                      disabled={isUploading}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 32px', height: 56, borderRadius: 28, background: '#10b981', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: isUploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}
                      onMouseEnter={(e) => { if(!isUploading){ e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; } }}
                      onMouseLeave={(e) => { if(!isUploading){ e.currentTarget.style.transform = 'translateY(0) scale(1)'; } }}
                    >
                      {isUploading ? <Loader2 size={18} className="animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      Approve & Generate
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Inject pulse animation */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}} />
          </div>
        ) : (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 32, marginBottom: 40, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: -8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={18} color="#64748b" /></div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, border: '2px solid #fff' }}><Mic size={18} color="#64748b" /></div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a' }}>Enable Camera & Microphone</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc', padding: '16px 24px', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: 15, color: '#475569', fontWeight: 500 }}>We'll provide a script on screen in</div>
              <select style={{ padding: '8px 32px 8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontWeight: 600, fontSize: 14, color: '#0f172a', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        )}

        {/* Actions */}
        {selectedMethod !== 'webcam' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button 
              onClick={() => { stopCamera(); router.push('/avatars/create'); }}
              style={{ padding: '0 24px', height: 48, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              disabled={isUploading}
            >
              Back
            </button>
            <button 
              onClick={handleReadyClick}
              disabled={!selectedFile || isUploading}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 32px', height: 48, background: (!selectedFile || isUploading) ? '#cbd5e1' : '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: (!selectedFile || isUploading) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: (!selectedFile || isUploading) ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
            >
              {isUploading && <Loader2 size={16} className="animate-spin" />}
              I'm ready
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
