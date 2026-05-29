'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import TrafficChart from '@/components/charts/TrafficChart';
import { BarChart3, TrendingUp, ArrowUpRight, RefreshCw, Layers, Map, FileDown, FileSpreadsheet } from 'lucide-react';
import FunnelChart from '@/components/charts/FunnelChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import AnalyticsSkeleton from '@/components/dashboard/AnalyticsSkeleton';
import { exportToPDF, exportToExcel } from '@/lib/export';

export default function AnalyticsPage() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trafficRes, funnelRes, heatmapRes] = await Promise.all([
        api.get('/kpis/traffic'),
        api.get('/kpis/funnel'),
        api.get('/kpis/heatmap')
      ]);
      setTrafficData(trafficRes.data);
      setFunnelData(funnelRes.data);
      setHeatmapData(heatmapRes.data);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!trafficData.length) return;
    setExporting(true);
    
    const summary = [
      { label: 'Total Pages Views', value: trafficData.reduce((acc, curr) => acc + curr.views, 0) },
      { label: 'Unique Visitors', value: trafficData.reduce((acc, curr) => acc + curr.visitors, 0) },
      { label: 'Avg. Bounce Rate', value: (trafficData.reduce((acc, curr) => acc + curr.bounce, 0) / trafficData.length).toFixed(2) + '%' }
    ];

    exportToPDF('Rapport d\'Analyses Détaillées', summary, trafficData, 'Smartovate_Analytics_Report');
    setExporting(false);
  };

  const handleExportExcel = () => {
    if (!trafficData.length) return;
    exportToExcel(trafficData, 'Smartovate_Raw_Traffic_Data');
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Analyses Détaillées</h1>
          <p style={{ color: '#64748b' }}>Explorez vos données de performance en profondeur.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExportPDF}
            disabled={exporting || loading}
            className="glass-card" 
            style={{ 
              padding: '0.5rem 1rem', 
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
              padding: '0.5rem 1rem', 
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
            onClick={fetchData}
            className="glass-card" 
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <RefreshCw size={16} /> Actualiser
          </button>
        </div>
      </div>

      <div className="grid-layout" style={{ marginBottom: '2rem' }}>
        <div id="chart-traffic" className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--primary)" />
              Évolution du Trafic
            </h4>
            <span style={{ 
              color: '#10b981', 
              background: '#10b98115', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <ArrowUpRight size={14} /> +12.5%
            </span>
          </div>
          <TrafficChart data={trafficData} />
        </div>

        <div id="chart-funnel" className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="#3b82f6" />
              Tunnel de Conversion (Funnel)
            </h4>
          </div>
          <FunnelChart data={funnelData} />
        </div>
      </div>

      <div id="chart-heatmap" className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={20} color="#10b981" />
            Intensité d'Engagement (Heatmap)
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Activité par jour et par heure</p>
        </div>
        <HeatmapChart data={heatmapData} />
      </div>
    </div>
  );
}
