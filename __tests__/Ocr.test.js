const request = require('supertest');
const express = require('express');
const healthRouter = require('../backend/services/health');

const app = express();
app.use(express.json());
app.use('/', healthRouter);

describe('Health Service API - OCR', () => {

  // Teste para RF05: OCR de Receitas (Simulado)
  test('Should return simulated OCR data from a recipe', async () => {
    const response = await request(app)
      .post('/recipe/ocr')
      .send(); // O corpo da requisição pode ser vazio para a simulação

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('suggestedMedication');
    expect(response.body.suggestedMedication).toHaveProperty('name', 'Ibuprofeno');
    expect(response.body.suggestedMedication).toHaveProperty('dosage', '600mg');
    expect(response.body).toHaveProperty('confidenceScore', 0.95);
  });

});