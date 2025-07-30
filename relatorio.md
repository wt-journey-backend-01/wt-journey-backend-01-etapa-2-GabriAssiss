<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 5 créditos restantes para usar o sistema de feedback AI.

# Feedback para GabriAssiss:

Nota final: **83.1/100**

# Olá, GabriAssiss! 👋🚀

Antes de tudo, parabéns pelo empenho e dedicação nesse desafio! 🎉 Você estruturou seu projeto de forma muito organizada, com os arquivos bem divididos entre rotas, controladores e repositórios, o que é essencial para manter o código limpo e escalável. Além disso, seus controladores mostram uma preocupação legítima com validações e tratamento de erros, o que é um ponto super positivo! 🙌

---

## 🎯 O que você mandou muito bem

- **Arquitetura modular:** Você separou muito bem as responsabilidades entre `routes/`, `controllers/` e `repositories/`. Isso facilita muito a manutenção e a leitura do código. 👏
  
- **Validações básicas:** Nos controladores, você validou campos obrigatórios, datas (no caso dos agentes), e status dos casos, além de checar se o `agente_id` realmente existe antes de criar ou atualizar um caso. Isso demonstra cuidado com a integridade dos dados. 👍
  
- **Uso correto dos métodos HTTP e status codes:** Você usou bem os status 201 para criação, 200 para sucesso, 204 para deleção, 400 para requisições mal formatadas e 404 para recursos não encontrados. Isso é fundamental para uma API RESTful bem feita. 🥳

- **Uso do UUID para IDs:** Gerar IDs únicos com `uuidv4()` é uma ótima prática para evitar conflitos. ✔️

- **Bônus tentado:** Vi que você tentou implementar filtros e mensagens de erro customizadas, o que é um diferencial bacana, mesmo que ainda precise de ajustes.

---

## 🔎 Pontos para melhorar (Análise detalhada para destravar seu código)

### 1. Atualização parcial (PATCH) dos agentes e casos não está funcionando corretamente

Você implementou os métodos PATCH para atualizar parcialmente agentes e casos, mas alguns testes importantes indicam que eles não estão funcionando como esperado, especialmente quando o recurso não existe.

Ao analisar seu controlador de agentes, veja esse trecho do `atualizarAtributosDoAgente`:

```js
export const atualizarAtributosDoAgente = (req, res) => {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;

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
```

**Aqui há uma pegadinha importante:** você está desestruturando `nome`, `dataDeIncorporacao` e `cargo` diretamente do `req.body`, mas no PATCH, o cliente pode enviar _qualquer combinação_ desses campos, inclusive só um deles. Se algum campo não for enviado, ele será `undefined` e sua validação de data vai falhar porque `isValidDate(undefined)` provavelmente retorna falso, gerando erro 400 indevido.

**Por exemplo:** Se o cliente quiser só atualizar o `nome`, sua função vai tentar validar `dataDeIncorporacao` que não veio, e vai bloquear a requisição.

---

### Como resolver isso?

Você precisa validar somente os campos que vieram no corpo da requisição. Ou seja, se `dataDeIncorporacao` estiver presente, aí sim valide a data. Se não estiver, pule essa validação.

Exemplo de ajuste:

```js
export const atualizarAtributosDoAgente = (req, res) => {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do agente.");
    }

    if (dataDeIncorporacao !== undefined) {
        if (!isValidDate(dataDeIncorporacao) || isFutureDate(dataDeIncorporacao)) {
            return res.status(400).send("Data de incorporação inválida ou no futuro.");
        }
    }

    // Filtrar apenas os campos que foram enviados para atualizar
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
```

---

O mesmo raciocínio vale para o `atualizarAtributosDoCaso` no `casosController.js`. Você está validando o `status` e o `agente_id` sempre, mesmo que não tenham sido enviados, o que pode gerar erros indevidos.

Seu código atual:

```js
export const atualizarAtributosDoCaso = (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, agente_id } = req.body;

    if(status && !(status === 'aberto' || status === 'solucionado')) {
        return res.status(400).send('Status inválido. Use aberto ou solucionado.');
    }

    if (req.body.id) {
        return res.status(400).send("Não é permitido alterar o ID do caso.");
    }

    if(!findAgenteById(req.body.agente_id)) {
        return res.status(400).send('Id do agente inválido.');
    }   
    
    const casoAtualizado = updateById(id,  { titulo, descricao, status, agente_id });
    
    if (!casoAtualizado) {
        return res.status(404).send(`Caso com id:${id} não encontrado.`);
    }

    res.status(200).json(casoAtualizado);
}
```

Aqui o problema é que você está validando `status` e `agente_id` sem checar se eles vieram no corpo da requisição, e isso pode causar erros ao atualizar parcialmente.

---

### Ajuste sugerido para o PATCH de casos:

```js
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
        return res.status(400).send('Id do agente inválido.');
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
```

---

### 2. Tratamento do caso "recurso não encontrado" para PATCH

Você já trata o 404 corretamente quando o recurso não existe, mas é importante garantir que isso aconteça **antes** de tentar validar campos que dependem do recurso existir.

No seu código, você chama `updateById` e só depois verifica se o resultado é `null` para mandar 404 — isso está correto. Só reforço a importância de validar os dados do corpo antes de tentar atualizar, e só chamar `updateById` se os dados estiverem ok.

---

### 3. Filtros e funcionalidades bônus não implementadas

Percebi que os testes bônus relacionados a filtros, ordenação e mensagens de erro customizadas não passaram. Isso indica que você ainda não implementou esses endpoints ou funcionalidades.

Se quiser, posso te ajudar a planejar esses filtros para que você consiga incrementar sua API e garantir uma experiência melhor para quem for consumir seu serviço.

---

### 4. Organização da estrutura do projeto

Sua estrutura de diretórios está perfeita, exatamente como o esperado:

```
.
├── controllers/
│   ├── agentesController.js
│   └── casosController.js
├── repositories/
│   ├── agentesRepository.js
│   └── casosRepository.js
├── routes/
│   ├── agentesRoutes.js
│   └── casosRoutes.js
├── server.js
├── package.json
└── utils/
    └── errorHandler.js
```

Isso é fundamental para manter o projeto escalável e fácil de entender. Parabéns por isso! 🎯

---

## 📚 Recursos que recomendo para você aprofundar esses pontos

- Para entender melhor a diferença entre PUT e PATCH e como validar campos opcionais no PATCH, veja este vídeo que explica como tratar atualizações parciais:  
  https://youtu.be/RSZHvQomeKE (foco em manipulação de requisições e respostas)

- Para aprender a validar dados condicionalmente e evitar erros quando campos opcionais não são enviados, recomendo este vídeo:  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_ (Validação de dados em Node.js/Express)

- Para entender mais sobre manipulação de arrays e objetos em JS, especialmente para atualizar apenas campos enviados:  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI (Métodos de array e manipulação de objetos)

- Para aprofundar seu conhecimento em arquitetura MVC e organização de projetos Node.js:  
  https://youtu.be/bGN_xNc4A1k?si=Nj38J_8RpgsdQ-QH

---

## 📝 Resumo rápido dos pontos para focar:

- [ ] Ajustar os métodos PATCH para validar somente os campos enviados no corpo da requisição, evitando validar campos `undefined`.
- [ ] Garantir que o PATCH retorne 404 quando o recurso não existir, e validar os dados antes de tentar atualizar.
- [ ] Implementar os filtros e ordenações para os endpoints de agentes e casos, para melhorar a usabilidade da API.
- [ ] Continuar aprimorando as mensagens de erro customizadas para deixar a API mais amigável e informativa.

---

## Finalizando...

GabriAssiss, você está no caminho certo! 🚀 Seu código está muito bem estruturado e com uma base sólida para uma API RESTful. Os ajustes que você precisa fazer são detalhes importantes para garantir que sua API seja robusta e flexível, especialmente para atualizações parciais.

Continue assim, focando em entender o fluxo dos dados, como validar de forma condicional, e a importância de tratar todos os casos possíveis de entrada do usuário. Você vai longe! 💪✨

Se precisar, estarei aqui para te ajudar a destravar esses pontos! 😉

Um abraço e bons códigos! 👩‍💻👨‍💻💙

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>