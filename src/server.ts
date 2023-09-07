import dotenv from 'dotenv';
import express, { Express } from 'express';
import "express-async-errors";
import { logger } from './config/logger';
import { connectToDb } from './startup/database';
import { loadBuiltInMiddleware, loadCustomMiddleware } from './startup/middleware';
import { loadRoutes } from './startup/routes';

dotenv.config();
export const app: Express = express();

const { PORT: port } = process.env;

connectToDb();
loadBuiltInMiddleware(app);
loadRoutes(app);
loadCustomMiddleware(app);

export const server = app.listen(port, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
}).on('error', () => {
    logger.error(`Server failed to start at http://localhost:${port}`);
});