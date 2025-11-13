const request = require('supertest');
const express = require('express');
const userRouter = require('../backend/services/user');

const app = express();
app.use(express.json());
app.use('/', userRouter);

describe('User Service API - Full Suite', () => {

    let newUserId;

    // Suite para RF09: Gerenciamento de Perfil
    describe('Profile Management (RF09)', () => {
        test('Should create a new user profile with empty medication/prescription lists', async () => {
            const response = await request(app)
                .post('/profile')
                .send({ name: 'John Doe', email: 'john.doe@example.com', birthdate: '1990-01-01' });

            expect(response.status).toBe(201);
            newUserId = response.body.id;
        });
    });

    // Suite para RF10: Histórico de Medicamentos
    describe('Medication History (RF10)', () => {
        let medicationId;

        test('Should add a new medication to a user profile', async () => {
            const response = await request(app)
                .post(`/profile/${newUserId}/medications`)
                .send({ name: 'Paracetamol', dosage: '500mg' });

            expect(response.status).toBe(201);
            medicationId = response.body.id;
        });

        test('Should retrieve the medication list for a user', async () => {
            const response = await request(app).get(`/profile/${newUserId}/medications`);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });

        test('Should delete a medication from a user profile', async () => {
            await request(app).delete(`/profile/${newUserId}/medications/${medicationId}`);
            const getResponse = await request(app).get(`/profile/${newUserId}/medications`);
            expect(getResponse.body.length).toBe(0);
        });
    });

    // Suite para RF10: Histórico de Receitas
    describe('Prescription History (RF10)', () => {
        let prescriptionId;
        const prescriptionData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // Exemplo de base64

        test('Should upload a new prescription for a user', async () => {
            const response = await request(app)
                .post(`/profile/${newUserId}/prescriptions`)
                .send({ prescriptionData });
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            prescriptionId = response.body.id;
        });

        test('Should retrieve the prescription list for a user', async () => {
            const response = await request(app).get(`/profile/${newUserId}/prescriptions`);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].data).toBe(prescriptionData);
        });

        test('Should delete a prescription from a user profile', async () => {
            await request(app).delete(`/profile/${newUserId}/prescriptions/${prescriptionId}`);
            const getResponse = await request(app).get(`/profile/${newUserId}/prescriptions`);
            expect(getResponse.body.length).toBe(0);
        });
    });
});