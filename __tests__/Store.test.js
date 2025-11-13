const request = require('supertest');
const express = require('express');
const storeRouter = require('../backend/services/store');

const app = express();
app.use(express.json());
app.use('/', storeRouter);

describe('Store Service API - With User ID', () => {

    const userId = 'user123';

    // Teste para RF06: Catálogo e Pesquisa
    test('Should return the full catalog or search results', async () => {
        let response = await request(app).get('/catalog');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);

        response = await request(app).get('/catalog?search=ibuprofeno');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Ibuprofeno');
    });

    // Teste para RF07: Processo de Compra com userId
    test('Should create a new order and associate it with a user', async () => {
        const response = await request(app)
            .post('/checkout')
            .send({
                userId,
                items: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }],
                paymentMethod: 'Cartão de Crédito',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.userId).toBe(userId);
        expect(response.body.status).toBe('Processing');
        expect(response.body.totalValue).toBe(32.50); // (2 * 10.00) + (1 * 12.50)
    });

    // Teste para RF08: Histórico de Pedidos por userId
    test('Should return the order history for a specific user', async () => {
        // Primeiro, cria uma nova ordem para um usuário diferente
        await request(app).post('/checkout').send({
            userId: 'anotherUser',
            items: [{ id: 1, quantity: 1 }],
            paymentMethod: 'Pix',
        });

        const response = await request(app).get(`/orders?userId=${userId}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Deve retornar apenas o pedido do 'user123'
        expect(response.body.length).toBe(1);
        expect(response.body[0].userId).toBe(userId);
    });

    test('Should return an empty array for a user with no orders', async () => {
        const response = await request(app).get('/orders?userId=newUser');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});