"use client";
import React, { useEffect, useState } from 'react';
import { 
  Eye, Activity, Video, Target, TrendingUp, TrendingDown, 
  Play, Heart, Share2, Smartphone, Monitor 
} from 'lucide-react';

export default function AnalyticsPage() {
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
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>Loading analytics data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 500 }}>Failed to load analytics data.</div>
      </div>
    );
  }

  const { metrics, platformBreakdown, topPerforming, recentVideos } = data;

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
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        .dash-card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 24px;
          border: 2px solid #F5F5F5;
          display: flex;
          flex-direction: column;
        }
        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #666;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 500;
        }
        .kpi-value {
          font-size: 32px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }
        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
        }
        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
        
        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        @media (max-width: 900px) {
          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }
        .chart-row {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
        }
        .chart-label {
          width: 120px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        .chart-bar-bg {
          flex: 1;
          height: 12px;
          background: #f1f5f9;
          border-radius: 6px;
          overflow: hidden;
        }
        .chart-bar-fill {
          height: 100%;
          background: #d86450;
          border-radius: 6px;
        }
        .chart-value {
          width: 60px;
          text-align: right;
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }
        .recent-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        .recent-table {
          width: 100%;
          border-collapse: collapse;
        }
        .recent-table th {
          text-align: left;
          padding: 16px;
          border-bottom: 2px solid #F5F5F5;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .recent-table td {
          padding: 16px;
          border-bottom: 1px solid #F5F5F5;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
        }
        .status-pill {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
        .status-published {
          background: #dcfce7;
          color: #166534;
        }
        .status-scheduled {
          background: #f1f5f9;
          color: #475569;
        }
      `}</style>

      <div>
        <h1 className="header-title">
          Performance <span>Analytics</span>
        </h1>
        <p className="header-subtitle">
          Track the growth and reach of your AI-generated content strategies.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="kpi-grid">
        <div className="dash-card">
          <div className="kpi-header">
            <span>Total Views</span>
            <Eye size={18} />
          </div>
          <div className="kpi-value">{metrics.totalViews}</div>
          <div className="kpi-trend trend-up" style={{ fontSize: 12, fontWeight: 500 }}>
            Live Data
          </div>
        </div>

        <div className="dash-card">
          <div className="kpi-header">
            <span>Active Strategies</span>
            <Target size={18} />
          </div>
          <div className="kpi-value">{metrics.activeStrategies}</div>
          <div className="kpi-trend" style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>
            Running 24/7
          </div>
        </div>

        <div className="dash-card">
          <div className="kpi-header">
            <span>Videos Published</span>
            <Video size={18} />
          </div>
          <div className="kpi-value">{metrics.videosPublished}</div>
          <div className="kpi-trend trend-up" style={{ fontSize: 12, fontWeight: 500 }}>
            Across all channels
          </div>
        </div>

        <div className="dash-card">
          <div className="kpi-header">
            <span>Avg. Engagement</span>
            <Heart size={18} />
          </div>
          <div className="kpi-value">{metrics.avgEngagement}</div>
          <div className="kpi-trend trend-up" style={{ fontSize: 12, fontWeight: 500 }}>
            Industry leading
          </div>
        </div>
      </div>

      {/* 2-COLUMN ANALYSIS GRID */}
      <div className="analysis-grid">
        
        {/* Target Platforms Performance */}
        <div className="dash-card">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Smartphone size={20} color="#d86450" />
            Platform Breakdown
          </div>
          
          <div className="chart-row">
            <div className="chart-label">TikTok</div>
            <div className="chart-bar-bg">
              <div className="chart-bar-fill" style={{ width: `${platformBreakdown.tiktok}%`, height: '100%' }}></div>
            </div>
            <div className="chart-value">{platformBreakdown.tiktok}%</div>
          </div>
          
          <div className="chart-row">
            <div className="chart-label">YouTube Shorts</div>
            <div className="chart-bar-bg">
              <div className="chart-bar-fill" style={{ width: `${platformBreakdown.youtube}%`, height: '100%', background: '#f87171' }}></div>
            </div>
            <div className="chart-value">{platformBreakdown.youtube}%</div>
          </div>

          <div className="chart-row">
            <div className="chart-label">Instagram Reels</div>
            <div className="chart-bar-bg">
              <div className="chart-bar-fill" style={{ width: `${platformBreakdown.instagram}%`, height: '100%', background: '#fbbf24' }}></div>
            </div>
            <div className="chart-value">{platformBreakdown.instagram}%</div>
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f1f5f9', fontSize: 13, color: '#64748b' }}>
            TikTok is driving the majority of views across your active strategies.
          </div>
        </div>

        {/* Content Style & Niche Analysis */}
        <div className="dash-card">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Monitor size={20} color="#d86450" />
            Top Performing Content
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Best Niche</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{topPerforming.niche}</div>
              <div style={{ fontSize: 13, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <TrendingUp size={14} /> +45% higher engagement
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Best Tone/Style</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{topPerforming.style}</div>
              <div style={{ fontSize: 13, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <TrendingUp size={14} /> Highest completion rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT VIDEO PERFORMANCE TABLE */}
      <div className="dash-card" style={{ padding: '24px 0' }}>
        <div style={{ padding: '0 24px 20px', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Play size={20} color="#d86450" />
          Recent Video Performance
        </div>
        
        <div className="recent-table-wrapper">
          <table className="recent-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Video Title</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Shares</th>
              </tr>
            </thead>
            <tbody>
              {recentVideos.map((vid: any) => {
                const formatNumber = (num: string) => {
                  const n = parseInt(num);
                  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
                  return n === 0 ? '-' : n;
                };
                
                return (
                  <tr key={vid.id}>
                    <td style={{ paddingLeft: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Video size={20} color="#3b82f6" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{vid.title}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{vid.contentStyle || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{vid.platform}</td>
                    <td>
                      <span className={`status-pill ${vid.status === 'Published' ? 'status-published' : 'status-scheduled'}`}>
                        {vid.status}
                      </span>
                    </td>
                    <td>{formatNumber(vid.views)}</td>
                    <td>{formatNumber(vid.likes)}</td>
                    <td>{formatNumber(vid.shares)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
