const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

exports.isAuth = (req, res, next) => {
    const authToken = req.headers['x-auth-token'];

    if(authToken) {
        jwt.verify(authToken, SECRET, (err, decodedData) => {
            if(err) {
                return next({status: 400, message:'Invalid access token!'});
            }

            req.verifiedUserId = decodedData._id;
            next();
        });
    } else {
        return next({status: 400, message:'You are not authenticated!'});
    }
}