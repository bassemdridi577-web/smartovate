'use client';
import { FunnelChart as ReFunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#9333ea', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];

interface FunnelData {
  value: number;
  name: string;
  fill?: string;
}

const defaultData = [
  { value: 1000, name: 'Visites' },
  { value: 800, name: 'Sessions' },
  { value: 600, name: 'Pages vues' },
  { value: 300, name: 'Formulaire ouvert' },
  { value: 150, name: 'Leads' },
  { value: 50, name: 'Clients' },
];

export default function FunnelChart({ data = defaultData }: { data?: FunnelData[] }) {
  return (
    <div style={{ height: '350px', width: '100%', minHeight: '350px' }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ReFunnelChart>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255,255,255,0.9)', 
              border: '1px solid rgba(0,0,0,0.1)', 
              borderRadius: '8px',
              color: '#000000'
            }} 
            itemStyle={{ color: '#000000' }}
          />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList position="right" fill="#000000" stroke="none" dataKey="name" fontSize={12} />
          </Funnel>
        </ReFunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
