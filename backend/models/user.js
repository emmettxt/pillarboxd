const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [
      /^.+@(?:[\w-]+\.)+\w+$/,
      'Please fill a valid email address',
    ],
  },
  active: Boolean,
  name: String,
  passwordHash: String,
  watchlist: [{ tv_id: Number, season_number: Number, episode_number: Number }],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    ;(returnedObject.id = returnedObject._id.toString()),
      delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
