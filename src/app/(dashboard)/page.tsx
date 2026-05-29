'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import RechartsDemo from '@/components/charts/RechartsDemo';
import LeadsChart from '@/components/charts/LeadsChart';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Zap, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

import { useSearchParams } from 'next/navigation';

import GlobalFilters from '@/components/dashboard/GlobalFilters';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

const StatCard = ({ icon: Icon, title, value, change, isPositive, color }: any) => (
  <div className="glass-card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{value}</h3>
        <p style={{ 
          fontSize: '0.75rem', 
          color: isPositive ? '#10b981' : '#ef4444', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change} <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>vs dernier mois</span>
        </p>
      </div>
      <div style={{ 
        background: `${color}15`, 
        padding: '0.75rem', 
        borderRadius: '0.75rem',
        color: color 
      }}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const fetchData = async (filters: any = {}) => {
    setLoading(true);
    try {
      // In a real app, we would pass filters to the API query params
      const [trafficRes, leadsRes, productsRes, alertsRes] = await Promise.all([
        api.get('/kpis/traffic'),
        api.get('/kpis/leads'),
        api.get('/kpis/products'),
        api.get('/insights/alerts')
      ]);
      
      setData({
        traffic: trafficRes.data,
        leads: leadsRes.data,
        products: productsRes.data
      });
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle auto-scroll and highlight from search param
  useEffect(() => {
    const searchTerm = searchParams.get('search');
    if (searchTerm && !loading && data) {
      const query = searchTerm.toLowerCase();
      
      // Delay slightly to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, td, th');
        for (const el of Array.from(elements)) {
          if (el.textContent?.toLowerCase().includes(query)) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Premium highlight effect
            const originalColor = (el as HTMLElement).style.color;
            const originalWeight = (el as HTMLElement).style.fontWeight;
            
            (el as HTMLElement).style.transition = 'all 0.5s ease';
            (el as HTMLElement).style.color = 'var(--primary)';
            (el as HTMLElement).style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
            (el as HTMLElement).style.padding = '0.25rem';
            (el as HTMLElement).style.borderRadius = '0.25rem';
            
            setTimeout(() => {
              (el as HTMLElement).style.color = originalColor;
              (el as HTMLElement).style.backgroundColor = 'transparent';
            }, 3000);
            
            break; 
          }
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, loading, data]);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  // Calculate some summary values
  const totalViews = data.traffic.reduce((acc: number, t: any) => acc + t.views, 0);
  const totalLeads = data.leads.reduce((acc: number, l: any) => acc + l.count, 0);
  const totalRevenue = data.products.reduce((acc: number, p: any) => acc + p.revenue, 0);
  const avgSatisfaction = (data.products.reduce((acc: number, p: any) => acc + p.score, 0) / data.products.length).toFixed(1);

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Aperçu Global</h1>
          <p style={{ color: '#64748b' }}>Données analytiques Smartovate en temps réel.</p>
        </div>
        <button 
          onClick={() => fetchData()}
          className="glass-card" 
          style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <RefreshCw size={16} /> Rafraîchir
        </button>
      </div>

      <GlobalFilters onFilterChange={(f) => fetchData(f)} />

      {/* Stats Grid */}
      <div id="section-stats" className="grid-layout" style={{ marginBottom: '2rem' }}>
        <StatCard 
          icon={TrendingUp} 
          title="Revenu Total" 
          value={`${totalRevenue.toLocaleString()} €`} 
          change="+12.5%" 
          isPositive={true}
          color="#9333ea" 
        />
        <StatCard 
          icon={Users} 
          title="Trafic Total" 
          value={totalViews.toLocaleString()} 
          change="+5.2%" 
          isPositive={true}
          color="#3b82f6" 
        />
        <StatCard 
          icon={ShoppingCart} 
          title="Total Leads" 
          value={totalLeads.toString()} 
          change="-2.4%" 
          isPositive={false}
          color="#10b981" 
        />
        <StatCard 
          icon={Zap} 
          title="Satisfaction Client" 
          value={`${avgSatisfaction}/5`} 
          change="+0.3" 
          isPositive={true}
          color="#f59e0b" 
        />
      </div>

      {/* Alerts Section (EPIC 4.4 Aide à la décision) */}
      {alerts.length > 0 && (
        <div id="section-alerts" className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertTriangle color="#f59e0b" size={20} />
            <h4 style={{ margin: 0 }}>Alertes de Décision & Anomalies</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((alert: any) => (
              <div key={alert.id} style={{ fontSize: '0.875rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{alert.message}</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{alert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div id="chart-traffic" className="glass-card">
          <h4 style={{ marginBottom: '1.5rem' }}>Évolution du Trafic</h4>
          <RechartsDemo data={data.traffic} />
        </div>
        <div id="chart-leads" className="glass-card">
          <h4 style={{ marginBottom: '1.5rem' }}>Sources d'Acquisition</h4>
          <LeadsChart data={data.leads} />
        </div>
      </div>

      {/* Product Performance Table */}
      <div id="section-products" className="glass-card">
        <h4 style={{ marginBottom: '1.5rem' }}>Performance des Produits</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Produit</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Utilisateurs</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Revenu</th>
                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: idx === data.products.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{product.name}</td>
                  <td style={{ padding: '1rem' }}>{product.users}</td>
                  <td style={{ padding: '1rem' }}>{product.revenue.toLocaleString()} €</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem',
                      background: product.score >= 4.5 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: product.score >= 4.5 ? '#10b981' : '#f59e0b'
                    }}>
                      {product.score} / 5
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer
        style={{
          marginTop: '4rem',
          textAlign: 'center',
          paddingBottom: '2rem',
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Smartovate Insights • © 2026
        </p>
      </footer>
    </div>
  );
}
