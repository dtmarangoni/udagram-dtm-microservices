import { Sequelize } from 'sequelize-typescript';
import { currentConfig } from '../config/config';

// Instantiate new Sequelize instance
export const sequelize = new Sequelize({
    username: currentConfig.username,
    password: currentConfig.password,
    database: currentConfig.database,
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    storage: ':memory:',
    logging: false,
});
