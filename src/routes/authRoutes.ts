import bcrypt from "bcrypt";
import express, { Request, Response } from 'express';
import _ from 'lodash';
import { User, validateNewUserData, validateUserData } from '../models/userModel';
import { authenticate } from "../middleware/middleware";
import { logger } from "../config/logger";

const router = express.Router();

/* Get all users */
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).sort('name').select('name email isAdmin');
        res.send(users);
    } catch (error) {
        return res.status(500).send('Error in fetching users');
    }
});

/* Register a user */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const result = validateUserData(req.body);
        if (result.error) {
            return res.status(400).send(result.error);
        }
        const existingUser = await User.findOne({ email: result.data.email });
        if (existingUser) {
            return res.status(400).send("User already exists with this email");
        }

        const user = new User(result.data);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const successUser = await user.save();

        const token = successUser.generateAuthToken();
        return token ?
            res.header('x-auth-token', token).send(_.pick(successUser, ['_id', 'name', 'email'])) :
            res.status(500).send('Internal Server Error');
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Get current user */
router.get('/me', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');
        return res.send(user);
    } catch (error) {
        return res.status(400).send('User details not found.');
    }
})

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

        const token = existingUser.generateAuthToken();
        if (token) {
            logger.info(`Logged in successfully with user: ${existingUser.name}`);
            return res.send(token);
        } else {
            return res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        logger.error(`Unable to login with the user ${req.body.name}`)
        return res.status(400).send(error.message);
    }
});



export default router;
