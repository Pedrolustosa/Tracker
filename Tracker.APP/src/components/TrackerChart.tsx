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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="container mt-5">
      <Card>
        <Card.Header>
          <h2>Gráfico de Ângulos do Tracker</h2>
        </Card.Header>
        <Card.Body>
          <TrackerForm formValues={formValues} handleChange={handleChange} handleSubmit={handleSubmit} submitted={submitted} />

          {loading ? (
            <Spinner animation="border" role="status" className="mt-3">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          ) : (
            <Line data={chartData} options={options} className="mt-4" />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrackerChart;