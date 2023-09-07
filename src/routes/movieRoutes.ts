import express, { Request, Response } from 'express';
import { Movie } from '../models/movieModel';

const movieRouter = express.Router();

/* Add a movie */
movieRouter.post('/', async (req: Request, res: Response) => {
    try {
        const movie = new Movie(req.body);
        const oMovie = await movie.save();
        res.send(oMovie);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

export default movieRouter;
