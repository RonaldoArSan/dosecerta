const express = require('express');
const router = express.Router();

const catalog = [
    { id: 1, name: 'Paracetamol', activeIngredient: 'Paracetamol', price: 10.00 },
    { id: 2, name: 'Ibuprofeno', activeIngredient: 'Ibuprofeno', price: 12.50 },
];

const orders = [];

// RF06: Catálogo e Pesquisa
router.get('/catalog', (req, res) => {
    const { search } = req.query;
    if (search) {
        const results = catalog.filter(med => 
            med.name.toLowerCase().includes(search.toLowerCase()) || 
            med.activeIngredient.toLowerCase().includes(search.toLowerCase())
        );
        return res.status(200).json(results);
    }
    res.status(200).json(catalog);
});

// RF07: Processo de Compra
router.post('/checkout', (req, res) => {
    const { userId, items, paymentMethod } = req.body; // Adicionado userId

    if (!userId) {
        return res.status(400).send('O ID do usuário é obrigatório.');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send('O carrinho de compras está vazio.');
    }

    if (!paymentMethod) {
        return res.status(400).send('Método de pagamento não especificado.');
    }

    let totalValue = 0;
    const orderItems = [];

    items.forEach(item => {
        const catalogItem = catalog.find(ci => ci.id === item.id);
        if (catalogItem) {
            totalValue += catalogItem.price * item.quantity;
            orderItems.push({ ...catalogItem, quantity: item.quantity });
        }
    });

    if (orderItems.length === 0) {
        return res.status(400).send('Nenhum item válido no carrinho.');
    }

    const newOrder = {
        id: Date.now(),
        userId, // Armazenando o ID do usuário
        items: orderItems,
        totalValue,
        paymentMethod,
        status: 'Processing',
        createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});

// RF08: Histórico de Pedidos
router.get('/orders', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).send('O ID do usuário é obrigatório para consultar o histórico.');
    }

    const userOrders = orders.filter(order => order.userId === userId);

    res.status(200).json(userOrders);
});

module.exports = router;