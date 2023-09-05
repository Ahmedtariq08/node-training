import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import Debug from 'debug';
import coursesRouter from './routes/courseRoute';
import customerRouter from './routes/customerRoutes';
import authRouter from './routes/authRoutes';
import { genreRouter, movieRouter } from './routes/movieRoutes';
import { authenticate, log } from './middleware/middleware';
import { connectToDb } from './database/mongo';

dotenv.config();
export const app: Express = express();

const { PORT: port, MODE: mode, MONGO: host, DATABASE: db } = process.env;

//databse connection
connectToDb(host, db);

//debuggers
const startupDebugger = Debug("app:startup");
const dbDebugger = Debug('app:db');

//Built in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

//Custom Middleware
// app.use(log);
// app.use(authenticate);

//Routes
app.use('/api/courses', coursesRouter);
app.use('/api/genres', genreRouter);
app.use('/api/movies', movieRouter);
app.use('/api/customer', customerRouter);
app.use('/api/auth', authRouter);

if (mode === 'dev') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

//some db work happens
dbDebugger("Connected to the database");




//Home response
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');

});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});