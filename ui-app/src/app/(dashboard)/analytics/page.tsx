"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, Video, Target, TrendingUp, TrendingDown, 
  Play, Smartphone, Monitor, Calendar, Search,
  MoreVertical, CheckCircle, FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, ReferenceDot } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for toggling individual chart lines
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({
    revenue: false,      // Instagram
    clickRate: false,    // YouTube
    unsubscribes: false, // TikTok
    twitter: false,
    facebook: false,
  });

  const toggleLine = (key: string) => {
    setHiddenLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>Loading analytics data...</div>
      </div>
    );
  }

  // Exact data from image reference visually, augmented with Twitter and Facebook
  const performanceData = [
    { date: 'Feb 7', revenue: 0, clickRate: 0, unsubscribes: 0, twitter: 0, facebook: 0 },
    { date: '', revenue: 7000, clickRate: 8000, unsubscribes: 8000, twitter: 9000, facebook: 5000 },
    { date: '', revenue: 4000, clickRate: 7000, unsubscribes: 7500, twitter: 8000, facebook: 3000 },
    { date: '', revenue: 9000, clickRate: 9000, unsubscribes: 9500, twitter: 11000, facebook: 6000 },
    { date: '', revenue: 7000, clickRate: 8500, unsubscribes: 11000, twitter: 13000, facebook: 5000 },
    { date: 'Feb 8', revenue: 14000, clickRate: 15500, unsubscribes: 16500, twitter: 18000, facebook: 11000 },
    { date: '', revenue: 16500, clickRate: 17500, unsubscribes: 18000, twitter: 19500, facebook: 13000 },
    { date: 'Feb 9', revenue: 16000, clickRate: 18000, unsubscribes: 18000, twitter: 20000, facebook: 12000 },
    { date: '', revenue: 18500, clickRate: 20000, unsubscribes: 22000, twitter: 24000, facebook: 15000 },
    { date: '', revenue: 17000, clickRate: 18500, unsubscribes: 24000, twitter: 25000, facebook: 14000 },
    { date: '', revenue: 10000, clickRate: 17000, unsubscribes: 21000, twitter: 22000, facebook: 8000 },
    { date: '', revenue: 10000, clickRate: 17000, unsubscribes: 21500, twitter: 23000, facebook: 8000 },
    { date: 'Feb 10', revenue: 17000, clickRate: 20000, unsubscribes: 22000, twitter: 24000, facebook: 14000 }, // Marker point!
    { date: '', revenue: 19500, clickRate: 21000, unsubscribes: 23000, twitter: 25000, facebook: 16000 },
    { date: '', revenue: 27500, clickRate: 30000, unsubscribes: 34000, twitter: 36000, facebook: 24000 },
    { date: 'Feb 11', revenue: 28500, clickRate: 30500, unsubscribes: 40000, twitter: 42000, facebook: 25000 },
    { date: '', revenue: 29000, clickRate: 31000, unsubscribes: 39000, twitter: 41000, facebook: 26000 },
    { date: '', revenue: 25000, clickRate: 27500, unsubscribes: 38500, twitter: 40000, facebook: 22000 },
    { date: '', revenue: 24000, clickRate: 25000, unsubscribes: 38000, twitter: 40000, facebook: 21000 },
    { date: 'Feb 12', revenue: 24000, clickRate: 25000, unsubscribes: 33000, twitter: 35000, facebook: 20000 },
    { date: '', revenue: 29000, clickRate: 30000, unsubscribes: 35000, twitter: 37000, facebook: 25000 },
    { date: '', revenue: 26000, clickRate: 29000, unsubscribes: 34500, twitter: 36000, facebook: 22000 },
    { date: '', revenue: 24000, clickRate: 29500, unsubscribes: 33500, twitter: 35000, facebook: 20000 },
    { date: 'Feb 13', revenue: 27000, clickRate: 30000, unsubscribes: 35000, twitter: 38000, facebook: 24000 },
    { date: '', revenue: 29000, clickRate: 33000, unsubscribes: 37000, twitter: 40000, facebook: 26000 },
    { date: '', revenue: 38000, clickRate: 39000, unsubscribes: 42000, twitter: 45000, facebook: 34000 },
  ];

  const quickActions = [
    { icon: <Calendar size={18} color="#6366f1" />, label: 'Create Strategy', bg: '#eef2ff' },
    { icon: <Target size={18} color="#0ea5e9" />, label: 'Connect Platform', bg: '#e0f2fe' },
    { icon: <Video size={18} color="#10b981" />, label: 'View Library', bg: '#d1fae5' },
    { icon: <Activity size={18} color="#f43f5e" />, label: 'View Reports', bg: '#ffe4e6' },
  ];

  return (
    <div className="custom-scrollbar" style={{
      padding: '32px 40px 40px 40px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: '100%',
      flex: 1,
      overflowY: 'auto',
      backgroundColor: 'transparent',
      color: '#111',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        .glass-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(100, 100, 111, 0.05);
          border: 1px solid rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          flex: 1;
        }
        @media (max-width: 1200px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
        }
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 800px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
        }
        .bottom-row {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
        }
        @media (max-width: 1000px) {
          .bottom-row {
            grid-template-columns: 1fr;
          }
        }
        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 13px;
          color: #334155;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .action-btn:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.04);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .card-title {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
        }
        .card-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 6px;
          font-weight: 500;
        }
        .badge-btn {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .nav-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
      `}</style>

      <div className="bento-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Plan Progress */}
          <div className="glass-card">
            <div className="card-header">
              <div>
                <div className="card-title">Plan Progress</div>
                <div className="card-subtitle">Posts published vs posts planned.</div>
              </div>
              <div className="nav-btn" style={{ width: 28, height: 28 }}>⋮</div>
            </div>
            
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
              <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1, color: '#1e293b', letterSpacing: '-2px' }}>82<span style={{ fontSize: 24, color: '#94a3b8', letterSpacing: '0' }}>/100</span></div>
              <div style={{ fontSize: 12, color: '#64748b', maxWidth: 80, lineHeight: 1.5, fontWeight: 500 }}>Posts in current cycle</div>
            </div>

            <div style={{ width: '100%', height: 16, background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 8, marginBottom: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '82%', background: '#bfdbfe', borderRadius: 8 }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '60%', background: '#60a5fa', borderRadius: 8 }}></div>
              {/* The vertical divider inside the bar */}
              <div style={{ position: 'absolute', top: -4, left: '60%', width: 2, height: 24, background: '#3b82f6' }}></div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Indicators:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Days Remaining</span>
                <span style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div> 7 Days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Failed Posts</span>
                <span style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div> 0 Errors</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Platform Health</span>
                <span style={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div> All Connected</span>
              </div>
            </div>
          </div>

          {/* Avatar Usage */}
          <div className="glass-card" style={{ flex: 1 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Avatar Usage</div>
                <div className="card-subtitle">Which avatar/voice pairings were used.</div>
              </div>
              <MoreVertical size={16} color="#94a3b8" />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1, marginTop: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={18} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Emma (Professional)</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}><span style={{ color: '#3b82f6', fontWeight: 700 }}>• 54%</span> / 32 videos</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: '#f5f3ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={18} color="#8b5cf6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Liam (Casual)</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}><span style={{ color: '#8b5cf6', fontWeight: 700 }}>• 27%</span> / 18 videos</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', paddingTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>54%</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6', marginTop: 12 }}>27%</div>
              </div>
            </div>
          </div>

          {/* Upcoming Posts */}
          <div className="glass-card">
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="card-title">Upcoming Posts</div>
                <div className="card-subtitle">See your automated scheduled posts.</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="badge-btn" style={{ color: '#0f172a', whiteSpace: 'nowrap' }}>
                  <Calendar size={14} /> 7 Feb 2024 - 10 Feb 2024
                </div>
                <div className="nav-btn" style={{ width: 28, height: 28 }}>⤢</div>
              </div>
            </div>

            <div style={{ position: 'relative', height: '100%' }}>
              {/* Timeline axis text */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 11, fontWeight: 600, padding: '0 16px', marginBottom: 16 }}>
                <div>07:00</div><div>7:15</div><div>7:30</div><div>7:45</div><div>8:00</div><div>8:15</div><div>8:30</div>
              </div>

              <div style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                Today <div style={{ flex: 1, height: 1, borderTop: '2px dashed #bfdbfe' }}></div>
              </div>

              {/* Timeline Items */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#eff6ff', padding: '16px', borderRadius: '16px', marginBottom: 24, border: '1px solid #bfdbfe', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <Play size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>Winter Sale Reel (IG)</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>07:00 - 11:00 AM</div>
                </div>
                <MoreVertical size={16} color="#94a3b8" />
              </div>

              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 16 }}>
                Sun 8 February
              </div>

              <div style={{ display: 'flex', alignItems: 'center', background: '#fffbeb', padding: '16px', borderRadius: '16px', border: '1px solid #fde68a', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <Video size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>New Arrivals (YT Shorts)</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>08:00 - 12:00 AM</div>
                </div>
                <MoreVertical size={16} color="#fcd34d" />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          
          <div className="stats-row">
            {/* 1. Total Views */}
            <div className="glass-card">
              <div className="card-header" style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 15 }}>Total Views</div>
                <div className="nav-btn">›</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#3b82f6', fontSize: 12, fontWeight: 700 }}>
                    ▲ +6.3%
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', letterSpacing: '-1px' }}>12.4K</div>
                </div>
                
                {/* Exact Mini Line Chart visual */}
                <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                   <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textAlign: 'right', marginBottom: 4 }}>12k+</div>
                   <svg viewBox="0 0 100 40" style={{ width: '100%', height: 20 }}>
                     <path d="M0,20 Q20,20 30,10 T60,15 T100,0" fill="none" stroke="#93c5fd" strokeWidth="3" />
                     <path d="M0,20 Q20,20 30,10 T60,15 T100,0 L100,40 L0,40 Z" fill="#eff6ff" />
                   </svg>
                </div>
              </div>
            </div>

            {/* 2. Total Posts */}
            <div className="glass-card">
              <div className="card-header" style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 15 }}>Total Posts</div>
                <div className="nav-btn">›</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#ef4444', fontSize: 12, fontWeight: 700 }}>
                    ▼ -2%
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', letterSpacing: '-1px' }}>382</div>
                </div>
                
                {/* Mini Bars Exact */}
                <div style={{ display: 'flex', gap: 6, height: 40, alignItems: 'flex-end', position: 'relative' }}>
                  <div style={{ width: 6, height: '40%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 4 }}></div>
                  <div style={{ width: 6, height: '60%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 4 }}></div>
                  
                  {/* Highlighted bar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', background: '#fef3c7', padding: '4px 6px', borderRadius: '4px', fontSize: 10, fontWeight: 700, color: '#b45309' }}>382</div>
                    <div style={{ width: 6, height: '100%', background: '#fcd34d', borderRadius: 4 }}></div>
                  </div>

                  <div style={{ width: 6, height: '30%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 4 }}></div>
                  <div style={{ width: 6, height: '50%', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 4 }}></div>
                </div>
              </div>
            </div>
            
            {/* 3. Avg Engagement */}
            <div className="glass-card">
              <div className="card-header" style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 15 }}>Avg Engagement</div>
                <div className="nav-btn">›</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#3b82f6', fontSize: 12, fontWeight: 700 }}>
                    ▲ +12%
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b', letterSpacing: '-1px' }}>12%</div>
                </div>
                
                {/* Exact Horizontal Marker line */}
                <div style={{ width: 90, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 10 }}>
                   <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textAlign: 'right', paddingRight: '15%' }}>15%</div>
                   <div style={{ width: '100%', height: 2, background: '#f1f5f9', position: 'relative' }}>
                     <div style={{ position: 'absolute', top: -3, left: '60%', width: 2, height: 8, background: '#93c5fd' }}></div>
                     <div style={{ position: 'absolute', top: -3, left: '85%', width: 2, height: 8, background: '#93c5fd' }}></div>
                     <div style={{ position: 'absolute', top: 0, left: '60%', width: '25%', height: 2, background: '#3b82f6' }}></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* MAIN CHART - Exact Rebuild */}
          <div className="glass-card" style={{ padding: '32px 32px 16px 32px', flex: 1 }}>
            <div className="card-header" style={{ marginBottom: 32 }}>
              <div>
                <div className="card-title" style={{ fontSize: 18 }}>Content Performance</div>
                <div className="card-subtitle">Monitor how your automated posts are performing across platforms.</div>
                
                <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
                  <div 
                    onClick={() => toggleLine('revenue')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: hiddenLines.revenue ? '#cbd5e1' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', opacity: hiddenLines.revenue ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: hiddenLines.revenue ? '#cbd5e1' : '#93c5fd', flexShrink: 0 }}></div> 
                    <span>Instagram Views</span>
                  </div>
                  <div 
                    onClick={() => toggleLine('clickRate')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: hiddenLines.clickRate ? '#cbd5e1' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', opacity: hiddenLines.clickRate ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: hiddenLines.clickRate ? '#cbd5e1' : '#f87171', flexShrink: 0 }}></div> 
                    <span>YouTube Views</span>
                  </div>
                  <div 
                    onClick={() => toggleLine('unsubscribes')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: hiddenLines.unsubscribes ? '#cbd5e1' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', opacity: hiddenLines.unsubscribes ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: hiddenLines.unsubscribes ? '#cbd5e1' : '#818cf8', flexShrink: 0 }}></div> 
                    <span>TikTok Views</span>
                  </div>
                  <div 
                    onClick={() => toggleLine('twitter')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: hiddenLines.twitter ? '#cbd5e1' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', opacity: hiddenLines.twitter ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: hiddenLines.twitter ? '#cbd5e1' : '#94a3b8', flexShrink: 0 }}></div> 
                    <span>Twitter/X Views</span>
                  </div>
                  <div 
                    onClick={() => toggleLine('facebook')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: hiddenLines.facebook ? '#cbd5e1' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', opacity: hiddenLines.facebook ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: hiddenLines.facebook ? '#cbd5e1' : '#34d399', flexShrink: 0 }}></div> 
                    <span>Facebook Views</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="badge-btn">
                  Last 07 days ▾
                </div>
                <div className="nav-btn" style={{ width: 32, height: 32 }}>⤢</div>
              </div>
            </div>

            <div style={{ height: 320, width: '100%', position: 'relative' }}>
              
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    {/* Linear fades for each colored stripe */}
                    <linearGradient id="fadeSlate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fadePurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fadeRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#fca5a5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fadeEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fadeBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#93c5fd" stopOpacity={0} />
                    </linearGradient>

                    {/* Striped patterns for each line */}
                    <pattern id="stripeSlate" x="0" y="0" width="8" height="400" patternUnits="userSpaceOnUse">
                      <rect width="8" height="400" fill="transparent" />
                      <rect x="3" y="0" width="2" height="400" fill="url(#fadeSlate)" />
                    </pattern>
                    <pattern id="stripePurple" x="0" y="0" width="8" height="400" patternUnits="userSpaceOnUse">
                      <rect width="8" height="400" fill="transparent" />
                      <rect x="3" y="0" width="2" height="400" fill="url(#fadePurple)" />
                    </pattern>
                    <pattern id="stripeRed" x="0" y="0" width="8" height="400" patternUnits="userSpaceOnUse">
                      <rect width="8" height="400" fill="transparent" />
                      <rect x="3" y="0" width="2" height="400" fill="url(#fadeRed)" />
                    </pattern>
                    <pattern id="stripeEmerald" x="0" y="0" width="8" height="400" patternUnits="userSpaceOnUse">
                      <rect width="8" height="400" fill="transparent" />
                      <rect x="3" y="0" width="2" height="400" fill="url(#fadeEmerald)" />
                    </pattern>
                    <pattern id="stripeBlue" x="0" y="0" width="8" height="400" patternUnits="userSpaceOnUse">
                      <rect width="8" height="400" fill="transparent" />
                      <rect x="3" y="0" width="2" height="400" fill="url(#fadeBlue)" />
                    </pattern>
                  </defs>
                  
                  {/* Horizontal dashed grid lines only */}
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  
                  <XAxis dataKey="date" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} interval={0} />
                  
                  {/* YAxis on the right side */}
                  <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dx={10} tickFormatter={(v) => v === 0 ? '0' : `${v/1000}k`} />
                  
                  <Tooltip 
                    cursor={{ stroke: '#a5b4fc', strokeWidth: 2 }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ background: '#0a0a0a', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: 13, fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}>
                            <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                            {payload.map((p: any, i: number) => {
                              const displayName = p.name === 'twitter' ? 'Twitter/X' : p.name === 'facebook' ? 'Facebook' : p.name === 'unsubscribes' ? 'TikTok' : p.name === 'clickRate' ? 'YouTube' : 'Instagram';
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }}></div>
                                  <span style={{ color: '#cbd5e1' }}>{displayName}:</span>
                                  <span>{p.value}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  
                  {/* The actual overlapping striped areas, conditionally rendered */}
                  {!hiddenLines.twitter && <Area type="linear" dataKey="twitter" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#stripeSlate)" activeDot={{ r: 6, fill: "#ffffff", stroke: "#94a3b8", strokeWidth: 2 }} />}
                  {!hiddenLines.unsubscribes && <Area type="linear" dataKey="unsubscribes" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#stripePurple)" activeDot={{ r: 6, fill: "#ffffff", stroke: "#a5b4fc", strokeWidth: 2 }} />}
                  {!hiddenLines.clickRate && <Area type="linear" dataKey="clickRate" stroke="#fca5a5" strokeWidth={2} fillOpacity={1} fill="url(#stripeRed)" activeDot={{ r: 6, fill: "#ffffff", stroke: "#fca5a5", strokeWidth: 2 }} />}
                  {!hiddenLines.facebook && <Area type="linear" dataKey="facebook" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#stripeEmerald)" activeDot={{ r: 6, fill: "#ffffff", stroke: "#34d399", strokeWidth: 2 }} />}
                  {!hiddenLines.revenue && <Area type="linear" dataKey="revenue" stroke="#93c5fd" strokeWidth={2} fillOpacity={1} fill="url(#stripeBlue)" activeDot={{ r: 6, fill: "#ffffff", stroke: "#93c5fd", strokeWidth: 2 }} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BOTTOM ROW */}
          {/* BOTTOM ROW - Contributions Heatmap */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div className="card-header" style={{ marginBottom: 32 }}>
              <div className="card-title" style={{ fontSize: 20 }}>Contributions</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>Timeframe</span>
                <div className="badge-btn" style={{ color: '#0f172a', padding: '8px 16px', borderRadius: '8px', gap: 8 }}>
                  <Calendar size={14} /> 4 Jan - 21 Dec
                </div>
              </div>
            </div>

            {/* Heatmap Grid Area */}
            <div style={{ border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px 32px', marginBottom: 16 }}>
              {/* Months Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingRight: 40, fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
              </div>
              
              {/* Grid */}
              <div style={{ display: 'flex', gap: 6, width: '100%', overflowX: 'hidden' }}>
                {Array.from({ length: 30 }).map((_, w) => (
                  <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {Array.from({ length: 7 }).map((_, d) => {
                      // Deterministic pseudo-random generation for stable rendering
                      const val = (w * 17 + d * 31 + (w % 2) * 43) % 100;
                      let level = 0;
                      if (val > 50 && val < 65) level = 1;
                      else if (val >= 65 && val < 80) level = 2;
                      else if (val >= 80 && val < 90) level = 3;
                      else if (val >= 90) level = 4;

                      const color = level === 0 ? 'transparent' 
                                  : level === 1 ? '#e0f2fe' 
                                  : level === 2 ? '#c7d2fe' 
                                  : level === 3 ? '#818cf8' 
                                  : '#4f46e5';

                      return (
                        <div key={d} style={{ 
                          width: '100%', 
                          paddingBottom: '100%', 
                          borderRadius: 4, 
                          background: color,
                          boxShadow: level > 0 ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                        }}></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1e293b', fontWeight: 500 }}>
                Less
                <div style={{ width: 14, height: 14, borderRadius: 4, background: '#e0f2fe' }}></div>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: '#c7d2fe' }}></div>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: '#818cf8' }}></div>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: '#4f46e5' }}></div>
                More
              </div>
              <div style={{ fontSize: 13, color: '#1e293b', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>
                Learn how we count contributions
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
