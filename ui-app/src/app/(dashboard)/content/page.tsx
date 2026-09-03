"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Calendar, Clock, Activity, ArrowRight, ChevronDown, Plus, Trash2, ArrowLeft, Sparkles, Users, Settings } from 'lucide-react';

const TikTokIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" fill="#25F4EE" transform="translate(-10, -10)"/>
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" fill="#FE2C55" transform="translate(10, 10)"/>
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" fill="#000000"/>
  </svg>
);

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-grad)"/>
    <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
    <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/>
    <defs>
      <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F58529"/>
        <stop offset="0.3" stopColor="#FEDA77"/>
        <stop offset="0.6" stopColor="#DD2A7B"/>
        <stop offset="0.8" stopColor="#8134AF"/>
        <stop offset="1" stopColor="#515BD4"/>
      </linearGradient>
    </defs>
  </svg>
);

const YouTubeIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.582 6.186a2.706 2.706 0 0 0-1.904-1.916C17.999 3.8 12 3.8 12 3.8s-5.999 0-7.678.47a2.706 2.706 0 0 0-1.904 1.916C1.948 7.878 1.948 12 1.948 12s0 4.122.47 5.814a2.706 2.706 0 0 0 1.904 1.916c1.679.47 7.678.47 7.678.47s5.999 0 7.678-.47a2.706 2.706 0 0 0 1.904-1.916c.47-1.692.47-5.814.47-5.814s0-4.122-.47-5.814z" fill="#FF0000"/>
    <path d="M9.945 15.49L15.228 12 9.945 8.51v6.98z" fill="white"/>
  </svg>
);

type StrategyConfig = {
  id: string;
  niche: string;
  durationValue: string;
  durationUnit: string;
  contentStyle: string;
  frequency: string;
  uploadTimes: string[];
  platforms: string[];
  avatarId?: string;
  voiceId?: string;
};

export default function ContentSchedulerPage() {
  const router = useRouter();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/socials/accounts')
      .then(async res => {
        if (!res.ok) return { success: false };
        const text = await res.text();
        return text ? JSON.parse(text) : { success: false };
      })
      .then(data => {
        if (data?.success && data.accounts) {
          setConnectedPlatforms(data.accounts.map((acc: any) => acc.platform));
        }
      })
      .catch(console.error);

    fetch('/api/avatars')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.avatars) {
          setAvatars(data.avatars.filter((a: any) => a.status === 'ready' || !a.status));
        }
      }).catch(console.error);

    fetch('/api/voices')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.voices) {
          setVoices(data.voices);
        }
      }).catch(console.error);
  }, []);

  const [avatars, setAvatars] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);

  const [strategies, setStrategies] = useState<StrategyConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/strategies')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.strategies) {
          setStrategies(data.strategies);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const syncStrategy = (id: string, updates: Partial<StrategyConfig>) => {
    fetch(`/api/strategies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(console.error);
  };
  
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<{stratId: string, type: string} | null>(null);
  const [avatarModalStratId, setAvatarModalStratId] = useState<string | null>(null);
  const [activeAvatarTab, setActiveAvatarTab] = useState<'custom' | 'system'>('custom');
  const [voiceModalStratId, setVoiceModalStratId] = useState<string | null>(null);
  const [activeVoiceTab, setActiveVoiceTab] = useState<'custom' | 'system'>('custom');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const niches = [
    'Technology & Gadgets',
    'Gaming',
    'Finance & Crypto',
    'Health & Fitness',
    'Education & Tutorials',
    'Entertainment & Comedy',
    'Lifestyle & Vlogs'
  ];

  const durationUnits = ['Days', 'Weeks', 'Months'];
  const frequencies = ['1 video per day', '2 videos per day', '3 videos per day', '4 videos per day'];
  const contentStyles = ['Educational', 'Entertaining', 'Professional', 'Casual', 'Inspirational'];

  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);

  const addStrategy = async () => {
    const newId = `strat-${Date.now()}`;
    const newStrat = {
      id: newId,
      niche: 'Gaming',
      durationValue: '10',
      durationUnit: 'Days',
      contentStyle: 'Entertaining',
      frequency: '1 video per day',
      uploadTimes: ['15:00'],
      platforms: ['Instagram Reels'],
      avatarId: avatars.length > 0 ? avatars[0].id : '',
      voiceId: voices.length > 0 ? voices[0].id : ''
    };
    
    // Optimistic update
    setStrategies(prev => [...prev, newStrat]);
    setActiveStrategyId(newId);
    
    try {
      await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStrat)
      });
    } catch (e) {
      console.error('Failed to save new strategy', e);
    }
  };

  const removeStrategy = async (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id));
    if (activeStrategyId === id) setActiveStrategyId(null);
    try {
      await fetch(`/api/strategies/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete strategy', e);
    }
  };

  const updateStrategy = (id: string, field: keyof StrategyConfig, value: any) => {
    setStrategies(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
    syncStrategy(id, { [field]: value });
  };

  const togglePlatform = (id: string, plat: string) => {
    let internalPlat = '';
    if (plat === 'YouTube Shorts') internalPlat = 'youtube';
    if (plat === 'Instagram Reels') internalPlat = 'instagram';
    if (plat === 'TikTok') internalPlat = 'tiktok';

    const isConnected = connectedPlatforms.includes(internalPlat);
    
    setStrategies(prev => prev.map(s => {
      if (s.id === id) {
        const has = s.platforms.includes(plat);
        if (!has && !isConnected) {
          setShowConnectModal(plat);
          return s;
        }
        const newPlatforms = has ? s.platforms.filter(p => p !== plat) : [...s.platforms, plat];
        syncStrategy(id, { platforms: newPlatforms });
        return { ...s, platforms: newPlatforms };
      }
      return s;
    }));
  };

  const handleFrequencyChange = (id: string, val: string) => {
    const count = parseInt(val.split(' ')[0]) || 1;
    setStrategies(prev => prev.map(s => {
      if (s.id === id) {
        const newTimes = [...s.uploadTimes];
        while (newTimes.length < count) {
          newTimes.push(newTimes.length === 1 ? '18:00' : newTimes.length === 2 ? '21:00' : '12:00');
        }
        const slicedTimes = newTimes.slice(0, count);
        syncStrategy(id, { frequency: val, uploadTimes: slicedTimes });
        return { ...s, frequency: val, uploadTimes: slicedTimes };
      }
      return s;
    }));
    setOpenDropdown(null);
  };

  const handleTimeChange = (id: string, idx: number, value: string) => {
    setStrategies(prev => prev.map(s => {
      if (s.id === id) {
        const newTimes = [...s.uploadTimes];
        newTimes[idx] = value;
        syncStrategy(id, { uploadTimes: newTimes });
        return { ...s, uploadTimes: newTimes };
      }
      return s;
    }));
  };

  const handleGenerate = async (id: string) => {
    setGeneratingId(id);
    try {
      const res = await fetch('/api/strategies/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyId: id })
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to trigger pipeline: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error triggering pipeline.");
    } finally {
      setTimeout(() => setGeneratingId(null), 1000); // Give user a short delay to see it worked
    }
  };

  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div style={{ 
      padding: '32px 40px 40px 40px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: '100%',
      minHeight: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '32px',
      animation: 'fadeIn 0.5s ease-out',
      color: '#111'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .header-title {
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -1px;
          margin: 0 0 8px 0;
          color: #111;
        }
        .header-title span {
          color: #888;
        }
        .header-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 40px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        @media (max-width: 800px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        .dash-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: none; 
          display: flex;
          flex-direction: column;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px dashed #e2e8f0;
          padding-bottom: 16px;
        }
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #111;
        }
        .input-element {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .input-element:focus {
          border-color: #94a3b8;
        }
        .custom-dropdown-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s;
        }
        .custom-dropdown-btn:hover, .custom-dropdown-btn.active {
          background-color: #f8fafc;
        }
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e2e2;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          z-index: 100;
          overflow: hidden;
          animation: dropDown 0.2s ease-out forwards;
          max-height: 250px;
          overflow-y: auto;
        }
        .custom-dropdown-item {
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .custom-dropdown-item:hover {
          background-color: #f7f7f7;
          color: #d86450;
        }
        .custom-dropdown-item.selected {
          background-color: #fff1f0;
          color: #d86450;
          font-weight: 600;
        }
        .primary-btn {
          background-color: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s;
        }
        .primary-btn:hover {
          background-color: #1e293b;
        }
        .primary-btn:active {
          transform: translateY(1px);
        }
        .platform-pill {
          padding: 16px;
          border-radius: 8px;
          border: none;
          background-color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
        }
        .platform-pill:hover {
          background-color: #f8fafc;
        }
        .platform-pill.selected {
          background-color: #ffffff;
        }
        .secondary-btn {
          background-color: transparent;
          color: #666;
          border: 2px dashed #e2e2e2;
          border-radius: 16px;
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          width: 100%;
        }
        .secondary-btn:hover {
          border-color: #d86450;
          color: #d86450;
          background-color: #fff1f0;
        }
        .strategy-container {
          background: transparent;
          border: none;
          padding: 0px;
          margin-bottom: 32px;
          position: relative;
        }
        .strategy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .strategy-title {
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }
        .remove-btn {
          background: #fff;
          border: 1px solid #e2e2e2;
          color: #ef4444;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .remove-btn:hover {
          background: #fef2f2;
          border-color: #fca5a5;
        }
        
        /* Premium Detail View Styles */
        .detail-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
        }
        .premium-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 20px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .premium-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .premium-card-title svg {
          display: none; /* Hide icons from title to match clean image style */
        }
        .premium-pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .premium-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 100px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #4b5563;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .premium-pill:hover {
          border-color: #d1d5db;
        }
        .premium-pill.active {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #eff6ff;
        }
        
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
        }
        .platform-box {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #ffffff;
          position: relative;
        }
        .platform-box:hover {
          border-color: #d1d5db;
        }
        .platform-box .check-icon {
          position: absolute;
          top: 6px;
          right: 6px;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.2s ease;
          color: #3b82f6;
        }
        .platform-box.active-tiktok, .platform-box.active-youtube, .platform-box.active-instagram {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .platform-box[class*="active-"] .check-icon {
          opacity: 1;
          transform: scale(1);
        }
        
        .premium-input-group {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          transition: border-color 0.2s;
        }
        .premium-input-group:focus-within, .premium-input-group.active {
          border-color: #3b82f6;
        }
        .premium-input {
          background: transparent;
          border: none;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          outline: none;
          width: 100%;
        }
        
        .time-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .time-row:last-child {
          margin-bottom: 0;
        }
        .time-row:focus-within {
          border-color: #3b82f6;
        }
        .time-dot {
          display: none;
        }

        /* Custom Time Select UI */
        .time-select {
          appearance: none;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 4px;
          text-align: center;
        }
        .time-select:hover {
          background: #f1f5f9;
        }
        .time-select.ampm {
          color: #10b981;
          margin-left: 4px;
        }
      `}</style>

      {!activeStrategyId && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="header-title">
              Content <span>Planner</span>
            </h1>
            <p className="header-subtitle">
              Design your automated video publishing schedule with AI.
            </p>
          </div>
          <button className="primary-btn" onClick={addStrategy} style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px', height: 'fit-content' }}>
            <Plus size={16} /> New Strategy
          </button>
        </div>
      )}

      {!activeStrategyId ? (
        <div className="strategy-list" style={{ paddingBottom: '64px' }}>

          {strategies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>No strategies yet</div>
              <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Create your first content strategy to get started.</p>
              <button className="primary-btn" onClick={addStrategy}>
                <Plus size={18} /> Create Strategy
              </button>
            </div>
          ) : (
            <div>
              <style>{`
                .folder-card {
                  position: relative;
                  width: 280px;
                  height: 220px;
                  cursor: pointer;
                  transition: transform 0.2s;
                  --folder-bg: #f8fafc;
                  --folder-text: #0f172a;
                  --folder-label: #64748b;
                }
                
                .folder-card.primary-folder {
                  --folder-bg: #2563eb; 
                  --folder-text: #ffffff;
                  --folder-label: rgba(255, 255, 255, 0.8);
                }

                .folder-card:hover {
                  transform: translateY(-4px);
                }
                
                .folder-tab {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 35%;
                  height: 44px;
                  background: var(--folder-bg);
                  border-radius: 24px 24px 0 0;
                  transition: background 0.3s;
                }
                
                .folder-tab::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  right: -24px;
                  width: 24px;
                  height: 24px;
                  background: radial-gradient(circle at top right, transparent 23.5px, var(--folder-bg) 24px);
                  transition: background 0.3s;
                }
                
                .folder-body {
                  position: absolute;
                  top: 44px;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: var(--folder-bg);
                  border-radius: 0 24px 24px 24px;
                  padding: 20px 24px;
                  display: flex;
                  flex-direction: column;
                  transition: background 0.3s;
                }

                .folder-pill {
                  display: inline-flex;
                  align-items: center;
                  padding: 4px 10px;
                  border-radius: 9999px;
                  font-size: 12px;
                  font-weight: 600;
                }

                .primary-folder .folder-pill {
                  background: rgba(255, 255, 255, 0.2);
                  color: #fff;
                  border: none;
                }

                .primary-folder .folder-pill-dot {
                  background: #fff;
                }

                .folder-card:not(.primary-folder) .folder-pill {
                  background: #fff;
                  color: #166534;
                  border: 1px solid #bbf7d0;
                }

                .folder-card:not(.primary-folder) .folder-pill-dot {
                  background: #22c55e;
                }
              `}</style>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                {strategies.map((strat, index) => {
                  const isPrimary = index === 0; // First one is blue like the image
                  return (
                    <div 
                      key={strat.id}
                      className={`folder-card ${isPrimary ? 'primary-folder' : ''}`}
                      onClick={() => setActiveStrategyId(strat.id)}
                    >
                      <div className="folder-tab"></div>
                      <div className="folder-body">
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--folder-label)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                          STATUS
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                          <span className="folder-pill">
                            <span className="folder-pill-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', marginRight: '6px' }}></span>
                            In Progress
                          </span>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--folder-label)', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Strategy {index + 1}
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--folder-text)', lineHeight: '1.2' }}>
                            {strat.niche} Content
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="strategy-detail" style={{ padding: '0 0 40px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <button 
              onClick={() => setActiveStrategyId(null)} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#6b7280',
                padding: '8px 0', 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#111827'}
              onMouseOut={e => e.currentTarget.style.color = '#6b7280'}
            >
              <ArrowLeft size={16} />
              Back to Strategies
            </button>
          </div>
          
          {strategies.filter(s => s.id === activeStrategyId).map((strat, index) => (
            <div key={strat.id} style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              
              {/* Section 1: Strategy Preferences */}
              <div className="settings-section">
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Strategy Preferences</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>Define the core subject and timeframe of your automated content.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Niche */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                        <Target size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Niche</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>The main topic for your videos.</div>
                      </div>
                    </div>
                    <div style={{ width: '220px', position: 'relative' }}>
                      <div 
                        className={`premium-input-group ${openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'niche' }); }}
                        style={{ cursor: 'pointer', background: '#ffffff' }}
                      >
                        <div style={{ flex: 1, padding: '10px 14px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                          {strat.niche}
                        </div>
                        <div style={{ padding: '0 12px' }}>
                          <ChevronDown size={16} color="#94a3b8" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                        </div>
                      </div>
                      {openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' && (
                        <div className="custom-dropdown-menu" style={{ top: 'calc(100% + 8px)' }}>
                          {niches.map(n => (
                            <div key={n} className={`custom-dropdown-item ${n === strat.niche ? 'selected' : ''}`} onClick={() => { updateStrategy(strat.id, 'niche', n); setOpenDropdown(null); }}>
                              {n}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campaign Duration */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Campaign Duration</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>How long the automation runs.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', width: '220px' }}>
                      <div className="premium-input-group" style={{ flex: 1, background: '#ffffff' }}>
                        <input type="number" className="premium-input" value={strat.durationValue} onChange={(e) => updateStrategy(strat.id, 'durationValue', e.target.value)} style={{ padding: '10px 14px', fontSize: '14px' }} />
                      </div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div className="premium-input-group" onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'duration' }); }} style={{ cursor: 'pointer', height: '100%', background: '#ffffff' }}>
                          <div style={{ flex: 1, padding: '10px 14px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>{strat.durationUnit}</div>
                          <div style={{ padding: '0 12px' }}><ChevronDown size={16} color="#94a3b8" /></div>
                        </div>
                        {openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' && (
                          <div className="custom-dropdown-menu" style={{ top: 'calc(100% + 8px)' }}>
                            {durationUnits.map(u => (
                              <div key={u} className={`custom-dropdown-item ${u === strat.durationUnit ? 'selected' : ''}`} onClick={() => { updateStrategy(strat.id, 'durationUnit', u); setOpenDropdown(null); }}>{u}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Avatar</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>The visual persona for your videos.</div>
                      </div>
                    </div>
                    <div style={{ width: '220px' }}>
                      <button 
                        className="premium-input-group"
                        onClick={() => setAvatarModalStratId(strat.id)}
                        style={{ cursor: 'pointer', background: '#ffffff', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <div style={{ flex: 1, padding: '8px 12px', fontSize: '14px', fontWeight: 500, color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', minWidth: 0 }}>
                          {strat.avatarId ? (
                            <>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0', flexShrink: 0, border: '2px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <video 
                                  src={`/api/avatars/${strat.avatarId}/preview#t=0.001`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                              </div>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600, flex: 1, textAlign: 'left' }}>
                                {avatars.find(a => a.id === strat.avatarId)?.name || 'Select Avatar'}
                              </span>
                            </>
                          ) : 'Select Avatar'}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Voice */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-1.7 0-3 1.2-3 2.8v6.4c0 1.6 1.3 2.8 3 2.8s3-1.2 3-2.8V4.8C15 3.2 13.7 2 12 2z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Voice</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>The voice generating your script.</div>
                      </div>
                    </div>
                    <div style={{ width: '220px' }}>
                      <button 
                        className="premium-input-group"
                        onClick={() => setVoiceModalStratId(strat.id)}
                        style={{ cursor: 'pointer', background: '#ffffff', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <div style={{ flex: 1, padding: '10px 14px', fontSize: '14px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', minWidth: 0 }}>
                          {strat.voiceId ? (voices.find(v => v.id === strat.voiceId)?.name || 'Select Voice') : 'Select Voice'}
                        </div>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 2: Platforms & Style */}
              <div className="settings-section">
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Platforms & Style</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>Choose where to publish and the tone of your videos.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Content Style */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Content Style</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>The tone of the generated videos.</div>
                      </div>
                    </div>
                    <div style={{ width: '220px', position: 'relative' }}>
                      <div className="premium-input-group" onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'style' }); }} style={{ cursor: 'pointer', background: '#ffffff' }}>
                        <div style={{ flex: 1, padding: '10px 14px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>{strat.contentStyle}</div>
                        <div style={{ padding: '0 12px' }}><ChevronDown size={16} color="#94a3b8" /></div>
                      </div>
                      {openDropdown?.stratId === strat.id && openDropdown?.type === 'style' && (
                        <div className="custom-dropdown-menu" style={{ top: 'calc(100% + 8px)' }}>
                          {contentStyles.map(s => (
                            <div key={s} className={`custom-dropdown-item ${s === strat.contentStyle ? 'selected' : ''}`} onClick={() => { updateStrategy(strat.id, 'contentStyle', s); setOpenDropdown(null); }}>{s}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platforms */}
                  {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(plat => {
                    const isSelected = strat.platforms.includes(plat);
                    return (
                      <div key={plat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                            {plat === 'TikTok' ? <TikTokIcon size={20} /> : plat === 'YouTube Shorts' ? <YouTubeIcon size={20} /> : <InstagramIcon size={20} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{plat}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Publish to {plat}.</div>
                          </div>
                        </div>
                        <div 
                          onClick={() => togglePlatform(strat.id, plat)}
                          style={{
                            width: '44px', height: '24px', borderRadius: '12px', background: isSelected ? '#10b981' : '#e5e7eb',
                            position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                          }}
                        >
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                            position: 'absolute', top: '2px', left: isSelected ? '22px' : '2px',
                            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Schedule */}
              <div className="settings-section">
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>Schedule</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>Configure when your videos go live.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Frequency */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                        <Activity size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>Upload Frequency</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Number of videos per day.</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', background: '#e5e7eb', borderRadius: '8px', padding: '4px' }}>
                      {['1', '2', '3'].map(num => {
                        const freqLabel = `${num} video${num === '1' ? '' : 's'} per day`;
                        const isActive = strat.frequency.startsWith(num);
                        return (
                          <div 
                            key={num}
                            onClick={() => handleFrequencyChange(strat.id, freqLabel)}
                            style={{
                              padding: '6px 16px', fontSize: '13px', fontWeight: 500, borderRadius: '6px', cursor: 'pointer',
                              background: isActive ? '#ffffff' : 'transparent',
                              color: isActive ? '#059669' : '#4b5563',
                              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                              transition: 'all 0.2s'
                            }}
                          >
                            {num}/day
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Posting Times mapped as settings rows */}
                  {strat.uploadTimes.map((time, idx) => {
                    const [hStr, mStr] = time.split(':');
                    let hNum = parseInt(hStr);
                    const ampm = hNum >= 12 ? 'PM' : 'AM';
                    if (hNum === 0) hNum = 12;
                    if (hNum > 12) hNum -= 12;
                    const displayHour = hNum.toString().padStart(2, '0');

                    return (
                      <div key={`time-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: '12px', padding: '16px 20px', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                            <Clock size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                              Video {idx + 1} Time
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              Scheduled publishing time.
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px', transition: 'border-color 0.2s', position: 'relative' }}
                             onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                             onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        >
                          <select 
                            value={displayHour} 
                            onChange={(e) => {
                              let newH = parseInt(e.target.value);
                              if (ampm === 'PM' && newH !== 12) newH += 12;
                              if (ampm === 'AM' && newH === 12) newH = 0;
                              handleTimeChange(strat.id, idx, `${newH.toString().padStart(2, '0')}:${mStr}`);
                            }} 
                            className="time-select"
                          >
                            {Array.from({length: 12}).map((_, i) => <option key={i+1} value={(i+1).toString().padStart(2, '0')}>{(i+1).toString().padStart(2, '0')}</option>)}
                          </select>
                          <span style={{ fontWeight: 600, color: '#111827', margin: '0 2px' }}>:</span>
                          <select 
                            value={mStr} 
                            onChange={(e) => handleTimeChange(strat.id, idx, `${hStr}:${e.target.value}`)} 
                            className="time-select"
                          >
                            {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select 
                            value={ampm} 
                            onChange={(e) => {
                              let newH = parseInt(hStr);
                              if (e.target.value === 'PM' && newH < 12) newH += 12;
                              if (e.target.value === 'AM' && newH >= 12) newH -= 12;
                              handleTimeChange(strat.id, idx, `${newH.toString().padStart(2, '0')}:${mStr}`);
                            }} 
                            className="time-select ampm"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

          {/* End of map block */}
            </div>
          ))}
          
          {/* Action Row for Detail View */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <button 
              onClick={() => { removeStrategy(activeStrategyId!); setActiveStrategyId(null); }}
              style={{ background: 'transparent', color: '#ef4444', border: 'none', padding: '12px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} /> Delete Strategy
              </span>
            </button>
            <button 
              className="primary-btn"
              onClick={() => handleGenerate(activeStrategyId!)}
              style={{ 
                padding: '12px 32px', fontSize: '14px', borderRadius: '8px', background: '#111827', color: '#ffffff',
                fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s'
              }}
            >
              {generatingId === activeStrategyId ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  Generating...
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </span>
              ) : 'Generate Strategy'}
            </button>
          </div>
        </div>
      )}
      {showConnectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: 400, maxWidth: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 64, height: 64, background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {showConnectModal === 'TikTok' && <TikTokIcon size={32} />}
              {showConnectModal === 'YouTube Shorts' && <YouTubeIcon size={32} />}
              {showConnectModal === 'Instagram Reels' && <InstagramIcon size={32} />}
              {!['TikTok', 'YouTube Shorts', 'Instagram Reels'].includes(showConnectModal || '') && <Target size={32} color="#64748b" />}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Account Not Connected</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
              You need to connect your <strong>{showConnectModal}</strong> account in the Socials tab before you can automatically schedule content to it.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setShowConnectModal(null)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#f1f5f9', color: '#475569', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >Cancel</button>
              <button 
                onClick={() => router.push('/socials')}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >Connect Now</button>
            </div>
          </div>
        </div>
      )}

      {avatarModalStratId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setAvatarModalStratId(null)}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: 700, maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Select Avatar</h2>
              <button onClick={() => setAvatarModalStratId(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
              <button 
                onClick={() => setActiveAvatarTab('custom')} 
                style={{ background: 'transparent', border: 'none', borderBottom: activeAvatarTab === 'custom' ? '2px solid #3b82f6' : '2px solid transparent', color: activeAvatarTab === 'custom' ? '#3b82f6' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Your Custom Avatars
              </button>
              <button 
                onClick={() => setActiveAvatarTab('system')} 
                style={{ background: 'transparent', border: 'none', borderBottom: activeAvatarTab === 'system' ? '2px solid #3b82f6' : '2px solid transparent', color: activeAvatarTab === 'system' ? '#3b82f6' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                From Us
              </button>
            </div>
            
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 8 }} className="custom-scrollbar">
              {activeAvatarTab === 'custom' && (
                avatars.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No custom avatars found. Create one first!</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                    {avatars.map(avatar => {
                      const isSelected = strategies.find(s => s.id === avatarModalStratId)?.avatarId === avatar.id;
                      return (
                        <div 
                          key={avatar.id}
                          onClick={() => { updateStrategy(avatarModalStratId!, 'avatarId', avatar.id); setAvatarModalStratId(null); }}
                          style={{ border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                        >
                          <div style={{ aspectRatio: '9/16', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <video 
                              src={`/api/avatars/${avatar.id}/preview#t=0.001`} 
                              loop muted playsInline preload="metadata"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              onMouseEnter={e => e.currentTarget.play().catch(()=>{})}
                              onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0.001; }}
                            />
                          </div>
                          <div style={{ padding: '8px 12px', background: isSelected ? '#eff6ff' : '#fff', color: isSelected ? '#1d4ed8' : '#111827', fontWeight: 600, fontSize: 13, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {avatar.name}
                          </div>
                          {isSelected && (
                            <div style={{ position: 'absolute', top: 8, right: 8, background: '#3b82f6', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeAvatarTab === 'system' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                  {[
                    { id: 'sys-1', name: 'Professional Anna', image: '/avatars/anna.jpg' },
                    { id: 'sys-2', name: 'Casual Mark', image: '/avatars/mark.jpg' },
                    { id: 'sys-3', name: 'Tech Reviewer', image: '/avatars/reviewer_v2.jpg' },
                    { id: 'sys-4', name: 'Friendly Sarah', image: '/avatars/sarah.jpg' },
                    { id: 'sys-5', name: 'Corporate David', image: '/avatars/david.jpg' },
                    { id: 'sys-6', name: 'Creative Designer', image: '/avatars/mia.jpg' },
                    { id: 'sys-7', name: 'Support Agent', image: '/avatars/alex.jpg' }
                  ].map(avatar => {
                    const isSelected = strategies.find(s => s.id === avatarModalStratId)?.avatarId === avatar.id;
                    return (
                      <div 
                        key={avatar.id}
                        onClick={() => { updateStrategy(avatarModalStratId!, 'avatarId', avatar.id); setAvatarModalStratId(null); }}
                        style={{ border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                      >
                        <div style={{ aspectRatio: '9/16', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img 
                            src={avatar.image} 
                            alt={avatar.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        </div>
                        <div style={{ padding: '8px 12px', background: isSelected ? '#eff6ff' : '#fff', color: isSelected ? '#1d4ed8' : '#111827', fontWeight: 600, fontSize: 13, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {avatar.name}
                        </div>
                        {isSelected && (
                          <div style={{ position: 'absolute', top: 8, right: 8, background: '#3b82f6', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {voiceModalStratId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setVoiceModalStratId(null)}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: 500, maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Select Voice</h2>
              <button onClick={() => setVoiceModalStratId(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
              <button 
                onClick={() => setActiveVoiceTab('custom')} 
                style={{ background: 'transparent', border: 'none', borderBottom: activeVoiceTab === 'custom' ? '2px solid #3b82f6' : '2px solid transparent', color: activeVoiceTab === 'custom' ? '#3b82f6' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                My Voices
              </button>
              <button 
                onClick={() => setActiveVoiceTab('system')} 
                style={{ background: 'transparent', border: 'none', borderBottom: activeVoiceTab === 'system' ? '2px solid #3b82f6' : '2px solid transparent', color: activeVoiceTab === 'system' ? '#3b82f6' : '#64748b', fontWeight: 600, fontSize: 14, padding: '0 4px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                System Voices
              </button>
            </div>
            
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: 8 }} className="custom-scrollbar">
              {activeVoiceTab === 'custom' && (
                voices.filter(v => v.type !== 'system').length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No custom voices found.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {voices.filter(v => v.type !== 'system').map(voice => {
                      const isSelected = strategies.find(s => s.id === voiceModalStratId)?.voiceId === voice.id;
                      const isPlaying = playingVoiceId === voice.id;
                      return (
                        <div 
                          key={voice.id}
                          onClick={() => { updateStrategy(voiceModalStratId!, 'voiceId', voice.id); setVoiceModalStratId(null); }}
                          style={{ border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`, borderRadius: 12, padding: '16px', cursor: 'pointer', transition: 'all 0.2s', background: isSelected ? '#eff6ff' : '#fff', display: 'flex', alignItems: 'center', gap: 16 }}
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isPlaying) {
                                audioRef.current?.pause();
                                setPlayingVoiceId(null);
                              } else {
                                setPlayingVoiceId(voice.id);
                                setTimeout(() => audioRef.current?.play().catch(console.error), 50);
                              }
                            }}
                            style={{ width: 40, height: 40, borderRadius: '50%', background: isPlaying ? '#3b82f6' : '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPlaying ? '#fff' : '#64748b', cursor: 'pointer' }}
                          >
                            {isPlaying ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            )}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: isSelected ? '#1d4ed8' : '#111827', fontSize: 15 }}>{voice.name}</div>
                            <div style={{ fontSize: 12, color: isSelected ? '#3b82f6' : '#64748b' }}>Custom Voice</div>
                          </div>
                          {isSelected && (
                            <div style={{ color: '#3b82f6' }}>✓</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeVoiceTab === 'system' && (
                voices.filter(v => v.type === 'system').length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No system voices available.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {voices.filter(v => v.type === 'system').map(voice => {
                      const isSelected = strategies.find(s => s.id === voiceModalStratId)?.voiceId === voice.id;
                      const isPlaying = playingVoiceId === voice.id;
                      return (
                        <div 
                          key={voice.id}
                          onClick={() => { updateStrategy(voiceModalStratId!, 'voiceId', voice.id); setVoiceModalStratId(null); }}
                          style={{ border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`, borderRadius: 12, padding: '16px', cursor: 'pointer', transition: 'all 0.2s', background: isSelected ? '#eff6ff' : '#fff', display: 'flex', alignItems: 'center', gap: 16 }}
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isPlaying) {
                                audioRef.current?.pause();
                                setPlayingVoiceId(null);
                              } else {
                                setPlayingVoiceId(voice.id);
                                setTimeout(() => audioRef.current?.play().catch(console.error), 50);
                              }
                            }}
                            style={{ width: 40, height: 40, borderRadius: '50%', background: isPlaying ? '#3b82f6' : '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPlaying ? '#fff' : '#64748b', cursor: 'pointer' }}
                          >
                            {isPlaying ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            )}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: isSelected ? '#1d4ed8' : '#111827', fontSize: 15 }}>{voice.name}</div>
                            <div style={{ fontSize: 12, color: isSelected ? '#3b82f6' : '#64748b' }}>System Voice</div>
                          </div>
                          {isSelected && (
                            <div style={{ color: '#3b82f6' }}>✓</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
            
            {playingVoiceId && (
              <audio 
                ref={audioRef}
                src={voices.find(v => v.id === playingVoiceId)?.type === 'system' ? `/system_voices/${playingVoiceId.replace('sys_', '')}.wav` : `/api/voices/${playingVoiceId}/audio`}
                onEnded={() => setPlayingVoiceId(null)}
                onPause={() => setPlayingVoiceId(null)}
                style={{ display: 'none' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
