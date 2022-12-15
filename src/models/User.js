const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: [5, 'Username should be at least 5 characters long!'],
        maxLength: [15, 'Username should be maximum 15 characters long!']
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        match: [/^(.+)@(.+)$/, 'Email address is not valid!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [5, 'Password should be at least 5 characters long!'],
    },
    createdMovies: [{
        type: Schema.Types.ObjectId,
        ref: 'movie'
    }],
    _creationDate: Number
});

const User = model('user', userSchema);

module.exports = User;