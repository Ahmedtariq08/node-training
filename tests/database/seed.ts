import { testLogger } from "../config/testLogger";
import { seedCourses } from "./seeds/courses"
import { seedCustomers } from "./seeds/customer";


export const seedTestDatabase = async () => {
    try {
        await seedCourses();
        await seedCustomers();
        testLogger.info('Seeding test database complete');
    } catch (error) {
        testLogger.error("Error in seeding test database");
    }
}