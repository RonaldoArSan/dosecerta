const request = require('supertest');
const express = require('express');
const healthRouter = require('../backend/services/health');

const app = express();
app.use(express.json());
app.use('/', healthRouter);

describe('Health Service API', () => {

  let medicationId;

  // Teste para RF01: Cadastro de Medicamento
  test('Should register a new medication', async () => {
    const response = await request(app)
      .post('/medication')
      .send({
        name: 'Paracetamol',
        dosage: '500mg',
        initialQuantity: 20,
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    medicationId = response.body.id;
  });

  // Teste para RF02: Agendamento de Uso
  test('Should schedule medication use', async () => {
    const response = await request(app)
      .post('/schedule')
      .send({
        medicationId,
        frequency: 'daily',
        times: ['08:00', '20:00'], // 2 vezes ao dia
        duration: '10 dias',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  // Teste para RF03 e RF04: Controle de Estoque e Alerta de Reposição
  test('Should update stock and trigger alert if low', async () => {
    // Consumir 15 unidades, deixando 5 no estoque (20 inicial - 15 consumido)
    let response = await request(app)
      .post('/stock')
      .send({ medicationId, quantityTaken: 15 });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(5);

    // O agendamento é de 2 doses/dia. Estoque de 5 vai durar 2.5 dias.
    // O alerta padrão é para menos de 7 dias, então deve ser acionado.
    // Para verificar o alerta, vamos usar o endpoint de consulta
    response = await request(app).get('/stock/alert');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    const alertMedication = response.body.find(m => m.id === medicationId);
    expect(alertMedication).toBeDefined();
    expect(alertMedication.daysRemaining).toBe(2); // Math.floor(2.5)
  });

});