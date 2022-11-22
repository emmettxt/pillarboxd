const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// intitalizes user in db and returns the user
const initialUserWithShow = {
  username: 'test_user0',
  password: 'password',
  email: 'test0@test.test',
  shows: {
    1398: {
      isSaved: true,
      episodes: [
        { season_number: 1, episode_number: 1 },
        { season_number: 1, episode_number: 2 },
      ],
    },
  },
}
const initialUserWithoutShow = {
  username: 'test_user1',
  password: 'password',
  email: 'test1@test.test',
}
const initialUsers = [initialUserWithShow, initialUserWithoutShow]

const getTestUserWithoutShow = async () => {
  const user = await User.findOne({ username: initialUserWithoutShow.username })
  return user
}

const getTestUserWithShow = async () => {
  const user = await User.findOne({ username: initialUserWithShow.username })
  return user
}
const intializeUsers = async () => {
  await User.deleteMany({})
  for (const initialUser of initialUsers) {
    const passwordHash = await bcrypt.hash(initialUser.password, 10)
    const user = new User({ ...initialUser, passwordHash })
    await user.save()
  }
  const users = await User.find({})
  return users
}

const nonExisitingUser = async () => {
  const passwordHash = await bcrypt.hash('dontNeedToRemember', 10)
  const user = new User({
    username: 'toBeDeleted',
    passwordHash,
    email: 'deleteUser@test.test',
  })
  await user.save()
  await user.delete()
  return user.toJSON()
}

const getValidTokenForUser = async (user) => {
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const token = await jwt.sign(userForToken, process.env.SECRET)
  return token
}
const userWatchListTestHelper = {
  intializeUsers,
  initialUsers,
  nonExisitingUser,
  getTestUserWithoutShow,
  getTestUserWithShow,
  getValidTokenForUser,
  initialUserWithShow,
}
module.exports = userWatchListTestHelper
