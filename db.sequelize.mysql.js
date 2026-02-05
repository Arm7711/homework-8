import { Sequelize } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();                  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caFilePath = path.resolve(__dirname, 'certificates/ca.pem');

const {
  MYSQL_HOST = 'localhost',
  MYSQL_DATABASE = 'db',
  MYSQL_PASSWORD = 'password',
  MYSQL_USER = 'admin',
  MYSQL_PORT = 3306,
} = process.env;

let caContent = null;
try {
  caContent = await fs.readFile(caFilePath);
} catch (error) {
  console.log('SSL certificate not found');
}

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql',
  dialectOptions: caContent ? {
    ssl: {
      ca: caContent,
      rejectUnauthorized: true
    }
  } : {},
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;