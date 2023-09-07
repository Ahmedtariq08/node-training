import request from 'supertest';
import { Course, ICourse } from '../../src/models/courseModel';
import { User } from '../../src/models/userModel';
import { server } from '../../src/server';
import { connectToDb, disconnectFromDb } from '../database/db';

const courseRoute = '/api/courses';
const authHeader = 'x-auth-token';

const validCourse: ICourse = {
    name: 'test',
    category: 'web',
    author: 'Ahmed',
    isPublished: true,
    price: 20,
    tags: ['backend', 'frontend'],
};

describe(courseRoute, () => {

    beforeAll(async () => {
        await connectToDb();
        // await seedCourses();
    });

    beforeEach(async () => {
        await Course.deleteMany({});
    })

    afterAll(async () => {
        await disconnectFromDb();
        server.close();
    })

    describe('GET / ', () => {
        it('should return all courses', async () => {
            const response = await request(server).get(courseRoute);
            expect(response.status).toBe(200);
            const courses = response.body;
            expect(courses.length).toBeGreaterThanOrEqual(0);
        })
    })

    describe('GET /:id ', () => {
        it('should return a valid course', async () => {
            const newCourse = new Course(validCourse);
            await newCourse.save();
            const res = await request(server).get(`${courseRoute}/${newCourse._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', newCourse.name);
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get(`/api/courses/1`);
            expect(res.status).toBe(404);
        })
    })

    describe('POST /', () => {

        //Define a happy path and then in each test we change one parameter that clearly aligns 
        //with the name of the test

        let token: string;
        let courseBody = validCourse as any;

        const exec = async () => {
            return await request(server)
                .post(courseRoute)
                .set(authHeader, token)
                .send(courseBody);
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
        })

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it('should return 400 if course name is less than 3 characters', async () => {
            courseBody = { name: 'a' };
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if course name is more than 50 characters', async () => {
            courseBody = { name: new Array(52).join('A') };
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should save the course if it is valid', async () => {
            courseBody = validCourse;
            const res = await exec();
            expect(res.status).toBe(200);

            const addedCourse = await Course.findOne({ name: validCourse.name });
            expect(addedCourse).not.toBeNull();
        })

        it('should return the course if is valid and saved ', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', validCourse.name);
        })
    })
})