import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const getEnvVar = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

const host: string = getEnvVar('NEON_DB_URL');

const sequelize = new Sequelize(host);
const connectToHostedSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to hosted SQL!');
  } catch (err) {
    console.error('Error connecting to hosted SQL:', err);
    throw err; // Throw the error for the caller to handle
  }
}

export { connectToHostedSQL, sequelize };