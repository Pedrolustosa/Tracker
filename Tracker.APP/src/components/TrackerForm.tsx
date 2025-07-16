// src/components/TrackerForm.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faCalendarAlt,
  faGlobeAmericas,
  faWrench,
  faSpinner,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import DashboardChart, { Dataset } from './DashboardChart';
import styles from './DashboardLayout.module.css';

interface TrackerFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitted: boolean;
  loading: boolean;
}

type TrackerField = 'axis_tilt' | 'axis_azimuth' | 'max_angle' | 'rest_position' | 'gcr';
const trackerFields: TrackerField[] = ['axis_tilt', 'axis_azimuth', 'max_angle', 'rest_position', 'gcr'];
const labels: Record<TrackerField, string> = {
  axis_tilt: 'Inclinação do Eixo (°)',
  axis_azimuth: 'Azimute do Eixo (°)',
  max_angle: 'Ângulo Máximo (°)',
  rest_position: 'Posição de Repouso (°)',
  gcr: 'GCR',
};
const placeholders: Record<TrackerField, string> = {
  axis_tilt: 'Ex: 0',
  axis_azimuth: 'Ex: 180',
  max_angle: 'Ex: 45',
  rest_position: 'Ex: 0',
  gcr: 'Ex: 0.4',
};
const helpTexts: Record<TrackerField, string> = {
  axis_tilt: 'Inclinação do eixo do rastreador em graus',
  axis_azimuth: 'Azimute do eixo do rastreador em graus',
  max_angle: 'Ângulo máximo de rotação do rastreador em graus',
  rest_position: 'Posição de repouso do rastreador em graus',
  gcr: 'Ground Coverage Ratio (0.0 - 1.0)',
};

const TrackerForm: React.FC<TrackerFormProps> = ({
  formValues,
  handleChange,
  handleSubmit,
  submitted,
  loading,
}) => {
  const [showChart, setShowChart] = React.useState(false);
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  const chartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const datasets: Dataset[] = [
    {
      label: 'Produção Solar',
      data: [12, 19, 3, 5, 2, 7],
      borderColor: '#ff6b35',
      backgroundColor: '#ffdab9',
    },
    {
      label: 'Consumo',
      data: [8, 15, 6, 7, 4, 10],
      borderColor: '#2d5016',
      backgroundColor: '#8bc34a',
    },
  ];

  const getFieldClassName = (fieldValue: any) => {
    if (!submitted) return '';
    return fieldValue === '' || fieldValue === null || fieldValue === undefined ? 'is-invalid' : 'is-valid';
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setShowChart(true);
  };

  return (
    <div className={styles['dashboard-bg']}>
      <header className={styles['dashboard-header']}>
        <FontAwesomeIcon icon={faSun} className={styles['header-icon']} />
        <h1>Rastreador Solar</h1>
      </header>
      <main className={styles['dashboard-main']}>
        <section className={styles['dashboard-form-card']}>
          <form onSubmit={onSubmit}>
            <div className={styles['config-grid']}>
              {/* Localização */}
              <div className="config-card">
                <div className="config-card-header">
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" style={{ color: 'var(--solar-orange)' }} />
                  <span>Localização</span>
                </div>
                <div className="config-card-body">
                  <div className="form-group mb-3">
                    <label className="form-label required-field">Latitude</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faGlobeAmericas} /></span>
                      <input
                        type="number"
                        step="0.000001"
                        name="latitude"
                        value={formValues.latitude}
                        onChange={handleChange}
                        placeholder="Ex: -23.5505"
                        className={`form-control ${getFieldClassName(formValues.latitude)}`}
                      />
                    </div>
                    <div className="form-text">Latitude em graus decimais (Norte: +, Sul: -)</div>
                    {submitted && (formValues.latitude === '' || formValues.latitude === null || formValues.latitude === undefined) && (
                      <div className="invalid-feedback">⚠️ Por favor, insira a latitude.</div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required-field">Longitude</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faGlobeAmericas} /></span>
                      <input
                        type="number"
                        step="0.000001"
                        name="longitude"
                        value={formValues.longitude}
                        onChange={handleChange}
                        placeholder="Ex: -46.6333"
                        className={`form-control ${getFieldClassName(formValues.longitude)}`}
                      />
                    </div>
                    <div className="form-text">Longitude em graus decimais (Leste: +, Oeste: -)</div>
                    {submitted && (formValues.longitude === '' || formValues.longitude === null || formValues.longitude === undefined) && (
                      <div className="invalid-feedback">⚠️ Por favor, insira a longitude.</div>
                    )}
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Altitude (m)</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faLocationDot} /></span>
                      <input
                        type="number"
                        step="0.1"
                        name="altitude"
                        value={formValues.altitude}
                        onChange={handleChange}
                        placeholder="Ex: 800"
                        className="form-control"
                      />
                    </div>
                    <div className="form-text">Altitude do local em metros</div>
                  </div>
                </div>
              </div>

              {/* Período */}
              <div className="config-card">
                <div className="config-card-header">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" style={{ color: 'var(--solar-green)' }} />
                  <span>Período de Análise</span>
                </div>
                <div className="config-card-body">
                  <div className="form-group mb-3">
                    <label className="form-label required-field">Data Inicial</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                      <input
                        type="date"
                        name="start"
                        value={formValues.start}
                        onChange={handleChange}
                        className={`form-control ${getFieldClassName(formValues.start)}`}
                      />
                    </div>
                    {submitted && !formValues.start && (
                      <div className="invalid-feedback">⚠️ Por favor, insira a data inicial.</div>
                    )}
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label required-field">Data Final</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                      <input
                        type="date"
                        name="end"
                        value={formValues.end}
                        onChange={handleChange}
                        className={`form-control ${getFieldClassName(formValues.end)}`}
                      />
                    </div>
                    {submitted && !formValues.end && (
                      <div className="invalid-feedback">⚠️ Por favor, insira a data final.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ambiente */}
            <div className="config-card">
              <div className="config-card-header">
                <FontAwesomeIcon icon={faGlobeAmericas} className="me-2" style={{ color: 'var(--solar-gold)' }} />
                <span>Ambiente</span>
              </div>
              <div className="config-card-body">
                <div className="form-group mb-3">
                  <label className="form-label required-field">Fuso Horário</label>
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faGlobeAmericas} /></span>
                    <select
                      name="tz"
                      value={formValues.tz}
                      onChange={handleChange}
                      className={`form-select ${getFieldClassName(formValues.tz)}`}
                      required
                    >
                      <option value="">Selecione o fuso horário</option>
                      <option value="America/Fortaleza">America/Fortaleza (GMT-3)</option>
                      <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                      <option value="America/Manaus">America/Manaus (GMT-4)</option>
                      <option value="America/Cuiaba">America/Cuiaba (GMT-4)</option>
                      <option value="America/Recife">America/Recife (GMT-3)</option>
                      <option value="America/Belem">America/Belem (GMT-3)</option>
                      <option value="America/Porto_Velho">America/Porto_Velho (GMT-4)</option>
                      <option value="America/Rio_Branco">America/Rio_Branco (GMT-5)</option>
                      <option value="America/Buenos_Aires">America/Buenos_Aires (GMT-3)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="Europe/Lisbon">Europe/Lisbon (GMT+1)</option>
                      <option value="Europe/London">Europe/London (GMT+1)</option>
                      <option value="America/New_York">America/New_York (GMT-4)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (GMT-7)</option>
                    </select>
                  </div>
                  <div className="form-text">Escolha o fuso horário da localidade do sistema.</div>
                  {submitted && !formValues.tz && (
                    <div className="invalid-feedback">⚠️ Por favor, selecione o fuso horário.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Rastreador */}
            <div className="config-card">
              <div className="config-card-header">
                <FontAwesomeIcon icon={faWrench} className="me-2" style={{ color: 'var(--solar-orange)' }} />
                <span>Rastreador</span>
              </div>
              <div className="config-card-body">
                {trackerFields.map((field, i) => (
                  <div key={i} className="form-group mb-3">
                    <label className="form-label required-field">{labels[field]}</label>
                    <div className="input-group">
                      <span className="input-group-text"><FontAwesomeIcon icon={faWrench} /></span>
                      <input
                        type="number"
                        step={field === 'gcr' ? '0.01' : '0.1'}
                        name={field}
                        value={formValues[field]}
                        onChange={handleChange}
                        placeholder={placeholders[field]}
                        className={`form-control ${getFieldClassName(formValues[field])}`}
                      />
                    </div>
                    <div className="form-text">{helpTexts[field]}</div>
                    {submitted && (formValues[field] === '' || formValues[field] === null || formValues[field] === undefined) && (
                      <div className="invalid-feedback">⚠️ Por favor, insira {labels[field].toLowerCase()}.</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="me-2">
                      <FontAwesomeIcon icon={faSpinner} spin size="lg" />
                      <span className="sr-only">Carregando...</span>
                    </span>
                    Processando Dados...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSun} className="me-2" />
                    Calcular Ângulos Solares
                  </>
                )}
              </button>
            </div>

            {showChart && (
              <div className="d-flex justify-content-end align-items-center mb-2" style={{ gap: '1rem' }}>
                <label htmlFor="chartType" style={{ fontWeight: 500 }}>Tipo de Gráfico:</label>
                <select
                  id="chartType"
                  value={chartType}
                  onChange={e => setChartType(e.target.value as 'line' | 'bar')}
                  className="form-select"
                  style={{ width: 120, display: 'inline-block' }}
                >
                  <option value="line">Linha</option>
                  <option value="bar">Barra</option>
                </select>
              </div>
            )}
          </form>
        </section>

        {showChart && (
          <section className={styles['dashboard-chart-card']}>
            <DashboardChart
              labels={chartLabels}
              datasets={datasets}
              title="Resultados da Simulação Solar"
              type={chartType}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default TrackerForm;
