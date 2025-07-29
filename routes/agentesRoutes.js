import express from 'express';

import {  criarAgente, acharAgente, acharAgentePorId, deletarAgente, atualizarTodosOsAtributosDoAgente, atualizarAtributosDoAgente } from '../controllers/agentesController.js';

const router = express.Router();



router.post('/', criarAgente);

router.get('/', acharAgente);

router.get('/:id', acharAgentePorId);

router.delete('/:id', deletarAgente);

router.put('/:id', atualizarTodosOsAtributosDoAgente);

router.patch('/:id', atualizarAtributosDoAgente);

export default router;