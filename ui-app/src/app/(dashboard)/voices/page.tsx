"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Play, Search, X, ChevronRight } from 'lucide-react';

export default function VoicesView() {
  const router = useRouter();
  const [voiceTab, setVoiceTab] = useState('My Voices');
  
  return (
    <div className="home-content">
      {/* TABS */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        {['System Voices', 'My Voices', 'Shared with Me'].map(tab => (
          <div 
            key={tab}
            onClick={() => setVoiceTab(tab)}
            style={{ 
              paddingBottom: 12, 
              cursor: 'pointer', 
              fontSize: 14, 
              fontWeight: 500,
              color: voiceTab === tab ? '#0f172a' : '#64748b',
              borderBottom: voiceTab === tab ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {voiceTab === 'My Voices' && <MyVoicesUI />}
      {voiceTab === 'System Voices' && <SystemVoicesUI />}
      {voiceTab === 'Shared with Me' && <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No shared voices yet.</div>}
    </div>
  );
}

function MyVoicesUI() {
  const mockVoices = [
    { id: '1', name: "Lily's Voice", type: 'System Voice' },
    { id: '2', name: "Matt's Voice", type: 'System Voice' },
    { id: '3', name: "Rosie's Voice", type: 'System Voice' },
  ];

  const renderWaveform = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 80, width: '100%', padding: '0 20px', justifyContent: 'center' }}>
        {Array.from({ length: 45 }).map((_, i) => {
          const height = Math.abs(Math.sin(i * 0.15)) * 40 + Math.abs(Math.cos(i * 0.8)) * 15 + 5;
          return (
            <div 
              key={i} 
              style={{ width: 4, height: `${height}px`, background: '#e2e8f0', borderRadius: 4 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* HERO BANNER */}
      <div style={{ 
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', 
        borderRadius: 16, 
        padding: '40px 48px', 
        marginBottom: 40,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Next-level voice cloning</h2>
          <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.5, marginBottom: 24 }}>
            Clone your voice in minutes. Pair it with any Avatar to make videos that sound just like you.
          </p>
          <button style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Create Voice
          </button>
        </div>
      </div>

      {/* EXAMPLES SECTION */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Examples</h3>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Check out these examples using our new cutting-edge voice cloning model.</p>
      </div>

      {/* CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {mockVoices.map(voice => (
          <div key={voice.id} style={{ background: '#f8fafc', borderRadius: 12, overflow: 'hidden', padding: '24px 0 0 0' }}>
            {renderWaveform()}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 20px 20px', marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: '#cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{voice.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{voice.type}</div>
                </div>
              </div>
              <button style={{ width: 36, height: 36, background: '#4f46e5', borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Play size={16} color="#fff" fill="#fff" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SystemVoicesUI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  const languages = [
    { name: 'English (US)', langCode: 'EN-US', langFull: 'English', region: 'United States', count: 37, flag: '🇺🇸' },
    { name: 'English (GB)', langCode: 'EN-GB', langFull: 'English', region: 'United Kingdom', count: 28, flag: '🇬🇧' },
    { name: 'Spanish', langCode: 'ES', langFull: 'Spanish', region: null, count: 128, flag: '🇪🇸' },
    { name: 'German', langCode: 'DE', langFull: 'German', region: null, count: 73, flag: '🇩🇪' },
    { name: 'French', langCode: 'FR', langFull: 'French', region: null, count: 128, flag: '🇫🇷' },
    { name: 'Japanese', langCode: 'JA', langFull: 'Japanese', region: null, count: 77, flag: '🇯🇵' },
  ];

  const allVoices = [
    { id: 1, name: 'Bruce - Full', desc: 'Measured delivery with an even tone.', lang: 'EN-US', langFull: 'English', gender: 'Male' },
    { id: 2, name: 'Carlos - Candid', desc: 'Young male with a professional demeanor.', lang: 'EN-US', langFull: 'English', gender: 'Male' },
    { id: 3, name: 'Carol - Candid', desc: 'Familiar tone good for relating to your...', lang: 'EN-US', langFull: 'English', gender: 'Female' },
    { id: 4, name: 'Clint - Sincere', desc: 'Subdued and sincere with a gentle tone.', lang: 'EN-US', langFull: 'English', gender: 'Male' },
    { id: 5, name: 'Dorothea - Balanced', desc: 'Mature and steady, good for explainer...', lang: 'EN-US', langFull: 'English', gender: 'Female' },
    { id: 6, name: 'Expert', desc: 'Middle-aged female with a narrator st...', lang: 'EN-US', langFull: 'English', gender: 'Female' },
    { id: 7, name: 'Greta - Rich', desc: 'Middle-aged female with a rich, profes...', lang: 'EN-US', langFull: 'English', gender: 'Female' },
    { id: 8, name: 'Hope - Calm', desc: 'Clear and professional with a moderat...', lang: 'EN-US', langFull: 'English', gender: 'Female' },
    { id: 9, name: 'Inna - Encouraging', desc: 'Direct and straightforward delivery.', lang: 'EN-US', langFull: 'English', gender: 'Female' },
  ];

  const filteredVoices = allVoices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) || voice.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = activeLanguage ? voice.lang === activeLanguage : true;
    return matchesSearch && matchesLang;
  });

  const selectedLangObj = languages.find(l => l.langCode === activeLanguage);

  return (
    <div>
      {/* Featured Voices */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Featured voices</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {/* Card 1 */}
        <div style={{ background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)', height: 160, borderRadius: 12, position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ background: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, width: 'fit-content', color: '#0f172a' }}>EN</div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Clint</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Sincere</div>
          </div>
          <div style={{ position: 'absolute', right: -15, bottom: -15, width: 110, height: 110, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={60} color="#fff" strokeWidth={1.5} />
          </div>
        </div>
        {/* Card 2 */}
        <div style={{ background: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)', height: 160, borderRadius: 12, position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ background: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, width: 'fit-content', color: '#0f172a' }}>EN</div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Liv</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Welcoming</div>
          </div>
          <div style={{ position: 'absolute', right: -15, bottom: -15, width: 110, height: 110, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={60} color="#fff" strokeWidth={1.5} />
          </div>
        </div>
        {/* Card 3 */}
        <div style={{ background: 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)', height: 160, borderRadius: 12, position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ background: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, width: 'fit-content', color: '#0f172a' }}>EN</div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Finlay</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Focused</div>
          </div>
          <div style={{ position: 'absolute', right: -15, bottom: -15, width: 110, height: 110, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={60} color="#fff" strokeWidth={1.5} />
          </div>
        </div>
        {/* Card 4 */}
        <div style={{ background: 'linear-gradient(135deg, #bef264 0%, #a3e635 100%)', height: 160, borderRadius: 12, position: 'relative', overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ background: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, width: 'fit-content', color: '#0f172a' }}>EN</div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Mira</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Radiant</div>
          </div>
          <div style={{ position: 'absolute', right: -15, bottom: -15, width: 110, height: 110, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={60} color="#fff" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Popular languages */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Popular languages</h3>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
        {languages.map((lang) => (
          <div 
            key={lang.name} 
            onClick={() => setActiveLanguage(activeLanguage === lang.langCode ? null : lang.langCode)}
            style={{ 
              flexShrink: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 16, 
              padding: '12px 20px', 
              borderRadius: 12, 
              border: activeLanguage === lang.langCode ? '2px solid #4f46e5' : '1px solid #e2e8f0', 
              background: activeLanguage === lang.langCode ? '#f8fafc' : '#fff', 
              cursor: 'pointer', 
              minWidth: 200, 
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 24 }}>{lang.flag}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{lang.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{lang.count} voices</div>
              </div>
            </div>
            <ChevronRight size={14} color={activeLanguage === lang.langCode ? '#4f46e5' : '#94a3b8'} />
          </div>
        ))}
      </div>

      {/* All voices */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>All voices</h3>
      
      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', padding: '8px 12px', borderRadius: 8, flex: 1, maxWidth: 300 }}>
          <Search size={14} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%' }} 
          />
        </div>
        
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: selectedLangObj ? '#eff6ff' : '#fff', border: selectedLangObj ? '1px solid #eff6ff' : '1px solid #e2e8f0', padding: '6px 12px', borderRadius: 8, color: selectedLangObj ? '#3b82f6' : '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          onClick={() => { if(selectedLangObj) setActiveLanguage(null); }}
        >
          <span style={{ fontSize: 14 }}>A</span> {selectedLangObj ? selectedLangObj.langFull : 'Language'} 
          {selectedLangObj && <X size={12} />}
        </div>

        {selectedLangObj?.region ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eff6ff', padding: '6px 12px', borderRadius: 8, color: '#3b82f6', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {selectedLangObj.region}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: 8, color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Region
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: 8, color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Gender
        </div>
      </div>

      {/* Voices Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filteredVoices.map(voice => (
          <div key={voice.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Play size={12} color="#64748b" fill="#64748b" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{voice.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{voice.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 4px', borderRadius: 4 }}>{voice.lang}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{voice.langFull}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0f172a' }}>
                <User size={12} /> {voice.gender}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
