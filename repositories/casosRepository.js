export let casos = [];


export const save = (idCaso, caso) => {
    const casoComId = {...caso, id: idCaso};
    casos.push(casoComId);
    return casoComId;
}

export const findById = (id) => {
    return casos.find( caso =>  caso.id == id);
} 

export const deleteById = (id) => {
    const index = casos.findIndex((caso) => caso.id == id);
    if(index == -1)
        return -1;
    casos = casos.filter((caso) =>(caso.id != id));
}

export const findAll = () => {
    return casos;
}
