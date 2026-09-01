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
};

export default function ContentSchedulerPage() {
  const router = useRouter();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/socials/accounts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.accounts) {
          setConnectedPlatforms(data.accounts.map((acc: any) => acc.platform));
        }
      })
      .catch(console.error);
  }, []);

  const [strategies, setStrategies] = useState<StrategyConfig[]>([{
    id: 'strat-1',
    niche: 'Technology & Gadgets',
    durationValue: '20',
    durationUnit: 'Days',
    contentStyle: 'Educational',
    frequency: '1 video per day',
    uploadTimes: ['12:00'],
    platforms: []
  }]);
  
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<{stratId: string, type: string} | null>(null);

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

  const addStrategy = () => {
    const newId = `strat-${Date.now()}`;
    setStrategies(prev => [
      ...prev, 
      {
        id: newId,
        niche: 'Gaming',
        durationValue: '10',
        durationUnit: 'Days',
        contentStyle: 'Entertaining',
        frequency: '1 video per day',
        uploadTimes: ['15:00'],
        platforms: ['Instagram Reels']
      }
    ]);
    setActiveStrategyId(newId);
  };

  const removeStrategy = (id: string) => {
    if (strategies.length > 1) {
      setStrategies(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateStrategy = (id: string, field: keyof StrategyConfig, value: any) => {
    setStrategies(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
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
        return { ...s, platforms: has ? s.platforms.filter(p => p !== plat) : [...s.platforms, plat] };
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
        return { ...s, frequency: val, uploadTimes: newTimes.slice(0, count) };
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
        return { ...s, uploadTimes: newTimes };
      }
      return s;
    }));
  };

  const handleGenerate = (id: string) => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
    }, 2000);
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
          gap: 32px;
        }
        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
        }
        .premium-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .premium-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }
        .premium-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .premium-pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .premium-pill {
          padding: 10px 20px;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .premium-pill:hover {
          background: #f1f5f9;
        }
        .premium-pill.active {
          background: #0f172a;
          color: #fff;
          border-color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
        }
        .platform-box {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s;
          background: #fff;
          position: relative;
        }
        .platform-box:hover {
          transform: translateY(-4px);
          border-color: #cbd5e1;
        }
        .platform-box .check-icon {
          position: absolute;
          top: 12px;
          right: 12px;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.3s;
        }
        .platform-box.active-tiktok {
          border-color: #FE2C55;
          background: rgba(254, 44, 85, 0.04);
        }
        .platform-box.active-youtube {
          border-color: #FF0000;
          background: rgba(255, 0, 0, 0.04);
        }
        .platform-box.active-instagram {
          border-color: #DD2A7B;
          background: rgba(221, 42, 123, 0.04);
        }
        .platform-box[class*="active-"] .check-icon {
          opacity: 1;
          transform: scale(1);
        }
        
        .premium-input-group {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s;
          overflow: hidden;
        }
        .premium-input-group:focus-within {
          border-color: #94a3b8;
          box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
        }
        .premium-input {
          background: transparent;
          border: none;
          padding: 14px 16px;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          width: 100%;
        }
        
        .time-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .time-row:hover {
          background: #fff;
          border-color: #cbd5e1;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="header-title">
            Content <span>Planner</span>
          </h1>
          <p className="header-subtitle">
            Design your automated video publishing schedule with AI.
          </p>
        </div>
        {!activeStrategyId && (
          <button className="primary-btn" onClick={addStrategy} style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px', height: 'fit-content' }}>
            <Plus size={16} /> New Strategy
          </button>
        )}
      </div>

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
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                color: '#475569',
                padding: '8px 16px', 
                borderRadius: '20px', 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Strategies
            </button>
          </div>
          
          {strategies.filter(s => s.id === activeStrategyId).map((strat, index) => (
            <div key={strat.id} className="strategy-container" style={{ margin: 0 }}>
              <div className="strategy-header">
                <div className="strategy-title">Strategy Configuration {index + 1}</div>
                <button className="remove-btn" onClick={() => { removeStrategy(strat.id); setActiveStrategyId(null); }} title="Remove Strategy">
                  <Trash2 size={16} />
                </button>
              </div>

          <div className="detail-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Niche Selection */}
              <div className="premium-card">
                <div className="premium-card-title">
                  <Target size={20} color="#3b82f6" /> Select Your Niche
                </div>
                <div style={{ position: 'relative' }}>
                  <div 
                    className={`premium-input-group ${openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'niche' }); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ flex: 1, padding: '14px 16px', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                      {strat.niche}
                    </div>
                    <div style={{ padding: '0 16px' }}>
                      <ChevronDown size={18} color="#94a3b8" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </div>
                  </div>
                  {openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' && (
                    <div className="custom-dropdown-menu" style={{ top: 'calc(100% + 8px)' }}>
                      {niches.map(n => (
                        <div 
                          key={n} 
                          className={`custom-dropdown-item ${n === strat.niche ? 'selected' : ''}`}
                          onClick={() => { updateStrategy(strat.id, 'niche', n); setOpenDropdown(null); }}
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Style Selection */}
              <div className="premium-card">
                <div className="premium-card-title">
                  <Sparkles size={20} color="#d946ef" /> Content Style
                </div>
                <div className="premium-pill-group">
                  {contentStyles.map(s => (
                    <div 
                      key={s} 
                      className={`premium-pill ${s === strat.contentStyle ? 'active' : ''}`}
                      onClick={() => updateStrategy(strat.id, 'contentStyle', s)}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Platforms */}
              <div className="premium-card">
                <div className="premium-card-title">
                  <Users size={20} color="#22c55e" /> Target Platforms
                </div>
                <div className="platform-grid">
                  {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(plat => {
                    const isSelected = strat.platforms.includes(plat);
                    let activeClass = '';
                    if (isSelected) {
                      if (plat === 'TikTok') activeClass = 'active-tiktok';
                      if (plat === 'YouTube Shorts') activeClass = 'active-youtube';
                      if (plat === 'Instagram Reels') activeClass = 'active-instagram';
                    }
                    return (
                      <div 
                        key={plat}
                        className={`platform-box ${activeClass}`}
                        onClick={() => togglePlatform(strat.id, plat)}
                      >
                        <div className="check-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                            stroke={plat === 'TikTok' ? '#FE2C55' : plat === 'YouTube Shorts' ? '#FF0000' : '#DD2A7B'}
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        {plat === 'TikTok' && <TikTokIcon size={36} />}
                        {plat === 'YouTube Shorts' && <YouTubeIcon size={36} />}
                        {plat === 'Instagram Reels' && <InstagramIcon size={36} />}
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', textAlign: 'center', lineHeight: '1.2' }}>
                          {plat}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Campaign Duration */}
              <div className="premium-card">
                <div className="premium-card-title">
                  <Calendar size={20} color="#f59e0b" /> Campaign Duration
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="premium-input-group" style={{ flex: 1 }}>
                    <input 
                      type="number" 
                      className="premium-input" 
                      value={strat.durationValue}
                      onChange={(e) => updateStrategy(strat.id, 'durationValue', e.target.value)}
                    />
                  </div>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <div 
                      className={`premium-input-group ${openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'duration' }); }}
                      style={{ cursor: 'pointer', height: '100%' }}
                    >
                      <div style={{ flex: 1, padding: '14px 16px', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                        {strat.durationUnit}
                      </div>
                      <div style={{ padding: '0 16px' }}>
                        <ChevronDown size={18} color="#94a3b8" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </div>
                    </div>
                    {openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' && (
                      <div className="custom-dropdown-menu" style={{ top: 'calc(100% + 8px)' }}>
                        {durationUnits.map(u => (
                          <div 
                            key={u} 
                            className={`custom-dropdown-item ${u === strat.durationUnit ? 'selected' : ''}`}
                            onClick={() => { updateStrategy(strat.id, 'durationUnit', u); setOpenDropdown(null); }}
                          >
                            {u}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Frequency & Time */}
              <div className="premium-card">
                <div className="premium-card-title">
                  <Activity size={20} color="#8b5cf6" /> Upload Schedule
                </div>
                
                <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Frequency
                </div>
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <div 
                    className={`premium-input-group ${openDropdown?.stratId === strat.id && openDropdown?.type === 'frequency' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'frequency' }); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ flex: 1, padding: '14px 16px', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                      {strat.frequency}
                    </div>
                    <div style={{ padding: '0 16px' }}>
                      <ChevronDown size={18} color="#94a3b8" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'frequency' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </div>
                  </div>
                  {openDropdown?.stratId === strat.id && openDropdown?.type === 'frequency' && (
                    <div className="custom-dropdown-menu" style={{ top: 'calc(100% + 8px)' }}>
                      {frequencies.map(f => (
                        <div 
                          key={f} 
                          className={`custom-dropdown-item ${f === strat.frequency ? 'selected' : ''}`}
                          onClick={() => handleFrequencyChange(strat.id, f)}
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Posting Times
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {strat.uploadTimes.map((time, idx) => {
                    const colors = ['#22c55e', '#3b82f6', '#d946ef', '#f59e0b'];
                    return (
                      <div key={idx} className="time-row">
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[idx % colors.length] }}></div>
                        {strat.uploadTimes.length > 1 && (
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', width: '60px' }}>
                            Video {idx + 1}
                          </div>
                        )}
                        <input 
                          type="time" 
                          className="premium-input" 
                          value={time}
                          onChange={(e) => handleTimeChange(strat.id, idx, e.target.value)}
                          style={{ padding: '0', background: 'transparent' }}
                        />
                      </div>
                    );
                  })}
                </div>
                
              </div>
              
            </div>
          </div>
          
          {/* Action Row for Detail View */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              className="primary-btn"
              onClick={() => handleGenerate(strat.id)}
              style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '12px', background: 'linear-gradient(135deg, #0f172a, #334155)', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)' }}
            >
              {generatingId === strat.id ? (
                'Generating Strategy...'
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Strategies
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      ))}
      
        </div>
      )}
      {showConnectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, width: 400, maxWidth: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
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
    </div>
  );
}
