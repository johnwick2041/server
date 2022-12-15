const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');

const userService = require('../services/userService');

const { checkUsernameAvailability, editPasswordValidator: patchPasswordValidator } = require('../utils/validations');

router.get('/:userId', isAuth, async (req, res, next) => {

    try {
        if (req.verifiedUserRole !== 'admin') {
            if (req.verifiedUserId !== req.params.userId) throw { status: 401, message: 'You are not authorized to view this data!' };
        }

        const user = await userService.getUser(req.params.userId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

router.put('/:userId', isAuth, async (req, res, next) => {
    if (req.body.password === '') delete req.body.password;

    try {
        if(req.verifiedUserId !== req.params.userId) throw {status: 401, message: 'You cannot modify other users data!'};

        const user = await userService.getUser(req.params.userId);
        if (req.body.hasOwnProperty('_creationDate')) throw { status: 401, message: 'You cannot modify creation date!' };
        if (req.body.username !== user.username) {
            if (req.body.hasOwnProperty('username')) await checkUsernameAvailability(req.body.username);
        }
        if (req.body.hasOwnProperty('password')) patchPasswordValidator(req.body.password, req.body.rePassword);

        const updatedUser = await userService.update(req.params.userId, req.body);

        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
});

module.exports = router;