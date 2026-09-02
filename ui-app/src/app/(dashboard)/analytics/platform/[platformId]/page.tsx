"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Users, TrendingUp, Clock, MapPin, Play, Star, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

export default function PlatformDeepDivePage() {
  const router = useRouter();
  const params = useParams();
  const platformId = typeof params.platformId === 'string' ? params.platformId : 'instagram';
  
  // Platform configuration mapping
  const platformConfig: Record<string, { name: string, color: string, bg: string }> = {
    instagram: { name: 'Instagram', color: '#e1306c', bg: '#fdf2f8' },
    youtube: { name: 'YouTube', color: '#ff0000', bg: '#fef2f2' },
    tiktok: { name: 'TikTok', color: '#000000', bg: '#f8fafc' },
    twitter: { name: 'Twitter/X', color: '#1da1f2', bg: '#f0f9ff' },
    facebook: { name: 'Facebook', color: '#1877f2', bg: '#eff6ff' }
  };

  const config = platformConfig[platformId] || platformConfig['instagram'];
  const [loading, setLoading] = useState(true);

  // Mock specific data for platform
  const followerData = Array.from({ length: 30 }).map((_, i) => ({
    date: `Day ${i + 1}`,
    followers: Math.floor(10000 + i * 250 + Math.random() * 500),
  }));

  const demoData = [
    { name: '18-24', value: 45 },
    { name: '25-34', value: 30 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 10 },
  ];
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  const geoData = [
    { country: 'United States', percentage: 40 },
    { country: 'United Kingdom', percentage: 15 },
    { country: 'Canada', percentage: 10 },
    { country: 'Australia', percentage: 8 },
    { country: 'Other', percentage: 27 },
  ];

  const timeToPostData = [
    { hour: '6am', engagement: 20 },
    { hour: '9am', engagement: 65 },
    { hour: '12pm', engagement: 45 },
    { hour: '3pm', engagement: 50 },
    { hour: '6pm', engagement: 90 },
    { hour: '9pm', engagement: 75 },
  ];

  const topVideos = Array.from({ length: 5 }).map((_, i) => ({
    title: `${config.name} Highlight Video ${i+1}`,
    date: new Date(Date.now() - i * 86400000 * 2).toLocaleDateString(),
    views: Math.floor(Math.random() * 150000 + 50000),
    engagement: (Math.random() * 10 + 5).toFixed(1)
  }));

  useEffect(() => {
    // Simulate loading for realistic UX
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>Loading {config.name} insights...</div>
      </div>
    );
  }

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
          padding: 32px;
          box-shadow: 0 4px 24px rgba(100, 100, 111, 0.05);
          border: 1px solid rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }
        .summary-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(100, 100, 111, 0.04);
          border: 1px solid rgba(0,0,0,0.02);
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-btn:hover {
          color: #1e293b;
        }
        .grid-row-1 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        .grid-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 1100px) {
          .grid-row-1 { grid-template-columns: 1fr; }
          .grid-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="back-btn" onClick={() => router.back()}>
        <ArrowLeft size={18} /> Back to Metrics
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 48, height: 48, borderRadius: '12px', background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 800 }}>
          {config.name.charAt(0)}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
          {config.name} Deep Analysis
        </div>
      </div>

      {/* SUMMARY ROW */}
      <div className="grid-row-1">
        <div className="summary-card">
          <div className="icon-box" style={{ background: config.bg, color: config.color }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total Followers</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
              17,450
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Avg Engagement Rate</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
              8.4%
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Play size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total Posts Published</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
              142
            </div>
          </div>
        </div>
      </div>

      {/* FOLLOWER GROWTH CHART */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Audience Growth (Last 30 Days)</div>
        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={followerData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [value.toLocaleString(), 'Followers']}
              />
              <Area type="monotone" dataKey="followers" stroke={config.color} strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEMO AND GEO ROW */}
      <div className="grid-row-2">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <PieChartIcon size={20} color="#64748b" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Demographics (Age)</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ height: 220, width: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {demoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Audience']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {demoData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }}></div>
                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{d.name}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{d.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <MapPin size={20} color="#64748b" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Top Regions</div>
          </div>
          <div style={{ height: 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: number) => [`${v}%`, 'Audience']} />
                <Bar dataKey="percentage" fill={config.color} radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BEST TIME TO POST & TOP VIDEOS */}
      <div className="grid-row-2">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Clock size={20} color="#64748b" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Best Time to Post</div>
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Average engagement mapped across times of day.</div>
          
          <div style={{ height: 250, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToPostData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: number) => [`${v}%`, 'Engagement Potential']} />
                <Bar dataKey="engagement" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
                  {timeToPostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.engagement > 70 ? config.color : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Star size={20} color="#64748b" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Top Performing Content</div>
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Highest engaged videos on {config.name}.</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topVideos.map((vid, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: 40, height: 40, borderRadius: '8px', background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', opacity: 0.9 }}>
                  <Play size={18} fill="currentColor" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {vid.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{vid.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                    {vid.views.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                    {vid.engagement}% ER
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
