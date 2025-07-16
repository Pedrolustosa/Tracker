// src/components/TrackerChart.tsx

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import TrackerForm from './TrackerForm';

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
    altitude: '',
    tz: 'America/Fortaleza',
    axis_tilt: '',
    axis_azimuth: '',
    max_angle: '',
    reposo_tracker: '',
    gcr: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tracker_angles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
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
    fetchData();
  };

  const chartData = {
    labels: data.map(item => item.timestamp),
    datasets: [
      {
        label: 'Ângulo do Tracker (tracker_theta)',
        data: data.map(item => parseFloat(item.tracker_theta.replace(',', '.'))),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Zenith',
        data: data.map(item => parseFloat(item.zenith.replace(',', '.'))),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gráfico de Ângulos do Tracker Solar',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}°`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Horário',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Ângulo (graus)',
        },
      },
    },
  };

  return (
    <div className="container-fluid">
      {/* Seção Hero */}
      <div className="hero-section fade-in text-center" style={{ marginBottom: 24 }}>
        <div className="d-flex align-items-center justify-content-center" style={{ gap: 18 }}>
          <img
            src={process.env.PUBLIC_URL + '/logo_tracker.png'}
            alt="Logo Rastreador Solar"
            style={{ height: 58, width: 58, objectFit: 'contain', borderRadius: 14, boxShadow: '0 4px 16px rgba(44,62,80,0.07)' }}
          />
          <h1 className="hero-title mb-0" style={{ fontWeight: 800, fontSize: '2.1rem', color: 'var(--solar-green)' }}>
            Rastreador Solar
          </h1>
        </div>
        <p className="hero-subtitle mt-2">
          Sistema Inteligente de Análise de Ângulos para Painéis Solares
        </p>
      </div>

      <div className="row">
        {/* Seção do Formulário */}
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="card slide-in">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <span className="section-icon me-2">⚙️</span>
                <h5 className="mb-0">Configuração do Sistema</h5>
              </div>
            </div>
            <div className="card-body">
              <TrackerForm 
                formValues={formValues} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
                submitted={submitted} 
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Seção de Resultados */}
        <div className="col-lg-7 col-md-6">
          {loading && (
            <div className="loading-container fade-in">
              <div className="spinner-border" role="status">
                <span className="sr-only">Carregando...</span>
              </div>
              <div className="loading-text">
                <strong>Processando dados solares...</strong>
                <br />
                <small>Calculando ângulos otimizados do rastreador</small>
              </div>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="card fade-in">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <span style={{ fontSize: '4rem', opacity: 0.3 }}>📊</span>
                </div>
                <h5 className="text-muted mb-3">Aguardando Configuração</h5>
                <p className="text-muted">
                  Configure os parâmetros do sistema e clique em "Calcular Ângulos" 
                  para visualizar os resultados da análise solar.
                </p>
              </div>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="results-section fade-in">
              <div className="results-header">
                <h3 className="results-title">
                  <span className="section-icon me-2">📈</span>
                  Análise de Ângulos Solares
                </h3>
                <div className="results-info">
                  {data.length} pontos de dados
                </div>
              </div>
              
              <div className="chart-container">
                <Line data={chartData} options={options} />
              </div>
              
              <div className="mt-4 p-3" style={{ 
                background: 'var(--solar-light-gray)', 
                borderRadius: '10px',
                borderLeft: '4px solid var(--solar-orange)'
              }}>
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="mb-2">
                      <strong style={{ color: 'var(--solar-green)' }}>📍 Localização</strong>
                    </div>
                    <small className="text-muted">
                      {formValues.latitude}°, {formValues.longitude}°
                    </small>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-2">
                      <strong style={{ color: 'var(--solar-green)' }}>📅 Período</strong>
                    </div>
                    <small className="text-muted">
                      {formValues.start} até {formValues.end}
                    </small>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-2">
                      <strong style={{ color: 'var(--solar-green)' }}>🔧 Configuração</strong>
                    </div>
                    <small className="text-muted">
                      Inclinação: {formValues.axis_tilt}° | Azimute: {formValues.axis_azimuth}°
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Informações Adicionais */}
      {!loading && data.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card fade-in">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <span className="section-icon me-2">💡</span>
                  <h5 className="mb-0">Informações do Sistema</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 text-center mb-3">
                    <div className="p-3" style={{ 
                      background: 'linear-gradient(135deg, var(--solar-gold), var(--solar-yellow))',
                      borderRadius: '15px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '2rem' }}>☀️</div>
                      <strong>Energia Solar</strong>
                      <br />
                      <small>Fonte Renovável</small>
                    </div>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="p-3" style={{ 
                      background: 'linear-gradient(135deg, var(--solar-light-green), var(--solar-green))',
                      borderRadius: '15px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '2rem' }}>🌱</div>
                      <strong>Sustentável</strong>
                      <br />
                      <small>Zero Emissões</small>
                    </div>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="p-3" style={{ 
                      background: 'linear-gradient(135deg, var(--solar-orange), var(--solar-yellow))',
                      borderRadius: '15px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '2rem' }}>⚡</div>
                      <strong>Eficiência</strong>
                      <br />
                      <small>Máximo Aproveitamento</small>
                    </div>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="p-3" style={{ 
                      background: 'linear-gradient(135deg, var(--solar-yellow), var(--solar-orange))',
                      borderRadius: '15px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '2rem' }}>🔧</div>
                      <strong>Automação</strong>
                      <br />
                      <small>Rastreamento Inteligente</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerChart;