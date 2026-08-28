"use client";

import React, { useState, useEffect } from 'react';
import { Share2, RefreshCw, Play, Upload } from 'lucide-react';

interface VideoFile {
  id: number;
  filename: string;
  title: string;
  edited: string;
  sizeBytes: number;
}

interface PublisherWidgetProps {
  lockedPlatform?: 'youtube' | 'instagram';
  initialPlatform?: 'youtube' | 'instagram' | 'both';
  ytConnected: boolean;
  igConnected: boolean;
  onPublishSuccess?: (pub: any) => void;
}

export default function PublisherWidget({ lockedPlatform, initialPlatform, ytConnected, igConnected, onPublishSuccess }: PublisherWidgetProps) {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState<string>('');
  
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platformType, setPlatformType] = useState<'youtube' | 'instagram' | 'both'>(lockedPlatform || initialPlatform || 'youtube');
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStep, setPublishStep] = useState('');

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (data.success && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          setSelectedVideoFile(data.videos[0].filename);
        } else {
          // Fallback static videos
          const fallback = [
            { id: 1, filename: 'personalized_outreach_25fps.mp4', title: 'Personalized Outreach', edited: '2h ago', sizeBytes: 1548000 },
            { id: 2, filename: 'demo_avatar_result.mp4', title: 'Demo Avatar Result', edited: '1d ago', sizeBytes: 2420000 }
          ];
          setVideos(fallback);
          setSelectedVideoFile(fallback[0].filename);
        }
      } catch (err) {
        console.error("Failed to fetch videos from API, using fallback:", err);
        const fallback = [
          { id: 1, filename: 'personalized_outreach_25fps.mp4', title: 'Personalized Outreach', edited: '2h ago', sizeBytes: 1548000 }
        ];
        setVideos(fallback);
        setSelectedVideoFile(fallback[0].filename);
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideos();
  }, []);

  const handlePublish = async () => {
    if (!ytConnected && platformType === 'youtube') {
      alert("Please connect your YouTube account first.");
      return;
    }
    if (!igConnected && platformType === 'instagram') {
      alert("Please connect your Instagram account first.");
      return;
    }
    if (platformType === 'both' && (!ytConnected || !igConnected)) {
      alert("Please connect both YouTube and Instagram accounts to publish to both.");
      return;
    }
    if (!selectedVideoFile) {
      alert("Please select a video to upload.");
      return;
    }
    if (!title && platformType !== 'instagram') {
      alert("Please enter a video title for YouTube.");
      return;
    }

    setIsPublishing(true);
    setPublishProgress(0);
    setPublishStep('Preparing video file for upload...');

    try {
      if (platformType === 'youtube' || platformType === 'both') {
        setPublishProgress(20);
        setPublishStep('Uploading video to YouTube...');

        const res = await fetch('/api/socials/youtube/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoFilename: selectedVideoFile,
            title: title,
            description: caption || '',
            tags: '',
          }),
        });

        const data = await res.json();

        setPublishProgress(90);
        setPublishStep('Finalizing YouTube upload...');

        if (data.success) {
          const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
          if (onPublishSuccess) {
            onPublishSuccess({
              id: `pub-yt-${Date.now()}`,
              title: title,
              platform: 'youtube',
              account: 'YouTube Channel',
              date: dateStr,
              status: 'Live',
              link: data.youtubeUrl || `https://youtube.com/shorts/${data.videoId}`
            });
          }
        } else {
          alert('YouTube upload failed: ' + (data.error || 'Unknown error'));
        }
      }

      if (platformType === 'instagram' || platformType === 'both') {
        // Instagram upload not yet implemented
        setPublishProgress(95);
        setPublishStep('Instagram upload not yet configured...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setPublishProgress(100);
      setPublishStep('Done!');
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setTimeout(() => {
        setIsPublishing(false);
        setTitle('');
        setCaption('');
      }, 1500);
    }
  };

  return (
    <div className="soc-publisher-layout">
      {/* Publisher Form fields */}
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Video selector */}
          <div className="soc-field-group">
            <label>Select Generated Video</label>
            {loadingVideos ? (
              <div style={{ padding: '10px 14px', border: '1px solid var(--panel-border)', borderRadius: 8, background: '#f8fafc', fontSize: 13, color: 'var(--text-muted)' }}>
                Loading Library Videos...
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <select 
                  value={selectedVideoFile} 
                  onChange={(e) => setSelectedVideoFile(e.target.value)}
                  className="soc-select"
                  style={{ flex: 1 }}
                >
                  {videos.map(v => (
                    <option key={v.id} value={v.filename}>{v.title} ({v.filename})</option>
                  ))}
                </select>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  padding: '0 20px', 
                  borderRadius: '8px', 
                  cursor: isUploadingLocal ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#334155',
                  transition: 'all 0.2s',
                  opacity: isUploadingLocal ? 0.6 : 1
                }}>
                  {isUploadingLocal ? (
                    <><RefreshCw size={14} className="pers-anim-pulse" style={{ marginRight: 6 }} /> Uploading...</>
                  ) : (
                    <><Upload size={14} style={{ marginRight: 6 }} /> Upload</>
                  )}
                  <input 
                    type="file" 
                    accept="video/*" 
                    style={{ display: 'none' }} 
                    disabled={isUploadingLocal}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setIsUploadingLocal(true);
                        
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const res = await fetch('/api/videos/upload', {
                            method: 'POST',
                            body: formData
                          });
                          
                          const data = await res.json();
                          
                          if (data.success) {
                            const newVideo = {
                              id: Date.now(),
                              filename: data.filename,
                              title: file.name.split('.')[0],
                              edited: 'Just now',
                              sizeBytes: data.size
                            };
                            setVideos([newVideo, ...videos]);
                            setSelectedVideoFile(newVideo.filename);
                          } else {
                            alert("Failed to upload video to server: " + (data.error || "Unknown error"));
                          }
                        } catch (err) {
                          alert("Failed to upload video.");
                        } finally {
                          setIsUploadingLocal(false);
                          // Reset input
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Platform select */}
          {lockedPlatform ? (
            <div className="soc-field-group">
              <label>Target Publication Platform</label>
              <input type="text" className="soc-input" disabled value={lockedPlatform === 'youtube' ? 'YouTube (Shorts)' : 'Instagram (Reels)'} />
            </div>
          ) : (
            <div className="soc-field-group">
              <label>Target Publication Platform</label>
              <select 
                value={platformType} 
                onChange={(e) => setPlatformType(e.target.value as any)}
                className="soc-select"
              >
                <option value="youtube">YouTube (Shorts)</option>
                <option value="instagram">Instagram (Reels)</option>
                <option value="both">Both (YouTube & Instagram)</option>
              </select>
            </div>
          )}
        </div>

        {/* Title input - YouTube only */}
        {(platformType === 'youtube' || platformType === 'both') && (
          <div className="soc-field-group">
            <label>Video Title (YouTube)</label>
            <input 
              type="text" 
              placeholder="Enter short, engaging title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="soc-input"
            />
          </div>
        )}

        {/* Caption text area */}
        <div className="soc-field-group">
          <label>{(lockedPlatform === 'youtube' || (!lockedPlatform && platformType === 'youtube')) ? 'Video Description' : 'Post Caption / Hashtags'}</label>
          <textarea 
            placeholder="Tell your audience about this video. Add hashtags for visibility (e.g. #AI #Outreach)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="soc-textarea"
          />
        </div>

        {/* Publish triggers */}
        <button 
          onClick={handlePublish}
          disabled={isPublishing || (lockedPlatform === 'youtube' && !ytConnected) || (lockedPlatform === 'instagram' && !igConnected) || (!lockedPlatform && !ytConnected && !igConnected)}
          style={{
            background: '#d86450',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: (isPublishing || (lockedPlatform === 'youtube' && !ytConnected) || (lockedPlatform === 'instagram' && !igConnected) || (!lockedPlatform && !ytConnected && !igConnected)) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            opacity: ((lockedPlatform === 'youtube' && !ytConnected) || (lockedPlatform === 'instagram' && !igConnected) || (!lockedPlatform && !ytConnected && !igConnected)) ? 0.5 : 1
          }}
        >
          {isPublishing ? (
            <>
              <RefreshCw className="pers-anim-pulse" size={16} /> Publishing...
            </>
          ) : (
            <>
              <Share2 size={16} /> Publish Video Now
            </>
          )}
        </button>

        {/* Uploader progress box */}
        {isPublishing && (
          <div style={{ marginTop: 16, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw className="pers-anim-pulse" size={12} /> {publishStep}
              </span>
              <span>{publishProgress}%</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${publishProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Video preview pane */}
      <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Selected Video Preview</div>
        <div style={{ background: '#0f172a', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #e2e8f0' }}>
          {selectedVideoFile ? (
            <video 
              src={`/api/videos/${selectedVideoFile}`}
              controls 
              style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
              playsInline
            />
          ) : (
            <div style={{ color: '#475569', fontSize: 13, textAlign: 'center', padding: 20 }}>
              No video selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
