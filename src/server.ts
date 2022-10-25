import 'reflect-metadata';
import './shared/container';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './config/swagger.json';

import { env } from './config/env';
import { appRouter } from './routes';
import { mockUserId } from './middlewares/mockUserId';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use(mockUserId); // remover
app.use('/v1', appRouter);

app.listen(env.APP_PORT, () => console.log(`\r\n🚀️ Server started on port ${env.APP_PORT}!\r\n`));
