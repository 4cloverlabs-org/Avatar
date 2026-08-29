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
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
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
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
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
        <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px', overflow: 'hidden' }}>
          {items.map((item, index) => (
            <div 
              key={item.trashId}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px 24px',
                borderBottom: index < items.length - 1 ? '1px solid var(--panel-border)' : 'none'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'var(--background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginRight: '16px'
              }}>
                {item.type === 'Avatar' ? <User size={20} /> : <Video size={20} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px' }}>
                  {item.originalId}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>Deleted {new Date(item.deletedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span style={{ color: item.daysRemaining <= 1 ? '#ef4444' : 'var(--text-muted)' }}>
                    {item.daysRemaining} {item.daysRemaining === 1 ? 'day' : 'days'} remaining
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => handleRestore(item.trashId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '6px',
                    color: 'var(--foreground)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
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
                    width: '32px',
                    height: '32px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: '6px',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                  title="Delete permanently"
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
