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

app.get('/', (_req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Gestion de empleados API</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            color: #172033;
            background: #f2fbf7;
          }

          main {
            width: min(720px, calc(100% - 32px));
            border: 1px solid #bfe8d4;
            border-radius: 8px;
            padding: 32px;
            background: #ffffff;
            box-shadow: 0 18px 40px rgba(23, 32, 51, 0.12);
          }

          h1 {
            margin: 0 0 12px;
            color: #14724f;
          }

          p {
            margin: 0;
            line-height: 1.5;
          }

          .badge {
            display: inline-block;
            margin-bottom: 16px;
            border-radius: 999px;
            padding: 6px 12px;
            color: #0f5132;
            background: #d8f3e5;
            font-size: 0.82rem;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <main>
          <span class="badge">Deploy automatizado activo</span>
          <h1>Gestion de empleados en produccion</h1>
          <p>Segunda prueba visual con PM2 Deploy desde la rama reto-3.</p>
        </main>
      </body>
    </html>
  `);
});

app.use('/api/v1', empleadosRoutes);
app.use(errorHandler);

export default app;
