"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '../../lib/auth-client';
import { 
  Home, Video, Trash, Mic, User, Settings, Sparkles, BookOpen, 
  Share2, Users, Bell, Search, Plus, Menu, X, PanelLeftClose, PanelLeftOpen, BarChart2, Megaphone, ChevronDown, Check, Loader2, FileText
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Workspace State
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Cached user for instant avatar display while session loads
  const [cachedUser, setCachedUser] = useState<{ name: string; email: string; image?: string } | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  // Load cached user from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('cached-user');
      if (cached) setCachedUser(JSON.parse(cached));
    } catch {}
    
    fetchNotifications();
    fetchWorkspaces();
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/settings/preferences');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.preferences) {
          const { dashboardTheme, highContrastMode } = data.preferences;
          if (dashboardTheme === 'light') {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('dashboard-theme', 'light');
          } else {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('dashboard-theme', 'dark');
          }
          if (highContrastMode) {
            document.documentElement.classList.add('high-contrast');
            localStorage.setItem('high-contrast', 'true');
          } else {
            document.documentElement.classList.remove('high-contrast');
            localStorage.setItem('high-contrast', 'false');
          }
        }
      }
    } catch (err) {
      console.error("Failed to load preferences globally", err);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      const data = await res.json();
      if (data.success && data.workspaces?.length > 0) {
        setWorkspaces(data.workspaces);
        
        // Check for saved active workspace
        const savedWsId = localStorage.getItem('active-workspace-id');
        const savedWs = savedWsId ? data.workspaces.find((w: any) => w.id === savedWsId) : null;
        setActiveWorkspace(savedWs || data.workspaces[0]);
      }
    } catch (err) {
      console.error("Failed to load workspaces", err);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    setIsCreatingWorkspace(true);
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorkspaceName })
      });
      const data = await res.json();
      if (data.success) {
        await fetchWorkspaces();
        // Set the new one as active
        const newWs = workspaces.find(w => w.id === data.workspaceId) || { id: data.workspaceId, name: newWorkspaceName, plan: 'FREE' };
        // Actually, we'd need to fetch first then find it. 
        // fetchWorkspaces will update the list, we can just let it be or manually set.
        setIsCreateWorkspaceModalOpen(false);
        setNewWorkspaceName('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    // Optimistic UI update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  // Update cache when fresh session arrives
  useEffect(() => {
    if (session?.user) {
      const userData = { name: session.user.name, email: session.user.email, image: session.user.image || undefined };
      setCachedUser(userData);
      try { localStorage.setItem('cached-user', JSON.stringify(userData)); } catch {}
    }
  }, [session]);

  const handleLogout = async () => {
    try { localStorage.removeItem('cached-user'); } catch {}
    router.push('/');
    authClient.signOut();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
    <div className="home-layout">
      {/* LEFT SIDEBAR */}
      <div 
        className={`home-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '40px' : '175px',
          transition: 'width 0.2s ease-in-out',
          position: 'relative',
          overflow: 'visible',
          paddingBottom: '24px'
        }}
      >
        {!isCollapsed ? (
          <div style={{ position: 'relative', margin: '0 12px 12px' }}>
            <div 
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '52px',
                padding: '0 12px',
                background: isWorkspaceDropdownOpen ? '#f1f5f9' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => { if (!isWorkspaceDropdownOpen) e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (!isWorkspaceDropdownOpen) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', flexShrink: 0 }}>
                  {activeWorkspace?.name?.charAt(0).toUpperCase() || 'W'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                    {activeWorkspace?.name || 'Workspace'}
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{activeWorkspace?.plan || 'FREE'} PLAN</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChevronDown size={16} color="#64748b" style={{ transform: isWorkspaceDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                <button 
                  className="mobile-close-btn" 
                  onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(false); }}
                  style={{ display: isMobileMenuOpen ? 'flex' : 'none' }}
                >
                  <X size={20} color="#4b5563" />
                </button>
              </div>
            </div>

            {isWorkspaceDropdownOpen && (
              <>
                <div 
                  onClick={() => setIsWorkspaceDropdownOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }} 
                />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '100%',
                  minWidth: '220px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  zIndex: 100,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Workspaces
                  </div>
                  
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {workspaces.map(ws => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          setActiveWorkspace(ws);
                          localStorage.setItem('active-workspace-id', ws.id);
                          setIsWorkspaceDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '10px 12px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 24, height: 24, background: '#f1f5f9', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12, fontWeight: 'bold' }}>
                            {ws.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{ws.name}</span>
                        </div>
                        {activeWorkspace?.id === ws.id && <Check size={16} color="#3b82f6" />}
                      </button>
                    ))}
                  </div>

                  <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0' }} />
                  
                  <button
                    onClick={() => {
                      setIsWorkspaceDropdownOpen(false);
                      setIsCreateWorkspaceModalOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '12px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#3b82f6',
                      fontSize: 13,
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Plus size={16} />
                    Create Workspace
                  </button>
                </div>
              </>
            )}
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
            <div style={{ width: 26, height: 26, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', flexShrink: 0 }}>
              {activeWorkspace?.name?.charAt(0).toUpperCase() || 'W'}
            </div>
          </div>
        )}

        <NavItem href="/dashboard" icon={Home} label="Home" />
        <NavItem href="/content" icon={FileText} label="Content" />
        <NavItem href="/analytics" icon={BarChart2} label="Analytics" />

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
          <NavItem href="/avatars" icon={Users} label="Avatars" />
          <NavItem href="/voices" icon={Mic} label="Voices" />
          <NavItem href="/socials" icon={Share2} label="Socials" />
          <NavItem href="/library" icon={BookOpen} label="Library" />
          <NavItem href="/trash" icon={Trash} label="Trash" />
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

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', outline: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ position: 'relative' }}>
                  <Bell size={20} color="#64748b" />
                  {unreadCount > 0 && (
                    <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #ffffff' }} />
                  )}
                </div>
              </button>

              {isNotificationDropdownOpen && (
                <>
                  <div onClick={() => setIsNotificationDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(15, 23, 42, 0.2)', backdropFilter: 'blur(2px)', transition: 'opacity 0.3s' }} />
                  <div style={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '380px',
                    background: '#ffffff',
                    boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 0.3s ease-out forwards'
                  }}>
                    <style>{`
                      @keyframes slideInRight {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                      }
                    `}</style>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '18px' }}>Notifications</div>
                      <button onClick={() => setIsNotificationDropdownOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Recent</div>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllAsRead} style={{ background: 'transparent', border: 'none', fontSize: '13px', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
                          You have no notifications.
                        </div>
                      ) : (
                        notifications.map(notif => {
                          const isUnread = !notif.read;
                          return (
                            <div 
                              key={notif.id}
                              onClick={(e) => isUnread ? handleMarkAsRead(notif.id, e) : null}
                              style={{ 
                                padding: '16px 24px', 
                                borderBottom: '1px solid #f1f5f9', 
                                background: isUnread ? '#eff6ff' : 'transparent', 
                                display: 'flex', 
                                gap: '16px', 
                                cursor: isUnread ? 'pointer' : 'default',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => { if (!isUnread) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                              onMouseLeave={(e) => { if (!isUnread) e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                              <div style={{ 
                                width: 40, height: 40, 
                                background: isUnread ? '#bfdbfe' : '#f1f5f9', 
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, 
                                color: isUnread ? '#2563eb' : '#64748b' 
                              }}>
                                {notif.type === 'video' ? <Video size={20} /> : notif.type === 'avatar' ? <User size={20} /> : <Sparkles size={20} />}
                              </div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: isUnread ? 600 : 500, color: '#0f172a', marginBottom: '4px' }}>{notif.title}</div>
                                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>{notif.message}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: 500 }}>
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            {(() => {
              const displayUser = session?.user || cachedUser;
              if (isSessionLoading && !cachedUser) {
                return <div style={{ width: 32, height: 32, background: 'linear-gradient(110deg, #e2e8f0 30%, #f1f5f9 50%, #e2e8f0 70%)', backgroundSize: '200% 100%', borderRadius: '50%', animation: 'shimmer 1.5s infinite' }} />;
              }
              if (!displayUser) {
                return <div style={{ width: 32, height: 32, background: '#d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>U</div>;
              }
              return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    background: '#4f46e5', 
                    color: '#fff', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 13, 
                    fontWeight: 600,
                    overflow: 'hidden'
                  }}>
                    {displayUser.image && !avatarError ? (
                       <img 
                         src={displayUser.image} 
                         alt={displayUser.name} 
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                         referrerPolicy="no-referrer"
                         onError={() => setAvatarError(true)}
                       />
                    ) : (
                       <User size={18} strokeWidth={2.5} />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    <div 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'transparent' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '40px',
                      width: '240px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      zIndex: 999,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ padding: '6px 8px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {displayUser.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {displayUser.email}
                        </div>
                      </div>
                      
                      <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#334155',
                          padding: '8px 10px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background-color 0.15s ease',
                          textDecoration: 'none'
                        }}
                      >
                        <Settings size={15} color="#475569" />
                        Account Settings
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          padding: '8px 10px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Trash size={15} />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
              );
            })()}
          </div>
        </div>

        {children}

      </div>
      {/* Create Workspace Modal */}
      {isCreateWorkspaceModalOpen && (
        <>
          <div 
            onClick={() => setIsCreateWorkspaceModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 99998, transition: 'opacity 0.2s' }} 
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '90%',
            maxWidth: '400px',
            zIndex: 99999,
            padding: '32px',
            animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Create Workspace</h2>
              <button 
                onClick={() => setIsCreateWorkspaceModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                Workspace Name
              </label>
              <input 
                type="text" 
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g. Acme Corp"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setIsCreateWorkspaceModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName.trim() || isCreatingWorkspace}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: (!newWorkspaceName.trim() || isCreatingWorkspace) ? '#94a3b8' : '#0f172a',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: (!newWorkspaceName.trim() || isCreatingWorkspace) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {isCreatingWorkspace && <Loader2 size={16} className="spin" />}
                {isCreatingWorkspace ? 'Creating...' : 'Create Workspace'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
