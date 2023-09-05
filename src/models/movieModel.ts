import mongoose from "mongoose";

export const AvailableGenres = ['Action', 'Romance', 'Drama', 'Crime', 'Thriller', 'Sci-fi', 'Horror'];

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Genre is required'],
        enum: AvailableGenres
    },
});

export const Genre = mongoose.model('Genre', genreSchema);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    genre: {
        type: genreSchema,
        required: [true, 'Genre is required for a movie']
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
        default: 20
    }
});

export const Movie = mongoose.model('Movie', movieSchema);