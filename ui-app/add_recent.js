const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

const injectionPoint = `      </div>

      {/* Video Preview Modal */}`;

const recentVideosCode = `      </div>

      {/* Recent Videos Section */}
      <div style={{ marginTop: 48, marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={20} color="var(--accent)" /> Recent Videos
        </h2>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="spinner"></div>
            <style>{\`.spinner { width: 40px; height: 40px; border: 4px solid var(--panel-border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }\`}</style>
          </div>
        ) : videos.length === 0 ? (
          <div style={{ background: 'var(--panel-bg)', border: '1px dashed var(--panel-border)', borderRadius: 16, padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Video size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontSize: 15, fontWeight: 500 }}>No videos yet</div>
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
                  <img src={video.thumbnail || video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={video.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.2s' }} className="play-overlay">
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Play size={20} fill="#000" color="#000" style={{ marginLeft: 4 }} />
                    </div>
                  </div>
                  <style>{\`.play-overlay:hover { opacity: 1 !important; }\`}</style>
                  {videoDurations[video.id] && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
                      {videoDurations[video.id]}
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</h3>
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

      {/* Video Preview Modal */}`;

content = content.replace(injectionPoint, recentVideosCode);
fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log('Added recent videos');
