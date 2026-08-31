"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, Video, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrashItem {
  trashId: string;
  type: string;
  originalId: string;
  deletedAt: string;
  daysRemaining: number;
}

export default function TrashPage() {
  const router = useRouter();
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trash');
      if (!res.ok) throw new Error('Failed to fetch trash');
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (trashId: string) => {
    try {
      const res = await fetch(`/api/trash/${trashId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(item => item.trashId !== trashId));
      } else {
        alert("Restore failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while restoring.");
    }
  };

  const handleDelete = async (trashId: string) => {
    if (!confirm("Are you sure you want to permanently delete this item? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/trash/${trashId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(item => item.trashId !== trashId));
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (err: any) {
      console.error(err);
      alert(`An error occurred while deleting: ${err.message}`);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm("Are you sure you want to empty the trash? All items will be permanently deleted.")) return;
    try {
      const res = await fetch(`/api/trash`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems([]);
      } else {
        alert("Empty trash failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while emptying the trash.");
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading trash...</div>;
  }

  return (
    <div className="home-dashboard" style={{ padding: '32px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>Trash</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} />
            Items in trash will be automatically deleted after 7 days.
          </p>
        </div>
        
        {items.length > 0 && (
          <button 
            onClick={handleEmptyTrash}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#fee2e2',
              color: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={16} />
            Empty Trash
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '16px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '64px',
          background: 'var(--panel-bg)',
          borderRadius: '12px',
          border: '1px dashed var(--panel-border)',
          color: 'var(--text-muted)'
        }}>
          <Trash2 size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>Trash is empty</h3>
          <p style={{ fontSize: '14px' }}>Deleted items will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {items.map((item, index) => (
            <div 
              key={item.trashId}
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                background: '#fff', 
                border: '2px solid #F5F5F5', 
                borderRadius: '8px',
                position: 'relative',
                transition: 'border-color 0.2s ease-in-out',
                overflow: 'visible'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#F5F5F5';
              }}
            >
              {/* Edge-to-edge preview with perfect 16:9 aspect ratio */}
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8fafc', borderRadius: '6px 6px 0 0', overflow: 'hidden', position: 'relative' }}>
                {item.type === 'Video' || item.type === 'Avatar' ? (
                  <video 
                    src={`/api/serve_video?type=trash&path=${encodeURIComponent(item.trashId)}#t=0.001`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    preload="metadata"
                    onMouseEnter={(e) => { 
                      e.currentTarget.play().catch(() => {});
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                      // Fallback if avatar has no valid video preview
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentElement) {
                        const fallback = document.createElement('div');
                        fallback.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #cbd5e1;';
                        fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                        e.currentTarget.parentElement.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    <User size={32} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {item.type === 'Avatar' ? <User size={10} /> : <Video size={10} />}
                  {item.type}
                </div>
              </div>

              {/* Card Content Area - Much tighter padding */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                <h3 
                  title={item.originalId}
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: 'var(--foreground)', 
                    marginBottom: '10px', 
                    wordBreak: 'break-all', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 1, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: '1.3'
                  }}
                >
                  {item.originalId.replace(/^gen_\d+_/, '')}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Deleted</span>
                    <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                      {new Date(item.deletedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                  }}>
                    <span>Expires in</span>
                    <span style={{ 
                      fontWeight: 600, 
                      color: item.daysRemaining <= 1 ? '#ef4444' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {item.daysRemaining <= 1 && <AlertTriangle size={12} />}
                      {item.daysRemaining} {item.daysRemaining === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>

                {/* Actions at the bottom - Tighter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--panel-border)' }}>
                  <button 
                    onClick={() => handleRestore(item.trashId)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      background: '#eff6ff',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#3b82f6',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dbeafe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                    }}
                  >
                    <RotateCcw size={14} />
                    Restore
                  </button>
                  <button 
                    onClick={() => handleDelete(item.trashId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                    title="Delete permanently"
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fca5a5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
