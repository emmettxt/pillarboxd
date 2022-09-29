const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })
  response.json(users)
})

userRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })
  response.json(user)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const existingUser = await User.findOne({ username: username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
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
    username: username,
    name: name,
    passwordHash: passwordHash,
  })
  try {
    const savedUser = await user.save()
    response.status(200).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).send({ error: error.message })
    }
  }
})

module.exports = userRouter
