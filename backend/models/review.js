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
  content: { type: String, required: true },
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
/* //additional validation to check that season number is given when episode number is given
reviewShema.pre('validate', (next) => {
  console.log(this.tv_id)
  const isSeasonNumberMissing = this.season_number === undefined
  const isEpisodeNumberMissing = this.episode_number === undefined
  // console.log({isSeasonNumberMissing, isEpisodeNumberMissing })
  // if (isSeasonNumberMissing && !isEpisodeNumberMissing) {
  //   const error = new mongoose.Error.ValidationError(this)
  //   error.addError(
  //     'season_number',
  //     new mongoose.Error.ValidatorError({
  //       message: 'epsiode_number is required if season_number is given',
  //     })
  //   )
  //   next(error)
  // } else
  if (!isEpisodeNumberMissing && isSeasonNumberMissing) {
    const error = new mongoose.Error.ValidationError(this)
    error.addError(
      'season_number',
      new mongoose.Error.ValidatorError({
        message: 'season_number is required if epsiode_number is given',
      })
    )
    next(error)
  } else {
    next()
  }
}) */

const Review = mongoose.model('Review', reviewShema)
module.exports = Review
