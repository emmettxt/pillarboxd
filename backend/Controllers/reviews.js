const reviewRouter = require('express').Router()
const Review = require('../models/review')

reviewRouter.get('/:id', async (request, response) => {
  const review = await Review.findById(request.params.id)
  if (!review) return response.sendStatus(404)
  response.send(review)
})
reviewRouter.get('/', async (request, response) => {
  const reviews = await Review.find(request.query).populate('user', 'username')
  response.send(reviews)
})
reviewRouter.post('/', async (request, response, next) => {
  if (!request.user) return response.sendStatus(401)
  const user = request.user
  const review = new Review({
    ...request.body,
    date_added: new Date(),
    date_modified: new Date(),
    user: user.id,
  })
  try {
    await review.save()
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response
        .status(422)
        .send({ name: error.name, message: error.message })
    }
    return next(error)
  }
  user.reviews.push(review)
  user.save()
  return response.send({
    ...review.toJSON(),
    user: { id: user.id, username: user.username },
  })
})
reviewRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const user = request.user

  if (!user) {
    return response.sendStatus(401)
  }
  const review = await Review.findById(id)
  if (review.user.toString() !== user.id) {
    console.log({ 'review.user': review.user.toString(), 'user.id': user.id })
    return response.sendStatus(401)
  }

  review.delete()
  response.sendStatus(202)
})
//updating the content of the review
reviewRouter.patch('/:id', async (request, response, next) => {
  const review = await Review.findById(request.params.id).populate(
    'user',
    'username'
  )
  if (!review) return response.sendStatus(404)

  if (!request.user || request.user.id !== review.user.id.toString()) {
    return response.sendStatus(401)
  }
  if (!request.body.content && !request.body.rating) {
    return response
      .status(403)
      .json({ message: 'request body must contain either content or rating' })
  }
  if (request.body.content) {
    review.content = request.body.content
  }
  if (request.body.rating) {
    review.rating = request.body.rating
  }
  review.date_modified = new Date()
  try {
    await review.save()
  } catch (error) {
    return next(error)
  }
  return response.json(review)
})
module.exports = reviewRouter
