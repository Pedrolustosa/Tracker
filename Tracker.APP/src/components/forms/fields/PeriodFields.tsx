import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PeriodFields.css';
import { ptBR } from 'date-fns/locale';

registerLocale('pt-BR', ptBR);

interface PeriodFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: string, date: Date | null) => void;
  submitted: boolean;
  getFieldClassName: (fieldValue: any) => string;
}

const PeriodFields: React.FC<PeriodFieldsProps> = ({
  formValues,
  handleDateChange,
  submitted,
  getFieldClassName
}) => (
  <div className="row mb-3">
    <div className="col-md-6">
      <label className="form-label required-field">Data Inicial</label>
      <div className="input-group">
        <DatePicker
          selected={formValues.startDate}
          onChange={(date) => handleDateChange('start', date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data inicial"
          className={`form-control ${getFieldClassName(formValues.start)}`}
          locale="pt-BR"
          showPopperArrow={false}
        />
      </div>
      {submitted && (formValues.start === '' || formValues.start === null || formValues.start === undefined) && (
        <div className="invalid-feedback d-block">
          ⚠️ Por favor, insira a data inicial.
        </div>
      )}
    </div>
    <div className="col-md-6">
      <label className="form-label required-field">Data Final</label>
      <div className="input-group">
        <DatePicker
          selected={formValues.endDate}
          onChange={(date) => handleDateChange('end', date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data final"
          className={`form-control ${getFieldClassName(formValues.end)}`}
          locale="pt-BR"
          showPopperArrow={false}
          minDate={formValues.startDate}
        />
      </div>
      {submitted && (formValues.end === '' || formValues.end === null || formValues.end === undefined) && (
        <div className="invalid-feedback d-block">
          ⚠️ Por favor, insira a data final.
        </div>
      )}
    </div>
  </div>
);

export default PeriodFields;
