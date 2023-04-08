import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { config } from '../app/config.js';
import { rootRouter } from '../routes/root.routes.js';

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(rootRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app };
