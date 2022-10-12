const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const userRouter = require('./controllers/users')
const tmdbProxyRouter = require('./controllers/tmdbProxy')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/login',loginRouter)
app.use('/api/users',userRouter)
app.use('/api/tmdb',tmdbProxyRouter)


// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

module.exports = app
