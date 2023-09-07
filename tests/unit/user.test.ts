import mongoose from 'mongoose';
import { User } from '../../src/models/userModel';
import jwt from 'jsonwebtoken';

const jwtPrivateKey = process.env.JWT_SECRET_KEY;

describe('user.generateAuthToken', () => {
    it('should return a valid jwt', () => {
        const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const user = new User(payload);
        const token = user.generateAuthToken();
        if (jwtPrivateKey) {
            const decoded = jwt.verify(token, jwtPrivateKey);
            expect(decoded).toMatchObject(payload);
        } else {
            throw new Error("jwt private key not found in env!");
        }
    })
})