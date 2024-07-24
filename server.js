import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { Role } from './src/server/database/schemas/roles.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: 'server.env' });

import db from './src/server/database/connection.js';
db();

const initializeRoles = async () => {
  const roles = ['public', 'authenticated', 'admin', 'superadmin'];
  try {
    for (const roleName of roles) {
      const roleExists = await Role.findOne({ name: roleName });
      if (!roleExists) {
        const newRole = new Role({ name: roleName });
        await newRole.save();
        console.log(`Role ${roleName} created successfully.`);
      } else {
        console.log(`Role ${roleName} already exists.`);
      }
    }
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};
initializeRoles();

import { authRouter } from './src/server/routes/auth.js';

const server = express();
const port = process.env.PORT ?? 3000;

server.use('/static', express.static('public'));

server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(morgan('dev'));
server.use(cors());
server.use('/api/v1', authRouter);

server.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(port, () => console.log('Server listening on port', port));
