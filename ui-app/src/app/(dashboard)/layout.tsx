"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Video, Trash, Mic, User, Settings, Sparkles, BookOpen, 
  Share2, Users, Bell, Search, Plus, Menu, X, PanelLeftClose, PanelLeftOpen, BarChart2
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem('sidebar-collapsed', String(nextVal));
  };

  const getNavItemStyle = (active: boolean) => {
    if (isCollapsed) {
      return {
        width: '28px',
        height: '28px',
        padding: 0,
        margin: '2px auto',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        outline: 'none',
        background: active ? '#ffffff' : 'transparent',
        boxShadow: 'none',
        border: 'none',
        position: 'relative' as const
      };
    }
    return {
      justifyContent: 'flex-start',
      padding: '8px 12px',
      margin: '2px 12px',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      outline: 'none',
      boxShadow: 'none',
      border: 'none'
    };
  };

  const NavItem = ({ href, icon: Icon, label, badge, badgeColor }: { href: string, icon: any, label: string, badge?: string, badgeColor?: string }) => {
    const active = isActive(href);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <Link 
        href={href} 
        style={{ 
          textDecoration: 'none', 
          display: isCollapsed ? 'flex' : 'block', 
          justifyContent: 'center', 
          width: '100%',
          outline: 'none',
          boxShadow: 'none',
          position: 'relative'
        }}
      >
        <div 
          className={`home-nav-item ${active ? 'active' : ''}`}
          style={getNavItemStyle(active)}
          onMouseEnter={(e) => {
            setShowTooltip(true);
            if (isCollapsed && !active) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            setShowTooltip(false);
            if (isCollapsed && !active) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {isCollapsed ? (
            <Icon size={18} style={{ flexShrink: 0 }} />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
                <Icon size={18} style={{ flexShrink: 0 }} /> 
                {label}
              </div>
              {badge && <span style={{ fontSize: 9, color: badgeColor, fontWeight: 700, whiteSpace: 'nowrap' }}>{badge}</span>}
            </>
          )}

          {/* Premium Floating Tooltip */}
          {isCollapsed && showTooltip && (
            <div style={{
              position: 'absolute',
              left: '38px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#0f172a',
              color: '#ffffff',
              padding: '5px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 100,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}>
              {label}
              {/* Tooltip Arrow */}
              <div style={{
                position: 'absolute',
                left: '-3px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                width: '6px',
                height: '6px',
                background: '#0f172a'
              }} />
            </div>
          )}
        </div>
      </Link>
    );
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="home-layout light-theme">
      {/* LEFT SIDEBAR */}
      <div 
        className={`home-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '40px' : '200px',
          transition: 'width 0.2s ease-in-out',
          position: 'relative',
          overflow: 'visible',
          paddingBottom: '24px'
        }}
      >
        {!isCollapsed ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 10,
            height: '60px',
            padding: '0 20px',
            marginBottom: 12
          }}>
            <div style={{ width: 26, height: 26, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', flexShrink: 0 }}>W</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>Workspace</span>
              <span style={{ fontSize: 9, background: '#f1f5f9', color: '#64748b', padding: '2px 5px', borderRadius: 4, fontWeight: 600 }}>FREE</span>
            </div>

            <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} color="#4b5563" />
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            height: '60px',
            padding: '0 6px',
            marginBottom: 12,
            width: '100%'
          }}>
            <div style={{ width: 26, height: 26, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', flexShrink: 0 }}>W</div>
          </div>
        )}

        <NavItem href="/dashboard" icon={Home} label="Home" />

        {/* Videos Section */}
        <div className="home-sidebar-section" style={{ marginTop: isCollapsed ? 8 : 16, marginBottom: isCollapsed ? 4 : 16, width: '100%' }}>
          {!isCollapsed ? (
            <div className="home-sidebar-title">Videos</div>
          ) : (
            <div style={{ height: 1, background: '#f1f5f9', margin: '6px 6px' }} />
          )}
          <NavItem href="/videos" icon={Video} label="Videos" />
        </div>

        {/* Assets Section */}
        <div className="home-sidebar-section" style={{ marginBottom: isCollapsed ? 4 : 16, width: '100%' }}>
          {!isCollapsed ? (
            <div className="home-sidebar-title">Assets</div>
          ) : (
            <div style={{ height: 1, background: '#f1f5f9', margin: '6px 6px' }} />
          )}
          <NavItem href="/library" icon={BookOpen} label="Library" />
          <NavItem href="/socials" icon={Share2} label="Socials" badge="UPGRADE" badgeColor="#10b981" />
          <NavItem href="/avatars" icon={Users} label="Avatars" />
          <NavItem href="/voices" icon={Mic} label="Voices" />
          <NavItem href="/trash" icon={Trash} label="Trash" />
        </div>

        {/* Tools Section */}
        <div className="home-sidebar-section" style={{ marginBottom: isCollapsed ? 4 : 16, width: '100%' }}>
          {!isCollapsed ? (
            <div className="home-sidebar-title">Tools</div>
          ) : (
            <div style={{ height: 1, background: '#f1f5f9', margin: '6px 6px' }} />
          )}
          <NavItem href="/personalization" icon={BarChart2} label="Analytics" />
          <NavItem href="/ai-playground" icon={Sparkles} label="AI Playground" badge="BETA" badgeColor="#3b82f6" />
        </div>

        {/* Collapsible Sidebar Button Container at Bottom */}
        <div style={{ 
          marginTop: 'auto',
          padding: isCollapsed ? '12px 6px' : '12px 12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          width: '100%'
        }}>
          <button 
            onClick={toggleCollapse}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#64748b',
              width: isCollapsed ? 28 : 'auto',
              height: 28,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: 10,
              padding: isCollapsed ? 0 : '0 12px',
              transition: 'background-color 0.2s',
              outline: 'none',
              boxShadow: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <>
                <PanelLeftClose size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>Collapse</span>
              </>
            )}
          </button>
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
