'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Grid,
  BarChart3, 
  Users, 
  Settings, 
  Shield,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
  { icon: Grid, label: 'Catalogue', href: '/catalog' },
  { icon: BarChart3, label: 'Analyses', href: '/analytics' },
  { icon: Lightbulb, label: 'Insights IA', href: '/insights' },
  { icon: ShieldAlert, label: 'Administration', href: '/admin/users', role: 'Admin' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

export default function Sidebar({ 
  collapsed, 
  onToggle,
  isMobileOpen,
  onCloseMobile
}: { 
  collapsed: boolean, 
  onToggle: () => void,
  isMobileOpen?: boolean,
  onCloseMobile?: () => void
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => {
    if (item.role === 'Admin') return user?.role === 'Admin';
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}

      <aside style={{
        width: collapsed ? '80px' : '260px',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        // Desktop override for transform
        ...(typeof window !== 'undefined' && window.innerWidth > 1024 ? {
          position: 'sticky',
          transform: 'none',
        } : {})
      }}
      className="sidebar-component"
      >
        {/* Toggle Button - Hidden on mobile */}
        <button 
          onClick={onToggle}
          style={{
            position: 'absolute',
            right: '-15px',
            top: '25px',
            width: '30px',
            height: '30px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50%',
            display: 'flex', // This will be hidden via CSS on mobile
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
            transition: 'all 0.2s ease'
          }}
          className="sidebar-toggle-btn"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Logo Section */}
        <div style={{ 
          padding: collapsed ? '1.5rem 0' : '2rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: (collapsed && typeof window !== 'undefined' && window.innerWidth > 1024) ? 'center' : 'flex-start',
          gap: '0.75rem',
          transition: 'padding 0.3s ease',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '0.5rem', 
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Shield color="white" size={24} />
          </div>
          <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: 'var(--foreground)',
            whiteSpace: 'nowrap',
            display: collapsed ? 'none' : 'block'
          }}
          className="sidebar-logo-text"
          >
            Smartovate
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onCloseMobile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (collapsed && typeof window !== 'undefined' && window.innerWidth > 1024) ? 'center' : 'flex-start',
                  gap: (collapsed && typeof window !== 'undefined' && window.innerWidth > 1024) ? '0' : '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : '#64748b',
                  backgroundColor: isActive ? 'var(--sidebar-hover)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  marginBottom: '0.25rem',
                  transition: 'all 0.2s ease',
                  height: '44px'
                }}
                title={collapsed ? item.label : ''}
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                <span style={{ 
                  whiteSpace: 'nowrap',
                  display: collapsed ? 'none' : 'block'
                }}
                className="sidebar-link-text"
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ 
          padding: (collapsed && typeof window !== 'undefined' && window.innerWidth > 1024) ? '1rem 0.75rem' : '1.5rem', 
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: (collapsed && typeof window !== 'undefined' && window.innerWidth > 1024) ? 'center' : 'flex-start'
        }}>
          <Link 
            href="/help"
            onClick={onCloseMobile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: (collapsed && typeof window !== 'undefined' && window.innerWidth > 1024) ? '0' : '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: '#64748b',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              height: '44px'
            }}
            title={collapsed ? "Centre d'aide" : ""}
          >
            <HelpCircle size={20} style={{ flexShrink: 0 }} />
            <span style={{ 
              whiteSpace: 'nowrap',
              display: collapsed ? 'none' : 'block'
            }}
            className="sidebar-link-text"
            >
              Centre d&apos;aide
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
