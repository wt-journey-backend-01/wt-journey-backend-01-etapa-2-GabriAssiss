export let agentes = [];


export const save = (idAgente, agente) => {
    const agenteComId = {...agente, id: idAgente};
    agentes.push(agenteComId);
    return agenteComId;
}

export const findById = (id) => {
    return agentes.find( agente =>  agente.id == id);
} 

export const deleteById = (id) => {
    const index = agentes.findIndex((agente) => agente.id == id);
    if(index == -1)
        return -1;
    agentes = agentes.filter((agente) =>(agente.id != id));
}

export const findAll = () => {
    return agentes;
}
