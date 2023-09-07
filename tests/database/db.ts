
import mongoose from 'mongoose';
import { testLogger } from '../config/testLogger';

export const connectToDb = async () => {
    try {
        const testDb = process.env.DB_TEST!;
        await mongoose.connect(testDb);
        testLogger.info(`Connected successfully to test database:  ${testDb}`);
    } catch (error) {
        testLogger.error('Error in connecting to the test database', error);
        process.exit(1);
    }
}

export const disconnectFromDb = async () => {
    try {
        await mongoose.disconnect();
        await mongoose.connection.close();
    } catch (error) {
        testLogger.error('Unable to close mongoose connection for test db');
        process.exit(1);
    }
}