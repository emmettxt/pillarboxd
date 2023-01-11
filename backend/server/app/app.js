const config = require('../utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const loginRouter = require('../controllers/login')
const middleware = require('../utils/middleware')
const userRouter = require('../controllers/users')
const tmdbProxyRouter = require('../controllers/tmdbProxy')
const imdbRouter = require('../controllers/imdb')
const userShowsRouter = require('../controllers/usersShows')
const reviewRouter = require('../controllers/reviews')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(express.static('client/build'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/users', userShowsRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/tmdb', tmdbProxyRouter)
app.use('/api/imdb', imdbRouter)
app.use(middleware.errorHandler)

app.use('/*', express.static('client/build'))

module.exports = app
