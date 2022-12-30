const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
  isSaved: { type: Boolean, default: false },
  episodes: [{ season_number: Number, episode_number: Number }],
  tmdb: Map,
})
showSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    returnedObject.episodes.forEach((episode) => {
      delete episode._id
    })
  },
})

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
    match: [/^.+@(?:[\w-]+\.)+\w+$/, 'Please fill a valid email address'],
  },
  isModerator: { type: Boolean, default: false },
  active: Boolean,
  name: String,
  passwordHash: String,
  shows: { type: Map, of: showSchema },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
