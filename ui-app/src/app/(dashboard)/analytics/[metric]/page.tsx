"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Activity, Play, Video, Target, TrendingUp, BarChart3, Star
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell 
} from 'recharts';

export default function DeepAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const metric = typeof params.metric === 'string' ? params.metric : 'views';
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>Loading detailed analysis...</div>
      </div>
    );
  }

  // Get raw data
  const baseData = data?.performanceData || [];
  
  // Apply modifier based on metric
  let modifier = 1;
  let metricTitle = 'Views';
  let yAxisFormatter = (v: number) => v === 0 ? '0' : `${v/1000}k`;
  let tooltipFormatter = (v: number) => v.toString();
  let overallGrowth = "+6.3%";

  if (metric === 'posts') {
    modifier = 1 / 5000;
    metricTitle = 'Posts';
    yAxisFormatter = (v: number) => v.toString();
    overallGrowth = "-2.0%";
  } else if (metric === 'engagement') {
    modifier = 1 / 2000;
    metricTitle = 'Engagement';
    yAxisFormatter = (v: number) => `${v}%`;
    tooltipFormatter = (v: number) => `${v}%`;
    overallGrowth = "+12.0%";
  }

  const chartData = baseData.filter((d:any) => d.date !== '').map((d: any, index: number) => {
    return {
      ...d,
      revenue: Math.round(d.revenue * modifier),
      clickRate: Math.round(d.clickRate * modifier),
      unsubscribes: Math.round(d.unsubscribes * modifier),
      twitter: Math.round(d.twitter * modifier),
      facebook: Math.round(d.facebook * modifier),
      uniqueKey: index.toString()
    };
  });

  const platforms = [
    { key: 'revenue', name: 'Instagram', color: '#93c5fd' },
    { key: 'clickRate', name: 'YouTube', color: '#f87171' },
    { key: 'unsubscribes', name: 'TikTok', color: '#818cf8' },
    { key: 'twitter', name: 'Twitter/X', color: '#94a3b8' },
    { key: 'facebook', name: 'Facebook', color: '#34d399' }
  ];

  // Calculate totals for table
  const totals = platforms.map(p => {
    const sum = chartData.reduce((acc: number, curr: any) => acc + (curr[p.key] || 0), 0);
    return {
      ...p,
      total: sum
    };
  }).sort((a, b) => b.total - a.total);

  // Compute grand total
  const grandTotal = totals.reduce((acc, curr) => acc + curr.total, 0);
  
  // Identify top platform
  const topPlatform = totals[0];

  // Pie chart data
  const pieData = totals.map(t => ({
    name: t.name,
    value: Math.max(t.total, 1),
    color: t.color
  }));

  // Top videos mapping based on metric
  const topVideos = (data?.recentVideos || []).map((vid: any) => {
    let val = vid.views;
    if (metric === 'posts') val = Math.max(1, Math.floor(vid.views / 50000));
    if (metric === 'engagement') val = ((vid.likes + vid.shares) / Math.max(1, vid.views) * 100).toFixed(1) + '%';
    return { ...vid, displayValue: val };
  });

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
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        th, td {
          text-align: left;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        th {
          font-weight: 600;
          color: #64748b;
          font-size: 13px;
        }
        td {
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
        }
        .clickable-row {
          cursor: pointer;
          transition: background 0.2s;
        }
        .clickable-row:hover {
          background: #f8fafc;
        }
        .grid-row-1 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        .grid-row-2 {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 1100px) {
          .grid-row-1 { grid-template-columns: 1fr; }
          .grid-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="back-btn" onClick={() => router.push('/analytics')}>
        <ArrowLeft size={18} /> Back to Overview
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 32, letterSpacing: '-0.5px' }}>
        Detailed Analysis: {metricTitle}
      </div>

      {/* SUMMARY ROW */}
      <div className="grid-row-1">
        <div className="summary-card">
          <div className="icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Total {metricTitle}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
              {metric === 'engagement' ? (grandTotal / chartData.length).toFixed(1) + '%' : grandTotal.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <Star size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Top Platform</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
              {topPlatform?.name}
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Period Growth</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: overallGrowth.startsWith('-') ? '#ef4444' : '#10b981' }}>
              {overallGrowth}
            </div>
          </div>
        </div>
      </div>

      {/* CHART ROW */}
      <div className="grid-row-2">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Performance Over Time</div>
          </div>
          <div style={{ height: 350, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {platforms.map(p => (
                    <linearGradient key={p.key} id={`fade_${p.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={p.color} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={p.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={yAxisFormatter} />
                <RechartsTooltip 
                  cursor={{ stroke: '#a5b4fc', strokeWidth: 2 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{ background: '#0a0a0a', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: 13, fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}>
                          <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{label || 'Date'}</div>
                          {payload.map((p: any, i: number) => {
                            const plt = platforms.find(pl => pl.key === p.name);
                            return (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: plt?.color || p.color }}></div>
                                <span style={{ color: '#cbd5e1' }}>{plt?.name || p.name}:</span>
                                <span>{tooltipFormatter(p.value)}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {platforms.map(p => (
                  <Area key={p.key} type="monotone" dataKey={p.key} stroke={p.color} strokeWidth={2} fillOpacity={1} fill={`url(#fade_${p.key})`} activeDot={{ r: 6, strokeWidth: 0, fill: p.color }} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Distribution</div>
          <div style={{ height: 260, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [
                    metric === 'engagement' ? `${(value/chartData.length).toFixed(1)}%` : value.toLocaleString(), 
                    'Total'
                  ]}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            {totals.slice(0, 4).map(t => (
              <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color }}></div>
                <div style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLES ROW */}
      <div className="grid-row-2">
        <div className="glass-card">
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Platform Breakdown</div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Detailed totals across all channels.</div>
          
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Total {metricTitle}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {totals.map(row => {
                // map the platform key to something url-friendly like 'youtube', 'instagram'
                let pId = 'instagram';
                if (row.key === 'clickRate') pId = 'youtube';
                if (row.key === 'unsubscribes') pId = 'tiktok';
                if (row.key === 'twitter') pId = 'twitter';
                if (row.key === 'facebook') pId = 'facebook';

                return (
                  <tr 
                    key={row.key} 
                    className="clickable-row"
                    onClick={() => router.push(`/analytics/platform/${pId}`)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: row.color }}></div>
                        {row.name}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {metric === 'engagement' ? (row.total / chartData.length).toFixed(1) : row.total.toLocaleString()}
                      {metric === 'engagement' ? '%' : ''}
                    </td>
                    <td>
                      <span style={{ padding: '4px 8px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', fontSize: 12, fontWeight: 600 }}>
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Top Performing Videos</div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Highest {metricTitle.toLowerCase()} this period.</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topVideos.map((vid: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: 40, height: 40, borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <Play size={18} fill="currentColor" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {vid.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{new Date(vid.edited).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#3b82f6' }}>
                  {typeof vid.displayValue === 'number' ? vid.displayValue.toLocaleString() : vid.displayValue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
