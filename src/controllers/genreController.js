const router = require("express").Router();

const { isAuth } = require('../middlewares/authMiddleware');

const genreService = require("../services/genreService");


router.get('/', async (req, res, next) => {
    const limit = req.query?.limit || 8;
    const skip = req.query?.skip || 0;

    const value = req.query?.value;
    const id = req.query?.id;

    const search = {};

    if (value) {
        search.key = 'value';
        search.value = value;
    } else if (id) {
        search.key = '_id';
        search.value = id;
    }

    try {
        const [genres, count] = await Promise.all([
            genreService.getGenres(search, limit, skip),
            genreService.getCount(search)
        ]);

        res.status(200).json({ count, genres });
    } catch (err) {
        next(err);
    }
});

router.get('/count', async (req, res, next) => {
    try {
        const count = await genreService.getTotalCount();

        res.status(200).json({ totalGenres: count });
    } catch (err) {
        next(err);
    }
});

router.get('/:genreId', async (req, res, next) => {
    try {
        const genre = await genreService.getOne(req.params.genreId);

        res.status(200).json(genre);
    } catch (err) {
        next(err);
    }
});

router.put('/:genreId', isAuth, async (req, res, next) => {
    try {
        if (req.verifiedUserRole !== 'admin') throw { status: 401, message: 'Only admins can edit genres!' };

        const genre = await genreService.editGenre(req.params.genreId, req.body);

        res.status(200).json(genre);
    } catch (err) {
        next(err);
    }
});

router.post('/', isAuth, async (req, res, next) => {
    try {
        if (req.verifiedUserRole !== 'admin') throw { status: 401, message: 'Only admins can create new genres!' };

        const genre = await genreService.addGenre(req.body);

        res.status(200).json(genre);
    } catch (err) {
        next(err);
    }
});

router.delete('/:genreId', isAuth, async (req, res, next) => {
    try {
        if (req.verifiedUserRole !== 'admin') throw { status: 401, message: 'Only admins can delete genres!' };
        
        await genreService.deleteGenre(req.params.genreId);

        res.status(204).json({})
    } catch (err) {
        next(err);
    }
});


module.exports = router;