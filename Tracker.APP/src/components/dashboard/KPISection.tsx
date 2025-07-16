import React from 'react';
import LoadingIndicator from '../ui/LoadingIndicator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './KPISection.css';

interface TrackerData {
  timestamp: string;
  zenith: string;
  azimuth: string;
  tracker_theta: string;
}

interface KPISectionProps {
  data: TrackerData[];
  loading: boolean;
}

const kpiList = [
  {
    label: 'Produção Total',
    value: (data: TrackerData[]) => (data.length * 0.92).toFixed(2) + ' kWh',
    color: '#ff6b35',
    tooltip: 'Energia total produzida pelo sistema no período selecionado (estimativa).'
  },
  {
    label: 'Eficiência',
    value: (data: TrackerData[]) => (data.length > 0 ? ((data.reduce((acc, d) => acc + parseFloat(d.tracker_theta.replace(',', '.')), 0) / (data.length * 90)) * 100).toFixed(1) : '0.0') + '%',
    color: '#2d5016',
    tooltip: 'Relação entre o aproveitamento do rastreador solar e o potencial máximo teórico.'
  },
  {
    label: 'Radiação Global',
    value: (data: TrackerData[]) => (data.length * 0.85).toFixed(2) + ' kWh/m²',
    color: '#ffd200',
    tooltip: 'Radiação solar global incidente estimada sobre o painel (mock).'
  },
  {
    label: 'Economia',
    value: (data: TrackerData[]) => 'R$ ' + (data.reduce((acc, d) => acc + parseFloat(d.tracker_theta.replace(',', '.')), 0) * 0.92).toFixed(2),
    color: '#11998e',
    tooltip: 'Economia financeira estimada baseada na produção e tarifa média.'
  },
];

const KPISection: React.FC<KPISectionProps> = ({ data, loading }) => (
  <div className="kpi-container">
    {loading ? (
      <LoadingIndicator message="Calculando indicadores..." />
    ) : (
      kpiList.map((kpi, idx) => {
        const getKpiValueClass = (index: number) => {
          const classes = ['production', 'efficiency', 'radiation', 'economy'];
          return `kpi-value ${classes[index] || ''}`;
        };

        return (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-label" title={kpi.tooltip}>
              {kpi.label}
              <FontAwesomeIcon icon={faInfoCircle} className="kpi-label-icon" />
            </div>
            <div className={getKpiValueClass(idx)}>
              {kpi.value(data)}
            </div>
          </div>
        );
      })
    )}
  </div>
);

export default KPISection;
