import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb://admin:admin123@127.0.0.1:27017/usuarios_db?authSource=admin';

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/usuarios_db');
    } catch {
      process.exit(1);
    }
  }
};