const jwt = require('jwt-simple');

let User = global.User

import config from '../config'

const generateTokenForUser = (user) => {
    const timeStamp = new Date().getTime();
    return jwt.encode({ sub: user.username, iat: timeStamp }, config.secret);
};
exports.signup = async (req, res, next) => {
    const { username, password } = req.body;

    // send err if no username or password provided
    if (!username || !password) {
        return res.status(422).send({ error: 'Pls provide username and password' });
    }

    const existingUser = User.find(username)
    if (existingUser) {
        return res.status(422).send({ error: 'username is in use' });
    }

    // create new user
    const user = {
        username,
        password,
    }

    let createdUser = await User.create(user)
    if (createdUser) return res.json({ token: generateTokenForUser(createdUser) });
    else return res.status(422).send({ error: 'user signup error' });
};

exports.signin = (req, res, next) => {
    // passport already checked username & pswd, so just give user a token
    res.send({ token: generateTokenForUser(req.user) });
};
