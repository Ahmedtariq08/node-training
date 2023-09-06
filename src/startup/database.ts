import mongoose from 'mongoose';
import { logger } from '../config/logger';

export const connectToDb = async () => {
    const { MONGO: host, DATABASE: database } = process.env;
    try {
        const res = await mongoose.connect(`${host}${database}`);
        const db = res.connection.db.databaseName;
        logger.info(`Connected successfully to ${db}`);
    } catch (error) {
        logger.error('Error in connecting to the database', error);
    }
}