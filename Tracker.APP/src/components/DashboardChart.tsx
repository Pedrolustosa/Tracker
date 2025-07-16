import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faDownload, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

interface DashboardChartProps {
  labels: string[];
  datasets: Dataset[];
  title?: string;
  type?: 'line' | 'bar';
  onExport?: () => void;
  onRefresh?: () => void;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  labels,
  datasets,
  title = 'Resultados da Simulação',
  type = 'line',
  onExport,
  onRefresh
}) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds, idx) => ({
      ...ds,
      borderColor: ds.borderColor || ['#ff6b35', '#2d5016', '#ffd700'][idx % 3],
      backgroundColor: ds.backgroundColor || ['#ffdab9', '#8bc34a', '#ffe082'][idx % 3],
      fill: ds.fill !== undefined ? ds.fill : false,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: ds.borderColor || '#ffd700',
    })),
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { color: '#ecf0f1' }, ticks: { color: '#2d5016' } },
      y: { grid: { color: '#ecf0f1' }, ticks: { color: '#2d5016' } },
    },
  };

  return (
    <div className="card results-section fade-in dashboard-card" style={{ marginTop: 32, boxShadow: '0 8px 32px rgba(44, 62, 80, 0.13)' }}>
      <div className="card-header d-flex align-items-center justify-content-between" style={{ background: 'var(--gradient-earth)', borderRadius: '16px 16px 0 0', padding: '1.2rem 2rem' }}>
        <div className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} style={{ fontSize: 26, color: '#ffd700', marginRight: 12 }} />
          <span style={{ color: 'var(--solar-white)', fontWeight: 700, fontSize: '1.25rem' }}>{title}</span>
        </div>
        <div className="d-flex gap-3">
          {onExport && (
            <button className="btn btn-outline-light btn-sm" title="Exportar" onClick={onExport} style={{ borderRadius: 12, marginRight: 8 }}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          )}
          {onRefresh && (
            <button className="btn btn-outline-light btn-sm" title="Atualizar" onClick={onRefresh} style={{ borderRadius: 12 }}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </button>
          )}
        </div>
      </div>
      <div className="card-body" style={{ padding: '2rem' }}>
        {type === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
