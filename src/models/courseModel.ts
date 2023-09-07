import mongoose from "mongoose";
import { z } from "zod";

const AvailableCategories = ['web', 'mobile', 'network', 'desktop'];

// export const courseSchemaZod = z.object({
//     name: z.string().min(3).max(50).nonempty(),
//     category: z.string().nonempty().min(1).transform((str) => str.toLowerCase().trim()), // Lowercase and trim
//     author: z.string().nonempty(),
//     createdAt: z.date().default(() => new Date()),
//     updatedAt: z.date().default(() => new Date()),
//     tags: z.array(z.string()).min(1).refine(validateTags, {
//       message: 'A course should have at least one tag',
//     }),
//     isPublished: z.boolean().,
//     price: z.number()
//       .min(10)
//       .max(200)
//       .refine((value, data) => data.isPublished ? true : value === undefined, {
//         message: 'Price is required for published courses',
//       })
//       .transform((value) => Math.round(value))
//   });

const courseSchemaMongo = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required for a course'],
        minlength: [3, 'Course name must have at least 3 characters'],
        maxlength: [50, 'Course name can not have more than 50 characters'],
    },
    category: {
        type: String,
        required: [true, `A course must have a category from ${AvailableCategories.join(', ')}`],
        lowercase: true,
        trim: true,
        enum: AvailableCategories
    },
    author: {
        type: String,
        required: [true, 'Author is required for the course']
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    tags: {
        type: Array,
        validate: {
            validator(value: string[]) {
                return value && value.length > 0;
            },
            message: 'A course should have at least one tag'
        }
    },
    isPublished: {
        type: Boolean,
        required: [true, 'Value is required for either the course is published or not']
    },
    price: {
        type: Number,
        required: [function () {
            return this.isPublished;
        }, 'Price is required for a course that is published'],
        min: [10, 'Price can not be less than $10'],
        max: [200, 'Price can not be more than $200'],
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
    }
})

export const Course = mongoose.model('Course', courseSchemaMongo);