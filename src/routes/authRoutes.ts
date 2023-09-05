import express, { Request, Response } from 'express';
import { User, validateUserData, validateNewUserData } from '../models/userModel';
import _ from 'lodash';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

/* Get all users */
router.get('/users', async (req: Request, res: Response) => {
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
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const successUser = await user.save();
        res.send(_.pick(successUser, ['_id', 'name', 'email']));
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Login user*/
router.post('/login', async (req: Request, res: Response) => {

    try {
        const result = validateNewUserData(req.body);
        if (result.error) {
            return res.status(400).send(result.error);
        }
        const existingUser = await User.findOne({ email: result.data.email });
        if (!existingUser) {
            return res.status(400).send("Invalid email");
        }

        const isPasswordValid = await bcrypt.compare(result.data.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid passowrd');
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            console.error('FATAL ERROR: Jwt key not defined');
            return res.status(500).send('Interal Server ERROR');
        }
        const token = jwt.sign({ _id: existingUser._id }, 'jwtPrivateKey');
        res.send(token);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

export default router;
