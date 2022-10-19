const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const {
  intializeUser,
  initialUser,
  nonExisitingUserId,
  getTestUser,
  getValidTokenForUser,
} = require('./users.watchlis.testHelper')
const tmdbUtil = require('../utils/tmdb')
//set DB to have exactly one user with single watchlist item with firs two episodes of season 1
beforeEach(async () => {
  await intializeUser()
})

describe('user has watchlist with one show', () => {
  describe('adding an entire show', () => {
    test('show not already in watchlist works', async () => {
      const token = await getValidTokenForUser(await getTestUser())
      const toAdd = await initialUser.watchlist[0]
      //clear show from watchlist
      await User.findOneAndUpdate(
        { username: initialUser.username },
        {
          $pull: {
            watchlist: {
              tv_id: toAdd.tv_id,
            },
          },
        }
      )
      const userBefore = await getTestUser()
      await api
        .post(`/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}`)
        .send()
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const userAfter = await getTestUser()
      const tvWatchlist = await tmdbUtil.getShowWatchlist(toAdd.tv_id)
      expect(userAfter.watchlist).toHaveLength(
        userBefore.watchlist.length + tvWatchlist.length
      )
    }, 10000)
    test('show already in watchlist works', async () => {
      const toAdd = await initialUser.watchlist[0]
      const userBefore = await getTestUser()
      const token = await getValidTokenForUser(userBefore)

      await api
        .post(`/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}`)
        .send()
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userAfter = await getTestUser()
      const tvWatchlist = await tmdbUtil.getShowWatchlist(toAdd.tv_id)
      const userWatchlistNotFromAdded = userBefore.watchlist.filter(
        (watchlistItem) => watchlistItem.tv_id !== toAdd.tv_id
      )
      expect(userAfter.watchlist).toHaveLength(
        tvWatchlist.length + userWatchlistNotFromAdded.length
      )
      const tvInUsersWatchlist = userAfter.watchlist.filter(
        (watchlisttItem) => watchlisttItem.tv_id === toAdd.tv_id
      )
      expect(tvInUsersWatchlist).toHaveLength(tvWatchlist.length)
    })
    test('invalid user id', async () => {
      const badId = await nonExisitingUserId()
      await api.post(`/users/${badId}/watchlist/${456}`).send().expect(404)
    })
    test('invalid tvId id', async () => {
      const user = await getTestUser()
      const token = await getValidTokenForUser(user)

      await api
        .post(`/api/users/${user.id}/watchlist/${'thiswillbreak'}`)
        .send()
        .set('Authorization', `bearer ${token}`)
        .expect(404)
    })
  })
  describe.only('deleting an entire show', () => {
    test('show that exists is removed', async () => {
      const userBeforeDelete = await getTestUser()
      const token = await getValidTokenForUser(userBeforeDelete)

      const tv_idToDelete = userBeforeDelete.watchlist[0].tv_id
      await api
        .delete(`/api/users/${userBeforeDelete.id}/watchlist/${tv_idToDelete}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      const userAfterDelete = await getTestUser()
      expect(userAfterDelete.watchlist).toHaveLength(
        userBeforeDelete.watchlist.filter(
          (item) => item.tv_id !== tv_idToDelete
        ).length
      )
    })
    test('show that does not exist causes no error', async () => {
      const userBeforeDelete = await getTestUser()
      const token = await getValidTokenForUser(userBeforeDelete)

      await api
        .delete(`/api/users/${userBeforeDelete.id}/watchlist/456`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)

      const userAfterDelete = await getTestUser()
      expect(userAfterDelete.watchlist).toEqual(userBeforeDelete.watchlist)
    })
    test.only('bad user id causes no error', async () => {
      const badUserId = await nonExisitingUserId()
      const token = await getValidTokenForUser({
        id: badUserId,
        username: 'none',
      })

      await api
        .delete(`/api/users/${badUserId}/watchlist/456`)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
    })
  })
  describe('adding a season', () => {
    describe('show is already in watchlist', () => {
      test('season is already in watchlist', async () => {
        const toAdd = initialUser.watchlist[0]
        const userBefore = await getTestUser()

        //do api call
        await api
          .post(
            `/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}/season/${toAdd.season_number}`
          )
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const userAfterAdd = await getTestUser()

        const seasonWatchList = await tmdbUtil.getSeasonWatchlist(
          toAdd.tv_id,
          toAdd.season_number
        )
        //this is the watchlist without the any episodes from the season added
        const userWatchlistNotFromSeasonAdded = userBefore.watchlist.filter(
          (watchlistItem) =>
            watchlistItem.tv_id !== toAdd.tv_id ||
            watchlistItem.season_number !== toAdd.season_number
        )
        //check the length the watch list increased by the number of ep in the season
        expect(userAfterAdd.watchlist).toHaveLength(
          seasonWatchList.length + userWatchlistNotFromSeasonAdded.length
        )
        const seasonInUsersWatchlist = userAfterAdd.watchlist.filter(
          (watchlisttItem) =>
            watchlisttItem.tv_id === toAdd.tv_id &&
            watchlisttItem.season_number === toAdd.season_number
        )
        expect(seasonInUsersWatchlist).toHaveLength(seasonWatchList.length)
      })

      test('season is not in watchlist', async () => {
        const toAdd = initialUser.watchlist[0]
        //remove the season from the watchlist
        await User.findOneAndUpdate(
          { username: initialUser.username },
          {
            $pull: {
              watchlist: {
                tv_id: toAdd.tv_id,
                season_number: toAdd.season_number,
              },
            },
          }
        )
        const userBefore = await getTestUser()

        //do api call
        await api
          .post(
            `/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}/season/${toAdd.season_number}`
          )
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const userAfterAdd = await getTestUser()

        const seasonWatchList = await tmdbUtil.getSeasonWatchlist(
          toAdd.tv_id,
          toAdd.season_number
        )

        //check the length the watch list increased by the number of ep in the season
        expect(userAfterAdd.watchlist).toHaveLength(
          seasonWatchList.length + userBefore.watchlist.length
        )
        const seasonInUsersWatchlist = userAfterAdd.watchlist.filter(
          (watchlisttItem) =>
            watchlisttItem.tv_id === toAdd.tv_id &&
            watchlisttItem.season_number === toAdd.season_number
        )
        expect(seasonInUsersWatchlist).toHaveLength(seasonWatchList.length)
      })
    })
    test('show is not in watchlist', async () => {
      const toAdd = initialUser.watchlist[0]
      //remove the show from the watchlist
      await User.findOneAndUpdate(
        { username: initialUser.username },
        {
          $pull: {
            watchlist: {
              tv_id: toAdd.tv_id,
            },
          },
        }
      )
      const userBefore = await getTestUser()

      //do api call
      await api
        .post(
          `/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}/season/${toAdd.season_number}`
        )
        .send()
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userAfterAdd = await getTestUser()

      const seasonWatchList = await tmdbUtil.getSeasonWatchlist(
        toAdd.tv_id,
        toAdd.season_number
      )

      //check the length the watch list increased by the number of ep in the season
      expect(userAfterAdd.watchlist).toHaveLength(
        seasonWatchList.length + userBefore.watchlist.length
      )
      const seasonInUsersWatchlist = userAfterAdd.watchlist.filter(
        (watchlisttItem) =>
          watchlisttItem.tv_id === toAdd.tv_id &&
          watchlisttItem.season_number === toAdd.season_number
      )
      expect(seasonInUsersWatchlist).toHaveLength(seasonWatchList.length)

      /* //find the show in the watchlist
      const showInWatchListAfter = userAfterAdd.watchList.find(
        (tv) => tv.id === tv_idToAdd
      )
      // check the show in the watchlist has the same number of season as before api call
      expect(showInWatchListAfter.seasons).toHaveLength(
        userBeforeAdd.watchList[0].seasons.length
      )
      //get what the season should look like in the watchlist
      const seasonWatchList = await tmdbUtil.getSeasonWatchlist({
        tvId: tv_idToAdd,
        seasonNumber: seasonNumberToAdd,
      })
      // get the season in the watchlist
      const seasonInWatchListAfter = showInWatchListAfter.seasons.find(
        (season) => season.season_number === seasonNumberToAdd
      )
      //check season matches
      //  expect(seasonInWatchListAfter).toMatchObject(seasonWatchList)*/
    })
  })
  describe('deleting a season', () => {
    test('works with valid data', async () => {
      const userBefore = await getTestUser()
      const toDelete = userBefore.watchlist[0]
      await api
        .delete(
          `/api/users/${userBefore.id}/watchlist/${toDelete.tv_id}/season/${toDelete.season_number}`
        )
        .expect(200)

      const userAfterDelete = await getTestUser()
      expect(userAfterDelete.watchlist).toHaveLength(
        userBefore.watchlist.filter(
          (w) =>
            !(
              w.tv_id === toDelete.tv_id &&
              w.season_number === toDelete.season_number
            )
        ).length
      )
    })
  })
  describe('deleting an episode', () => {
    test('valid data and episode exists', async () => {
      const userBefore = await getTestUser()
      const toDelete = userBefore.watchlist[0]
      await api
        .delete(
          `/api/users/${userBefore.id}/watchlist/${toDelete.tv_id}/season/${toDelete.season_number}/episode/${toDelete.episode_number}`
        )
        .expect(200)

      const userAfterDelete = await getTestUser()
      expect(userAfterDelete.watchlist).toHaveLength(
        userBefore.watchlist.length - 1
      )
      expect(userAfterDelete.watchlist).not.toContain({ toDelete })
    })
  })
  describe('adding an episode', () => {
    test('episode exists in watchlist', async () => {
      const userBefore = await getTestUser()
      const toAdd = userBefore.watchlist[0]
      await api
        .post(
          `/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}/season/${toAdd.season_number}/episode/${toAdd.episode_number}`
        )
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userAfter = await getTestUser()
      expect(userAfter.watchlist).toHaveLength(userBefore.watchlist.length)
      const watchlisttItem = userAfter.watchlist.filter(
        (w) =>
          w.tv_id === toAdd.tv_id &&
          w.season_number === toAdd.season_number &&
          w.episode_number === toAdd.episode_number
      )
      expect(watchlisttItem).toHaveLength(1)
    })
    test('episode does not exist in watchlist', async () => {
      //remove an item from the watchlist to ensure it does not exist
      const toAdd = initialUser.watchlist[0]
      await User.findOneAndUpdate(
        { username: initialUser.username },
        {
          $pull: {
            watchlist: toAdd,
          },
        }
      )
      const userBefore = await getTestUser()
      await api
        .post(
          `/api/users/${userBefore.id}/watchlist/${toAdd.tv_id}/season/${toAdd.season_number}/episode/${toAdd.episode_number}`
        )
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const userAfter = await getTestUser()
      expect(userAfter.watchlist).toHaveLength(userBefore.watchlist.length + 1)
      const watchlisttItem = userAfter.watchlist.filter(
        (w) =>
          w.tv_id === toAdd.tv_id &&
          w.season_number === toAdd.season_number &&
          w.episode_number === toAdd.episode_number
      )
      expect(watchlisttItem[0]).toMatchObject(toAdd)
      expect(watchlisttItem).toHaveLength(1)
    }, 10000)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
