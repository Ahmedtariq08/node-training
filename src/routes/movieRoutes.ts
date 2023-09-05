import express, { Request, Response } from 'express';
import { AvailableGenres, Genre, Movie } from '../models/movieModel';

//ANCHOR - Genres
const genreRouter = express.Router();


/* Seed Genres */
genreRouter.post('/seed', async (req: Request, res: Response) => {
    try {
        const seedGenres = AvailableGenres.map(genre => {
            return { name: genre }
        })
        await Genre.deleteMany({});
        await Genre.insertMany(seedGenres);
        res.send(seedGenres);
    } catch (error) {
        return res.status(500).send('Error in seeding genres');
    }
});

/* Get all genres */
genreRouter.get('/', async (req: Request, res: Response) => {
    try {
        const genres = await Genre.find({}).select('name');
        // const mappedNames = genres.map(obj => obj.name);
        res.send(genres);
    } catch (error) {
        return res.status(500).send('Error in fetching genres');
    }
});

//ANCHOR - Movies
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

export { genreRouter, movieRouter };
