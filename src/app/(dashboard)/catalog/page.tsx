'use client';

import { useState } from 'react';
import { 
  Search, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Layers, 
  Plus, 
  Check, 
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
  Filter
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'ai' | 'cloud' | 'security' | 'database' | 'crm';
  description: string;
  status: 'connected' | 'available' | 'disconnected';
  icon: any;
  provider: string;
  popularity: number; // For sorting
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [integrations, setIntegrations] = useState<Integration[]>([
    { 
      id: 'gemini', 
      name: 'Google Gemini API', 
      category: 'ai', 
      description: 'Connectez les modèles d\'IA avancés de Google pour interroger et résumer automatiquement vos indicateurs clés.', 
      status: 'connected', 
      icon: Cpu, 
      provider: 'Google AI',
      popularity: 98
    },
    { 
      id: 'openrouter', 
      name: 'OpenRouter Gateway', 
      category: 'ai', 
      description: 'Accédez à Claude 3.5, GPT-4o et Llama 3 via une connexion unique et sécurisée dans vos paramètres de chat.', 
      status: 'connected', 
      icon: Cpu, 
      provider: 'OpenRouter',
      popularity: 95
    },
    { 
      id: 'postgres', 
      name: 'PostgreSQL Database', 
      category: 'database', 
      description: 'Base de données principale contenant vos tables d\'utilisateurs, leads bruts et flux d\'événements.', 
      status: 'connected', 
      icon: Database, 
      provider: 'PostgreSQL',
      popularity: 90
    },
    { 
      id: 'cyberaudit', 
      name: 'Cyber Shield Audit', 
      category: 'security', 
      description: 'Analyse en temps réel de vos journaux de sécurité et détection automatique des menaces.', 
      status: 'connected', 
      icon: ShieldCheck, 
      provider: 'CyberShield',
      popularity: 88
    },
    { 
      id: 'aws', 
      name: 'AWS CloudWatch', 
      category: 'cloud', 
      description: 'Surveillez l\'utilisation des ressources serveur, la latence des API et les journaux système.', 
      status: 'available', 
      icon: Cloud, 
      provider: 'Amazon Web Services',
      popularity: 85
    },
    { 
      id: 'salesforce', 
      name: 'Salesforce CRM', 
      category: 'crm', 
      description: 'Synchronisez vos opportunités commerciales et vos comptes clients pour analyser le tunnel de conversion.', 
      status: 'available', 
      icon: Layers, 
      provider: 'Salesforce',
      popularity: 82
    },
    { 
      id: 'stripe', 
      name: 'Stripe Payments', 
      category: 'database', 
      description: 'Suivez vos abonnements, transactions financières et la valeur à vie des clients (LTV).', 
      status: 'available', 
      icon: Database, 
      provider: 'Stripe',
      popularity: 94
    },
    { 
      id: 'mongodb', 
      name: 'MongoDB Atlas', 
      category: 'database', 
      description: 'Intégrez vos collections documentaires NoSQL pour analyser le comportement des utilisateurs.', 
      status: 'available', 
      icon: Database, 
      provider: 'MongoDB',
      popularity: 78
    }
  ]);

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleConnection = (id: string) => {
    const item = integrations.find(i => i.id === id);
    if (!item) return;

    if (item.status === 'connected') {
      // Disconnect directly
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'available' } : i));
      showToast(`Intégration ${item.name} déconnectée avec succès.`, 'success');
    } else {
      // Simulate connection progress with loader
      setConnectingId(id);
      setTimeout(() => {
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected' } : i));
        setConnectingId(null);
        showToast(`Intégration ${item.name} connectée et active !`, 'success');
      }, 1500);
    }
  };

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'ai', label: 'Agents IA', icon: Cpu },
    { id: 'cloud', label: 'Cloud Hosting', icon: Cloud },
    { id: 'security', label: 'Sécurité', icon: ShieldCheck },
    { id: 'database', label: 'Bases & Finance', icon: Database },
    { id: 'crm', label: 'CRM & Ventes', icon: Layers }
  ];

  const filteredIntegrations = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 1000,
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <Check size={20} />
          <span style={{ fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Catalogue des Services</h1>
          <p style={{ color: '#64748b' }}>Connectez vos sources de données et activez des agents intelligents pour enrichir votre tableau de bord.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search wrapper */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Rechercher une intégration (ex: postgres, stripe, gemini)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem 0.75rem 3rem', 
                borderRadius: '0.75rem', 
                border: '1px solid var(--border)',
                background: 'rgba(0, 0, 0, 0.02)',
                outline: 'none',
                fontSize: '0.925rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            <Filter size={16} />
            <span>{filteredIntegrations.length} services disponibles</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '2rem',
              border: activeCategory === cat.id ? 'none' : '1px solid var(--border)',
              backgroundColor: activeCategory === cat.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
              color: activeCategory === cat.id ? 'white' : '#64748b',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(147, 51, 234, 0.25)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.icon && <cat.icon size={16} />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredIntegrations.map((item) => {
          const IconComponent = item.icon;
          const isConnected = item.status === 'connected';
          const isConnecting = connectingId === item.id;

          return (
            <div 
              key={item.id} 
              className="glass-card animate-fade-in"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                padding: '1.75rem',
                border: isConnected ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isConnected ? '0 10px 30px rgba(16, 185, 129, 0.03)' : 'none'
              }}
            >
              <div>
                {/* Upper info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    padding: '0.75rem', 
                    borderRadius: '0.75rem', 
                    background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(147, 51, 234, 0.05)',
                    color: isConnected ? '#10b981' : 'var(--primary)'
                  }}>
                    <IconComponent size={24} />
                  </div>
                  
                  {/* Status pill */}
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '1rem',
                    background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    color: isConnected ? '#10b981' : '#64748b'
                  }}>
                    {isConnected ? 'Actif' : 'Disponible'}
                  </span>
                </div>

                {/* Integration Details */}
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.75rem' }}>
                  Par {item.provider}
                </span>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#64748b', 
                  lineHeight: '1.5',
                  marginBottom: '1.5rem',
                  minHeight: '63px' // Prevent layout shift on varying description lengths
                }}>
                  {item.description}
                </p>
              </div>

              {/* Actions Footer */}
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem',
                borderTop: '1px solid rgba(0,0,0,0.03)',
                paddingTop: '1.25rem',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <button
                  onClick={() => handleToggleConnection(item.id)}
                  disabled={isConnecting}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: isConnected ? 'rgba(239, 68, 68, 0.08)' : 'var(--primary)',
                    color: isConnected ? '#ef4444' : 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    opacity: isConnecting ? 0.7 : 1
                  }}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Connexion...
                    </>
                  ) : isConnected ? (
                    'Déconnecter'
                  ) : (
                    <>
                      <Plus size={16} />
                      Activer
                    </>
                  )}
                </button>

                <a 
                  href="https://smartovate.com" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    padding: '0.65rem', 
                    borderRadius: '0.5rem', 
                    border: '1px solid var(--border)',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Consulter la documentation"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info card at the bottom */}
      <div className="glass-card" style={{ marginTop: '3rem', borderLeft: '4px solid var(--primary)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(147, 51, 234, 0.05)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0' }}>Une source de données manquante ?</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
            Vous pouvez configurer des connexions personnalisées par webhook ou base de données SQL dans les <strong>Paramètres &gt; Données &amp; API</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
