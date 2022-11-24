const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}
const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
  }
  next()
}

//user extractor middleware, should be called after tokenExtractor. Uses the token to get the user and add to request
const userExtractor = async (request, response, next) => {
  if (request.token) {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      request.user = user
    } catch (err) {
      return response.status(401).json({
        error: err.message,
      })
    }
  }
  next()
}
const errorHandler = (error, request, response, next) => {
  switch (error.name) {
    case 'CastError':
      return response.status(400).json({ message: error.message })

    case 'AxiosError':
      if (error.code === 'ECONNABORTED') {
        return next(error)
      }
      return response.status(error.response.status).json(error.response.data)

    case 'MongoServerError':
      return response.status(400).json({ message: error.message })

    default:
      next(error)
  }
}
module.exports = { tokenExtractor, requestLogger, userExtractor, errorHandler }
