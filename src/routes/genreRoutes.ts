import express, { Request, Response } from 'express';
import { AvailableGenres, Genre } from '../models/genreModel';
import { asyncMiddleware, authenticate, isUserAdmin } from '../middleware/middleware';

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

/* Create new genre */
genreRouter.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        const name = req.body.name;
        if (!name) {
            return res.status(400).send('Genre must have a name');
        }

        const genreExists = await Genre.findOne({ name });
        if (genreExists) {
            return res.status(400).send('Genre already exists by this name');
        }
        let genre = new Genre({ name: req.body.name });
        genre = await genre.save();
        return res.send(genre);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Get all genres */
// we can remove call of async middleware after using express-async-errors
genreRouter.get('/', authenticate, asyncMiddleware(async (req: Request, res: Response) => {
    const genres = await Genre.find({});
    res.send(genres);
    // try {
    //     const genres = await Genre.find({});
    //     return res.send(genres);
    // } catch (error) {
    //     return res.status(500).send('Error in fetching genres');
    // }
}));

/* Delete genre */
genreRouter.delete('/:id', [authenticate, isUserAdmin], async (req: Request, res: Response) => {
    try {
        const genreId = req.params.id;
        const genre = await Genre.findByIdAndRemove(genreId);
        if (!genre) {
            return res.status(404).send('Genre by given Id was not found');
        }
        return res.send(genre);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

export default genreRouter;