const router = require('express').Router();

const movieController = require('./controllers/movieController');
const genreController = require('./controllers/genreController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

router.use('/movies', movieController);
router.use('/genres', genreController);
router.use('/auth', authController);
router.use('/users', userController);

module.exports = router;