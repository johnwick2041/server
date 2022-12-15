const {Schema, model} = require('mongoose');

const movieSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: [2, 'Title should be at least 2 characters long!'],
        maxLength: [20, 'Title should be at maximum 20 characters long!']
    },
    genres: [{
        type: Schema.Types.ObjectId,
        required: [true, 'Genre is required!'],
        validate: {
            validator(value) {
                return value.length !== 0;
            },
            message: 'There should be at least 1 genre!'
        },
        ref: 'genre'
    }],
    time: {
        type: Number,
        requred: [true, 'Time is required!'],
        min: [0, 'Time should be positive number!']
    },
    releaseYear: {
        type: Number,
        required: [true, 'releaseYear is required!'],
    },
    imgUrl: {
        type: String,
        requred: [true, 'imgUrl is required!'],
        validate: {
            validator(value) {
                value = value.toLowerCase();
                return value.startsWith('http://') || value.startsWith('https://');
            },
            message: 'Image URL should start with http:// or https://'
        },
    },
    trailer: {
        type: String,
        requred: [true, 'Trailer is required!'],
        validate: {
            validator(value) {
                value = value.toLowerCase();
                return value.startsWith('https://www.youtube.com') || value.startsWith('www.youtube.com') || value.startsWith('https://youtube.com');
            },
            message: 'Trailer should be valid youtube link!'
        },
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [50, 'Description should be at least 50 characters long!'],
        maxLength: [500, 'Description should be less than 500 characters long!']
    },
    postCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'postCreator field is required!']
    },
    _creationDate: {
        type: Number
    }
});

const Movie = model('movie', movieSchema);

module.exports = Movie;