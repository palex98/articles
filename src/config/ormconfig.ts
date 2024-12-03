import { DataSource } from 'typeorm';
import { Article } from '../models/Article';
import { Tag } from '../models/Tag';
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Article, Tag],
    synchronize: true,
    logging: true,
});

export default AppDataSource;
