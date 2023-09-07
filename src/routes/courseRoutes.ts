import express, { Request, Response } from 'express';
import { Course } from '../models/courseModel';
import { seedCourses } from '../startup/seed';
import { authenticate } from '../middleware/middleware';
import { BadRequest } from '../config/error';

const router = express.Router();

/* Seed Database */
router.post('/seed', async (req: Request, res: Response) => {
    try {
        await Course.deleteMany({});
        await Course.insertMany(seedCourses);
        return res.send('Database succesfully seeded with courses');
    } catch (error) {
        return res.status(500).send('Error in seeding database')
    }
});

/* Delete all courses */
router.delete('/deleteAll', async (req: Request, res: Response) => {
    try {
        await Course.deleteMany({});
        return res.send('Deleted all courses successfully.');
    } catch (error) {
        return res.status(500).send('Error in deleting all courses.')
    }
});

/* Get all courses */
router.get('/', async (req: Request, res: Response) => {
    const courses = await Course.find().sort({ updatedAt: -1 });
    return res.send(courses);
});

/* Get course by id */
router.get('/:id', async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId); //throws an exception if id not found
    return res.send(course);
});

/* Update course */
router.put('/:id', async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const body = req.body;
    try {
        const course = await Course.findOneAndUpdate({ _id: courseId }, {
            $set: {
                ...body,
                updatedAt: new Date().toISOString()
            }
        }, { new: true, runValidators: true },);
        return res.send(course);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send(`Could not find a course with id: ${courseId}`)
        } else {
            return res.status(400).send(error.message);
        }
    }
});

/* Add a new course */
router.post('/', async (req: Request, res: Response) => {
    try {
        const course = req.body;
        const courseToAdd = new Course({
            ...course,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        const result = await courseToAdd.save();
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Delete a course */
router.delete('/:id', async (req: Request, res: Response) => {
    const courseId = req.params.id;
    try {
        await Course.deleteOne({ _id: courseId });
        return res.send('Course deleted successfully.');
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send(`Could not find a course with id: ${courseId}`)
        } else {
            return res.status(400).send(error.message);
        }
    }
});

export default router;
