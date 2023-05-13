import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { rootRouter } from '../../modules/platform-users/root.routes.js';
import { config } from './config.js';

const app = express();

app.use(
  cors({
    origin: [config.clientOrigin],
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

