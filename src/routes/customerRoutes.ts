import express, { Request, Response } from 'express';
import { Customer } from '../models/customerModel';

const router = express.Router();

/* Get all customers */
router.get('/', async (req: Request, res: Response) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

/* Add a new customer */
router.post('/', async (req: Request, res: Response) => {
    try {
        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
        customer = await customer.save();
        return res.send(customer);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Update a customer */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone
            }, { new: true });
        if (!customer) {
            return res.status(404).send('The customer with the given ID was not found.');
        }
        return res.send(customer);
    } catch (error) {
        return res.status(404).send(error.message);
    }
});

/* Delete a customer */
router.delete('/:id', async (req: Request, res: Response) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

/* Get a single customer */
router.get('/:id', async (req: Request, res: Response) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

export default router;