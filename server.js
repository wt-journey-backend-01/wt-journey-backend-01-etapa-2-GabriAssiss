import casosRouter from './routes/casosRoutes.js';
import agentesRouter from './routes/agentesRoutes.js';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/casos', casosRouter);

app.use('/agentes', agentesRouter);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
