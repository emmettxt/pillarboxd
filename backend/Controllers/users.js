const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const tmdbUtil = require('../utils/tmdb')
const axios = require('axios')
const { TMDB_API_KEY_V3 } = require('../utils/config')

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

userRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
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

//this route is for adding an entire show to a users watchlist
userRouter.post('/:userId/watchlist/:tv_id', async (request, response) => {
  const { userId, tv_id } = request.params
  let user
  try {
    user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: {
            tv_id: tv_id,
          },
        },
      },
      { new: true }
    )
  } catch (error) {
    return response.sendStatus(404)
  }
  if (!user) {
    return response.sendStatus(404)
  }
  try {
    const tvWatchlist = await tmdbUtil.getShowWatchlist(tv_id)
    user.watchlist = [...user.watchlist, ...tvWatchlist]
  } catch (error) {
    return response.sendStatus(404)
  }
  await user.save()
  response.json(user)
})

//this route is for removing a show from a users watchlist
userRouter.delete('/:userId/watchlist/:tv_id', async (request, response) => {
  const userId = request.params.userId
  const tv_id = request.params.tv_id
  await User.findByIdAndUpdate(userId, {
    $pull: { watchList: { id: tv_id } },
  })
  response.sendStatus(200)
})

//this route is for adding an entire season of a show to a users watchlist
userRouter.post(
  '/:userId/watchlist/:tv_id/season/:season_number',
  async (request, response) => {
    const { userId, tv_id, season_number } = request.params
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: {
            tv_id: tv_id,
            season_number: season_number,
          },
        },
      },
      { new: true }
    )
    if (!user) {
      return response.sendStatus(404)
    }
    try {
      Number(tv_id)
      Number(season_number)
    } catch (err) {
      return response.sendStatus(404)
    }
    const seasonWatchList = await tmdbUtil.getSeasonWatchlist(
      tv_id,
      Number(season_number)
    )
    user.watchlist = [...user.watchlist, ...seasonWatchList]
    await user.save()
    response.json(user)
  }
)

//this removes an entire season from a users watchlist
userRouter.delete(
  '/:userId/watchlist/:tv_id/season/:season_number',
  async (request, response) => {
    const { userId, tv_id, season_number } = request.params
    await User.findByIdAndUpdate(userId, {
      $pull: {
        watchlist: {
          tv_id,
          season_number,
        },
      },
    })
    response.sendStatus(200)
  }
)
//this adds an episode to a users watchlist
userRouter.post(
  '/:userId/watchlist/:tv_id/season/:season_number/episode/:episode_number',
  async (request, response) => {
    const { userId, tv_id, season_number, episode_number } = request.params
    const user = await User.findById(userId)
    if (!user) {
      return response.sendStatus(404)
    }
    //if already exists return user
    if (
      user.watchlist.find(
        (watchlisttItem) =>
          watchlisttItem.tv_id === tv_id &&
          watchlisttItem.season_number === season_number &&
          watchlisttItem.episode_number === episode_number
      )
    ) {
      return response.json(user)
    }
    //try get the episode from tmdb to check it is valid
    try {
      await axios.get(
        `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}/episode/${episode_number}?api_key=${TMDB_API_KEY_V3}`
      )
      user.watchlist.push({ tv_id, season_number, episode_number })
      await user.save()
      return response.json(user)
    } catch (error) {
      if (error.name === 'AxiosError') {
        response.status(error.response.status).send(error.response.data)
      }
    }
  }
)

//this removes an episode from a users watchlist
userRouter.delete(
  '/:userId/watchlist/:tv_id/season/:season_number/episode/:episode_number',
  async (request, response) => {
    const { userId, tv_id, season_number, episode_number } = request.params
    await User.findByIdAndUpdate(userId, {
      $pull: {
        watchlist: {
          tv_id,
          season_number,
          episode_number,
        },
      },
    })

    response.sendStatus(200)
  }
)

module.exports = userRouter
