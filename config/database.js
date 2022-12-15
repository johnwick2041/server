const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

exports.connectDatabase = () => mongoose.connect(MONGO_URL);