import express from 'express';

import {  criarAgente, acharAgente, acharAgentePorId, deletarAgente, atualizarTodosOsAtributosDoAgente, atualizarAtributosDoAgente } from '../controllers/agentesController.js';

const router = express.Router();


/**
 * @openapi
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarAgente);

/**
 * @openapi
 * /agentes:
 *   get:
 *     summary: Lista todos os agentes
 *     tags: [Agentes]
 *     responses:
 *       200:
 *         description: Lista de agentes
 */
router.get('/', acharAgente);

/**
 * @openapi
 * /agentes/{id}:
 *   get:
 *     summary: Busca um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agente encontrado
 *       404:
 *         description: Agente não encontrado
 */
router.get('/:id', acharAgentePorId);

/**
 * @openapi
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Agente removido
 *       404:
 *         description: Agente não encontrado
 */
router.delete('/:id', deletarAgente);

/**
 * @openapi
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um agente
 *     tags: [Agentes]
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
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Agente não encontrado
 */
router.put('/:id', atualizarTodosOsAtributosDoAgente);

/**
 * @openapi
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um agente
 *     tags: [Agentes]
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
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agente não encontrado
 */
router.patch('/:id', atualizarAtributosDoAgente);

export default router;