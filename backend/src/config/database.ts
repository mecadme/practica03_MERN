import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('MONGO_URI no está definida');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);

    console.log('Conectado correctamente a MongoDB');

    console.log('==============================');
    console.log('Mongo Host:', mongoose.connection.host);
    console.log('Mongo DB:', mongoose.connection.name);
    console.log('==============================');

  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};