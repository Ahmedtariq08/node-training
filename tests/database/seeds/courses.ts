import { ICourse, Course } from "../../../src/models/courseModel";
import { testLogger } from "../../config/testLogger";

const courses: ICourse[] = [
    {
        tags: [
            "express",
            "backend"
        ],
        category: 'web',
        createdAt: new Date("2018-01-24T21:42:27.388Z"),
        updatedAt: new Date("2018-01-24T21:42:27.388Z"),
        name: "Express.js Course",
        author: "Mosh",
        isPublished: true,
        price: 10,
    },
    {
        tags: [
            "node",
            "backend"
        ],
        category: 'web',
        createdAt: new Date("2018-01-24T21:42:47.912Z"),
        updatedAt: new Date("2018-01-24T21:42:47.912Z"),
        name: "Node.js Course",
        author: "Mosh",
        isPublished: true,
        price: 20,
    },
    {
        tags: [
            "aspnet",
            "backend"
        ],
        category: 'mobile',
        createdAt: new Date("2018-01-24T21:42:59.605Z"),
        updatedAt: new Date("2018-01-24T21:42:59.605Z"),
        name: "ASP.NET MVC Course",
        author: "Mosh",
        isPublished: true,
        price: 15,
    },
    {
        tags: [
            "react",
            "frontend"
        ],
        category: 'network',
        updatedAt: new Date("2018-01-24T21:43:21.589Z"),
        createdAt: new Date("2018-01-24T21:43:21.589Z"),
        name: "React Course",
        author: "Mosh",
        isPublished: false,
        price: 25
    },
    {
        tags: [
            "node",
            "backend"
        ],
        category: 'web',
        createdAt: new Date("2018-01-24T21:44:01.075Z"),
        updatedAt: new Date("2018-01-24T21:44:01.075Z"),
        name: "Node.js Course by Jack",
        author: "Jack",
        isPublished: true,
        price: 12,
    },
    {
        tags: [
            "node",
            "backend"
        ],
        category: 'web',
        createdAt: new Date("2018-01-24T21:47:53.128Z"),
        updatedAt: new Date("2018-01-24T21:47:53.128Z"),
        name: "Node.js Course by Mary",
        author: "Mary",
        isPublished: false,
        price: 12,
    },
    {
        tags: [
            "angular",
            "frontend"
        ],
        category: 'mobile',
        createdAt: new Date("2018-01-24T21:56:15.353Z"),
        updatedAt: new Date("2018-01-24T21:56:15.353Z"),
        name: "Angular Course",
        author: "Mosh",
        isPublished: true,
        price: 15,
    }
]

export const seedCourses = async () => {
    try {
        await Course.deleteMany({});
        await Course.insertMany(courses);
        testLogger.info(`Seeded ${courses.length} courses in test db`);
    } catch (error) {
        testLogger.error('Unable to seed courses')
    }
}
