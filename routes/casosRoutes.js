import express from 'express';

import { criarCaso, acharCaso, acharCasoPorId, atualizarAtributosDoCaso, atualizarTodosOsAtributosDoCaso, deletarCaso } from '../controllers/casosController.js';

const router = express.Router();

/**
 * @openapi
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agente não encontrado
 */
router.post('/', criarCaso);

/**
 * @openapi
 * /casos:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos
 */
router.get('/', acharCaso);

/**
 * @openapi
 * /casos/{id}:
 *   get:
 *     summary: Busca um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso encontrado
 *       404:
 *         description: Caso não encontrado
 */
router.get('/:id', acharCasoPorId);


/**
 * @openapi
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Caso removido com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.delete('/:id', deletarCaso);

/**
 * @openapi
 * /casos/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um caso
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso ou agente não encontrado
 */
router.put('/:id', atualizarTodosOsAtributosDoCaso);

/**
 * @openapi
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Caso ou agente não encontrado
 */
router.patch('/:id', atualizarAtributosDoCaso);

export default router;