import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faDownload, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import './DashboardChart.css';

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

  // Função para formatar data no padrão brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
      tooltip: { 
        enabled: true,
        callbacks: {
          title: function(context: any) {
            return formatDateToBrazilian(context[0].label);
          }
        }
      },
    },
    scales: {
      x: { 
        grid: { color: '#ecf0f1' }, 
        ticks: { 
          color: '#2d5016',
          callback: function(value: any, index: number) {
            const label = labels[index];
            return formatDateToBrazilian(label);
          },
          maxTicksLimit: 8 // Limita o número de ticks para evitar sobreposição
        } 
      },
      y: { grid: { color: '#ecf0f1' }, ticks: { color: '#2d5016' } },
    },
  };

  return (
    <div className="dashboard-card fade-in">
      <div className="chart-header">
        <div className="chart-title-section">
          <FontAwesomeIcon icon={faChartLine} className="chart-icon" />
          <h3 className="chart-title">{title}</h3>
        </div>
        <div className="chart-actions">
          {onExport && (
            <button className="chart-action-btn" title="Exportar" onClick={onExport}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          )}
          {onRefresh && (
            <button className="chart-action-btn" title="Atualizar" onClick={onRefresh}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </button>
          )}
        </div>
      </div>
      <div className="chart-body">
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
