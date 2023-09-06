import express, { Request, Response } from 'express';
import { z } from 'zod';
import { getAllCourses, seedCoursesInDb, deleteAllCourses, getCourse, addCourse, updateCourse, removeCourse } from '../service/courseService';

const router = express.Router();

// ANCHOR - REST CRUD

/* Seed Database */
router.post('/seed', async (req: Request, res: Response) => {
    try {
        await seedCoursesInDb();
        return res.send('Database succesfully seeded with courses');
    } catch (error) {
        return res.status(500).send('Error in seeding database')
    }
});

/* Delete all courses */
router.delete('/deleteAll', async (req: Request, res: Response) => {
    try {
        await deleteAllCourses();
        return res.send('Deleted all courses successfully.');
    } catch (error) {
        return res.status(500).send('Error in deleting all courses.')
    }
});

/* Get all courses */
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await getAllCourses();
        res.send(result);
    } catch (error) {
        return res.status(500).send('Error in fetching courses data');
    }
});

/* Get course by id */
router.get('/:id', async (req: Request, res: Response) => {
    const courseId = req.params.id;
    try {
        const result = await getCourse(courseId);
        res.send(result);
    } catch (error) {
        return res.status(400).send(`Could not find a course with id: ${courseId}`);
    }
});

/* Update course */
router.put('/:id', async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const body = req.body;
    try {
        const result = await updateCourse(courseId, body);
        return res.send(result);
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
        const result = await addCourse(req.body);
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

/* Delete a course */
router.delete('/:id', async (req: Request, res: Response) => {
    const courseId = req.params.id;
    try {
        const result = await removeCourse(courseId);
        return res.send('Course deleted successfully.');
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send(`Could not find a course with id: ${courseId}`)
        } else {
            return res.status(400).send(error.message);
        }
    }
});


// ANCHOR - Courses
interface Course {
    id: number,
    name: string
}

let courses: Course[] = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' },
];



router.get('/:id', (req: Request, res: Response) => {
    const course = courses.find(value => value.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`Course with id: ${req.params.id} not found`);
    }
    return res.send(course);
});



router.put('/:id', (req: Request, res: Response) => {
    const courseId = req.params.id;
    const course = courses.find(value => value.id === parseInt(courseId));
    if (!course) {
        return res.status(404).send(`Course with id: ${req.params.id} not found`);
    }
    const name = req.body.name;
    const error = validateCourse({ name });
    if (error) {
        return res.status(400).send(error);
    } else {
        course.name = name;
        return res.send(course);
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    const courseId = req.params.id;
    const course = courses.find(value => value.id === parseInt(courseId));
    if (!course) {
        return res.status(404).send(`Course with id: ${req.params.id} not found`);
    }
    courses = courses.filter(c => c.id !== course.id);
    return res.send(course);
})

/**
 * @param course
 * @returns string of error message, or undefined if no errors found;
 */
const validateCourse = (course: Partial<Course>): string | undefined => {
    let errorMessage = undefined;
    const schema = z.object({
        name: z.string({ invalid_type_error: "Name must be a string", required_error: "Name is required" }).min(3).nonempty()
    })
    try {
        schema.parse(course);
    } catch (error) {
        if (error instanceof z.ZodError) {
            errorMessage = error.issues[0].message;
        }
    }
    return errorMessage;
}

export default router;
