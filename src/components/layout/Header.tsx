import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Bell, Search, User, Info, AlertCircle, CheckCircle, Menu, X } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
// ... rest of the logic ...


  const notifications = [
    { id: 1, title: 'Nouveau Lead', message: 'Un nouveau formulaire a été soumis.', time: 'il y a 5 min', type: 'info', icon: <Info size={16} color="#3b82f6" /> },
    { id: 2, title: 'Alerte Performance', message: 'Le temps de réponse a augmenté de 15%.', time: 'il y a 1h', type: 'warning', icon: <AlertCircle size={16} color="#f59e0b" /> },
    { id: 3, title: 'Système à jour', message: 'La mise à jour v2.4.0 a été installée.', time: 'il y a 3h', type: 'success', icon: <CheckCircle size={16} color="#10b981" /> },
  ];

  const [dynamicResults, setDynamicResults] = useState<{ id: string, title: string, type: 'text' }[]>([]);

  // Function to scan the page for searchable text
  const scanPageForText = () => {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .glass-card p, .glass-card span, th, td');
    const results: { id: string, title: string, type: 'text' }[] = [];
    const seen = new Set();

    elements.forEach((el, index) => {
      const text = el.textContent?.trim();
      if (text && text.length > 2 && text.length < 50 && !seen.has(text.toLowerCase())) {
        // Find or create an ID for this element if it doesn't have one
        if (!el.id) el.id = `dynamic-search-${index}`;
        results.push({ id: el.id, title: text, type: 'text' });
        seen.add(text.toLowerCase());
      }
    });
    return results;
  };

  useEffect(() => {
    // Initial scan
    setDynamicResults(scanPageForText());
    
    // Rescan on potential content changes (optional, but good for dynamic dashboards)
    const timer = setTimeout(() => setDynamicResults(scanPageForText()), 2000);
    return () => clearTimeout(timer);
  }, []);

  const searchItems = [
    // Dashboard Sections
    { id: 'chart-traffic', title: 'Évolution du Trafic', type: 'section', keywords: ['traffic', 'évolution', 'visites', 'utilisateurs'] },
    { id: 'chart-leads', title: 'Sources d\'Acquisition', type: 'section', keywords: ['leads', 'sources', 'acquisition', 'conversion'] },
    { id: 'section-products', title: 'Performance des Produits', type: 'section', keywords: ['produits', 'ventes', 'revenu', 'performance'] },
    { id: 'section-alerts', title: 'Alertes et Anomalies', type: 'section', keywords: ['alertes', 'anomalies', 'erreurs', 'attention'] },
    { id: 'section-stats', title: 'Statistiques Globales', type: 'section', keywords: ['stats', 'kpi', 'résumé', 'chiffres'] },
    // Pages
    { id: '/analytics', title: 'Analyses Détaillées', type: 'page', keywords: ['analytics', 'rapports', 'détails'] },
    { id: '/insights', title: 'IA Insights', type: 'page', keywords: ['ia', 'intelligence', 'prévisions', 'conseils'] },
    { id: '/admin', title: 'Administration', type: 'page', keywords: ['admin', 'gestion', 'utilisateurs', 'accès'] },
    { id: '/settings', title: 'Paramètres', type: 'page', keywords: ['settings', 'config', 'profil', 'compte'] },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Merge predefined items with dynamic page text
  const allSearchableItems = [
    ...searchItems,
    ...dynamicResults.filter(dr => !searchItems.some(si => si.title.toLowerCase() === dr.title.toLowerCase()))
  ];

  const filteredResults = searchQuery.trim().length < 2 
    ? [] 
    : allSearchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ('keywords' in item && item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 8); // Limit results for better UI

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (item: any) => {
    if (!item) return;

    if (typeof item !== 'string' && item.type === 'page') {
      router.push(item.id);
    } else {
      const searchTerm = typeof item === 'string' ? item : item.title;
      const targetId = typeof item === 'string' ? null : item.id;

      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.transition = 'all 0.5s ease';
          element.style.boxShadow = '0 0 0 4px rgba(147, 51, 234, 0.3)';
          setTimeout(() => {
            element.style.boxShadow = 'none';
          }, 2000);
          setShowResults(false);
          setSearchQuery('');
          return;
        }
      }

      // If we're not on the dashboard or element not found, navigate to dashboard with search param
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or other defaults
      if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
        handleAction(filteredResults[selectedIndex]);
      } else if (filteredResults.length > 0) {
        // Auto-select first result if user just presses enter
        handleAction(filteredResults[0]);
      } else if (searchQuery.trim()) {
        // Fallback to generic search
        handleAction(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          marginRight: '0.5rem'
        }}
        className="mobile-menu-toggle"
      >
        <Menu size={24} />
      </button>

      {/* Search Bar - Hidden on small mobile screens, shown on desktop */}
      <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '350px' }} className="header-search-container">
        <Search 
          size={18} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 10 }} 
        />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '0.5rem 1rem 0.5rem 2.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: '#f8fafc',
          }}
        />

        {showResults && filteredResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            zIndex: 50,
            padding: '0.5rem'
          }}>
            {filteredResults.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => handleAction(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: selectedIndex === index ? '#f1f5f9' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{ color: selectedIndex === index ? 'var(--primary)' : '#64748b' }}>
                  {item.type === 'page' ? <User size={14} /> : <Search size={14} />}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        <div ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#64748b', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              position: 'relative'
            }}
          >
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white'
            }}></span>
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              width: '280px',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              zIndex: 100
            }}>
              {/* Notification list... (simplified for brevity) */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Notifications</div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ color: '#64748b' }}>{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)' }} className="header-divider" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right', display: 'none' }} className="header-user-info">
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.username}</div>
          </div>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--sidebar-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>

  );
}
