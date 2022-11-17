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
      console.log(error.message)
    }
  }
})
// const generateValidationEmail = async (savedUser) => {
//   const randomString = cryptoRandomString({ length: 128, type: 'url-safe' })
//   const validationString = new ValidationString({
//     user: savedUser.id,
//     string: randomString,
//   })
//   await validationString.save()
// }

//this route is for adding an entire show to a users watchlist
userRouter.post('/:userId/watchlist/:tv_id', async (request, response) => {
  const { userId, tv_id } = request.params
  if (request.user.id !== userId) {
    return response.sendStatus(401)
  }
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
  response.json(user.watchlist)
})

//this route is for removing a show from a users watchlist
userRouter.delete('/:userId/watchlist/:tv_id', async (request, response) => {
  const userId = request.params.userId
  const tv_id = request.params.tv_id
  if (!request.user || request.user.id !== userId) {
    return response.sendStatus(200)
  }
  await User.findByIdAndUpdate(
    userId,
    {
      $pull: { watchlist: { tv_id } },
    },
    { new: true }
  )
  response.sendStatus(200)
})

//this route is for adding an entire season of a show to a users watchlist
userRouter.post(
  '/:userId/watchlist/:tv_id/season/:season_number',
  async (request, response) => {
    const { userId, tv_id, season_number } = request.params
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
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
    response.json(user.watchlist)
  }
)

//this removes an entire season from a users watchlist
userRouter.delete(
  '/:userId/watchlist/:tv_id/season/:season_number',
  async (request, response) => {
    const { userId, tv_id, season_number } = request.params
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
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
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          watchlist: {
            tv_id,
            season_number,
            episode_number,
          },
        },
      },
      { new: true }
    )
    if (!user) {
      return response.sendStatus(404)
    }
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
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
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

/* testing new shows route for user object */
userRouter.post(
  '/:userId/shows/:tv_id/episodes',
  async (request, response, next) => {
    const { userId, tv_id } = request.params
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
    let episodes
    try {
      episodes = await tmdbUtil.getShowEpisodes(tv_id)
    } catch (error) {
      next(error)
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          [`shows.${tv_id}.episodes`]: episodes,
        },
      },
      { new: true }
    )
    response.json(user.shows.get(tv_id))
  }
)

//this route is for removing a show from a users watchlist
userRouter.delete(
  '/:userId/shows/:tv_id/episodes',
  async (request, response) => {
    const userId = request.params.userId
    const tv_id = request.params.tv_id
    if (!request.user || request.user.id !== userId) {
      return response.sendStatus(401)
    }
    await User.findByIdAndUpdate(userId, {
      $set: { [`shows.${tv_id}.episodes`]: [] },
    })

    response.sendStatus(200)
  }
)
//adding a season to a users watchlist
userRouter.post(
  '/:userId/shows/:tv_id/episodes/season/:season_number',
  async (request, response, next) => {
    const { userId, tv_id, season_number } = request.params
    //check userid is valid
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
    //check the paramaters are valid
    try {
      Number(tv_id)
      Number(season_number)
    } catch (err) {
      return response.sendStatus(404)
    }
    //get list of episodes for the season
    let episodes = []
    try {
      episodes = await tmdbUtil.getSeasonEpisodes(tv_id, Number(season_number))
    } catch (error) {
      return next(error)
    }

    const user = await User.findById(userId)
    const show = user.shows.get(tv_id)
    //if the shows exists remove the episodes already in the season
    if (show) {
      show.episodes = show.episodes.filter(
        (e) => e.season_number !== Number(season_number)
      )
      show.episodes = [...show.episodes, ...episodes]
    } else {
      user.shows.set(tv_id, { episodes })
    }
    user.save()
    response.json(user.shows.get(tv_id))
  }
)

//this route is for removing a show from a users watchlist
userRouter.delete(
  '/:userId/shows/:tv_id/episodes/season/:season_number',
  async (request, response) => {
    const { userId, tv_id, season_number } = request.params

    if (!request.user || request.user.id !== userId) {
      return response.sendStatus(200)
    }
    const user = await User.findById(userId)
    try {
      const show = user.shows.get(tv_id)
      show.episodes = show.episodes.filter(
        (e) => e.season_number !== Number(season_number)
      )
      user.save()
    } finally {
      response.sendStatus(200)
    }
  }
)
//adding a single episode to a users watchlist
userRouter.post(
  '/:userId/shows/:tv_id/episodes/season/:season_number/episode/:episode_number',
  async (request, response, next) => {
    const { userId, tv_id, season_number, episode_number } = request.params
    //check userid is valid
    if (request.user.id !== userId) {
      return response.sendStatus(401)
    }
    //check the paramaters are valid
    try {
      await axios.get(
        `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}/episode/${episode_number}?api_key=${TMDB_API_KEY_V3}`
      )
    } catch (err) {
      return next(err)
    }

    const user = await User.findById(userId)
    const show = user.shows.get(tv_id)
    //if the shows exists remove the episodes already in the season
    if (show) {
      show.episodes = show.episodes.filter(
        (e) =>
          e.season_number !== Number(season_number) ||
          e.episode_number !== Number(episode_number)
      )
    }
    const episode = { season_number, episode_number }
    show.episodes = [...show.episodes, episode]
    await user.save()
    response.json(show)
  }
)

//this route is for removing an episode from a users watchlist
userRouter.delete(
  '/:userId/shows/:tv_id/episodes/season/:season_number/episode/:episode_number',
  async (request, response) => {
    const { userId, tv_id, season_number, episode_number } = request.params

    if (!request.user || request.user.id !== userId) {
      return response.sendStatus(200)
    }
    const user = await User.findById(userId)
    try {
      const show = user.shows.get(tv_id)
      show.episodes = show.episodes.filter(
        (e) =>
          e.season_number !== Number(season_number) ||
          e.episode_number !== Number(episode_number)
      )

      user.save()
    } finally {
      response.sendStatus(200)
    }
  }
)
userRouter.get('/:userId/shows/:tv_id/', async (request, response) => {
  const userId = request.params.userId
  const tv_id = request.params.tv_id
  if (!request.user || request.user.id !== userId) {
    return response.sendStatus(200)
  }
  const user = await User.findById(userId)
  const usersShow = user.shows.get(tv_id)
  response.json(usersShow)
})
userRouter.get('/:userId/shows/', async (request, response) => {
  const userId = request.params.userId
  if (!request.user || request.user.id !== userId) {
    return response.sendStatus(200)
  }
  const user = await User.findById(userId)
  response.json(user.shows)
})
//this is for updating a specific show for a user, usually to add or remove from saved
userRouter.patch('/:userId/shows/:tv_id', async (request, response) => {
  const userId = request.params.userId
  if (!request.user || request.user.id !== userId) {
    return response.sendStatus(401)
  }
  const user = await User.findByIdAndUpdate(userId)
  const tv_id = request.params.tv_id
  const show = user.shows.get(tv_id)
  user.shows.set(tv_id, { ...show?._doc, ...request.body })
  user.save()
  response.json(user.shows.get(tv_id))
})
module.exports = userRouter
