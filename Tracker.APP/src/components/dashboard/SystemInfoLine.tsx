import React from 'react';
import LoadingIndicator from '../ui/LoadingIndicator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './SystemInfoLine.css';

interface SystemInfoLineProps {
  formValues: any;
  data: any[];
  loading: boolean;
}

const infoFields = [
  {
    label: 'Localização',
    value: (f: any) => `${f.latitude}°, ${f.longitude}° (${f.altitude} m)`,
    tooltip: 'Latitude, longitude e altitude do sistema solar.'
  },
  {
    label: 'Período',
    value: (f: any) => `${f.start} a ${f.end}`,
    tooltip: 'Intervalo de datas analisado.'
  },
  {
    label: 'Inclinação',
    value: (f: any) => `${f.axis_tilt}°`,
    tooltip: 'Inclinação do eixo do rastreador em relação ao solo.'
  },
  {
    label: 'Azimute',
    value: (f: any) => `${f.axis_azimuth}°`,
    tooltip: 'Orientação do eixo do rastreador em relação ao norte.'
  },
  // Adicione outros campos técnicos se desejar
];

const SystemInfoLine: React.FC<SystemInfoLineProps> = ({ formValues, data, loading }) => {
  if (loading) return <LoadingIndicator message="Carregando informações do sistema..." />;
  if (!data || data.length === 0) return null;
  return (
    <div className="system-info-container">
      {infoFields.map(field => (
        <span key={field.label} className="system-info-field" title={field.tooltip}>
          <span className="system-info-label">{field.label}:</span>
          <span className="system-info-value">{field.value(formValues)}</span>
          <FontAwesomeIcon icon={faInfoCircle} className="system-info-icon" />
        </span>
      ))}
    </div>
  );
};

export default SystemInfoLine;
