import { Model, Schema, model } from "mongoose";

const AvailableCategories = ['web', 'mobile', 'network', 'desktop'];

export interface ICourse {
    name: string,
    category: string,
    author: string,
    isPublished: boolean,
    price: number,
    tags?: unknown,
    createdAt?: Date,
    updatedAt?: Date,
}

export type CourseModel = Model<ICourse, {}>;

export const courseSchema = new Schema<ICourse, CourseModel>({
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

export const Course = model<ICourse, CourseModel>('Course', courseSchema);