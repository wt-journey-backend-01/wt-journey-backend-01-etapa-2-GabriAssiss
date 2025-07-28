import express from 'express';
import {v4 as uuidv4} from 'uuid';
import { criarCaso, acharCaso, acharCasoPorId, atualizarAtributosDoCaso, atualizarTodosOsAtributosDoCaso, deletarCaso } from '../controllers/casosController.js';

const router = express.Router();

let casos = [];

router.post('/', criarCaso);

router.get('/', acharCaso);

router.get('/:id', acharCasoPorId);

router.delete('/:id', deletarCaso);

router.put('/:id', atualizarTodosOsAtributosDoCaso);

router.patch('/:id', atualizarAtributosDoCaso);

export default router;