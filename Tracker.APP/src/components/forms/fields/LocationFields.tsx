import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';

interface LocationFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitted: boolean;
  getFieldClassName: (fieldValue: any) => string;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ formValues, handleChange, submitted, getFieldClassName }) => (
  <div className="card mb-4">
    <div className="card-header bg-light d-flex align-items-center">
      <FontAwesomeIcon icon={faLocationDot} className="me-2" style={{ color: 'var(--solar-orange)' }} />
      <span>Localização</span>
    </div>
    <div className="card-body">
      <div className="mb-3">
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
          <div className="invalid-feedback d-block">⚠️ Por favor, insira a latitude.</div>
        )}
      </div>
      <div className="mb-3">
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
          <div className="invalid-feedback d-block">⚠️ Por favor, insira a longitude.</div>
        )}
      </div>
      <div>
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
);

export default LocationFields;
