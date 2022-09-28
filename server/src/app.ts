import express, { Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import apiRoutes from './api';
import { errorHandler, notFound, rateLimiter } from './middlewares';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimiter);

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
