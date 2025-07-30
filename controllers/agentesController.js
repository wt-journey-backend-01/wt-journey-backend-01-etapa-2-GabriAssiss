import {v4 as uuidv4} from 'uuid';
import { findById, deleteById, save, findAll, updateById } from '../repositories/agentesRepository.js'
import {isValidDate, isFutureDate} from '../utils/errorHandler.js'

export const criarAgente = (req, res) => {
    const agente = req.body;
    if(!req.body.nome || !req.body.dataDeIncorporacao || !req.body.cargo  ) {
        return res.status(400).send('Dados inválidos.');
    }

    if (!isValidDate(agente.dataDeIncorporacao) || isFutureDate(agente.dataDeIncorporacao)) {
        return res.status(400).send("Data de incorporação inválida ou no futuro.");
    }

    const id = uuidv4();
    const AgenteComId = save(id, agente);
    res.status(201).json(AgenteComId);
    
}

export const acharAgente = (req, res) => {
    res.status(200).send(findAll());
}

export const acharAgentePorId = (req, res) => {
    const { id } = req.params; 
    const agenteProcurado = findById(id);
    if(!agenteProcurado) {
        return res.status(404).send(`Agente com id:${id} não encontrado.`);
    }
    res.send(agenteProcurado);
}

export const deletarAgente = (req, res) => {
    const { id } = req.params; 
    const index = deleteById(id);

    if(index == -1) {
        return res.status(404).send(`Agente com id:${id} não encontrado.`);
    }
    res.status(204).end();
}

export const atualizarTodosOsAtributosDoAgente = (req, res) => {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;

    if (!nome || !dataDeIncorporacao || !cargo) {
        return res.status(400).send("Todos os campos (nome, data de Incorporação, cargo) são obrigatórios.");
    }

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do agente.");
    }

    if (!isValidDate(dataDeIncorporacao) || isFutureDate(dataDeIncorporacao)) {
        return res.status(400).send("Data de incorporação inválida ou no futuro.");
    }

    const updatedAgente = updateById(id,  {nome, dataDeIncorporacao, cargo});

    if (!updatedAgente) {
        return res.status(404).send(`Agente com id:${id} não encontrado.`);
    }

    res.status(200).json(updatedAgente);
}

export const atualizarAtributosDoAgente = (req, res) => {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do agente.");
    }

    if (dataDeIncorporacao !== undefined && (!isValidDate(dataDeIncorporacao) || isFutureDate(dataDeIncorporacao))) {
        return res.status(400).send("Data de incorporação inválida ou no futuro.");
    }

    const dadosParaAtualizar = {};
    if (nome !== undefined) dadosParaAtualizar.nome = nome;
    if (dataDeIncorporacao !== undefined) dadosParaAtualizar.dataDeIncorporacao = dataDeIncorporacao;
    if (cargo !== undefined) dadosParaAtualizar.cargo = cargo;

    if (Object.keys(dadosParaAtualizar).length === 0) {
        return res.status(400).send("Nenhum campo válido para atualizar foi enviado.");
    }

    const updatedAgente = updateById(id, dadosParaAtualizar);
    
    if (!updatedAgente) {
        return res.status(404).send(`Agente com id:${id} não encontrado.`);
    }

    res.status(200).json(updatedAgente);
}