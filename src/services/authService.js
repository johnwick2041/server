const User = require('../models/User');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

exports.register = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        _creationDate: new Date().getTime()
    });

    return newUser.save();
}

exports.login = async ({username, password}) => {
    const user = await User.findOne({username});
    if(!user) throw {status: 400, message: 'Wrong username or password!'};

    const result = await bcrypt.compare(password, user.password);

    if(!result) throw {status: 400, message: 'Wrong username or password!'}

    return user;
}