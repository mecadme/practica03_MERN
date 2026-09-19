import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import empleadosRoutes from './routes/empleados.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.set('puerto', process.env.PORT || 3000);
app.set('nombreApp', 'Gestión de empleados');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/v1', empleadosRoutes);
app.use(errorHandler);

export default app;