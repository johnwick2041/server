const router = require('express').Router();

const movieService = require('../services/movieService');
const userService = require('../services/userService');


const { isAuth } = require('../middlewares/authMiddleware');
const { calculateRatingStars } = require('../utils/calculateRatingStars');


router.get('/', async (req, res, next) => {
    const limit = req.query?.limit || 8;
    const skip = req.query?.skip || 0;
    const sort = req.query?.sort;
    const order = req.query?.order;
    const genres = req.query?.genres;
    const title = req.query?.title;
    const postCreator = req.query?.postCreator;

    const sortCriteria = {};
    if (sort && order) sortCriteria[sort] = order;

    const search = {};
    if (genres) {
        search.key = 'genres';
        search.value = genres;
    } else if (title) {
        search.key = 'title';
        search.value = title;
    } else if (postCreator) {
        search.key = 'postCreator';
        search.value = postCreator;
    }

    try {
        const movies = await movieService.getMovies(search, sortCriteria, limit, skip);
        const moviesCount = await movieService.getCount(search);

        res.status(200).json({ count: moviesCount, movies });
    } catch (err) {
        next(err);
    }
});

router.get('/count', async (req, res, next) => {
    try {
        const moviesCount = await movieService.getMoviesCount();

        res.status(200).json({ moviesCount });
    } catch (err) {
        next(err);
    }
});

router.get('/:movieId', async (req, res, next) => {
    const populateGenres = req.query?.genres || false;
    const populateGenresDetailed = req.query?.detailedGenres || false;

    try {

        const movie = await movieService.getOne(req.params.movieId, populateGenres, populateGenresDetailed);

        if (!movie) throw { status: 404, message: 'Movie not found!' };

        res.status(200).json(movie);
    } catch (err) {
        next(err);
    }
});

router.post('/', isAuth, async (req, res, next) => {
    try {
        if (req.body.hasOwnProperty('_ratingStars')) throw { status: 400, message: 'You cannot modify _ratingStars property!' };

        if(req.body.postCreator !== req.verifiedUserId && req.verifiedUserRole !== 'admin') throw {status: 401, message: 'You are not authorized to set postCreator field!'};

        const movie = await movieService.addMovie(req.body);
        await userService.addMovie(req.body.postCreator, movie._id);

        res.status(201).json(movie);
    } catch (err) {
        next(err);
    }
});

router.put('/:movieId', isAuth, async (req, res, next) => {

    try {
        if (req.body.hasOwnProperty('_ratingStars')) throw { status: 400, message: 'You cannot modify _ratingStars property!' };

        const movie = await movieService.getOne(req.params.movieId);

        if (!movie) throw { status: 404, message: 'Movie not found!' };
        if (req.verifiedUserRole !== 'admin') {
            if (req.verifiedUserId != movie.postCreator) throw { status: 401, message: 'You are not authorized to edit this movie!' };
        }

        const updatedMovie = await movieService.updateMovie(movie._id, req.body);
        res.status(200).json(updatedMovie);
    } catch (err) {
        next(err);
    }
});

router.delete('/:movieId', isAuth, async (req, res, next) => {

    try {
        const movie = await movieService.getOne(req.params.movieId);

        if (!movie) throw { status: 404, message: 'Movie not found!' };

        if (req.verifiedUserRole !== 'admin') {
            if (req.verifiedUserId != movie.postCreator) throw { status: 401, message: 'You are not authorized to delete this movie!' };
        }


        await Promise.all([
            movieService.deleteMovie(movie._id),
            userService.deleteMovie(movie.postCreator, movie._id)
        ]);
        res.status(204).json({});
    } catch (err) {
        next(err);
    }
});

router.post('/:movieId/like', isAuth, async (req, res, next) => {

    try {
        const movie = await movieService.getOne(req.params.movieId);

        if (!movie) throw { status: 404, message: 'Movie not found!' };
        if (req.verifiedUserId == movie.postCreator) throw { status: 400, message: 'You cannot like your own movie!' };
        if (movie.likes.includes(req.verifiedUserId)) throw { status: 400, message: 'You already liked this movie!' };
        movie.dislikes = movie.dislikes.filter(x => x != req.verifiedUserId);

        movie.likes.push(req.verifiedUserId);
        movie._ratingStars = calculateRatingStars(movie.likes.length, movie.dislikes.length);

        await movieService.saveMovie(movie);
        res.status(201).json({
            likesCount: movie.likes.length,
            dislikesCount: movie.dislikes.length,
            _ratingStars: movie._ratingStars
        });
    } catch (err) {
        next(err);
    }
});

router.post('/:movieId/dislike', isAuth, async (req, res, next) => {

    try {
        const movie = await movieService.getOne(req.params.movieId);

        if (!movie) throw { status: 404, message: 'Movie not found!' };
        if (req.verifiedUserId == movie.postCreator) throw { status: 400, message: 'You cannot dislike your own movie!' };
        if (movie.dislikes.includes(req.verifiedUserId)) throw { status: 400, message: 'You already disliked this movie!' };
        movie.likes = movie.likes.filter(x => x != req.verifiedUserId);

        movie.dislikes.push(req.verifiedUserId);
        movie._ratingStars = calculateRatingStars(movie.likes.length, movie.dislikes.length);

        await movieService.saveMovie(movie);
        res.status(201).json({
            likesCount: movie.likes.length,
            dislikesCount: movie.dislikes.length,
            _ratingStars: movie._ratingStars
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:movieId/like', isAuth, async (req, res, next) => {
    try {
        const movie = await movieService.getOne(req.params.movieId);

        if (!movie) throw { status: 404, message: 'Movie not found!' };
        if (!movie.likes.includes(req.verifiedUserId)) throw { status: 400, message: 'You have not liked this movie!' };
        movie.likes = movie.likes.filter(x => x != req.verifiedUserId);

        movie._ratingStars = calculateRatingStars(movie.likes.length, movie.dislikes.length);
        await movieService.saveMovie(movie);

        res.status(200).json({
            likesCount: movie.likes.length,
            dislikesCount: movie.dislikes.length,
            _ratingStars: movie._ratingStars
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:movieId/dislike', isAuth, async (req, res, next) => {
    try {
        const movie = await movieService.getOne(req.params.movieId);

        if (!movie) throw { status: 404, message: 'Movie not found!' };
        if (!movie.dislikes.includes(req.verifiedUserId)) throw { status: 400, message: 'You have not disliked this movie!' };
        movie.dislikes = movie.dislikes.filter(x => x != req.verifiedUserId);

        movie._ratingStars = calculateRatingStars(movie.likes.length, movie.dislikes.length);
        await movieService.saveMovie(movie);

        res.status(200).json({
            likesCount: movie.likes.length,
            dislikesCount: movie.dislikes.length,
            _ratingStars: movie._ratingStars
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;