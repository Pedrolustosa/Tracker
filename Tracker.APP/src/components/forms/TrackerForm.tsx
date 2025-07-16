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
import LocationFields from './fields/LocationFields';
import PeriodFields from './fields/PeriodFields';
import EnvironmentFields from './fields/EnvironmentFields';
import TrackerFields from './fields/TrackerFields';

interface TrackerFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleDateChange?: (field: string, date: Date | null) => void;
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
  handleDateChange,
  handleSubmit,
  submitted,
  loading,
}) => {

  const getFieldClassName = (fieldValue: any) => {
    if (!submitted) return '';
    return fieldValue === '' || fieldValue === null || fieldValue === undefined ? 'is-invalid' : 'is-valid';
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="dashboard-bg">
      <header className="dashboard-header">
        <FontAwesomeIcon icon={faSun} className="header-icon" />
        <h1>Rastreador Solar</h1>
      </header>
      <main className="dashboard-main">
        <section className="dashboard-form-card">
          <form onSubmit={onSubmit}>
            <div className="config-grid">
              <LocationFields
                formValues={formValues}
                handleChange={handleChange}
                submitted={submitted}
                getFieldClassName={getFieldClassName}
              />
              <PeriodFields
                formValues={formValues}
                handleChange={handleChange}
                handleDateChange={handleDateChange || (() => {})}
                submitted={submitted}
                getFieldClassName={getFieldClassName}
              />
              <EnvironmentFields
                formValues={formValues}
                handleChange={handleChange}
                submitted={submitted}
                getFieldClassName={getFieldClassName}
              />
              <TrackerFields
                formValues={formValues}
                handleChange={handleChange}
                submitted={submitted}
                getFieldClassName={getFieldClassName}
              />
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

          </form>
        </section>

      </main>
    </div>
  );
};

export default TrackerForm;
