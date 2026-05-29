'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RechartsDemo({ data }: { data?: any[] }) {
  const hasData = data && data.length > 0;
  const displayData = hasData ? data : [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" />
          <XAxis dataKey={hasData ? "date" : "name"} stroke="#000000" fontSize={12} />
          <YAxis stroke="#000000" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(147,51,234,0.1)', borderRadius: '8px', color: '#0f172a' }}
            itemStyle={{ color: '#0f172a' }}
          />
          <Area type="monotone" dataKey={hasData ? "views" : "value"} stroke="#9333ea" name="Utilisateurs" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
