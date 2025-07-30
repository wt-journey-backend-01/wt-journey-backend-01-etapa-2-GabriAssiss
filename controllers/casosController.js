import {v4 as uuidv4} from 'uuid';
import {  findById, deleteById, save, findAll, updateById } from '../repositories/casosRepository.js'
import { findById as findAgenteById} from '../repositories/agentesRepository.js'

export const criarCaso = (req, res) => {
    const caso = req.body;
    if(!req.body.titulo || !req.body.descricao || !req.body.agente_id) {
        return res.status(400).send('Dados inválidos.');
    }

    if(!findAgenteById(req.body.agente_id)) {
        return res.status(404).send('Id do agente inválido.');
    }

    if(!(req.body.status === 'aberto' || req.body.status === 'solucionado')) {
        return res.status(400).send('Status inválido. Use aberto ou solucionado.');
    }

    const id = uuidv4();
    const casoComId = save(id, caso);
    res.status(201).json(casoComId);
    
}

export const acharCaso = (req, res) => {
    res.status(200).send(findAll());
}

export const acharCasoPorId = (req, res) => {
    const { id } = req.params; 
    const casoProcurado = findById(id);
    if(!casoProcurado) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }
    res.send(casoProcurado);
}

export const deletarCaso = (req, res) => {
    const { id } = req.params; 
    const index = deleteById(id);

    if(index == -1) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }
    res.status(204).end();
}

export const atualizarTodosOsAtributosDoCaso = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, agente_id } = req.body;

    if (!titulo || !descricao || !status || !agente_id) {
        return res.status(400).send("Todos os campos (titulo, descricao, status, agente_id) são obrigatórios.");
    }

    if (status !== 'aberto' && status !== 'solucionado') {
        return res.status(400).send("Status inválido. Use 'aberto' ou 'solucionado'.");
    }

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do caso.");
    }
    
    if(!findAgenteById(agente_id)) {
        return res.status(404).send('Id do agente inválido.');
    }

    const casoAtualizado = updateById(id,  { titulo, descricao, status, agente_id });
    
    if (!casoAtualizado) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }

    res.status(200).json(casoAtualizado);
}

export const atualizarAtributosDoCaso = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, agente_id } = req.body;

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do caso.");
    }

    if (status !== undefined && !(status === 'aberto' || status === 'solucionado')) {
        return res.status(400).send('Status inválido. Use aberto ou solucionado.');
    }

    if (agente_id !== undefined && !findAgenteById(agente_id)) {
        return res.status(404).send('Id do agente inválido.');
    }   

    const dadosParaAtualizar = {};
    if (titulo !== undefined) dadosParaAtualizar.titulo = titulo;
    if (descricao !== undefined) dadosParaAtualizar.descricao = descricao;
    if (status !== undefined) dadosParaAtualizar.status = status;
    if (agente_id !== undefined) dadosParaAtualizar.agente_id = agente_id;

    if (Object.keys(dadosParaAtualizar).length === 0) {
        return res.status(400).send("Nenhum campo válido para atualizar foi enviado.");
    }

    const casoAtualizado = updateById(id, dadosParaAtualizar);
    
    if (!casoAtualizado) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }

    res.status(200).json(casoAtualizado);
}
