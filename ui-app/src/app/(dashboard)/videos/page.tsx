"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';

export default function VideosView() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.videos) {
          setVideos(data.videos);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="home-content">
      {/* VIDEOS GRID */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading generated videos...</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
          <Video size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>No generated videos found</div>
          <div style={{ fontSize: 14 }}>Your MuseTalk generations will appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {videos.map(video => (
            <div key={video.id} className="home-recent-card" style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff', transition: 'all 0.2s' }}>
              <div className="home-recent-img" style={{ height: 240, background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video 
                  src={`/api/videos/${video.filename}#t=0.001`} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  preload="metadata"
                  onMouseEnter={(e) => { 
                    const playPromise = e.currentTarget.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(() => {});
                    }
                  }}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0.001; }}
                  muted
                  loop
                  playsInline
                />

                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>
                  {(video.sizeBytes / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
              <div className="home-recent-info" style={{ padding: '12px 16px' }}>
                <div className="home-recent-title" style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
                <div className="home-recent-meta" style={{ fontSize: 12, color: '#64748b', margin: 0, marginTop: 4 }}>
                  {new Date(video.edited).toLocaleDateString()} at {new Date(video.edited).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
