import {v4 as uuidv4} from 'uuid';
import { casos } from '../repositories/casosRepository.js'

export const criarCaso = (req, res) => {
    const caso = req.body;
    if(!req.body.titulo || !req.body.descricao || !req.body.agente_id) {
        res.status(400).send('Dados inválidos.');
    }

    if(!(req.body.status === 'aberto' || req.body.status === 'solucionado')) {
        res.status(400).send('Status inválido. Use aberto ou solucionado.');
    }

    const casoId = uuidv4();
    const casoComId = {...caso, id: casoId}
    casos.push(casoComId);
    res.status(201).json(casoComId);
}

export const acharCaso = (req, res) => {
    res.status(200).send(casos);
}

export const acharCasoPorId = (req, res) => {
    const { id } = req.params; 
    const casoProcurado = casos.find((caso) => caso.id == id);
    if(!casoProcurado) {
        res.status(404).send(`Caso com id:${id} não encontrado.`);
    }
    res.send(casoProcurado);
}

export const deletarCaso = (req, res) => {
    const { id } = req.params; 
    const tam = casos.length;
    casos = casos.filter((caso) =>(caso.id != id));
    if(casos.length == tam) {
        res.status(404).send(`Caso com id:${id} não encontrado.`);
    }
    res.status(204).send(`Caso com id:${id} deletado.`);
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

    const index = casos.findIndex((caso) => caso.id == id);

    if (index == -1) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }

    casos[index] = {
        id, 
        titulo,
        descricao,
        status,
        agente_id
    };

    res.status(200).send(`Caso com id ${id} foi atualizado com sucesso.`);
}

export const atualizarAtributosDoCaso = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, agente_id } = req.body;

    const caso = casos.find((caso) => caso.id === id);

    if (!caso) {
        res.status(404).send(`Caso com id:${id} não encontrado.`);
    }

    if (titulo) caso.titulo = titulo;
    if (descricao) caso.descricao = descricao;
    if (status) {
        if (status !== 'aberto' && status !== 'solucionado') {
            return res.status(400).send('Status inválido. Use aberto ou solucionado.');
        }
        caso.status = status;
    }
    if (agente_id) caso.agente_id = agente_id;

    res.send(`Caso com o id ${id} foi atualizado.`);
}