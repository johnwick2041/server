const userService = require('../services/userService');

exports.editPasswordValidator = (password) => {
    if(!password) throw {status: 400, message: 'Password is required!'};
    if(password.length < 5) throw {status: 400, message: 'Password should be at least 5 characters long!'};
}

exports.checkUsernameAvailability = async (username) => {
    const result = await userService.getUsername(username);

    if (result === null) return;

    throw { status: 409, message: 'Username already exist!' };
}