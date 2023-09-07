import mongoose from 'mongoose';
import { logger } from '../config/logger';

export const connectToDb = async () => {
    const { NODE_ENV: env, DB_DEV: devDb, DB_TEST: testDb } = process.env;
    try {
        const database = env === 'dev' ? devDb : testDb;
        await mongoose.connect(database);
        logger.info(`Connected successfully to ${database}`);
    } catch (error) {
        logger.error('Error in connecting to the database', error);
    }
}