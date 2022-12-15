const router = require('express').Router();
const jwt = require('jsonwebtoken');

const authService = require('../services/authService');

const { checkUsernameAvailability } = require('../utils/validations');

const SECRET = process.env.SECRET;

router.post('/register', async (req, res, next) => {
    try {
        await checkUsernameAvailability(req.body.username);

        const user = await authService.register(req.body);
        const token = await generateAuthToken(user._id);
        res.status(201).json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email,
            _creationDate: user._creationDate,
            'X-Auth-Token': token
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await authService.login(req.body);
        const token = await generateAuthToken(user._id);

        res.status(200).json({ _id: user._id, username: user.username, _creationDate: user._creationDate, 'X-Auth-Token': token });
    } catch (err) {
        next(err);
    }
});

function generateAuthToken(userId) {
    return new Promise((resolve, reject) => {
        jwt.sign({_id: userId}, SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                return reject({ status: 500, message: 'An error occured while generating auth token!' });
            }
            resolve(token);
        });
    });
}

module.exports = router;