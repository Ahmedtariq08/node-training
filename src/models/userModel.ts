import mongoose from "mongoose";
import { z } from "zod";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must have at least three characters'],
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    email: {
        type: String,
        unique: [true, 'A user already exists with this email'],
        required: [true, 'Email is required'],
        validate: {
            validator: function (v: string) {
                return emailRegex.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must have at least 8 characters'],
    }
}));

const userSchema_zod = z.object({
    name: z.string({ required_error: 'Name is required' })
        .min(3, 'Name must have at least three characters')
        .max(50, 'Name can not be more than 50 characters')
        .nonempty(),
    email: z.string({ required_error: 'Email is required' })
        .nonempty()
        .email('Please enter a valid email'),
    password: z.string({ required_error: 'Password is required' })
        .nonempty()
        .min(8, 'Password must have at least 8 characters')
});

const newUserSchema_zod = z.object({
    email: z.string({ required_error: 'Email is required' })
        .nonempty()
        .email('Please enter a valid email'),
    password: z.string({ required_error: 'Password is required' })
        .nonempty()
        .min(8, 'Password must have at least 8 characters')
});

type ZodWrapper = {
    data?: any,
    error?: string[]
}

const validateSchema = (schema: z.AnyZodObject, data: unknown): ZodWrapper => {
    let messages: string[] | undefined = undefined;
    let result = undefined;
    try {
        result = schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            messages = error.issues.map(issue => issue.message);
        }
    }
    return { data: result, error: messages };
}

export const validateUserData = (data: unknown): ZodWrapper => {
    return validateSchema(userSchema_zod, data);
}

export const validateNewUserData = (data: unknown): ZodWrapper => {
    return validateSchema(newUserSchema_zod, data);
}