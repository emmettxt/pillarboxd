const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const loginRouter = require('./Controllers/login')
const middleware = require('./utils/middleware')
const userRouter = require('./Controllers/users')
const tmdbProxyRouter = require('./Controllers/tmdbProxy')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/login',loginRouter)
app.use('/users',userRouter)
app.use('/tmdb',tmdbProxyRouter)


// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

module.exports = app
