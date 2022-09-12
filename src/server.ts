import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './config/swagger.json';
import './shared/container';

import { env } from './config/env';

import { appRouter } from './routes';
import { router } from './oldRoutes';
import { mockUserId } from './middlewares/mockUserId';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(mockUserId);
app.use(router);
app.use('/v1', appRouter);

const port = env.APP_PORT;
app.listen(port, () => console.log(`\r\n🚀️ Server started on port ${port}!\r\n`));
