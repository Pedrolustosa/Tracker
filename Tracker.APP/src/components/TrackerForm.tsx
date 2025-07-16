// src/components/TrackerForm.tsx

import React from 'react';

interface TrackerFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitted: boolean;
  loading: boolean;
}

const TrackerForm: React.FC<TrackerFormProps> = ({ formValues, handleChange, handleSubmit, submitted, loading }) => {
  const getFieldClassName = (fieldValue: string) => {
    if (!submitted) return ''; // Não aplica validação até o formulário ser submetido
    return fieldValue ? 'is-valid' : 'is-invalid';
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return ( 
    <form onSubmit={onSubmit}>
      {/* Seção de Localização */}
      <div className="form-section slide-in">
        <h6 className="section-title">
          <span className="section-icon">📍</span>
          Localização Geográfica
        </h6>
        <div className="parameter-grid">
          <div className="form-group">
            <label className="form-label required-field">Latitude</label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formValues.latitude}
              onChange={handleChange}
              placeholder="Ex: -23.5505"
              className={`form-control ${getFieldClassName(formValues.latitude)}`}
            />
            <div className="form-text">
              Coordenada de latitude em graus decimais (Norte: +, Sul: -)
            </div>
            {submitted && !formValues.latitude && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira a latitude.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">Longitude</label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formValues.longitude}
              onChange={handleChange}
              placeholder="Ex: -46.6333"
              className={`form-control ${getFieldClassName(formValues.longitude)}`}
            />
            <div className="form-text">
              Coordenada de longitude em graus decimais (Leste: +, Oeste: -)
            </div>
            {submitted && !formValues.longitude && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira a longitude.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Período de Análise */}
      <div className="form-section slide-in">
        <h6 className="section-title">
          <span className="section-icon">📅</span>
          Período de Análise
        </h6>
        <div className="parameter-grid">
          <div className="form-group">
            <label className="form-label required-field">Data de Início</label>
            <input
              type="date"
              name="start"
              value={formValues.start}
              onChange={handleChange}
              className={`form-control ${getFieldClassName(formValues.start)}`}
            />
            <div className="form-text">
              Data de início da simulação solar
            </div>
            {submitted && !formValues.start && (
              <div className="invalid-feedback">
                ⚠️ Por favor, selecione a data de início.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">Data de Fim</label>
            <input
              type="date"
              name="end"
              value={formValues.end}
              onChange={handleChange}
              className={`form-control ${getFieldClassName(formValues.end)}`}
            />
            <div className="form-text">
              Data de fim da simulação solar
            </div>
            {submitted && !formValues.end && (
              <div className="invalid-feedback">
                ⚠️ Por favor, selecione a data de fim.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Configurações Ambientais */}
      <div className="form-section slide-in">
        <h6 className="section-title">
          <span className="section-icon">🌍</span>
          Configurações Ambientais
        </h6>
        <div className="parameter-grid">
          <div className="form-group">
            <label className="form-label required-field">Altitude</label>
            <input
              type="number"
              step="0.1"
              name="altitude"
              value={formValues.altitude}
              onChange={handleChange}
              placeholder="Ex: 760"
              className={`form-control ${getFieldClassName(formValues.altitude)}`}
            />
            <div className="form-text">
              Altitude do local em metros acima do nível do mar
            </div>
            {submitted && !formValues.altitude && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira a altitude.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">Fuso Horário</label>
            <input
              type="text"
              name="tz"
              value={formValues.tz}
              onChange={handleChange}
              placeholder="Ex: America/Sao_Paulo"
              className={`form-control ${getFieldClassName(formValues.tz)}`}
            />
            <div className="form-text">
              Fuso horário no formato IANA (ex: America/Sao_Paulo)
            </div>
            {submitted && !formValues.tz && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira o fuso horário.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Configurações do Rastreador */}
      <div className="form-section slide-in">
        <h6 className="section-title">
          <span className="section-icon">🔧</span>
          Parâmetros do Rastreador
        </h6>
        <div className="parameter-grid">
          <div className="form-group">
            <label className="form-label required-field">Inclinação do Eixo</label>
            <input
              type="number"
              step="0.1"
              name="axis_tilt"
              value={formValues.axis_tilt}
              onChange={handleChange}
              placeholder="Ex: 0"
              className={`form-control ${getFieldClassName(formValues.axis_tilt)}`}
            />
            <div className="form-text">
              Inclinação do eixo do rastreador em graus (0° = horizontal)
            </div>
            {submitted && !formValues.axis_tilt && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira a inclinação do eixo.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">Azimute do Eixo</label>
            <input
              type="number"
              step="0.1"
              name="axis_azimuth"
              value={formValues.axis_azimuth}
              onChange={handleChange}
              placeholder="Ex: 180"
              className={`form-control ${getFieldClassName(formValues.axis_azimuth)}`}
            />
            <div className="form-text">
              Azimute do eixo do rastreador em graus (180° = Norte-Sul)
            </div>
            {submitted && !formValues.axis_azimuth && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira o azimute do eixo.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">Ângulo Máximo</label>
            <input
              type="number"
              step="0.1"
              name="max_angle"
              value={formValues.max_angle}
              onChange={handleChange}
              placeholder="Ex: 45"
              className={`form-control ${getFieldClassName(formValues.max_angle)}`}
            />
            <div className="form-text">
              Ângulo máximo de rotação do rastreador em graus
            </div>
            {submitted && !formValues.max_angle && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira o ângulo máximo.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">Posição de Repouso</label>
            <input
              type="number"
              step="0.1"
              name="reposo_tracker"
              value={formValues.reposo_tracker}
              onChange={handleChange}
              placeholder="Ex: 0"
              className={`form-control ${getFieldClassName(formValues.reposo_tracker)}`}
            />
            <div className="form-text">
              Posição de repouso do rastreador em graus
            </div>
            {submitted && !formValues.reposo_tracker && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira a posição de repouso.
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label required-field">GCR</label>
            <input
              type="number"
              step="0.01"
              name="gcr"
              value={formValues.gcr}
              onChange={handleChange}
              placeholder="Ex: 0.4"
              className={`form-control ${getFieldClassName(formValues.gcr)}`}
            />
            <div className="form-text">
              Ground Coverage Ratio - Razão de cobertura do solo (0.0 - 1.0)
            </div>
            {submitted && !formValues.gcr && (
              <div className="invalid-feedback">
                ⚠️ Por favor, insira o GCR.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Submissão */}
      <div className="text-center mt-4">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-border me-2" role="status">
                <span className="sr-only">Carregando...</span>
              </div>
              Processando Dados...
            </>
          ) : (
            <>
              ☀️ Calcular Ângulos Solares
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TrackerForm;