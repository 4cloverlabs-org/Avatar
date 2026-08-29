"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Calendar, Clock, Activity, ArrowRight, ChevronDown, Plus, Trash2 } from 'lucide-react';

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
  
  const [isGenerating, setIsGenerating] = useState(false);
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

  const addStrategy = () => {
    setStrategies(prev => [
      ...prev, 
      {
        id: `strat-${Date.now()}`,
        niche: 'Gaming',
        durationValue: '10',
        durationUnit: 'Days',
        contentStyle: 'Entertaining',
        frequency: '1 video per day',
        uploadTimes: ['15:00'],
        platforms: ['Instagram Reels']
      }
    ]);
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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div style={{ 
      padding: '0px 40px 40px 40px',
      marginTop: '-16px',
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
          margin-bottom: 8px;
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
          border-radius: 8px;
          padding: 24px;
          border: 2px solid #F5F5F5;
          box-shadow: none; 
          display: flex;
          flex-direction: column;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
          box-shadow: none;
        }
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #111;
        }
        .input-element {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid #e2e2e2;
          background-color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          color: #111;
          outline: none;
          transition: all 0.2s;
          box-shadow: none;
        }
        .input-element:focus {
          border-color: #d86450;
        }
        .custom-dropdown-btn {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid #e2e2e2;
          background-color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          color: #111;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s;
        }
        .custom-dropdown-btn:hover, .custom-dropdown-btn.active {
          border-color: #d86450;
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
          background-color: #d86450;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 18px 36px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: transform 0.2s, background-color 0.2s;
          box-shadow: 0 8px 16px rgba(216, 100, 80, 0.2);
        }
        .primary-btn:hover {
          background-color: #c55745;
          transform: translateY(-1px);
        }
        .primary-btn:active {
          transform: translateY(1px);
        }
        .platform-pill {
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid #e2e2e2;
          background-color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .platform-pill:hover {
          border-color: #d86450;
        }
        .platform-pill.selected {
          background-color: #fff1f0;
          border-color: #d86450;
          color: #d86450;
          font-weight: 600;
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
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 24px;
          padding: 32px;
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
      `}</style>

      <div>
        <h1 className="header-title">
          Content <span>Planner</span>
        </h1>
        <p className="header-subtitle">
          Design your automated video publishing schedule with AI.
        </p>
      </div>

      {strategies.map((strat, index) => (
        <div key={strat.id} className="strategy-container">
          <div className="strategy-header">
            <div className="strategy-title">Strategy {index + 1}</div>
            {strategies.length > 1 && (
              <button className="remove-btn" onClick={() => removeStrategy(strat.id)} title="Remove Strategy">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="dashboard-grid">
            {/* Niche Card */}
            <div className="dash-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <Target size={18} />
                </div>
                <div className="card-title">Select Your Niche</div>
              </div>
              <div style={{ position: 'relative', marginTop: 'auto' }}>
                <div 
                  className={`custom-dropdown-btn ${openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'niche' }); }}
                >
                  {strat.niche}
                  <ChevronDown size={16} color="#888" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>
                {openDropdown?.stratId === strat.id && openDropdown?.type === 'niche' && (
                  <div className="custom-dropdown-menu">
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

            {/* Duration Card */}
            <div className="dash-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <Calendar size={18} />
                </div>
                <div className="card-title">Campaign Duration</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="number" 
                    className="input-element" 
                    value={strat.durationValue}
                    onChange={(e) => updateStrategy(strat.id, 'durationValue', e.target.value)}
                  />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <div 
                    className={`custom-dropdown-btn ${openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'duration' }); }}
                  >
                    {strat.durationUnit}
                    <ChevronDown size={16} color="#888" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {openDropdown?.stratId === strat.id && openDropdown?.type === 'duration' && (
                    <div className="custom-dropdown-menu">
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

            {/* Content Style Card */}
            <div className="dash-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div className="card-title">Content Style</div>
              </div>
              <div style={{ position: 'relative', marginTop: 'auto' }}>
                <div 
                  className={`custom-dropdown-btn ${openDropdown?.stratId === strat.id && openDropdown?.type === 'style' ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'style' }); }}
                >
                  {strat.contentStyle}
                  <ChevronDown size={16} color="#888" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'style' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>
                {openDropdown?.stratId === strat.id && openDropdown?.type === 'style' && (
                  <div className="custom-dropdown-menu">
                    {contentStyles.map(s => (
                      <div 
                        key={s} 
                        className={`custom-dropdown-item ${s === strat.contentStyle ? 'selected' : ''}`}
                        onClick={() => { updateStrategy(strat.id, 'contentStyle', s); setOpenDropdown(null); }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Platforms Card */}
            <div className="dash-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                <div className="card-title">Target Platforms</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 'auto' }}>
                {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(plat => (
                  <div 
                    key={plat}
                    className={`platform-pill ${strat.platforms.includes(plat) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(strat.id, plat)}
                  >
                    {plat}
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency & Time Card */}
            <div className="dash-card" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div className="card-header" style={{ marginBottom: '16px' }}>
                  <div className="icon-wrapper">
                    <Activity size={18} />
                  </div>
                  <div className="card-title">Upload Frequency</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div 
                    className={`custom-dropdown-btn ${openDropdown?.stratId === strat.id && openDropdown?.type === 'frequency' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown({ stratId: strat.id, type: 'frequency' }); }}
                  >
                    {strat.frequency}
                    <ChevronDown size={16} color="#888" style={{ transform: openDropdown?.stratId === strat.id && openDropdown?.type === 'frequency' ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {openDropdown?.stratId === strat.id && openDropdown?.type === 'frequency' && (
                    <div className="custom-dropdown-menu">
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
              </div>

              <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: '#f0f0f0', display: 'none' }} className="divider"></div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <div className="card-header" style={{ marginBottom: '16px' }}>
                  <div className="icon-wrapper">
                    <Clock size={18} />
                  </div>
                  <div className="card-title">Upload Time{strat.uploadTimes.length > 1 ? 's' : ''}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {strat.uploadTimes.map((time, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {strat.uploadTimes.length > 1 && (
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#666', minWidth: '60px' }}>
                          Video {idx + 1}
                        </div>
                      )}
                      <input 
                        type="time" 
                        className="input-element" 
                        value={time}
                        onChange={(e) => handleTimeChange(strat.id, idx, e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <style>{`
                @media (min-width: 768px) {
                  .divider { display: block !important; }
                }
              `}</style>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Strategy Button */}
      <div style={{ marginBottom: '40px' }}>
        <button className="secondary-btn" onClick={addStrategy}>
          <Plus size={20} />
          Add Another Strategy
        </button>
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button 
          className="primary-btn"
          onClick={handleGenerate}
        >
          {isGenerating ? (
            'Generating Strategy...'
          ) : (
            <>
              Generate Strategies
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
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
