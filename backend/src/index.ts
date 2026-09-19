import app from './app.js';
import { config } from 'dotenv';
import { connectDatabase } from './config/database.js';

config();

const port = app.get('puerto') || 3000;


connectDatabase();

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});