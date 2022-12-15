const {Schema, model} = require('mongoose');

const genreSchema = new Schema({
    value: {
        type: String,
        required: [true, 'Value field is required!']
    }
});

const Genre = model('genre', genreSchema);

module.exports = Genre;