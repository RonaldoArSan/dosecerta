const express = require('express');
const router = express.Router();

const healthService = require('../services/health');
const storeService = require('../services/store');
const userService = require('../services/user'); // Importando o novo serviço

router.use('/health', healthService);
router.use('/store', storeService);
router.use('/user', userService); // Adicionando a nova rota

module.exports = router;