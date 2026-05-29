'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Info,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/lib/export';

export default function InsightsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/insights/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!alerts.length) return;
    setExporting(true);
    
    const summary = [
      { label: 'Total Alerts', value: alerts.length },
      { label: 'High Severity', value: alerts.filter(a => a.severity === 'High').length },
      { label: 'System Health', value: alerts.length > 5 ? 'At Risk' : 'Healthy' }
    ];

    exportToPDF('Rapport d\'Insights Stratégiques IA', summary, alerts, 'Smartovate_Insights_Report');
    setExporting(false);
  };

  const handleExportExcel = () => {
    if (!alerts.length) return;
    exportToExcel(alerts, 'Smartovate_AI_Insights_Data');
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/insights/generate');
      await fetchInsights();
    } catch (err) {
      console.error("Failed to generate insights:", err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Centre de Décision (IA)</h1>
          <p style={{ color: '#64748b' }}>Analyse intelligente des tendances et détection d'anomalies.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExportPDF}
            disabled={exporting || loading}
            className="glass-card" 
            style={{ 
              padding: '0.75rem 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 600,
              opacity: exporting ? 0.7 : 1
            }}
          >
            {exporting ? <RefreshCw className="animate-spin" size={16} /> : <FileDown size={16} />} 
            PDF
          </button>
          <button 
            onClick={handleExportExcel}
            disabled={loading}
            className="glass-card" 
            style={{ 
              padding: '0.75rem 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer',
              border: '1px solid #10b981',
              color: '#10b981',
              fontWeight: 600
            }}
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="glass-card" 
            style={{ 
              padding: '0.75rem 1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer', 
              border: '1px solid #9333ea',
              color: '#9333ea',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            {generating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            Lancer l'analyse IA
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Alerts Section */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AlertTriangle color="#ef4444" size={24} />
            <h3 style={{ fontSize: '1.25rem' }}>Anomalies Détectées</h3>
          </div>
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><RefreshCw className="animate-spin" /></div>
          ) : alerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{ 
                  padding: '1rem', 
                  borderRadius: '0.75rem', 
                  background: alert.severity === 'High' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                  border: `1px solid ${alert.severity === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'}`,
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    width: '4px', 
                    height: '100%', 
                    background: alert.severity === 'High' ? '#ef4444' : '#f59e0b',
                    borderRadius: '2px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: alert.severity === 'High' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>
                        {alert.type} • {alert.severity}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{alert.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.925rem', fontWeight: 500 }}>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <CheckCircle2 size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>Aucune anomalie détectée pour le moment.</p>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Lightbulb color="#f59e0b" size={24} />
            <h3 style={{ fontSize: '1.25rem' }}>Recommandations Stratégiques</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ background: 'rgba(147, 51, 234, 0.03)', border: 'none' }}>
              <h5 style={{ color: '#9333ea', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={16} /> Optimisation Marketing
              </h5>
              <p style={{ fontSize: '0.875rem', margin: 0, color: '#475569' }}>
                Le canal LinkedIn affiche un taux de conversion 2x supérieur aux autres sources. Nous recommandons d'augmenter le budget publicitaire sur ce canal de 15% pour le mois prochain.
              </p>
            </div>

            <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.03)', border: 'none' }}>
              <h5 style={{ color: '#3b82f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={16} /> Performance Produit
              </h5>
              <p style={{ fontSize: '0.875rem', margin: 0, color: '#475569' }}>
                L'utilisation de "Cloud Hub" a stagné. Une analyse des retours clients (score 4.4/5) suggère un besoin de simplification de l'interface d'onboarding.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Banner */}
      <div className="glass-card" style={{ background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
            <Lightbulb size={32} color="#f59e0b" />
          </div>
          <div>
            <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>Besoin d'un rapport détaillé ?</h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.875rem' }}>Générez un export PDF complet pour vos partenaires stratégiques.</p>
          </div>
        </div>
        <button 
          onClick={handleExportPDF}
          disabled={exporting || loading}
          className="glass-card" 
          style={{ background: '#fff', color: '#000', border: 'none', fontWeight: 600, padding: '0.75rem 1.5rem', cursor: 'pointer' }}
        >
          {exporting ? 'Génération...' : 'Exporter Rapport'}
        </button>
      </div>
    </div>
  );
}
