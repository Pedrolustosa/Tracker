// src/components/TrackerForm.tsx

import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

interface TrackerFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitted: boolean; // Adiciona o estado de enviado
}

const TrackerForm: React.FC<TrackerFormProps> = ({ formValues, handleChange, handleSubmit, submitted }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="formLatitude">
            <Form.Label>Latitude *</Form.Label>
            <Form.Control 
              type="number" 
              name="latitude" 
              value={formValues.latitude} 
              onChange={handleChange} 
              required 
              placeholder="Insira a latitude" 
              className={submitted && !formValues.latitude ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: -9.41
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formLongitude">
            <Form.Label>Longitude *</Form.Label>
            <Form.Control 
              type="number" 
              name="longitude" 
              value={formValues.longitude} 
              onChange={handleChange} 
              required 
              placeholder="Insira a longitude" 
              className={submitted && !formValues.longitude ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: -38.02
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formAltitude">
            <Form.Label>Altitude *</Form.Label>
            <Form.Control 
              type="number" 
              name="altitude" 
              value={formValues.altitude} 
              onChange={handleChange} 
              required 
              placeholder="Insira a altitude" 
              className={submitted && !formValues.altitude ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 254
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="formStart">
            <Form.Label>Data de Início *</Form.Label>
            <Form.Control 
              type="date" 
              name="start" 
              value={formValues.start} 
              onChange={handleChange} 
              required 
              className={submitted && !formValues.start ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 2025-07-01
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formEnd">
            <Form.Label>Data de Fim *</Form.Label>
            <Form.Control 
              type="date" 
              name="end" 
              value={formValues.end} 
              onChange={handleChange} 
              required 
              className={submitted && !formValues.end ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 2025-07-01
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formTZ">
            <Form.Label>Fuso Horário *</Form.Label>
            <Form.Control 
              type="text" 
              name="tz" 
              value={formValues.tz} 
              onChange={handleChange} 
              required 
              placeholder="Insira o fuso horário" 
              className={submitted && !formValues.tz ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: America/Fortaleza
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="formAxisTilt">
            <Form.Label>Inclinação do Eixo *</Form.Label>
            <Form.Control 
              type="number" 
              name="axis_tilt" 
              value={formValues.axis_tilt} 
              onChange={handleChange} 
              required 
              placeholder="Insira a inclinação do eixo" 
              className={submitted && !formValues.axis_tilt ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 0
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formAxisAzimuth">
            <Form.Label>Azimute do Eixo *</Form.Label>
            <Form.Control 
              type="number" 
              name="axis_azimuth" 
              value={formValues.axis_azimuth} 
              onChange={handleChange} 
              required 
              placeholder="Insira o azimute do eixo" 
              className={submitted && !formValues.axis_azimuth ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 180
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formMaxAngle">
            <Form.Label>Ângulo Máximo *</Form.Label>
            <Form.Control 
              type="number" 
              name="max_angle" 
              value={formValues.max_angle} 
              onChange={handleChange} 
              required 
              placeholder="Insira o ângulo máximo" 
              className={submitted && !formValues.max_angle ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 55
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="formReposoTracker">
            <Form.Label>Ângulo de Repouso do Tracker *</Form.Label>
            <Form.Control 
              type="number" 
              name="reposo_tracker" 
              value={formValues.reposo_tracker} 
              onChange={handleChange} 
              required 
              placeholder="Insira o ângulo de repouso" 
              className={submitted && !formValues.reposo_tracker ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 0
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formGCR">
            <Form.Label>GCR *</Form.Label>
            <Form.Control 
              type="number" 
              name="gcr" 
              value={formValues.gcr} 
              onChange={handleChange} 
              required 
              placeholder="Insira o GCR" 
              className={submitted && !formValues.gcr ? 'is-invalid' : 'is-valid'} // Validação
            />
            <Form.Text muted>
              Exemplo: 0.3014
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit" className="mt-3">
        Enviar
      </Button>
    </Form>
  );
};

export default TrackerForm;