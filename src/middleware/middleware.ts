import { NextFunction, Request, Response } from "express";

export const log = (req: Request, res: Response, next: NextFunction) => {
    console.log('logging...');
    next();
}
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    console.log('authenticating...');
    next();
}