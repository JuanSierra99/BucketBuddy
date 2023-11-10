const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const client = require("./database");
require("dotenv").config();

//Configure JWT options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SIGN_KEY,
};

// https://github.com/jwalton/passport-api-docs
passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    const username = jwtPayload.username;
    client.query(
      `SELECT * FROM users WHERE username='${username}'`,
      (err, result) => {
        if (err) {
          return done(err, false);
        }
        if (result.rows.length === 1) {
          const user = result.rows[0];
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    );
  })
);

module.exports = passport;
