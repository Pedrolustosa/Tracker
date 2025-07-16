import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';

interface TrackerFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitted: boolean;
  getFieldClassName: (fieldValue: any) => string;
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

const TrackerFields: React.FC<TrackerFieldsProps> = ({ formValues, handleChange, submitted, getFieldClassName }) => (
  <div className="card mb-4">
    <div className="card-header bg-light d-flex align-items-center">
      <FontAwesomeIcon icon={faWrench} className="me-2" style={{ color: 'var(--solar-orange)' }} />
      <span>Rastreador</span>
    </div>
    <div className="card-body">
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
            <div className="invalid-feedback d-block">⚠️ Por favor, insira {labels[field].toLowerCase()}.</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default TrackerFields;
