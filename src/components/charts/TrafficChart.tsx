'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficData {
  date: string;
  views: number;
  visitors: number;
}

export default function TrafficChart({ data }: { data?: TrafficData[] }) {
  const hasData = data && data.length > 0;
  const displayData = hasData ? data : [
    { date: '2026-04-01', views: 400, visitors: 240 },
    { date: '2026-04-05', views: 300, visitors: 139 },
    { date: '2026-04-10', views: 600, visitors: 480 },
    { date: '2026-04-15', views: 800, visitors: 390 },
    { date: '2026-04-20', views: 500, visitors: 430 },
    { date: '2026-04-25', views: 900, visitors: 700 },
  ];

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey={hasData ? "date" : "date"} 
            stroke="#000000" 
            fontSize={10} 
            tickFormatter={(str) => {
              if (!str) return '';
              const parts = str.split('-');
              return parts.length > 1 ? `${parts[2]}/${parts[1]}` : str;
            }}
          />
          <YAxis stroke="#000000" fontSize={10} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: '#000000' }}
            itemStyle={{ color: '#000000' }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            name="Vues de pages"
            stroke="#9333ea" 
            fillOpacity={1} 
            fill="url(#colorViews)" 
            strokeWidth={2} 
          />
          <Area 
            type="monotone" 
            dataKey="visitors" 
            name="Visiteurs uniques"
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorVisitors)" 
            strokeWidth={2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
