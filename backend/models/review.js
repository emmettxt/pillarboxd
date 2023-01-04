const mongoose = require('mongoose')
const episodeNumberValidator = function (value) {
  return !(this.season_number === undefined) && value
}

const reviewShema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  tv_id: { type: Number, index: true, required: true },
  date_added: { type: Date, required: true },
  date_modified: { type: Date, required: true },
  content: String,
  season_number: Number,
  episode_number: {
    type: Number,
    validate: [
      episodeNumberValidator,
      'season_number is required if epsiode_number is given',
    ],
  },
  rating: {
    type: Number,
    min: [0, 'Must be at least 0 got {VALUE}'],
    max: [5, 'Cannot be greater than 5 got {VALUE}'],
  },
  moderation: {
    isModerated: { type: Boolean, default: false },
    moderator_comment: String,
    date_moderated: Date,
  },
})
reviewShema.index(
  { user: 1, tv_id: 1, season_number: 1, episode_number: 1 },
  { unique: true }
)

reviewShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Review = mongoose.model('Review', reviewShema)
module.exports = Review
