import casosRouter from './routes/casosRoutes.js';
import agentesRouter from './routes/agentesRoutes.js';
import express from 'express';
import { swaggerDocs } from './swagger.js';

const app = express();
const PORT = 3000;


app.use(express.json());

app.use('/casos', casosRouter);

app.use('/agentes', agentesRouter);

swaggerDocs(app);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
