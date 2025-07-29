import {v4 as uuidv4} from 'uuid';
import {  findById, deleteById, save, findAll } from '../repositories/casosRepository.js'

export const criarCaso = (req, res) => {
    const caso = req.body;
    if(!req.body.titulo || !req.body.descricao || !req.body.agente_id) {
        res.status(400).send('Dados inválidos.');
    }

    if(!(req.body.status === 'aberto' || req.body.status === 'solucionado')) {
        res.status(400).send('Status inválido. Use aberto ou solucionado.');
    }
    else{
        const casoComId = save(uuidv4(), caso);
        res.status(201).json(casoComId);
    }
}

export const acharCaso = (req, res) => {
    res.status(200).send(findAll());
}

export const acharCasoPorId = (req, res) => {
    const { id } = req.params; 
    const casoProcurado = findById(id);
    if(!casoProcurado) {
        res.status(404).send(`Caso com id:${id} não encontrado.`);
    }
    res.send(casoProcurado);
}

export const deletarCaso = (req, res) => {
    const { id } = req.params; 
    const index = deleteById(id);

    if(index == -1) {
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

    const caso = findById(id);

    if (!caso) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }

    caso.titulo = titulo;
    caso.descricao = descricao;
    caso.status = status;
    caso.agente_id = agente_id;

    res.status(200).send(`Caso com id ${id} foi atualizado com sucesso.`);
}

export const atualizarAtributosDoCaso = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, agente_id } = req.body;

    const caso = findById(id);

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