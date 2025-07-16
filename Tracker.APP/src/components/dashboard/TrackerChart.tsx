import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import DashboardChart from '../charts/DashboardChart';
import KPISection from './KPISection';
import SystemInfoLine from './SystemInfoLine';
import PeriodFields from '../forms/fields/PeriodFields';
import '../../styles/TrackerChart.css';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface TrackerData {
  timestamp: string;
  zenith: string;
  azimuth: string;
  tracker_theta: string;
}

const TrackerChart: React.FC = () => {


  const [data, setData] = useState<TrackerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false); // Novo estado para controle de validação
  const [formValues, setFormValues] = useState({
    latitude: '',
    longitude: '',
    start: '',
    end: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    altitude: '',
    tz: 'America/Fortaleza',
    axis_tilt: '',
    axis_azimuth: '',
    max_angle: '',
    rest_position: '',
    gcr: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Função para lidar com mudanças de data no DatePicker
  const handleDateChange = (field: string, date: Date | null) => {
    const dateString = date ? date.toISOString().split('T')[0] : '';
    setFormValues({ 
      ...formValues, 
      [field]: dateString,
      [`${field}Date`]: date 
    });
  };

  // Função para obter classe CSS baseada na validação do campo
  const getFieldClassName = (fieldValue: any) => {
    if (!submitted) return '';
    return (fieldValue === '' || fieldValue === null || fieldValue === undefined) ? 'is-invalid' : 'is-valid';
  };

  // Função para exportar dados para planilha Excel
  const exportToExcel = () => {
    if (data.length === 0) {
      toastr.warning('Não há dados para exportar. Execute o cálculo primeiro.');
      return;
    }

    try {
      // Preparar dados para a planilha
      const excelData = data.map((item, index) => ({
        'Índice': index + 1,
        'Timestamp': item.timestamp,
        'Ângulo Zenith (°)': parseFloat(item.zenith.replace(',', '.')).toFixed(2),
        'Ângulo Azimute (°)': parseFloat(item.azimuth.replace(',', '.')).toFixed(2),
        'Ângulo do Tracker θ (°)': parseFloat(item.tracker_theta.replace(',', '.')).toFixed(2)
      }));

      // Criar workbook e worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Configurar largura das colunas
      const colWidths = [
        { wch: 8 },  // Índice
        { wch: 20 }, // Timestamp
        { wch: 18 }, // Zenith
        { wch: 18 }, // Azimute
        { wch: 20 }  // Tracker
      ];
      ws['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Ângulos Solares');

      // Gerar nome do arquivo com data atual
      const now = new Date();
      const fileName = `angulos_solares_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;

      // Fazer download do arquivo
      XLSX.writeFile(wb, fileName);
      
      toastr.success(`Planilha exportada com sucesso: ${fileName}`);
    } catch (error) {
      console.error('Erro ao exportar planilha:', error);
      toastr.error('Erro ao exportar planilha. Tente novamente.');
    }
  };

  // Normaliza o payload para garantir tipos corretos
  function normalizePayload(formValues: any) {
    return {
      latitude: formValues.latitude === '' ? null : Number(formValues.latitude),
      longitude: formValues.longitude === '' ? null : Number(formValues.longitude),
      altitude: formValues.altitude === '' ? null : Number(formValues.altitude),
      start: formValues.start || null,
      end: formValues.end || null,
      tz: formValues.tz || null,
      axis_tilt: formValues.axis_tilt === '' ? null : Number(formValues.axis_tilt),
      axis_azimuth: formValues.axis_azimuth === '' ? null : Number(formValues.axis_azimuth),
      max_angle: formValues.max_angle === '' ? null : Number(formValues.max_angle),
      rest_position: formValues.rest_position === '' ? null : Number(formValues.rest_position),
      gcr: formValues.gcr === '' ? null : Number(formValues.gcr),
    };
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = normalizePayload(formValues);
      console.log('Payload enviado:', payload);
      const response = await fetch('http://127.0.0.1:8000/api/tracker_angles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os dados da API');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      toastr.error('Erro ao buscar os dados da API');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true); // Marca o formulário como enviado
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = ['latitude', 'longitude', 'start', 'end', 'altitude', 'axis_tilt', 'axis_azimuth', 'max_angle', 'rest_position', 'gcr'];
    const emptyFields = requiredFields.filter(field => {
      const value = (formValues as any)[field];
      return value === '' || value === null || value === undefined;
    });
    
    // Verificar se o fuso horário está vazio (não tem valor padrão)
    if (!formValues.tz || formValues.tz === '') {
      emptyFields.push('tz');
    }
    
    if (emptyFields.length > 0) {
      toastr.error(`Por favor, preencha todos os campos obrigatórios: ${emptyFields.join(', ')}`);
      return;
    }
    
    fetchData();
  };





  return (
    <div className="solar-dashboard">
      <div className="dashboard-container">
        {/* Header Principal com Logo */}
        <div className="dashboard-header fade-in">
          <h1 className="dashboard-title">
            <img 
              src={process.env.PUBLIC_URL + '/logo_tracker.png'} 
              alt="Solar Tracker Logo" 
              className="dashboard-logo"
            />
            Solar Tracker
          </h1>
          <p className="dashboard-subtitle">
            Sistema Inteligente de Análise e Otimização de Painéis Solares
          </p>
        </div>

        {/* KPIs Técnicos */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <KPISection data={data} loading={loading} />
        </div>

        {/* Linha de informações do sistema */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <SystemInfoLine formValues={formValues} data={data} loading={loading} />
        </div>

        {/* Card de Configuração */}
        <div className="config-card fade-in">
          <h2 className="config-title">
            <i className="fas fa-cogs config-icon"></i>
            Configuração do Sistema
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Localização */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-map-marker-alt"></i>
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formValues.latitude}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.latitude)}`}
                  placeholder="Ex: -23.5505"
                  step="any"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-map-marker-alt"></i>
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formValues.longitude}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.longitude)}`}
                  placeholder="Ex: -46.6333"
                  step="any"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-mountain"></i>
                  Altitude (m)
                </label>
                <input
                  type="number"
                  name="altitude"
                  value={formValues.altitude}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.altitude)}`}
                  placeholder="Ex: 760"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-clock"></i>
                  Fuso Horário
                </label>
                <select
                  name="tz"
                  value={formValues.tz}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.tz)}`}
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
              
              {/* Período com DatePicker */}
              <div className="form-group period-fields">
                <PeriodFields
                  formValues={formValues}
                  handleChange={handleChange}
                  handleDateChange={handleDateChange}
                  submitted={submitted}
                  getFieldClassName={getFieldClassName}
                />
              </div>
              
              {/* Configurações do Tracker */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-angle-up"></i>
                  Inclinação do Eixo (°)
                </label>
                <input
                  type="number"
                  name="axis_tilt"
                  value={formValues.axis_tilt}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.axis_tilt)}`}
                  placeholder="Ex: 0"
                  step="any"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-compass"></i>
                  Azimute do Eixo (°)
                </label>
                <input
                  type="number"
                  name="axis_azimuth"
                  value={formValues.axis_azimuth}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.axis_azimuth)}`}
                  placeholder="Ex: 180"
                  step="any"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-arrows-alt-h"></i>
                  Ângulo Máximo (°)
                </label>
                <input
                  type="number"
                  name="max_angle"
                  value={formValues.max_angle}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.max_angle)}`}
                  placeholder="Ex: 45"
                  step="any"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-home"></i>
                  Posição de Repouso (°)
                </label>
                <input
                  type="number"
                  name="rest_position"
                  value={formValues.rest_position}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.rest_position)}`}
                  placeholder="Ex: 0"
                  step="any"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-percentage"></i>
                  GCR
                </label>
                <input
                  type="number"
                  name="gcr"
                  value={formValues.gcr}
                  onChange={handleChange}
                  className={`form-control ${getFieldClassName(formValues.gcr)}`}
                  placeholder="Ex: 0.4"
                  step="0.01"
                  min="0"
                  max="1"
                  required
                />
              </div>
            </div>
            
            <div className="text-center">
              <button type="submit" className="btn-calculate" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span className="ms-2">Processando...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sun"></i>
                    <span className="ms-2">Calcular Ângulos Solares</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Card de Resultados */}
        <div className="results-card fade-in">
          {!loading && data.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="empty-state-title">Aguardando Configuração</h3>
              <p className="empty-state-text">
                Configure os parâmetros do sistema acima e clique em "Calcular Ângulos Solares" para visualizar os resultados da análise.
              </p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="fade-in">
              <DashboardChart
                labels={data.map(d => d.timestamp)}
                datasets={[
                  {
                    label: 'Ângulo do Tracker (θ)',
                    data: data.map(d => parseFloat(d.tracker_theta.replace(',', '.'))),
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true
                  },
                  {
                    label: 'Zenith Solar',
                    data: data.map(d => parseFloat(d.zenith.replace(',', '.'))),
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    fill: true
                  }
                ]}
                title="Análise de Ângulos Solares"
                type="line"
              />
              
              {/* Legenda moderna */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '2rem', 
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(14, 165, 233, 0.1)',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '16px', height: '3px', background: '#0ea5e9', borderRadius: '2px' }}></div>
                  <span>Ângulo do Tracker (θ)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '16px', height: '3px', background: '#06b6d4', borderRadius: '2px' }}></div>
                  <span>Zenith Solar</span>
                </div>
              </div>
              
              {/* Botão de Exportar Planilha */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '1.5rem' 
              }}>
                <button 
                  onClick={exportToExcel}
                  className="btn-export"
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Exportar Planilha Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackerChart;