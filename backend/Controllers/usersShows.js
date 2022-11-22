const usersShowsRouter = require('express').Router()
const User = require('../models/user')
const tmdbUtil = require('../utils/tmdb')
const axios = require('axios')
const { TMDB_API_KEY_V3 } = require('../utils/config')

/* testing new shows route for user object */
usersShowsRouter.post(
  '/:userId/shows/:tv_id/episodes',
  async (request, response, next) => {
    const { userId, tv_id } = request.params
    if(!request.user) return response.sendStatus(401)
    if (request.user.id !== userId) {
      return response.sendStatus(403)
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
usersShowsRouter.delete(
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
usersShowsRouter.post(
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
    //this function defines updating the db
    const updateDb = async () => {
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
      await user.save()
      // return user
      response.json(user.shows.get(tv_id))
    }
    //call update function with retryfucntion
    const attempts = 10
    try {
      await retryFunction(updateDb, attempts, next)
    } catch (err) {
      next(err)
    }
  }
)
//function take a function and number of attempts and will try a number of attempt to run fucntion without error
//will throw error if still failing after number of attempts
const retryFunction = async (fn, attempts) => {
  for (let i = 0; i < attempts; i++) {
    try {
      await fn()
      return
    } catch (err) {
      if (i === attempts + 1) {
        // return next(err)
        throw err
      }
      await setTimeout(() => null, 100)
      continue
    }
  }
}
//this route is for removing a show from a users watchlist
usersShowsRouter.delete(
  '/:userId/shows/:tv_id/episodes/season/:season_number',
  async (request, response) => {
    const { userId, tv_id, season_number } = request.params

    if (!request.user || request.user.id !== userId) {
      return response.sendStatus(200)
    }
    response.sendStatus(202)
    await User.findByIdAndUpdate(userId, {
      $pull: {
        [`shows.${tv_id}.episodes`]: {
          season_number,
        },
      },
    })
  }
)
//adding a single episode to a users watchlist
usersShowsRouter.post(
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

    const updateDb = async () => {
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
    try {
      retryFunction(updateDb, 10)
    } catch (err) {
      next(err)
    }
  }
)

//this route is for removing an episode from a users watchlist
usersShowsRouter.delete(
  '/:userId/shows/:tv_id/episodes/season/:season_number/episode/:episode_number',
  async (request, response) => {
    const { userId, tv_id, season_number, episode_number } = request.params

    if (!request.user || request.user.id !== userId) {
      return response.sendStatus(401)
    }
    response.sendStatus(202)
    await User.findByIdAndUpdate(userId, {
      $pull: {
        [`shows.${tv_id}.episodes`]: {
          season_number,
          episode_number,
        },
      },
    })
  }
)
usersShowsRouter.get('/:userId/shows/:tv_id/', async (request, response) => {
  const userId = request.params.userId
  const tv_id = request.params.tv_id
  if (!request.user || request.user.id !== userId) {
    return response.sendStatus(200)
  }
  const user = await User.findById(userId)
  const usersShow = user.shows.get(tv_id)
  response.json(usersShow)
})
usersShowsRouter.get('/:userId/shows/', async (request, response) => {
  const userId = request.params.userId
  if (!request.user || request.user.id !== userId) {
    return response.sendStatus(200)
  }
  const user = await User.findById(userId)
  response.json(user.shows)
})
//this is for updating a specific show for a user, usually to add or remove from saved
usersShowsRouter.patch('/:userId/shows/:tv_id', async (request, response) => {
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
module.exports = usersShowsRouter
