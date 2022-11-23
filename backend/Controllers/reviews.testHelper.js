const Review = require('../models/review')
const User = require('../models/user')
const intialReview = {
  tv_id: 1389,
  content: 'content',
  rating: 5,
  episode_number: 1,
  season_number: 1,
  date_added: new Date(),
  date_modified: new Date(),
}

const initializeReview = async () => {
  const user = await User.findOne({})
  const review = new Review({...intialReview,user:user.id})
  await review.save()
  return review
}
const reviewTestHelper = { initializeReview }
module.exports = reviewTestHelper
