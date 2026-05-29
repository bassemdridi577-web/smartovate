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

interface LeadsData {
  source: string;
  count: number;
}

export default function LeadsChart({ data }: { data: LeadsData[] }) {
  const chartData = {
    labels: data.map(d => d.source),
    datasets: [
      {
        label: 'Leads per Source',
        data: data.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#000000', fontSize: 10 }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#000000', fontSize: 10 }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar options={options} data={chartData} />
    </div>
  );
}
