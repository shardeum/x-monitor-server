let User = global.User
const passport = require('passport');
const JwtStragety = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

import config from '../config'
// Local Stragety Setup
const localOption = { usernameField: 'username' };
const localLogin = new LocalStrategy(localOption, (username, password, done) => {
    const foundUser = User.find(username)
    if (foundUser) {
        User.comparePassword(password, username).then(isMatch => {
            if (isMatch) done(null, foundUser)
            else return done(null, false)
        })
    } else {
        return done(null, false)
    }
});

// JWT Strategy setup
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret,
};

const jwtLogin = new JwtStragety(jwtOptions, (payload, done) => {
    console.log('payload', payload)
    console.log('payload.sub', payload.sub)
    // check if user id in payload exist in database
    const foundUser = User.find(payload.sub)
    if(!foundUser) console.log("Not find any user")
    if (!foundUser) {
        done(null, false)
        return
    }
    done(null, foundUser)
});

// Tell passport to use this stragety
passport.use(jwtLogin);
passport.use(localLogin);
