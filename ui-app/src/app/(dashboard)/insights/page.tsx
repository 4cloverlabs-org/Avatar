"use client";
import React from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, Copy, Settings, Plus, ArrowLeftRight, 
  MoveUpRight, MoveDownLeft, ArrowRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const areaData = [
  { value: 20 },
  { value: 35 },
  { value: 25 },
  { value: 50 },
  { value: 40 },
  { value: 70 },
  { value: 95 }
];

export default function InsightsPage() {
  return (
    <div style={{ padding: '32px', background: '#fafbfc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TOTAL BALANCE CARD */}
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', display: 'flex', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>Total Balance</div>
              <div style={{ fontSize: '42px', fontWeight: 800, color: '#000', letterSpacing: '-1px', marginBottom: '16px', display: 'flex', alignItems: 'baseline' }}>
                $10,204<span style={{ color: '#d1d5db' }}>.00</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '32px' }}>
                4629 3920 9612 5642 
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer' }}>
                  <Copy size={14} /> Copy
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#000', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  <ArrowDownLeft size={16} /> Receive
                </button>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: '#b4f477', border: 'none', color: '#000', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(180, 244, 119, 0.4)' }}>
                  <ArrowUpRight size={16} /> Transfer
                </button>
              </div>
            </div>

            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                <ArrowUpRight size={14} /> +50% Up Last Month
              </div>
              <div style={{ width: '100%', height: '140px', marginTop: 'auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SPENDING CARD */}
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>Spending</div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', color: '#1a1a1a', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                <Settings size={16} /> Settings
              </button>
            </div>
            
            {/* Custom Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              {[
                { label: 'Jan', height: '45%', color: '#f8fafc' },
                { label: 'Feb', height: '35%', color: '#f8fafc' },
                { label: 'Mar', height: '60%', color: '#e2f5e3' },
                { label: 'Apr', height: '80%', color: '#dcfce7' },
                { label: 'May', height: '55%', color: '#86efac' },
                { label: 'Jun', height: '40%', color: '#b4f477' },
                { label: 'Jul', height: '75%', color: '#86efac' },
                { label: 'Aug', height: '100%', color: '#2b7a5a', pattern: true },
                { label: 'Sep', height: '60%', color: '#34d399' },
                { label: 'Oct', height: '30%', color: '#34d399' }
              ].map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '8%' }}>
                  <div style={{ 
                    width: '100%', 
                    height: bar.height, 
                    background: bar.color, 
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    paddingBottom: '8px'
                  }}>
                    {bar.pattern && (
                      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(#fff 15%, transparent 16%)', backgroundSize: '8px 8px' }} />
                    )}
                    <div style={{ width: '16px', height: '4px', background: 'rgba(255,255,255,0.8)', borderRadius: '2px', margin: '0 auto', zIndex: 1 }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: bar.pattern ? '#10b981' : '#9ca3af' }}>{bar.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SPENDING OVERVIEW */}
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '24px' }}>Spending Overview</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
              <span>$15,000</span>
              <span>$15,000</span>
            </div>
            
            {/* Dashed Progress Bar */}
            <div style={{ display: 'flex', gap: '4px', height: '32px', marginBottom: '16px' }}>
              {Array.from({ length: 80 }).map((_, i) => {
                let color = '#b4f477'; // Others 35%
                if (i >= 28 && i < 54) color = '#34d399'; // Savings 32.5%
                if (i >= 54) color = '#2b7a5a'; // House Rents 32.5%
                return (
                  <div key={i} style={{ flex: 1, background: color, borderRadius: '2px' }} />
                )
              })}
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '32px' }}>
              <span>Others: <strong style={{ color: '#1a1a1a' }}>35.0%</strong></span>
              <span>Savings: <strong style={{ color: '#1a1a1a' }}>32.5%</strong></span>
              <span>House Rents: <strong style={{ color: '#1a1a1a' }}>32.5%</strong></span>
            </div>

            {/* Currencies */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { flag: '🇬🇧', name: 'British Pound (GBP)', iban: '50682' },
                { flag: '🇪🇺', name: 'Euro (EUR)', iban: '50682' },
                { flag: '🇺🇸', name: 'US Dollar (USD)', iban: '94507' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {c.flag}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>IBAN ending -- {c.iban}</div>
                    </div>
                  </div>
                  <ArrowRight size={18} color="#cbd5e1" />
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '24px' }}>Transactions</div>
            
            {/* 4 Buttons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {[
                { icon: <Plus size={20} />, label: 'Add' },
                { icon: <ArrowLeftRight size={20} />, label: 'Move' },
                { icon: <MoveUpRight size={20} />, label: 'Send' },
                { icon: <MoveDownLeft size={20} />, label: 'Request' }
              ].map((btn, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <button style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: 'none', borderRadius: '16px', cursor: 'pointer', color: '#1a1a1a' }}>
                    {btn.icon}
                  </button>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{btn.label}</div>
                </div>
              ))}
            </div>

            {/* Customers Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
              {[
                { label: 'Min 8.2% ARP', color: '#10b981', bg: '#ecfdf5', bars: ['#a7f3d0', '#34d399'] },
                { label: 'Earned +500.00', color: '#3b82f6', bg: '#eff6ff', bars: ['#bfdbfe', '#3b82f6'] },
                { label: 'Min 8.2% ARP', color: '#10b981', bg: '#ecfdf5', bars: ['#a7f3d0', '#b4f477'] }
              ].map((block, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', paddingBottom: i < 2 ? '24px' : '0' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>Customers</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px' }}>45.2k</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: block.bg, color: block.color, borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                      <Settings size={12} /> {block.label}
                    </div>
                    {/* Mini bar chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
                      {[30, 50, 70, 100, 80, 60, 40, 50, 70, 60].map((h, bi) => (
                        <div key={bi} style={{ 
                          width: '8px', 
                          height: `${h}%`, 
                          background: bi > 4 && bi < 8 ? block.bars[1] : block.bars[0], 
                          borderRadius: '2px' 
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#f1f5f9', margin: '0 -32px 24px -32px' }} />

            {/* Recent Transactions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { name: 'Jordan Smith', action: 'Sent', amount: '-50 USD', initial: 'J' },
                { name: 'Alex Johnson', action: 'Receive', amount: '+50 USD', initial: 'A' },
                { name: 'Morgan Ellis', action: 'Sent', amount: '-50 USD', initial: 'M' },
                { name: 'Taylor Reed', action: 'Receive', amount: '+50 USD', initial: 'T' }
              ].map((tx, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>
                      {tx.initial}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{tx.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{tx.action}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
