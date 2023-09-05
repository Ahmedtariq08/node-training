import express, { Request, Response } from 'express';
import { User, validateUserData } from '../models/userModel';
import _ from 'lodash';

//ANCHOR - Genres
const router = express.Router();

/* Get all users */
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).sort('name').select('name email');
        res.send(users);
    } catch (error) {
        return res.status(500).send('Error in fetching users');
    }
});

/* Register a user */
router.post('/register', async (req: Request, res: Response) => {
    const result = validateUserData(req.body);
    if (result.error) {
        return res.status(400).send(result.error);
    }
    try {
        const existingUser = await User.findOne({ email: result.data.email });
        if (existingUser) {
            return res.status(400).send("User already exists with this email");
        }
        const user = new User(result.data);
        const successUser = await user.save();
        //send token here
        res.send(_.pick(successUser, ['_id', 'name', 'email']));
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

export default router;
