import request from 'supertest';
import { server } from '../../src/server';
import { connectToDb, disconnectFromDb } from '../database/db';
import { seedTestDatabase } from '../database/seed';

describe.only('/api/courses', () => {

    beforeAll(async () => {
        await connectToDb();
        await seedTestDatabase();
    });

    afterAll(async () => {
        await disconnectFromDb();
        server.close();
    })

    describe('GET / ', () => {



        it('should return all courses', async () => {
            const response = await request(server).get('/api/courses');
            expect(response.status).toBe(200);
        })
    })
})