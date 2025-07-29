import express from 'express';

import { criarCaso, acharCaso, acharCasoPorId, atualizarAtributosDoCaso, atualizarTodosOsAtributosDoCaso, deletarCaso } from '../controllers/casosController.js';

const router = express.Router();

router.post('/', criarCaso);

router.get('/', acharCaso);

router.get('/:id', acharCasoPorId);

router.delete('/:id', deletarCaso);

router.put('/:id', atualizarTodosOsAtributosDoCaso);

router.patch('/:id', atualizarAtributosDoCaso);

export default router;