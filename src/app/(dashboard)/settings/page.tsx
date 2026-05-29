'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  User, 
  Globe, 
  Cpu, 
  Key, 
  Save, 
  Loader2, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  Smartphone,
  Server
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface AISettings {
  provider: string;
  model_name: string;
  has_key: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // AI Settings State
  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: 'openrouter',
    model_name: 'openrouter/auto',
    has_key: false
  });
  const [apiKey, setApiKey] = useState('');

  // Password State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Notification State
  const [notifs, setNotifs] = useState({ email: true, push: false, alerts: true });

  // Database State
  const [dbConfig, setDbConfig] = useState({ url: 'postgresql://localhost:5433/visual_db', status: 'Connected' });

  useEffect(() => {
    fetchAISettings();
  }, []);

  const fetchAISettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/settings/ai');
      setAiSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch AI settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSaveAI = async () => {
    try {
      setIsSaving(true);
      await api.post('/settings/ai', {
        provider: aiSettings.provider,
        model_name: aiSettings.model_name,
        api_key: apiKey || undefined
      });
      showToast('Configuration IA mise à jour !', 'success');
      setApiKey('');
      fetchAISettings();
    } catch (err) {
      showToast('Erreur lors de la mise à jour IA', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    try {
      setIsSaving(true);
      // Mock API call for password update
      await new Promise(r => setTimeout(r, 1000));
      showToast('Mot de passe mis à jour !', 'success');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      showToast('Erreur lors du changement', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNotifs = async () => {
    try {
      setIsSaving(true);
      await new Promise(r => setTimeout(r, 800));
      showToast('Préférences de notification enregistrées', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setIsSaving(true);
      const res = await api.get('/health');
      if (res.data.status === 'healthy') {
        showToast('Connexion à la base de données réussie !', 'success');
        setDbConfig({ ...dbConfig, status: 'Connected' });
      }
    } catch (err) {
      showToast('Échec de la connexion', 'error');
      setDbConfig({ ...dbConfig, status: 'Error' });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Profil', icon: User },
    { id: 'ai', label: 'IA Chat', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'database', label: 'Données & API', icon: Database },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Paramètres</h1>
        <p style={{ color: '#64748b' }}>Personnalisez votre expérience et gérez vos configurations techniques.</p>
      </div>

      {/* Global Message Toast */}
      {message.text && (
        <div style={{ 
          position: 'fixed', top: '2rem', right: '2rem', zIndex: 100,
          padding: '1rem 1.5rem', borderRadius: '0.75rem', 
          backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2.5rem' }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.875rem 1rem', borderRadius: '0.75rem', border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--sidebar-hover)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : '#64748b',
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass-card" style={{ padding: '2.5rem', minHeight: '500px' }}>
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={24} color="var(--primary)" /> Informations Personnelles
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Utilisateur</label>
                  <input type="text" defaultValue={user?.username} readOnly className="glass-card" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" defaultValue={user?.email || 'admin@smartovate.ai'} className="glass-card" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)' }} />
                </div>
                <button className="btn-primary" style={{ marginTop: '1rem' }}>Enregistrer les modifications</button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={24} color="var(--primary)" /> Configuration Chat IA
              </h3>
              <div style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '1rem' }}>Service Provider</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button onClick={() => setAiSettings({...aiSettings, provider: 'openrouter'})} style={{ padding: '1rem', borderRadius: '0.75rem', border: `2px solid ${aiSettings.provider === 'openrouter' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer' }}>OpenRouter</button>
                    <button onClick={() => setAiSettings({...aiSettings, provider: 'google'})} style={{ padding: '1rem', borderRadius: '0.75rem', border: `2px solid ${aiSettings.provider === 'google' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer' }}>Google AI</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Modèle</label>
                  <select value={aiSettings.model_name} onChange={(e) => setAiSettings({...aiSettings, model_name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="openai/gpt-4o">GPT-4o</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>API Key</label>
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={aiSettings.has_key ? "••••••••••••••••" : "Entrez votre clé..."} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                </div>
                <button onClick={handleSaveAI} disabled={isSaving} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer Configuration IA
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={24} color="var(--primary)" /> Sécurité du Compte
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Mot de passe actuel</label>
                  <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="glass-card" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Nouveau mot de passe</label>
                  <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="glass-card" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Confirmer le mot de passe</label>
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="glass-card" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)' }} />
                </div>
                <button onClick={handleUpdatePassword} disabled={isSaving} className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />} 
                  Modifier le mot de passe
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={24} color="#f59e0b" /> Préférences de Notifications
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Mail color="#64748b" />
                    <div>
                      <div style={{ fontWeight: 600 }}>Notifications Email</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Recevoir les résumés hebdomadaires</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={notifs.email} onChange={e => setNotifs({...notifs, email: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Smartphone color="#64748b" />
                    <div>
                      <div style={{ fontWeight: 600 }}>Notifications Push</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Alertes en temps réel sur navigateur</div>
                    </div>
                  </div>
                  <input type="checkbox" checked={notifs.push} onChange={e => setNotifs({...notifs, push: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
                <button onClick={handleUpdateNotifs} disabled={isSaving} className="btn-primary" style={{ marginTop: '1rem', background: '#f59e0b', justifyContent: 'center' }}>
                  Enregistrer les préférences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Database size={24} color="#10b981" /> Données & API
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Server size={20} color="#10b981" />
                      <span style={{ fontWeight: 600 }}>Base de données principale</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', background: dbConfig.status === 'Connected' ? '#10b981' : '#ef4444', color: 'white' }}>
                      {dbConfig.status}
                    </span>
                  </div>
                  <input type="text" value={dbConfig.url} readOnly style={{ width: '100%', padding: '0.75rem', background: 'white', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#64748b' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={handleTestConnection} disabled={isSaving} className="btn-primary" style={{ background: '#10b981', flex: 1, justifyContent: 'center' }}>
                    Tester la connexion
                  </button>
                  <button className="btn-primary" style={{ background: '#64748b', flex: 1, justifyContent: 'center' }}>
                    Gérer les clés API
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
