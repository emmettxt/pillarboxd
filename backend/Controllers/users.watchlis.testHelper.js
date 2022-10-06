const User = require('../models/user')
const bcrypt = require('bcryptjs')

// intitalizes user in db and returns the user
const initialUser = {
  username: 'test_user',
  password: 'password',
  watchlist: [
    { tv_id: 1398, season_number: 1, episode_number: 1 },
    { tv_id: 1398, season_number: 1, episode_number: 2 },
    { tv_id: 1398, season_number: 2, episode_number: 1 },
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
  const user = new User({ username: 'toBeDeleted', passwordHash })
  await user.save()
  await user.delete()
  return user.id
}

const userWatchListTestHelper = {
  intializeUser,
  initialUser,
  nonExisitingUserId,
  getTestUser,
}

module.exports = userWatchListTestHelper
