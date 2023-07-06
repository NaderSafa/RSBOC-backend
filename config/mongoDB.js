// Import enviroment variables
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  DB_PASSWORD: process.env.DB_PASSWORD,
};

export default dbConfig;
