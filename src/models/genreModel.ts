import mongoose from "mongoose";

export const AvailableGenres = ['Action', 'Romance', 'Drama', 'Crime', 'Thriller', 'Sci-fi', 'Horror'];

export const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Genre is required'],
        minlength: [3, 'Genre must have at least 3 characters']
    },
});

export const Genre = mongoose.model('Genre', genreSchema);