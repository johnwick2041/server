const User = require('../models/User');
exports.getUser = (userId) => {
    return User.findOne({ _id: userId }).select('-password');
}

exports.getUsersCount = () => {
    return User.count();
}

exports.getUsername = (username) => {
    return User.findOne({ username: { $regex: `${username}$`, $options: 'i' } }).select('username');
}

exports.addMovie = (userId, movieId) => {
    return User.updateOne({ _id: userId }, { $push: { createdMovies: movieId } });
}

exports.deleteMovie = (userId, movieId) => {
    return User.updateOne({ _id: userId }, { $pull: { createdMovies: movieId } });
}