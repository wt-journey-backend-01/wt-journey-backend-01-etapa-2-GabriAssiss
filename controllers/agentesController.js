import {v4 as uuidv4} from 'uuid';
import { findById, deleteById, save, findAll } from '../repositories/agentesRepository.js'

export const criarAgente = (req, res) => {
    const agente = req.body;
    if(!req.body.nome || !req.body.dataDeIncorporacao || !req.body.cargo  ) {
        return res.status(400).send('Dados inválidos.');
    }

    if (!isValidDate(agente.dataDeIncorporacao) || isFutureDate(agente.dataDeIncorporacao)) {
        return res.status(400).send("Data de incorporação inválida ou no futuro.");
    }

    const AgenteComId = save(uuidv4(), agente);
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
    res.status(204);
}

export const atualizarTodosOsAtributosDoAgente = (req, res) => {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;

    if (!nome || !dataDeIncorporacao || !cargo) {
        return res.status(400).send("Todos os campos (nome, data de Incorporação, cargo) são obrigatórios.");
    }


    const agente = findById(id);

    if (!agente) {
        return res.status(404).send(`Agente com id:${id} não encontrado.`);
    }

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do agente.");
    }

    agente.nome = nome;
    agente.dataDeIncorporacao = dataDeIncorporacao;
    agente.cargo = cargo;

    res.status(200).send(`Agente com id ${id} foi atualizado com sucesso.`);
}

export const atualizarAtributosDoAgente = (req, res) => {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;

    const agente = findById(id);

    if (!agente) {
        return res.status(404).send(`Agente com id:${id} não encontrado.`);
    }
    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do agente.");
    }

    if (nome) {agente.nome = nome;}
    if (dataDeIncorporacao) {agente.dataDeIncorporacao = dataDeIncorporacao;}
    if (cargo) {agente.cargo = cargo;}

    res.send(`Agente com o id ${id} foi atualizado.`);
}