import express, { Express, Request, Response } from 'express';
import authRouter from '../routes/authRoutes';
import coursesRouter from '../routes/courseRoute';
import customerRouter from '../routes/customerRoutes';
import { genreRouter, movieRouter } from '../routes/movieRoutes';

export const loadRoutes = (app: Express) => {
    app.use(express.json());
    app.use('/api/courses', coursesRouter);
    app.use('/api/genres', genreRouter);
    app.use('/api/movies', movieRouter);
    app.use('/api/customer', customerRouter);
    app.use('/api/auth', authRouter);

    // Home response
    app.get('/', (req: Request, res: Response) => {
        return res.send('Welcome to Vidly application by Ahmed Tariq');
    });
}