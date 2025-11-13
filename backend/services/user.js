const express = require('express');
const router = express.Router();

const users = []; // Simulação de banco de dados em memória

// RF09: Criação de Perfil de Usuário
router.post('/profile', (req, res) => {
    const { name, email, birthdate } = req.body;

    if (!name || !email || !birthdate) {
        return res.status(400).send('Campos obrigatórios (nome, email, data de nascimento) não preenchidos.');
    }

    if (users.find(u => u.email === email)) {
        return res.status(409).send('O e-mail fornecido já está em uso.');
    }

    const newUser = {
        id: `user${Date.now()}`,
        name,
        email,
        birthdate,
        medications: [], // RF10: Inicializa o histórico de medicamentos
        prescriptions: [], // RF10: Inicializa o histórico de receitas
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// ... (outros endpoints de perfil e medicação)

// RF10: Upload de Receita
router.post('/profile/:userId/prescriptions', (req, res) => {
    const { userId } = req.params;
    const { prescriptionData } = req.body; // Base64-encoded string

    if (!prescriptionData) {
        return res.status(400).send('Dados da receita são obrigatórios.');
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }

    const newPrescription = {
        id: `presc${Date.now()}`,
        data: prescriptionData,
        uploadedAt: new Date().toISOString(),
    };

    user.prescriptions.push(newPrescription);
    res.status(201).json(newPrescription);
});

// RF10: Consultar Receitas
router.get('/profile/:userId/prescriptions', (req, res) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }

    res.status(200).json(user.prescriptions);
});

// RF10: Deletar Receita
router.delete('/profile/:userId/prescriptions/:prescriptionId', (req, res) => {
    const { userId, prescriptionId } = req.params;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }

    const prescriptionIndex = user.prescriptions.findIndex(p => p.id === prescriptionId);

    if (prescriptionIndex === -1) {
        return res.status(404).send('Receita não encontrada.');
    }

    user.prescriptions.splice(prescriptionIndex, 1);
    res.status(204).send();
});


// Manter os endpoints existentes
router.get('/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }
    res.status(200).json(user);
});

router.put('/profile/:userId', (req, res) => {
    const { userId } = req.params;
    const { name, birthdate } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }
    if (name) user.name = name;
    if (birthdate) user.birthdate = birthdate;
    res.status(200).json(user);
});

router.post('/profile/:userId/medications', (req, res) => {
    const { userId } = req.params;
    const { name, dosage } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }
    const newMedication = {
        id: `med${Date.now()}`,
        name,
        dosage,
    };
    user.medications.push(newMedication);
    res.status(201).json(newMedication);
});

router.get('/profile/:userId/medications', (req, res) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }
    res.status(200).json(user.medications);
});

router.delete('/profile/:userId/medications/:medicationId', (req, res) => {
    const { userId, medicationId } = req.params;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }
    const medicationIndex = user.medications.findIndex(m => m.id === medicationId);
    if (medicationIndex === -1) {
        return res.status(404).send('Medicamento não encontrado no histórico do usuário.');
    }
    user.medications.splice(medicationIndex, 1);
    res.status(204).send();
});

module.exports = router;