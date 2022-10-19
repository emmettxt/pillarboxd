const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// intitalizes user in db and returns the user
const initialUser = {
  username: 'test_user',
  password: 'password',
  email: 'test@test.test',
  watchlist: [
    { tv_id: 1398, season_number: 1, episode_number: 1 },
    { tv_id: 1398, season_number: 1, episode_number: 2 },
    { tv_id: 1398, season_number: 2, episode_number: 1 },
    { tv_id: 1399, season_number: 1, episode_number: 1 },
  ],
}
const getTestUser = async () =>
  await User.findOne({ username: initialUser.username })

const intializeUser = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  const user = new User({ ...initialUser, passwordHash })
  await user.save()
  return user
}

const nonExisitingUserId = async () => {
  const passwordHash = await bcrypt.hash('dontNeedToRemember', 10)
  const user = new User({
    username: 'toBeDeleted',
    passwordHash,
    email: 'deleteUser@test.test',
  })
  await user.save()
  await user.delete()
  return user.id
}

const getValidTokenForUser = async (user) => {
  const userForToken = {
    username: user.username,
    id: user.id,
  }
  console.log(userForToken)
  return await jwt.sign(userForToken,process.env.SECRET)
}
const userWatchListTestHelper = {
  intializeUser,
  initialUser,
  nonExisitingUserId,
  getTestUser,
  getValidTokenForUser
}
module.exports = userWatchListTestHelper
