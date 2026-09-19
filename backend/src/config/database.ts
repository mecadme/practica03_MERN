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
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};