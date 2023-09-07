import mongoose from "mongoose";
import { authenticate } from "../../../src/middleware/middleware";
import { User } from "../../../src/models/userModel";

describe('auth middleware', () => {
    it('should populate req.user with valid the payload of valid JWT ', () => {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }

        const token = new User(user).generateAuthToken();
        let req = {
            header: jest.fn().mockReturnValue(token),
            user: {}
        };
        const res = {}
        const next = jest.fn();
        authenticate(req as any, res as any, next);
        expect(req.user).toMatchObject(user);
    })
})