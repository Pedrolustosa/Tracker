import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';

interface EnvironmentFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  submitted: boolean;
  getFieldClassName: (fieldValue: any) => string;
}

const EnvironmentFields: React.FC<EnvironmentFieldsProps> = ({ formValues, handleChange, submitted, getFieldClassName }) => (
  <div className="card mb-4">
    <div className="card-header bg-light d-flex align-items-center">
      <FontAwesomeIcon icon={faGlobeAmericas} className="me-2" style={{ color: 'var(--solar-gold)' }} />
      <span>Ambiente</span>
    </div>
    <div className="card-body">
      <div className="mb-3">
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
            
            {/* Fusos Horários Brasileiros */}
            <optgroup label="🇧🇷 Brasil">
              {/* GMT-2 (Fernando de Noronha) */}
              <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
              
              {/* GMT-3 (Horário de Brasília - Maior parte do país) */}
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Bahia">Salvador/Bahia (GMT-3)</option>
              <option value="America/Belem">Belém/Pará (GMT-3)</option>
              <option value="America/Fortaleza">Fortaleza/Ceará (GMT-3)</option>
              <option value="America/Recife">Recife/Pernambuco (GMT-3)</option>
              <option value="America/Maceio">Maceió/Alagoas (GMT-3)</option>
              <option value="America/Araguaina">Araguaína/Tocantins (GMT-3)</option>
              <option value="America/Santarem">Santarém/Pará (GMT-3)</option>
              
              {/* GMT-4 (Amazônia - Parte ocidental) */}
              <option value="America/Manaus">Manaus/Amazonas (GMT-4)</option>
              <option value="America/Cuiaba">Cuiabá/Mato Grosso (GMT-4)</option>
              <option value="America/Campo_Grande">Campo Grande/MS (GMT-4)</option>
              <option value="America/Porto_Velho">Porto Velho/Rondônia (GMT-4)</option>
              <option value="America/Boa_Vista">Boa Vista/Roraima (GMT-4)</option>
              
              {/* GMT-5 (Acre) */}
              <option value="America/Rio_Branco">Rio Branco/Acre (GMT-5)</option>
              <option value="America/Eirunepe">Eirunepé/Amazonas (GMT-5)</option>
            </optgroup>
            
            {/* Outros Fusos Horários Internacionais */}
            <optgroup label="🌍 Internacional">
              <option value="UTC">UTC (GMT+0)</option>
              <option value="Europe/Lisbon">Lisboa/Portugal (GMT+1)</option>
              <option value="Europe/London">Londres/Reino Unido (GMT+1)</option>
              <option value="America/New_York">Nova York/EUA (GMT-4)</option>
              <option value="America/Los_Angeles">Los Angeles/EUA (GMT-7)</option>
              <option value="America/Buenos_Aires">Buenos Aires/Argentina (GMT-3)</option>
              <option value="America/Santiago">Santiago/Chile (GMT-3)</option>
              <option value="America/Lima">Lima/Peru (GMT-5)</option>
              <option value="America/Bogota">Bogotá/Colômbia (GMT-5)</option>
            </optgroup>
          </select>
        </div>
        <div className="form-text">Escolha o fuso horário da localidade do sistema.</div>
        {submitted && !formValues.tz && (
          <div className="invalid-feedback d-block">⚠️ Por favor, selecione o fuso horário.</div>
        )}
      </div>
    </div>
  </div>
);

export default EnvironmentFields;
