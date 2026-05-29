'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: 'rgba(15, 23, 42, 0.7)' }
    },
  },
  
  scales: {
    y: {
      grid: { color: 'rgba(15, 23, 42, 0.05)' },
      ticks: { color: 'rgba(15, 23, 42, 0.5)' }
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(15, 23, 42, 0.5)' }
    }
  }
};

const data = {
  labels: ['LinkedIn', 'Direct', 'Search', 'Referral'],
  datasets: [
    {
      label: 'Leads Générés',
      data: [45, 30, 25, 15],
      backgroundColor: 'rgba(236, 72, 153, 0.6)',
      borderRadius: 8,
    },
  ],
};

export default function ChartJSDemo() {
  return (
    <div className="glass-card" style={{ height: '400px' }}>
      <h3 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Tunnel de Conversion (Chart.js)</h3>
      <div style={{ height: '85%' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
