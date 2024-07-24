import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { databaseConfig } from 'src/config/database.config';

dotenv.config();

export const AppDataSource = new DataSource(databaseConfig);
