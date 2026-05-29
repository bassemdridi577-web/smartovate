'use client';

import { useState } from 'react';
import { Calendar, Filter, ChevronDown } from 'lucide-react';

interface GlobalFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function GlobalFilters({ onFilterChange }: GlobalFiltersProps) {
  const [dateRange, setDateRange] = useState('30d');
  const [product, setProduct] = useState('all');

  const handleDateChange = (val: string) => {
    setDateRange(val);
    onFilterChange({ dateRange: val, product });
  };

  const handleProductChange = (val: string) => {
    setProduct(val);
    onFilterChange({ dateRange, product: val });
  };

  return (
    <div className="glass-card" style={{ 
      display: 'flex', 
      gap: '1rem', 
      padding: '0.75rem 1.25rem', 
      marginBottom: '2rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
        <Filter size={16} />
        <span>Filtrer par :</span>
      </div>

      {/* Date Range Selector */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Calendar size={14} style={{ position: 'absolute', left: '0.75rem', color: '#9333ea', pointerEvents: 'none' }} />
        <select 
          value={dateRange}
          onChange={(e) => handleDateChange(e.target.value)}
          style={{ 
            padding: '0.5rem 2rem 0.5rem 2.25rem', 
            borderRadius: '0.5rem', 
            border: '1px solid rgba(147, 51, 234, 0.1)',
            background: 'rgba(147, 51, 234, 0.05)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none'
          }}
        >
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
          <option value="ytd">Cette année (YTD)</option>
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', color: '#64748b', pointerEvents: 'none' }} />
      </div>

      {/* Product Selector */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select 
          value={product}
          onChange={(e) => handleProductChange(e.target.value)}
          style={{ 
            padding: '0.5rem 2rem 0.5rem 1rem', 
            borderRadius: '0.5rem', 
            border: '1px solid rgba(0, 0, 0, 0.05)',
            background: 'rgba(0, 0, 0, 0.02)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none'
          }}
        >
          <option value="all">Tous les produits</option>
          <option value="ia-platform">IA Platform</option>
          <option value="cloud-hub">Cloud Hub</option>
          <option value="cyber-shield">Cyber Shield</option>
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', color: '#64748b', pointerEvents: 'none' }} />
      </div>

      <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8' }}>
        Dernière mise à jour : Aujourd'hui, 14:00
      </div>
    </div>
  );
}
