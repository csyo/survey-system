var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'name',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(name, password, done) {
      User.findOne({
        name: name
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: '此帳號尚未註冊' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: '密碼不正確。' });
        }
        return done(null, user);
      });
    }
  ));
};
