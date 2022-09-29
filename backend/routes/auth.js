// const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require('crypto')
// const db = require('../db');
// const router = express.Router()
const User = require('../models/user')

// router.get('/login', function (req, res) {
//   res.render('login')
// })
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password' })
      }
      const hashedPassword = await crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256'
      )
      if (!crypto.timingSafeEqual(user.passwordHash, hashedPassword)) {
        return cb(null, false, {
          message: 'Incorrect username or password',
        })
      }
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  })
)
const authLocal = passport.authenticate('local', { session: false })
module.exports = authLocal
// router.post('/login/password',passport.authenticate('local'),{session:false})
// module.exports = router
