const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app/app')
const api = supertest(app)
const User = require('../models/user')
const {
  intializeUsers,
  initialUserWithShow,
  nonExisitingUser,
  getTestUserWithoutShow,
  getTestUserWithShow,
  getValidTokenForUser,
} = require('./usersShows.testHelper')
const tmdbUtil = require('../utils/tmdb')
//set DB to have exactly one user with single watchlist item with firs two episodes of season 1
beforeEach(async () => {
  await intializeUsers()
})
describe('adding entire show', () => {
  test('show already in watchlist works', async () => {
    const userBefore = await getTestUserWithShow()
    const token = await getValidTokenForUser(userBefore)
    //id of show to add
    const toAdd = Object.keys(initialUserWithShow.shows)[0]
    await api
      .post(`/api/users/${userBefore.id}/shows/${toAdd}/episodes`)
      .send()
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const userAfter = await getTestUserWithShow()
    const episodes = await tmdbUtil.getShowEpisodes(toAdd)
    const showAfter = userAfter.shows.get(toAdd)
    //check all but episodes have remained the same
    expect({ ...showAfter._doc, episodes: null }).toEqual({
      ...userBefore.shows.get(toAdd)._doc,
      episodes: null,
    })
    //check the length is correct
    expect(showAfter.episodes).toHaveLength(episodes.length)
    //check the values are correct
    expect(showAfter.toJSON().episodes).toEqual(episodes)
  })
  test('show not already in watchlist works', async () => {
    const toAdd = Object.keys(initialUserWithShow.shows)[0]

    const userBefore = await User.findOneAndUpdate(
      { username: initialUserWithShow.username },
      { $unset: { [`shows.${toAdd}`]: 1 } },
      { new: true }
    )
    const token = await getValidTokenForUser(userBefore)
    await api
      .post(`/api/users/${userBefore.id}/shows/${toAdd}/episodes`)
      .send()
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const userAfter = await getTestUserWithShow()
    const episodes = await tmdbUtil.getShowEpisodes(toAdd)
    const showAfter = userAfter.shows.get(toAdd)

    expect(showAfter.episodes).toHaveLength(episodes.length)

    //check the length is correct
    expect(showAfter.episodes).toHaveLength(episodes.length)
    //check the values are correct
    expect(showAfter.toJSON().episodes).toEqual(episodes)
  })

  describe('user without any shows', () => {
    test('show not already in watchlist works', async () => {
      const userBefore = await getTestUserWithoutShow()
      const token = await getValidTokenForUser(userBefore)
      //id of show to add
      const toAdd = Object.keys(initialUserWithShow.shows)[0]
      await api
        .post(`/api/users/${userBefore.id}/shows/${toAdd}/episodes`)
        .send()
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const userAfter = await getTestUserWithoutShow()
      const episodes = await tmdbUtil.getShowEpisodes(toAdd)
      const showAfter = userAfter.shows.get(toAdd)
      //check the length is correct
      expect(showAfter.episodes).toHaveLength(episodes.length)
      //check the values are correct
      expect(showAfter.toJSON().episodes).toEqual(episodes)
    })
  })
  test('invalid tv id fails with 404', async () => {
    const userBefore = await getTestUserWithShow()
    const token = await getValidTokenForUser(userBefore)

    await api
      .post(`/api/users/${userBefore.id}/shows/${'thisIsNotaValidID'}/episodes`)
      .send()
      .set('Authorization', `bearer ${token}`)
      .expect(404)
  })
  test('invalid token fails with 403', async () => {
    const userBefore = await getTestUserWithShow()
    const token = await getValidTokenForUser(userBefore)
    const otherUser = await getTestUserWithoutShow()
    await api
      .post(`/api/users/${otherUser.id}/shows/${'thisIsNotaValidID'}/episodes`)
      .send()
      .set('Authorization', `bearer ${token}`)
      .expect(403)
  })
  test.only('valid token for non existing user fails with 401', async () => {
    const user = await nonExisitingUser()
    const token = await getValidTokenForUser(user)
    const toAdd = Object.keys(initialUserWithShow.shows)[0]

    await api
      .post(`/api/users/${user.id}/shows/${toAdd}/episodes`)
      .send()
      .set('Authorization', `bearer ${token}`)
      .expect(401)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
