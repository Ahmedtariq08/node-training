import mongoose from 'mongoose';

export const connectToDb = async (host: string, database: string) => {
    try {
        const res = await mongoose.connect(`${host}${database}`);
        const db = res.connection.db.databaseName;
        console.log(`Connected successfully to ${db}`);
    } catch (error) {
        console.error('Error in connecting to the database', error);
    }
}