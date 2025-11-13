














































































































const express = require('express');
const router = express.Router();

const medications = [];
const schedules = [];

// RF01: Cadastro de Medicamento
router.post('/medication', (req, res) => {
  const { name, dosage, concentration, format, initialQuantity, unitOfMeasurement } = req.body;

  if (!name || !dosage || !initialQuantity) {
    return res.status(400).send('Campos obrigatórios não preenchidos.');
  }

  if (initialQuantity <= 0) {
    return res.status(400).send('A quantidade inicial deve ser positiva.');
  }

  const newMedication = {
    id: Date.now(),
    name,
    dosage,
    concentration,
    format,
    initialQuantity,
    quantity: initialQuantity,
    unitOfMeasurement,
    createdAt: new Date().toISOString(),
  };

  medications.push(newMedication);

  res.status(201).json(newMedication);
});

// RF02: Agendamento de Uso
router.post('/schedule', (req, res) => {
  const { medicationId, frequency, times, duration, instructions } = req.body;

  if (!medicationId || !frequency || !times || !duration) {
    return res.status(400).send('Campos obrigatórios não preenchidos.');
  }

  const medication = medications.find(m => m.id === medicationId);
  if (!medication) {
    return res.status(404).send('Medicamento não encontrado.');
  }

  const newSchedule = {
    id: Date.now(),
    medicationId,
    frequency,
    times,
    duration,
    instructions,
    createdAt: new Date().toISOString(),
  };

  schedules.push(newSchedule);

  res.status(201).json(newSchedule);
});

// Função para verificar o estoque e enviar notificação
const checkStockAndSendNotification = (medicationId) => {
  const medication = medications.find(m => m.id === medicationId);
  const schedule = schedules.find(s => s.medicationId === medicationId);

  // O valor de X é configurável, usando 7 como padrão
  const alertThreshold = 7; 

  if (medication && schedule) {
    const dosesPerDay = schedule.times.length;
    const daysRemaining = medication.quantity / dosesPerDay;

    if (daysRemaining < alertThreshold) {
      console.log(`ALERTA: Estoque baixo para ${medication.name}. Restam aproximadamente ${Math.floor(daysRemaining)} dias.`);
      // Aqui seria a chamada para o serviço de Push Notification
      // Ex: sendPushNotification(user.token, `Estoque de ${medication.name} está acabando!`, `Restam apenas ${Math.floor(daysRemaining)} dias. Toque para comprar.`);
    }
  }
};


// RF03: Controle de Estoque
router.post('/stock', (req, res) => {
    const { medicationId, quantityTaken } = req.body;

    if (!medicationId || quantityTaken == null) {
        return res.status(400).send('Campos obrigatórios não preenchidos: medicationId, quantityTaken.');
    }

    if (quantityTaken <= 0) {
        return res.status(400).send('A quantidade retirada deve ser positiva.');
    }

    const medication = medications.find(m => m.id === medicationId);
    if (!medication) {
        return res.status(404).send('Medicamento não encontrado.');
    }

    if (medication.quantity < quantityTaken) {
        return res.status(400).send('Estoque insuficiente.');
    }

    medication.quantity -= quantityTaken;

    // RF04: Lógica de Alerta de Reposição é acionada aqui
    checkStockAndSendNotification(medicationId);


    res.status(200).json(medication);
});

// RF04: Endpoint para consulta de medicamentos com estoque baixo
router.get('/stock/alert', (req, res) => {
    const alertThreshold = parseInt(req.query.threshold, 10) || 7;
    const lowStockMedications = [];

    medications.forEach(medication => {
        const schedule = schedules.find(s => s.medicationId === medication.id);
        if (schedule) {
            const dosesPerDay = schedule.times.length;
            const daysRemaining = medication.quantity / dosesPerDay;

            if (daysRemaining < alertThreshold) {
                lowStockMedications.push({
                    ...medication,
                    daysRemaining: Math.floor(daysRemaining),
                });
            }
        }
    });

    if (lowStockMedications.length > 0) {
        res.status(200).json(lowStockMedications);
    } else {
        res.status(200).send('Nenhum medicamento com estoque baixo.');
    }
});

// RF05: OCR de Receitas
router.post('/recipe/ocr', (req, res) => {
  // Simulação da chamada a um serviço de OCR (ex: Google Vision API, AWS Textract)
  // Em um cenário real, aqui você receberia um arquivo de imagem,
  // enviaria para o serviço de ML e processaria a resposta.

  console.log('Simulando processamento OCR de uma receita...');

  // Dados mocados que seriam extraídos da imagem da receita
  const extractedData = {
    suggestedMedication: {
      name: 'Ibuprofeno',
      dosage: '600mg',
      frequency: 'daily',
      times: ['12:00'],
      instructions: 'Tomar após o almoço',
    },
    confidenceScore: 0.95 // Simula a confiança do modelo de ML
  };

  // A resposta deve ser uma sugestão de preenchimento para os campos de RF01 e RF02
  res.status(200).json(extractedData);
});

module.exports = router;