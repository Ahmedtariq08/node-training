import mongoose from 'mongoose';
import { seedCourses } from '../database/seed';
import { courseSchemaMongo } from '../schema/courseSchema';

const Course = mongoose.model('Course', courseSchemaMongo);

export const seedCoursesInDb = async () => {
    await Course.deleteMany({});
    await Course.insertMany(seedCourses);
}

export const deleteAllCourses = async () => {
    await Course.deleteMany({});
}

export const getAllCourses = async () => {
    const courses = await Course.find().sort({ updatedAt: -1 });
    return courses;
}

export const getCourse = async (id: string) => {
    const course = await Course.findById(id);
    return course;
}

export const addCourse = async (course: {}) => {
    const courseToAdd = new Course({
        ...course,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    const result = await courseToAdd.save();
    return result;
}

export const updateCourse = async (id: string, body: {}) => {
    const course = await Course.findOneAndUpdate({ _id: id }, {
        $set: {
            ...body,
            updatedAt: new Date().toISOString()
        }
    }, { new: true, runValidators: true },);
    return course;
}

export const removeCourse = async (id: string) => {
    const course = await Course.deleteOne({ _id: id });
    return course;
}

/// =========== ///
export const exercise71 = async () => {
    return await Course
        .find({ isPublished: true, tags: 'backend' })
        .sort({ name: 1 })
        .select({ name: 1, author: 1 });
}

export const exercise72 = async () => {
    return await Course
        .find({ isPublished: true, tags: { $in: ['backend', 'frontend'] } })
        .sort({ price: -1 })
        .select({ name: 1, author: 1, price: 1 });
}

export const exercise73 = async () => {
    return await Course
        .find({ isPublished: true })
        .or([
            { name: /.*by*/i },
            { price: { $gte: 15 } }
        ])
}

const getCourses = async () => {
    //SECTION - comparison operators
    //eq = equal, ne = not equal, gt = greater than, lt = less than
    //lte = less than or equal to, in, nin (not in)

    //SECTION - logical operators
    // or, and

    //SECTION - Pagination
    const pageNumber = 2;
    const pageSize = 10;

    try {
        const result = await Course
            // .find({ price: { $in: [10, 15, 20] } })
            // .find({ price: { $gte: 10, $lte: 20 } })
            // .find({ author: 'Ahmed Tariq', isPublished: true })

            // .find()
            // .or([ {author: 'Ahmed Tariq'}, { isPublished: true}])

            //starts with ahmed
            .find({ author: /^Ahmed/i })

            //ends with tariq (i for case insensitive)
            .find({ author: /Tariq$/i })

            //contains ahmed
            .find({ author: /.*Ahmed.*/ })

            //pagination
            .skip(pageNumber - 1 * pageSize)

            .limit(pageSize)
            .sort({ name: 1 })

            //only return count of objects that match query (remove select)
            .count()

            // sends results by filtering
            .select({ name: 1, tags: 1 });
        console.log(result);
    } catch (error) {
        console.error('Error in getting courses', error);
    }
}
