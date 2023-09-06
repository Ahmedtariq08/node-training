import express, { Express } from 'express';
import helmet from 'helmet';
import { error } from '../middleware/middleware';

export const loadBuiltInMiddleware = (app: Express) => {
    //Built in middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(helmet());
}

export const loadCustomMiddleware = (app: Express) => {
    //Custom middleware
    app.use(error)
}


