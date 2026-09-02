"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Monitor, Smartphone, Mic, Video, MicOff, VideoOff, Loader2, Play, Square, CheckCircle, X, Check, PhoneOff, Settings, Power, ChevronRight, CheckCircle2, Circle, Send, Link as LinkIcon, Download } from 'lucide-react';
import type { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { QRCodeSVG } from 'qrcode.react';

export default function RecordAvatarPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'webcam' | 'phone' | 'upload' | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/network-ip')
        .then(res => res.json())
        .then(data => {
          const port = window.location.port ? `:${window.location.port}` : '';
          setCurrentUrl(`http://${data.ip}${port}/avatars/create/record`);
        })
        .catch(() => {
          // Fallback to window location if API fails
          setCurrentUrl(window.location.href);
        });
    }
  }, []);

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
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lightingMode, setLightingMode] = useState('Normal');
  const [backgroundMode, setBackgroundMode] = useState('Original');
  const [activeCameraView, setActiveCameraView] = useState('Main');
  const [scriptText, setScriptText] = useState("Hi, my name is [Your Name]. I am recording this video to create a custom AI avatar. By reading this script, I am providing the system with the visual and audio data it needs to accurately capture my voice and facial expressions.");
  const [avatarName, setAvatarName] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('English (US)');
  const [speakingStyle, setSpeakingStyle] = useState('Professional');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selfieSegmentationRef = useRef<SelfieSegmentation | null>(null);
  const segmentationFrameRef = useRef<number>(0);

  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAudioPassed, setHasAudioPassed] = useState(false);
  const [hasCameraPassed, setHasCameraPassed] = useState(false);
  const [hasSubjectPassed, setHasSubjectPassed] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const scriptWords = scriptText.split(' ').filter(Boolean);
  const animationFrameRef = useRef<number>(0);
  const isRecordingRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isRunning = true;

    const officeImg = new Image();
    officeImg.src = '/images/office_bg.jpg';
    
    const abstractImg = new Image();
    abstractImg.src = '/images/abstract_bg.jpg';

    const drawResults = (results: any) => {
      const canvas = canvasRef.current;
      const canvasCtx = canvas?.getContext('2d');
      if (!canvas || !canvasCtx) return;
      setHasSubjectPassed(true);

      if (canvas.width !== results.image.width) {
        canvas.width = results.image.width;
        canvas.height = results.image.height;
      }

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mask with a tiny bit of anti-aliasing blur
      canvasCtx.filter = 'blur(2px)';
      canvasCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

      // Draw the person inside the eroded mask
      canvasCtx.filter = 'none';
      canvasCtx.globalCompositeOperation = 'source-in';
      canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      canvasCtx.globalCompositeOperation = 'destination-atop';

      if (backgroundMode === 'Blur') {
        canvasCtx.filter = 'blur(16px)';
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      } else if (backgroundMode === 'Office') {
        if (officeImg.complete && officeImg.naturalHeight !== 0) {
          canvasCtx.filter = 'none';
          canvasCtx.drawImage(officeImg, 0, 0, canvas.width, canvas.height);
        } else {
          canvasCtx.fillStyle = '#1e293b';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (backgroundMode === 'Gradient') {
        if (abstractImg.complete && abstractImg.naturalHeight !== 0) {
          canvasCtx.filter = 'none';
          canvasCtx.drawImage(abstractImg, 0, 0, canvas.width, canvas.height);
        } else {
          canvasCtx.fillStyle = '#222';
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        canvasCtx.filter = 'none';
        canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }
      canvasCtx.restore();
    };

    // Update the onResults handler so it always uses the latest backgroundMode from this render's closure
    if (selfieSegmentationRef.current) {
      selfieSegmentationRef.current.onResults(drawResults);
    }

    const processVideo = async () => {
      if (!isRunning) return;
      
      if (!selfieSegmentationRef.current) {
        const SelfieSegmentationClass = (window as any).SelfieSegmentation;
        if (SelfieSegmentationClass) {
          selfieSegmentationRef.current = new SelfieSegmentationClass({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
          });
          // Switch to high-accuracy model (0) instead of the fast landscape model (1) for perfect edge detection
          selfieSegmentationRef.current!.setOptions({ modelSelection: 0 });
          selfieSegmentationRef.current!.onResults(drawResults);
        } else {
          // Load script dynamically if not present
          if (!document.getElementById('mediapipe-script')) {
            const script = document.createElement('script');
            script.id = 'mediapipe-script';
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
            script.crossOrigin = 'anonymous';
            document.body.appendChild(script);
          }
        }
      }

      if (videoRef.current && videoRef.current.readyState >= 2) {
        if (selfieSegmentationRef.current) {
          try {
            await selfieSegmentationRef.current.send({ image: videoRef.current });
          } catch (e) { /* ignore frame drops */ }
        } else if (canvasRef.current) {
          // Fallback: draw raw video if MediaPipe isn't ready yet
          const ctx = canvasRef.current.getContext('2d');
          if (ctx && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      } else if (canvasRef.current) {
        // If the camera is off or loading, clear the canvas so it doesn't freeze on the last frame
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      segmentationFrameRef.current = requestAnimationFrame(processVideo);
    };

    processVideo();

    return () => {
      isRunning = false;
      if (segmentationFrameRef.current) cancelAnimationFrame(segmentationFrameRef.current);
    };
  }, [backgroundMode]);

  useEffect(() => {
    if (!isRecording || isMicMuted || !streamRef.current) {
      setIsSpeaking(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(streamRef.current);
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const average = sum / dataArray.length;
      const speaking = average > 10;
      setIsSpeaking(speaking);
      if (speaking) setHasAudioPassed(true);
      animationFrameRef.current = requestAnimationFrame(checkVolume);
    };
    
    checkVolume();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      try { source.disconnect(); audioContext.close(); } catch(e) {}
    };
  }, [isRecording, isMicMuted]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onend = () => {
          if (isRecordingRef.current) {
             try { recognitionRef.current.start(); } catch (e) {}
          }
        };

        recognitionRef.current.onresult = (event: any) => {
          let currentSessionTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
             currentSessionTranscript += event.results[i][0].transcript;
             if (event.results[i].isFinal && i === event.results.length - 1) {
                accumulatedTranscriptRef.current += ' ' + event.results[i][0].transcript;
             }
          }
          
          const fullTranscript = accumulatedTranscriptRef.current + ' ' + currentSessionTranscript;
          
          const spokenWords = fullTranscript.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(Boolean);
          let currentSearchIdx = 0;
          let maxMatchedIdx = -1;
          for (const spokenWord of spokenWords) {
            // Try to find the spoken word in the script, moving forward
            for (let i = currentSearchIdx; i < scriptWords.length; i++) {
              const cleanScript = scriptWords[i].toLowerCase().replace(/[^a-z0-9]/g, '');
              // Use strict exact match to prevent accidental skips
              if (cleanScript && cleanScript === spokenWord) {
                maxMatchedIdx = i;
                currentSearchIdx = i + 1;
                break;
              }
            }
          }
          if (maxMatchedIdx > -1) {
            setHighlightedWordIndex(maxMatchedIdx);
          }
        };
      }
    }
  }, []);

  const toggleMic = async () => {
    if (!streamRef.current) return;
    
    if (isMicMuted) {
      // Turn it back on by requesting a new audio track
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newAudioTrack = newStream.getAudioTracks()[0];
        streamRef.current.addTrack(newAudioTrack);
        setIsMicMuted(false);
      } catch (err) {
        console.error("Error restarting microphone", err);
      }
    } else {
      // Turn it off by completely stopping the track
      streamRef.current.getAudioTracks().forEach(track => {
        track.stop();
        streamRef.current?.removeTrack(track);
      });
      setIsMicMuted(true);
    }
  };

  const toggleCamera = async () => {
    if (!streamRef.current) return;
    
    if (isCameraOff) {
      // Turn it back on by requesting a new video track
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        const newVideoTrack = newStream.getVideoTracks()[0];
        
        // Recreate the entire MediaStream so the HTMLMediaElement detects the change
        const audioTracks = streamRef.current.getAudioTracks();
        const combinedStream = new MediaStream([newVideoTrack, ...audioTracks]);
        streamRef.current = combinedStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = combinedStream;
          videoRef.current.play().catch(e => console.error('Play error', e));
        }
        setIsCameraOff(false);
      } catch (err) {
        console.error("Error restarting camera", err);
      }
    } else {
      // Turn it off by completely stopping the track so the hardware light goes off
      streamRef.current.getVideoTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOff(true);
    }
  };

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
      // Explicitly ask for facingMode: 'user' to help iOS Safari select the correct camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      streamRef.current = stream;
      setIsMicMuted(false);
      setIsCameraOff(false);
      if (videoRef.current) {
        setHasCameraPassed(true);
        // Force muted and playsinline directly on the DOM node for strict iOS Safari compliance
        videoRef.current.muted = true;
        videoRef.current.defaultMuted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.srcObject = stream;
        // iOS Safari strictly requires an explicit play() call for media streams, autoPlay is not enough
        videoRef.current.play().catch(e => console.error('Play error on startCamera:', e));
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  const handleMethodSelect = async (method: 'webcam' | 'phone') => {
    setSelectedMethod(method);
    if (method === 'webcam') {
      startCamera();
    } else {
      stopCamera();
      try {
        const res = await fetch('/api/handoff/create', { method: 'POST', credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          let url = window.location.origin + '/api/handoff/redirect';
          if (url.includes('localhost')) url = url.replace('localhost', '10.171.188.44');
          const newUrl = new URL(url);
          newUrl.searchParams.set('token', data.token);
          setCurrentUrl(newUrl.toString());
        } else {
          alert('Error creating handoff token: ' + (data.error || 'Unknown error'));
        }
      } catch (err: any) {
        console.error("Failed to create handoff token", err);
        alert('Exception creating handoff token: ' + err.message);
      }
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
    isRecordingRef.current = true;
    accumulatedTranscriptRef.current = '';
    if (recognitionRef.current) {
      setHighlightedWordIndex(-1);
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
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
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

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
        } catch (e) { }
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

  let computedFilter = 'none';
  if (lightingMode === 'Studio Warm') computedFilter = 'brightness(1.1) sepia(0.3) saturate(1.2)';
  else if (lightingMode === 'Studio Cool') computedFilter = 'brightness(1.1) contrast(1.1) saturate(0.9) hue-rotate(180deg)'; // Slight blue tint
  else if (lightingMode === 'Cinematic') computedFilter = 'contrast(1.25) saturate(1.1) brightness(0.9)';

  // Blur is now handled by MediaPipe segmentation, so we don't apply CSS blur to the whole container anymore.

  if (selectedMethod === 'webcam') {
    return (
      <>
      <div style={{ padding: '32px 48px', fontFamily: 'system-ui, sans-serif', width: '100%', maxWidth: 1600, margin: '0 auto', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: 24, boxSizing: 'border-box', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => { stopCamera(); setSelectedMethod(null); }} style={{ width: 44, height: 44, borderRadius: 22, background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ArrowLeft size={20} color="#111" />
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>Avatar Recording Session</h1>
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>Custom AI Avatar Pipeline</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: '#f8fafc', padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 500, color: '#333' }}>
                <span style={{ fontWeight: 600 }}>System</span> is ready for recording
              </div>
              <button onClick={() => { stopCamera(); setSelectedMethod(null); }} style={{ width: 44, height: 44, borderRadius: 22, background: '#df6c62', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={20} />
              </button>
              <button onClick={handleReadyClick} disabled={!recordedVideoUrl || isUploading} style={{ width: 44, height: 44, borderRadius: 22, background: '#111', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (!recordedVideoUrl || isUploading) ? 'not-allowed' : 'pointer', color: '#fff', opacity: (!recordedVideoUrl || isUploading) ? 0.5 : 1 }}>
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, flex: 1, minHeight: 0 }}>
            {/* Left Col: Videos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
              {/* Main Video */}
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden', background: '#000', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {!streamRef.current && !recordedVideoUrl && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Loader2 size={32} className="animate-spin" />
                  </div>
                )}
                {recordedVideoUrl ? (
                  <video src={recordedVideoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover', transform: activeCameraView === 'Close Up' ? 'scale(1.3) translateY(5%)' : activeCameraView === 'Side View' ? 'scale(1.1) translateX(5%)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', filter: computedFilter }} />
                ) : (
                  <>
                    <video ref={videoRef} autoPlay muted playsInline style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: 16, height: 16, zIndex: -1 }} />
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scaleX(-1) ${activeCameraView === 'Close Up' ? 'scale(1.3) translateY(5%)' : activeCameraView === 'Side View' ? 'scale(1.1) translateX(-5%)' : 'scale(1)'}`, filter: computedFilter, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </>
                )}
                
                {/* Overlays */}

                <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13, fontWeight: 500 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: isRecording ? '#ef4444' : '#10b981', animation: isRecording ? 'pulse 1.5s infinite' : 'none' }} />
                  {isRecording ? `Recording... 00:${recordingTime.toString().padStart(2, '0')}` : 'Ready to Record'}
                </div>

                <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16, color: '#fff', width: '80%', maxWidth: 500 }}>
                  <div style={{ display: 'flex', gap: 3, height: 24, alignItems: 'center' }}>
                     <div style={{ width: 3, height: '40%', background: '#fff', borderRadius: 2, animation: isSpeaking ? 'soundPulse 0.5s infinite ease-in-out alternate' : 'none' }} />
                     <div style={{ width: 3, height: '80%', background: '#fff', borderRadius: 2, animation: isSpeaking ? 'soundPulse 0.7s infinite ease-in-out alternate 0.2s' : 'none' }} />
                     <div style={{ width: 3, height: '100%', background: '#fff', borderRadius: 2, animation: isSpeaking ? 'soundPulse 0.4s infinite ease-in-out alternate 0.1s' : 'none' }} />
                     <div style={{ width: 3, height: '60%', background: '#fff', borderRadius: 2, animation: isSpeaking ? 'soundPulse 0.6s infinite ease-in-out alternate 0.3s' : 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, lineHeight: 1.5, opacity: 0.9, display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {scriptWords.map((word, i) => (
                        <span key={i} style={{ color: highlightedWordIndex >= i ? '#60a5fa' : '#fff', transition: 'color 0.2s ease' }}>
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12 }}>
                  <button onClick={toggleMic} style={{ width: 44, height: 44, borderRadius: 22, background: isMicMuted ? '#df6c62' : 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button onClick={toggleCamera} style={{ width: 44, height: 44, borderRadius: 22, background: isCameraOff ? '#df6c62' : 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                  </button>
                  
                  {!recordedVideoUrl ? (
                    isRecording ? (
                      <button onClick={handleStopRecording} style={{ width: 44, height: 44, borderRadius: 22, background: '#df6c62', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(223,108,98,0.4)' }}><Square size={16} fill="#fff" /></button>
                    ) : (
                      <button onClick={handleStartRecording} style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', border: '2px solid #fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><div style={{width: 14, height: 14, borderRadius: 7, background: '#ef4444'}}/></button>
                    )
                  ) : (
                    <button onClick={handleRetake} style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
                  )}
                </div>

                <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 12 }}>
                   <button onClick={() => setShowSettings(!showSettings)} style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', border: 'none', color: showSettings ? '#60a5fa' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}><Settings size={16} /></button>
                </div>
                {showSettings && (
                  <div style={{ position: 'absolute', bottom: 64, right: 20, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: 16, width: 280, color: '#fff', border: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Studio Lighting</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                      {['Normal', 'Studio Warm', 'Studio Cool', 'Cinematic'].map(mode => (
                        <button key={mode} onClick={() => setLightingMode(mode)} style={{ background: lightingMode === mode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', border: lightingMode === mode ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', borderRadius: 8, padding: '8px', color: '#fff', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>{mode}</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Background</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {['Original', 'Blur', 'Office', 'Gradient'].map(mode => (
                        <button key={mode} onClick={() => setBackgroundMode(mode)} style={{ background: backgroundMode === mode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', border: backgroundMode === mode ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', borderRadius: 8, padding: '8px', color: '#fff', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>{mode}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
               {/* Top Cards */}
               <div style={{ display: 'flex', gap: 16 }}>
                 <div style={{ flex: 1, background: '#d1e5db', borderRadius: 20, padding: 16, position: 'relative' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111', marginBottom: 10 }}>Recording Tips</div>
                    <p style={{ fontSize: 11, color: '#333', lineHeight: 1.5, margin: 0 }}>Ensure you are in a well-lit room. Speak clearly and maintain eye contact with the lens to achieve the best AI training results.</p>
                 </div>
                 <div style={{ flex: 1, background: '#000', borderRadius: 20, padding: 16, color: '#fff', position: 'relative' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Checklist</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: scriptText.trim().length > 0 ? '#a7f3d0' : '#888' }}>{scriptText.trim().length > 0 ? <CheckCircle2 size={14} /> : <Circle size={14} />} Script Prepared</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: hasAudioPassed ? '#a7f3d0' : '#888' }}>{hasAudioPassed ? <CheckCircle2 size={14} /> : <Circle size={14} />} Clear Audio / No Background Noise</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: recordingTime >= 15 ? '#a7f3d0' : '#888' }}>{recordingTime >= 15 ? <CheckCircle2 size={14} /> : <Circle size={14} />} 15s Minimum Duration</div>
                     </div>
                 </div>
               </div>

               {/* Avatar Profile Form */}
               <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>Avatar Profile</div>
                    <div style={{ background: '#e2e8f0', padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 0.5 }}>METADATA</div>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Avatar Name</label>
                    <input 
                      type="text"
                      value={avatarName}
                      onChange={(e) => setAvatarName(e.target.value)}
                      placeholder="e.g. Sales Representative AI"
                      style={{ width: '100%', height: 44, background: '#ffffff', border: 'none', borderRadius: 12, padding: '0 16px', fontSize: 13, color: '#0f172a', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                    />
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Primary Language</label>
                    <select value={primaryLanguage} onChange={(e) => setPrimaryLanguage(e.target.value)} style={{ width: '100%', height: 44, background: '#ffffff', border: 'none', borderRadius: 12, padding: '0 16px', fontSize: 13, color: '#0f172a', outline: 'none', appearance: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Speaking Style</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                       {['Professional', 'Casual', 'Energetic'].map((style) => (
                         <div 
                           key={style} 
                           onClick={() => setSpeakingStyle(style)}
                           style={{ flex: 1, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: speakingStyle === style ? '#0f172a' : '#ffffff', color: speakingStyle === style ? '#ffffff' : '#64748b', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                           {style}
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ 
      padding: '40px 60px 80px 60px',
      marginTop: '-16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: '100%',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: '#ffffff',
      borderRadius: '32px',
      animation: 'fadeIn 0.5s ease-out',
      color: '#111',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <button
        onClick={() => { stopCamera(); router.push('/avatars/create'); }}
        style={{ position: 'absolute', top: 40, left: 60, background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: '20px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', width: 'fit-content' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ width: '100%', maxWidth: 800, marginTop: 40 }}>

        <h1 style={{ fontSize: 42, fontWeight: 400, color: '#111', marginBottom: 12, letterSpacing: '-1px' }}>
          Create your Avatar in <span style={{ color: '#888' }}>15 seconds</span>
        </h1>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 48, lineHeight: 1.5 }}>
          Record your motion once, then reuse it across any look for this avatar. Or upload footage.
        </p>

        {/* Methods */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div 
            onClick={() => handleMethodSelect('webcam')}
            style={{ 
              padding: 24, 
              border: '2px solid #F5F5F5', 
              borderRadius: 16, 
              cursor: 'pointer', 
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              transition: 'all 0.2s',
              transform: 'translateY(0)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Monitor size={24} color="#d86450" />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', textAlign: 'center' }}>
              Record via webcam
            </div>
          </div>

          <div 
            onClick={() => handleMethodSelect('phone')}
            style={{ 
              padding: 24, 
              border: `2px solid ${selectedMethod === 'phone' ? '#d86450' : '#F5F5F5'}`, 
              borderRadius: 16, 
              cursor: 'pointer', 
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              transition: 'all 0.2s',
              transform: selectedMethod === 'phone' ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: selectedMethod === 'phone' ? '#d86450' : '#fff5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <Smartphone size={24} color={selectedMethod === 'phone' ? '#fff' : '#d86450'} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', textAlign: 'center' }}>
              Record via phone
            </div>
          </div>
        </div>

        {selectedMethod !== 'phone' && (
          <div style={{ border: '2px solid #F5F5F5', borderRadius: 16, padding: 32, marginBottom: 40, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: -8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video size={18} color="#64748b" /></div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, border: '2px solid #fff' }}><Mic size={18} color="#64748b" /></div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a' }}>Enable Camera & Microphone</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f8fafc', padding: '16px 24px', borderRadius: 12, border: '2px solid #F5F5F5' }}>
              <div style={{ fontSize: 15, color: '#475569', fontWeight: 500 }}>We'll provide a script on screen in</div>
              <select style={{ padding: '8px 32px 8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', fontWeight: 600, fontSize: 14, color: '#0f172a', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d86450'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        )}

        {selectedMethod === 'phone' && (
          <div style={{ border: '2px solid #F5F5F5', borderRadius: 16, padding: 48, marginBottom: 40, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Scan to Record on Phone</h2>
            <p style={{ color: '#64748b', marginBottom: 32, textAlign: 'center', maxWidth: 400, lineHeight: 1.5 }}>
              Scan this QR code with your phone's camera. It will open this page on your mobile device, allowing you to record your avatar easily.
            </p>
            {currentUrl ? (
              <div style={{ padding: 24, background: '#fff', borderRadius: 24, border: '2px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                <QRCodeSVG value={currentUrl} size={220} level="H" />
              </div>
            ) : (
              <div style={{ width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 16 }}>
                <Loader2 className="animate-spin" size={32} color="#94a3b8" />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {selectedMethod !== 'phone' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button
              onClick={() => { stopCamera(); router.push('/avatars/create'); }}
              style={{ padding: '0 24px', height: 48, background: '#fff', border: '2px solid #F5F5F5', color: '#64748b', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
              disabled={isUploading}
            >
              Back
            </button>
            <button
              onClick={handleReadyClick}
              disabled={!selectedFile || isUploading}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 32px', height: 48, background: (!selectedFile || isUploading) ? '#e2e8f0' : '#d86450', color: (!selectedFile || isUploading) ? '#94a3b8' : '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: (!selectedFile || isUploading) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
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