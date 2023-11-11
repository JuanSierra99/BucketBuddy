const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const client = require("./database");
require("dotenv").config();

//Configure JWT options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // how we will extract jwt
  secretOrKey: process.env.JWT_SIGN_KEY, // used to verify the signature of the incoming JWT
};

// https://github.com/jwalton/passport-api-docs
passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    const username = jwtPayload.username;
    const user = {
      username: jwtPayload.username,
    };
    return done(null, user);
  })
);

module.exports = passport;
