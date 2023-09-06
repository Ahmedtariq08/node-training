import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const log = (req: Request, res: Response, next: NextFunction) => {
    next();
}

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
    return res.status(500).send('Internal Server Error');
}

/* Async middleware */
export const asyncMiddleware = (handler: (req: Request, res: Response) => void) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}


