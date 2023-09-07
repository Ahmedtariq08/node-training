import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppResponse, InternalServerError, GenericResponse } from "../config/error";
import { logger } from "../config/logger";

/* Auth middleware */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No authentication token provided');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send('Invalid authentication token');
    }
}

export const isUserAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.isAdmin) {
        return res.status(403).send('Access denied');
    }
    next();
}

/* Excetion handling middleware */
export const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppResponse) {
        logger.error(err.message);
        return res.status(err.statusCode).send(err.message);
    }
    const { statusCode, ...response } = new InternalServerError(err.message);
    return res.status(statusCode).send(response.message);
}

/* Async middleware */
//this already wraps route functions into this block and passes control to next on error
export const asyncMiddleware = (handler: (req: Request, res: Response) => void) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}


