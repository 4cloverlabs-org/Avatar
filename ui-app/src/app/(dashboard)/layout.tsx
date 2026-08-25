"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Video, Trash, Mic, User, Settings, Sparkles, BookOpen, 
  Share2, Users, Bell, Search, Plus, Menu, X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="home-layout light-theme">
      {/* LEFT SIDEBAR */}
      <div className={`home-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ padding: '8px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold' }}>W</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>Workspace</span>
              <span style={{ fontSize: 9, background: '#f1f5f9', color: '#64748b', padding: '2px 5px', borderRadius: 4, fontWeight: 600 }}>FREE</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} color="#4b5563" />
          </button>
        </div>

        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div className={`home-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <Home size={16} /> Home
          </div>
        </Link>

        <div className="home-sidebar-section" style={{ marginTop: 16 }}>
          <div className="home-sidebar-title">Videos</div>
          <Link href="/videos" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/videos') ? 'active' : ''}`}><Video size={16} /> Videos</div>
          </Link>
        </div>

        <div className="home-sidebar-section">
          <div className="home-sidebar-title">Assets</div>
          <Link href="/library" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/library') ? 'active' : ''}`}><BookOpen size={16} /> Library</div>
          </Link>
          <Link href="/socials" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/socials') ? 'active' : ''}`} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Share2 size={16} /> Socials</div>
              <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700 }}>UPGRADE</span>
            </div>
          </Link>
          <Link href="/avatars" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/avatars') ? 'active' : ''}`}><Users size={16} /> Avatars</div>
          </Link>
          <Link href="/voices" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/voices') ? 'active' : ''}`}><Mic size={16} /> Voices</div>
          </Link>
          <Link href="/trash" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/trash') ? 'active' : ''}`}><Trash size={16} /> Trash</div>
          </Link>
        </div>

        <div className="home-sidebar-section">
          <div className="home-sidebar-title">Tools</div>
          <Link href="/dubbing" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/dubbing') ? 'active' : ''}`}><Mic size={16} /> Dubbing</div>
          </Link>
          <Link href="/personalization" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/personalization') ? 'active' : ''}`}><Settings size={16} /> Personalization</div>
          </Link>
          <Link href="/ai-playground" style={{ textDecoration: 'none' }}>
            <div className={`home-nav-item ${isActive('/ai-playground') ? 'active' : ''}`} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Sparkles size={16} /> AI Playground</div>
              <span style={{ fontSize: 9, color: '#3b82f6', fontWeight: 700 }}>BETA</span>
            </div>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
      <div className="home-main">
        {/* HEADER */}
        <div className="home-header">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} color="#0f172a" />
          </button>
          <div className="home-search">
            <Search size={16} />
            <input type="text" placeholder="Search" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <button className="home-pill" style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px' }} onClick={() => router.push('/studio')}>
              Create
            </button>
            <Bell size={20} color="#6b7280" />
            <div style={{ width: 32, height: 32, background: '#d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>K</div>
          </div>
        </div>

        {children}

      </div>
    </div>
  );
}
