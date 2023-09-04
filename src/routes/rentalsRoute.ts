import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { rentalSchema } from '../schema/rentalSchema';
import { Customer } from './customerRoutes';
import { Movie } from './movieRoutes';

const router = express.Router();
const Rental = mongoose.model('Rental', rentalSchema);

/* Get all rentals */
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

/* Add a rental */
router.post('/', async (req, res) => {
    try {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) {
            return res.status(400).send('Invalid customer.');
        }

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) {
            return res.status(400).send('Invalid movie.');
        }

        if (movie.numberInStock === 0) {
            return res.status(400).send('Movie not in stock.');
        }

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        rental = await rental.save();

        movie.numberInStock--;
        movie.save();

        res.send(rental);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Get rental by Id */
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

export default router;