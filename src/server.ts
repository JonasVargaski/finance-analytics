import cors from 'cors';
import express from 'express';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`\r\n🚀️ Server started on port ${port}!\r\n`));
