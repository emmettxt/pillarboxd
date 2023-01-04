const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.send(users)
})

userRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id)
    if (!user) return response.sendStatus(404)
    response.send(user)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/', async (request, response, next) => {
  const { username, name, password, email } = request.body
  const existingUser = await User.findOne({ username: username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  const existingUserEmail = await User.findOne({ email })
  if (existingUserEmail) {
    return response.status(400).json({ error: 'email must be unique' })
  }
  if (!password) {
    return response
      .status(400)
      .json({ error: 'must contain username and password' })
  }
  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    email,
    passwordHash: passwordHash,
    active: true,
  })
  try {
    const savedUser = await user.save()
    // await generateValidationEmail(savedUser)
    response.status(200).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message })
    } else {
      next(error)
    }
  }
})
module.exports = userRouter
