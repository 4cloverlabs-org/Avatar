"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Plus, Upload, Trash, Zap, Link as LinkIcon, 
  Download, RefreshCw, CheckCircle, AlertCircle, FileSpreadsheet, 
  Play, Users, Settings, BarChart, HelpCircle, Eye, Info
} from 'lucide-react';

interface Avatar {
  id: string;
  name: string;
  status: string;
  progress: number;
}

interface Lead {
  id: string;
  first_name: string;
  company: string;
  email: string;
  status: 'Idle' | 'Generating' | 'Ready' | 'Failed';
  videoUrl?: string;
}

interface Campaign {
  id: string;
  name: string;
  totalGenerated: number;
  viewRate: number;
  deliveryRate: number;
  ctr: number;
}

const mockCampaigns: Campaign[] = [
  { id: 'all', name: 'All Campaigns', totalGenerated: 148, viewRate: 68.4, deliveryRate: 98.2, ctr: 24.5 },
  { id: 'q3-outreach', name: 'Q3 Sales Cold Outreach', totalGenerated: 85, viewRate: 72.1, deliveryRate: 99.0, ctr: 28.3 },
  { id: 'welcome-series', name: 'New Customer Welcome', totalGenerated: 42, viewRate: 64.8, deliveryRate: 97.6, ctr: 20.1 },
  { id: 'winback', name: 'Win-back Reactivation', totalGenerated: 21, viewRate: 59.2, deliveryRate: 96.0, ctr: 16.8 }
];

export default function PersonalizationPage() {
  // Avatars loaded from API
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');

  // Selected Campaign for Analytics
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(mockCampaigns[0]);

  // Lead List state
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', first_name: 'Sarah', company: 'Google', email: 'sarah.j@google.com', status: 'Idle' },
    { id: '2', first_name: 'Alex', company: 'Meta', email: 'alex.m@meta.com', status: 'Idle' },
    { id: '3', first_name: 'David', company: 'Stripe', email: 'd.webb@stripe.com', status: 'Idle' }
  ]);

  // Script Template state
  const [scriptTemplate, setScriptTemplate] = useState<string>(
    "Hi {{first_name}}, I saw what your team is building at {{company}} and wanted to show you how personalized talking avatars can improve your conversion rates!"
  );
  
  // Selected Lead for Live Preview
  const [previewLeadIndex, setPreviewLeadIndex] = useState<number>(0);
  const [selectedVoice, setSelectedVoice] = useState<string>('Bruce - Full');
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

  // Generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Generated Videos gallery
  const [generatedVideos, setGeneratedVideos] = useState<{
    id: string;
    leadName: string;
    company: string;
    videoUrl: string;
    script: string;
  }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scriptAreaRef = useRef<HTMLTextAreaElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Fetch avatars on mount
  useEffect(() => {
    async function loadAvatars() {
      try {
        const res = await fetch('/api/avatars');
        const data = await res.json();
        if (data.success && data.avatars && data.avatars.length > 0) {
          setAvatars(data.avatars);
          setSelectedAvatarId(data.avatars[0].id);
        } else {
          // Provide fallback avatars if API returns empty
          const fallback = [
            { id: '236a1dcd-f214-4cb3-8125-a6178a5682e7', name: 'Bruce (Default)', status: 'ready', progress: 100 },
            { id: 'avatar-clara', name: 'Clara (Custom)', status: 'ready', progress: 100 },
            { id: 'avatar-marcus', name: 'Marcus (Narrator)', status: 'ready', progress: 100 }
          ];
          setAvatars(fallback);
          setSelectedAvatarId(fallback[0].id);
        }
      } catch (err) {
        console.error("Failed to load avatars, using fallback:", err);
        const fallback = [
          { id: '236a1dcd-f214-4cb3-8125-a6178a5682e7', name: 'Bruce (Default)', status: 'ready', progress: 100 },
          { id: 'avatar-clara', name: 'Clara (Custom)', status: 'ready', progress: 100 }
        ];
        setAvatars(fallback);
        setSelectedAvatarId(fallback[0].id);
      } finally {
        setLoadingAvatars(false);
      }
    }
    loadAvatars();
  }, []);

  // Scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Insert variables into template script
  const insertVariable = (variable: string) => {
    const textarea = scriptAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const inserted = `{{${variable}}}`;
    const newText = text.substring(0, start) + inserted + text.substring(end);
    
    setScriptTemplate(newText);
    
    // Reset selection cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + inserted.length, start + inserted.length);
    }, 0);
  };

  // Get preview script text
  const getRenderedScript = (leadIndex: number) => {
    const lead = leads[leadIndex];
    if (!lead) return scriptTemplate;
    return scriptTemplate
      .replaceAll('{{first_name}}', lead.first_name || '[First Name]')
      .replaceAll('{{company}}', lead.company || '[Company]')
      .replaceAll('{{email}}', lead.email || '[Email]');
  };

  // CSV Drag/Drop & Parse
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        alert("CSV is empty or missing data rows");
        return;
      }

      // Read headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      
      const firstNameIndex = headers.findIndex(h => h.includes('first') || h.includes('name'));
      const companyIndex = headers.findIndex(h => h.includes('company') || h.includes('org'));
      const emailIndex = headers.findIndex(h => h.includes('email') || h.includes('mail'));

      const parsedLeads: Lead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map(c => c.trim().replace(/['"]/g, ''));
        if (cells.length < headers.length) continue;

        parsedLeads.push({
          id: `csv-${i}-${Date.now()}`,
          first_name: firstNameIndex !== -1 ? cells[firstNameIndex] : cells[0] || 'Prospect',
          company: companyIndex !== -1 ? cells[companyIndex] : cells[1] || 'Company',
          email: emailIndex !== -1 ? cells[emailIndex] : cells[2] || 'support@domain.com',
          status: 'Idle'
        });
      }

      if (parsedLeads.length > 0) {
        setLeads(parsedLeads);
        setPreviewLeadIndex(0);
        addLog(`Successfully parsed CSV: Loaded ${parsedLeads.length} leads.`, 'success');
      }
    };
    reader.readAsText(file);
  };

  // Add line to Console Log
  const addLog = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    let prefix = `[${timestamp}] `;
    if (type === 'success') prefix += '✅ ';
    if (type === 'warn') prefix += '⚠️ ';
    setConsoleLogs(prev => [...prev, `${prefix}${message}`]);
  };

  // Edit lead cell
  const handleEditLead = (id: string, key: keyof Lead, value: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        return { ...lead, [key]: value };
      }
      return lead;
    }));
  };

  // Add new lead row
  const addLeadRow = () => {
    const newLead: Lead = {
      id: Date.now().toString(),
      first_name: 'John',
      company: 'Acme Corp',
      email: 'john@acme.com',
      status: 'Idle'
    };
    setLeads(prev => [...prev, newLead]);
  };

  // Delete lead row
  const removeLeadRow = (id: string) => {
    if (leads.length <= 1) {
      alert("You need at least one lead row.");
      return;
    }
    setLeads(prev => prev.filter(l => l.id !== id));
    if (previewLeadIndex >= leads.length - 1) {
      setPreviewLeadIndex(0);
    }
  };

  // Bulk Generation Execution
  const triggerBulkGeneration = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setCurrentProgress(0);
    setShowConsole(true);
    setConsoleLogs([]);

    addLog(`Starting Personalization Campaign generation with selected Avatar: ${avatars.find(a => a.id === selectedAvatarId)?.name || 'Custom'}`, 'info');
    addLog(`Processing ${leads.length} lead videos using voice cloning profile...`, 'info');

    // Reset lead statuses
    setLeads(prev => prev.map(l => ({ ...l, status: 'Idle' })));

    for (let index = 0; index < leads.length; index++) {
      const lead = leads[index];
      setLeads(prev => prev.map((l, idx) => idx === index ? { ...l, status: 'Generating' } : l));
      
      addLog(`[${index + 1}/${leads.length}] Synthesizing speech for ${lead.first_name} (${lead.company})...`, 'info');
      
      // Step 1: TTS Synthesis simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      addLog(`Generated personalized audio track for script: "${getRenderedScript(index).substring(0, 40)}..."`, 'success');

      // Step 2: Avatar Animation synthesis
      addLog(`[${index + 1}/${leads.length}] Syncing video face to audio timeline...`, 'info');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Finalize video
      const simulatedVideoUrl = `/results/output/personalized_${lead.first_name.toLowerCase()}_${Date.now()}.mp4`;
      
      setLeads(prev => prev.map((l, idx) => idx === index ? { ...l, status: 'Ready', videoUrl: simulatedVideoUrl } : l));
      
      setGeneratedVideos(prev => [
        {
          id: `gen-${index}-${Date.now()}`,
          leadName: lead.first_name,
          company: lead.company,
          videoUrl: simulatedVideoUrl,
          script: getRenderedScript(index)
        },
        ...prev
      ]);

      addLog(`Successfully animated talking avatar for ${lead.first_name}. Output stabilized!`, 'success');
      setCurrentProgress(Math.round(((index + 1) / leads.length) * 100));
    }

    addLog("Campaign Generation Complete! All personalized outputs generated successfully.", 'success');
    setIsGenerating(false);
  };

  const currentPreviewLead = leads[previewLeadIndex] || leads[0];

  return (
    <div className="home-content">
      <div className="pers-container">
        
        {/* HEADER PANEL */}
        <div className="pers-header-panel">
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={24} color="#4f46e5" /> Personalized Video Campaigns
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Generate custom talking-head videos in bulk for sales outreach, email marketing, or customer success.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Campaign:</span>
            <select 
              value={selectedCampaign.id} 
              onChange={(e) => {
                const camp = mockCampaigns.find(c => c.id === e.target.value);
                if (camp) setSelectedCampaign(camp);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--panel-border)',
                background: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {mockCampaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="pers-stats-grid">
          {/* Card 1 */}
          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
              <Zap size={22} color="#4f46e5" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Videos Generated</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{selectedCampaign.totalGenerated}</div>
            </div>
          </div>

          {/* Card 2 - Ring Chart SVG */}
          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#ecfdf5' }}>
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="4"></circle>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="4" 
                        strokeDasharray={`${selectedCampaign.viewRate * 0.94} 100`} 
                        strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Avg View Rate</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{selectedCampaign.viewRate}%</div>
            </div>
          </div>

          {/* Card 3 - Sparkline Bar SVG */}
          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#eff6ff' }}>
              <svg width="40" height="24" style={{ marginTop: 4 }}>
                <rect x="0" y="8" width="6" height="16" rx="2" fill="#93c5fd"></rect>
                <rect x="10" y="4" width="6" height="20" rx="2" fill="#93c5fd"></rect>
                <rect x="20" y="10" width="6" height="14" rx="2" fill="#93c5fd"></rect>
                <rect x="30" y="0" width="6" height="24" rx="2" fill="#3b82f6"></rect>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Delivery Success</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{selectedCampaign.deliveryRate}%</div>
            </div>
          </div>

          {/* Card 4 - Trend indicator */}
          <div className="pers-stat-card">
            <div className="pers-stat-icon-wrapper" style={{ background: '#fdf2f8' }}>
              <BarChart size={22} color="#db2777" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Outreach CTR</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{selectedCampaign.ctr}%</div>
            </div>
          </div>
        </div>

        {/* WORKSPACE LAYOUT */}
        <div className="pers-workspace-layout">
          
          {/* LEFT COLUMN: BUILDER */}
          <div className="pers-main-workspace">
            
            {/* STEP 1: SELECT AVATAR & VOICE */}
            <div className="pers-card">
              <div className="pers-card-title">
                <span className="pers-step-badge">Step 1</span> Select Avatar & Clone Voice
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                
                {/* Avatar Selection Column */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                    Actor Avatar
                  </label>
                  {loadingAvatars ? (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <RefreshCw className="pers-anim-pulse" size={24} style={{ marginRight: 8 }} /> Loading Avatars...
                    </div>
                  ) : (
                    <div className="pers-avatar-grid">
                      {avatars.map(av => (
                        <div 
                          key={av.id} 
                          className={`pers-avatar-item ${selectedAvatarId === av.id ? 'selected' : ''}`}
                          onClick={() => setSelectedAvatarId(av.id)}
                        >
                          <div className="pers-avatar-thumb">
                            <Users size={24} color="#94a3b8" />
                            <div className="pers-avatar-play-overlay">
                              <Play size={16} color="#fff" fill="#fff" />
                            </div>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {av.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Selection Column */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                    Voice Identity
                  </label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--panel-border)',
                        background: '#ffffff',
                        fontSize: 13,
                        color: '#1e293b',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option>Bruce - Full (Standard)</option>
                      <option>Carlos - Candid (Narrative)</option>
                      <option>Carol - Candid (Conversational)</option>
                      <option>Liv - Welcoming (Customer Success)</option>
                    </select>

                    <div className="pers-dropzone" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={20} color="#64748b" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                        {voiceFile ? voiceFile.name : 'Clone custom voice profile'}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                        Upload reference audio (.wav or .mp3)
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
                        style={{ display: 'none' }}
                        accept=".wav,.mp3"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* STEP 2: SCRIPT BUILDER */}
            <div className="pers-card">
              <div className="pers-card-title">
                <span className="pers-step-badge">Step 2</span> Write Dynamic Script Template
              </div>
              
              <div className="pers-script-area-wrapper">
                <textarea
                  ref={scriptAreaRef}
                  value={scriptTemplate}
                  onChange={(e) => setScriptTemplate(e.target.value)}
                  className="pers-script-area"
                  placeholder="Hello {{first_name}}, I saw that you work at {{company}}..."
                />
                <div className="pers-script-toolbar">
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', alignSelf: 'center', marginRight: 4 }}>
                    Insert Tag:
                  </span>
                  <div className="pers-variable-tag" onClick={() => insertVariable('first_name')}>
                    {"{"} first_name {"}"}
                  </div>
                  <div className="pers-variable-tag" onClick={() => insertVariable('company')}>
                    {"{"} company {"}"}
                  </div>
                  <div className="pers-variable-tag" onClick={() => insertVariable('email')}>
                    {"{"} email {"}"}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12, background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
                <Info size={16} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                  Ensure your templates flow naturally when variables are filled. We will synthesize fresh speech for every prospect on your list automatically.
                </div>
              </div>
            </div>

            {/* STEP 3: LEAD LIST CSV & TABLE */}
            <div className="pers-card">
              <div className="pers-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="pers-step-badge">Step 3</span> Configure Prospect Database
                </span>
                <button 
                  onClick={() => document.getElementById('csv-file-input')?.click()}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s'
                  }}
                >
                  <FileSpreadsheet size={14} color="#10b981" /> Import CSV
                </button>
                <input 
                  type="file" 
                  id="csv-file-input" 
                  onChange={handleCSVUpload}
                  style={{ display: 'none' }}
                  accept=".csv"
                />
              </div>

              {/* Table wrapper */}
              <div className="pers-table-wrapper" style={{ marginBottom: 16 }}>
                <table className="pers-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Preview</th>
                      <th>First Name</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th style={{ width: '50px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => (
                      <tr 
                        key={lead.id} 
                        style={{ 
                          background: previewLeadIndex === idx ? '#f8fafc' : 'transparent',
                          borderLeft: previewLeadIndex === idx ? '3px solid #4f46e5' : '3px solid transparent'
                        }}
                      >
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="radio" 
                            name="preview-lead" 
                            checked={previewLeadIndex === idx}
                            onChange={() => setPreviewLeadIndex(idx)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <input 
                            value={lead.first_name} 
                            onChange={(e) => handleEditLead(lead.id, 'first_name', e.target.value)}
                            className="pers-table-input"
                          />
                        </td>
                        <td>
                          <input 
                            value={lead.company} 
                            onChange={(e) => handleEditLead(lead.id, 'company', e.target.value)}
                            className="pers-table-input"
                          />
                        </td>
                        <td>
                          <input 
                            value={lead.email} 
                            onChange={(e) => handleEditLead(lead.id, 'email', e.target.value)}
                            className="pers-table-input"
                          />
                        </td>
                        <td>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: lead.status === 'Ready' ? '#dcfce7' : 
                                        lead.status === 'Generating' ? '#dbeafe' : '#f1f5f9',
                            color: lead.status === 'Ready' ? '#15803d' : 
                                   lead.status === 'Generating' ? '#1d4ed8' : '#475569'
                          }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => removeLeadRow(lead.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#94a3b8' }}
                          >
                            <Trash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={addLeadRow}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Plus size={14} /> Add Row
                </button>

                <button 
                  onClick={triggerBulkGeneration}
                  disabled={isGenerating}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginLeft: 'auto'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="pers-anim-pulse" size={14} /> Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={14} /> Generate Campaign Videos
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LIVE CONSOLE */}
            {showConsole && (
              <div className="pers-card">
                <div className="pers-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Live System Console</span>
                  <button 
                    onClick={() => setShowConsole(false)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer' }}
                  >
                    Hide Console
                  </button>
                </div>
                
                {isGenerating && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      <span>Batch Synthesis progress</span>
                      <span>{currentProgress}%</span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${currentProgress}%`, height: '100%', background: '#4f46e5', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>
                )}

                <div className="pers-console">
                  {consoleLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`pers-console-line ${
                        log.includes('✅') ? 'success' : 
                        log.includes('⚠️') ? 'warn' : 'info'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </div>
              </div>
            )}

            {/* GENERATED CAMPAIGN GALLERY */}
            {generatedVideos.length > 0 && (
              <div className="pers-card">
                <div className="pers-card-title">Generated Personalized Videos ({generatedVideos.length})</div>
                <div className="pers-video-grid">
                  {generatedVideos.map(video => (
                    <div key={video.id} className="pers-video-card">
                      <div className="pers-video-player">
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', background: '#1e293b', minHeight: '120px' }}>
                          <Play size={32} fill="#fff" style={{ cursor: 'pointer' }} />
                        </div>
                      </div>
                      <div className="pers-video-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{video.leadName}</span>
                          <span className="pers-badge success">{video.company}</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {video.script}
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button style={{ flex: 1, padding: '6px', fontSize: 11, fontWeight: 600, background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#334155' }}>
                            <LinkIcon size={12} /> Share
                          </button>
                          <button style={{ flex: 1, padding: '6px', fontSize: 11, fontWeight: 600, background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#334155' }}>
                            <Download size={12} /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: PREVIEW & INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div className="pers-sidebar-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={16} color="#64748b" /> Live Content Preview
              </h3>
              
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Showing rendering preview for lead row: <strong style={{ color: '#0f172a' }}>{currentPreviewLead?.first_name || 'Sarah'}</strong>
              </div>

              <div className="pers-preview-box">
                "{getRenderedScript(previewLeadIndex)}"
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid var(--panel-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Variable count:</span>
                  <span style={{ fontWeight: 600 }}>{scriptTemplate.match(/\{\{([^}]+)\}\}/g)?.length || 0} items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Synthesized word count:</span>
                  <span style={{ fontWeight: 600 }}>{getRenderedScript(previewLeadIndex).split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>

            <div className="pers-sidebar-card" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: 'none' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#312e81', margin: 0 }}>Campaign Automation</h3>
              <p style={{ fontSize: 12, color: '#4338ca', lineHeight: 1.5, margin: 0 }}>
                Deliver personalized video landings dynamically via email. When a user clicks, we resolve variables and play their custom recording instantly.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#4f46e5', cursor: 'pointer', marginTop: 4 }}>
                Setup CRM integration <Plus size={14} />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
