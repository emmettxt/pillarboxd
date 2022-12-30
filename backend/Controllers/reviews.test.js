const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app/app')
const api = supertest(app)
const Review = require('../models/review')
const User = require('../models/user')
const reviewTestHelper = require('./reviews.testHelper')
const usersShowsTestHelper = require('./usersShows.testHelper')

beforeEach(async () => {
  await User.deleteMany({})
  await Review.deleteMany({})
  await usersShowsTestHelper.intializeUsers()
})
describe('two user exist in DB', () => {
  describe('adding a review', () => {
    describe('works with valid data', () => {
      test('just tv_id', async () => {
        const user = await usersShowsTestHelper.getTestUserWithShow()
        const token = await usersShowsTestHelper.getValidTokenForUser(user)
        const tv_id = Number(Object.keys(user.toJSON().shows)[0])
        const body = { tv_id, content: 'review content', rating: 5 }
        const response = await api
          .post('/api/reviews')
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(200)
        expect(response.body).toMatchObject(body)

        const userAfter = await usersShowsTestHelper.getTestUserWithShow()
        expect(userAfter.reviews.map((x) => x.toString())).toContain(
          response.body.id
        )
      })
      test('tv_id and season_number', async () => {
        const user = await usersShowsTestHelper.getTestUserWithShow()
        const token = await usersShowsTestHelper.getValidTokenForUser(user)
        const tv_id = Number(Object.keys(user.toJSON().shows)[0])
        const body = {
          tv_id,
          season_number: 1,
          content: 'review content',
          rating: 5,
        }
        const response = await api
          .post('/api/reviews')
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(200)
        expect(response.body).toMatchObject(body)

        const userAfter = await usersShowsTestHelper.getTestUserWithShow()
        expect(userAfter.reviews.map((x) => x.toString())).toContain(
          response.body.id
        )
      })
      test('tv_id, season_number, and episode_number', async () => {
        const user = await usersShowsTestHelper.getTestUserWithShow()
        const token = await usersShowsTestHelper.getValidTokenForUser(user)
        const tv_id = Number(Object.keys(user.toJSON().shows)[0])
        const body = {
          tv_id,
          season_number: 1,
          episode_number: 2,
          content: 'review content',
          rating: 5,
        }
        const response = await api
          .post('/api/reviews')
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(200)
        expect(response.body).toMatchObject(body)

        const userAfter = await usersShowsTestHelper.getTestUserWithShow()
        expect(userAfter.reviews.map((x) => x.toString())).toContain(
          response.body.id
        )
      })
    })
    describe('fails with bad data', () => {
      test('tv_id and episode_number, but no season_number gives 422', async () => {
        const userBefore = await usersShowsTestHelper.getTestUserWithShow()
        const token = await usersShowsTestHelper.getValidTokenForUser(
          userBefore
        )
        const tv_id = Number(Object.keys(userBefore.toJSON().shows)[0])
        const reviewsBefore = await Review.find({ tv_id })
        const body = {
          tv_id,
          episode_number: 1,
          content: 'review content',
          rating: 5,
        }
        await api
          .post('/api/reviews')
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(422)

        const userAfter = await usersShowsTestHelper.getTestUserWithShow()

        expect(userAfter.reviews).toEqual(userBefore.reviews)

        const reviewsAfter = await Review.find({ tv_id })
        expect(reviewsAfter).toEqual(reviewsBefore)
      })
      test('No tv_id gives 422', async () => {
        const userBefore = await usersShowsTestHelper.getTestUserWithShow()
        const token = await usersShowsTestHelper.getValidTokenForUser(
          userBefore
        )
        const reviewsBefore = await Review.find()
        const body = {
          content: 'review content',
          rating: 5,
        }
        await api
          .post('/api/reviews')
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(422)

        const userAfter = await usersShowsTestHelper.getTestUserWithShow()

        expect(userAfter.reviews).toEqual(userBefore.reviews)

        const reviewsAfter = await Review.find()
        expect(reviewsAfter).toEqual(reviewsBefore)
      })
      test('No content or rating gives 422', async () => {
        const userBefore = await usersShowsTestHelper.getTestUserWithShow()
        const token = await usersShowsTestHelper.getValidTokenForUser(
          userBefore
        )
        const tv_id = Number(Object.keys(userBefore.toJSON().shows)[0])

        const reviewsBefore = await Review.find({ tv_id })
        const body = {
          tv_id,
        }
        await api
          .post('/api/reviews')
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(422)

        const userAfter = await usersShowsTestHelper.getTestUserWithShow()

        expect(userAfter.reviews).toEqual(userBefore.reviews)

        const reviewsAfter = await Review.find({ tv_id })
        expect(reviewsAfter).toEqual(reviewsBefore)
      })
    })
    test('fails with no auth 401', async () => {
      const userBefore = await usersShowsTestHelper.getTestUserWithShow()
      const tv_id = Number(Object.keys(userBefore.toJSON().shows)[0])

      const reviewsBefore = await Review.find({ tv_id })
      const body = {
        tv_id,
      }
      await api.post('/api/reviews').send(body).expect(401)
      const userAfter = await usersShowsTestHelper.getTestUserWithShow()

      expect(userAfter.reviews).toEqual(userBefore.reviews)

      const reviewsAfter = await Review.find({ tv_id })
      expect(reviewsAfter).toEqual(reviewsBefore)
    })
  })
  describe('updating a review', () => {
    beforeEach(async () => {
      await Review.deleteMany({})
      await reviewTestHelper.initializeReview()
    })
    test('works with content only', async () => {
      const reviewBefore = await Review.findOne({})
      const user = await User.findById(reviewBefore.user)
      const token = await usersShowsTestHelper.getValidTokenForUser(user)
      const patchBody = { content: 'updated content' }
      const response = await api
        .patch(`/api/reviews/${reviewBefore.id}`)
        .send(patchBody)
        .set('Authorization', `bearer ${token}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
      //check response has updated
      expect(response.body.content).toEqual(patchBody.content)
      expect(response.body.date_modified).not.toEqual(
        reviewBefore.date_modified
      )
      //check data updated in server
      const reviewAfter = await Review.findById(reviewBefore.id)
      expect(reviewAfter.content).toEqual(patchBody.content)
      expect(reviewAfter.date_modified).toEqual(
        new Date(response.body.date_modified)
      )
      //check only the content and date_modified have changed
      expect({
        ...reviewAfter.toJSON(),
        content: null,
        date_modified: null,
      }).toEqual({
        ...reviewBefore.toJSON(),
        content: null,
        date_modified: null,
      })
    })
    test('works with rating only', async () => {
      const reviewBefore = await Review.findOne({})
      const user = await User.findById(reviewBefore.user)
      const token = await usersShowsTestHelper.getValidTokenForUser(user)
      const patchBody = { rating: 4 }
      const response = await api
        .patch(`/api/reviews/${reviewBefore.id}`)
        .send(patchBody)
        .set('Authorization', `bearer ${token}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
      //check response has updated
      expect(response.body.rating).toEqual(patchBody.rating)
      expect(response.body.date_modified).not.toEqual(
        reviewBefore.date_modified
      )
      //check data updated in server
      const reviewAfter = await Review.findById(reviewBefore.id)
      expect(reviewAfter.rating).toEqual(patchBody.rating)
      expect(reviewAfter.date_modified).toEqual(
        new Date(response.body.date_modified)
      )
      //check only the content and date_modified have changed
      expect({
        ...reviewAfter.toJSON(),
        rating: null,
        date_modified: null,
      }).toEqual({
        ...reviewBefore.toJSON(),
        rating: null,
        date_modified: null,
      })
    })
    test('works with content and rating', async () => {
      const reviewBefore = await Review.findOne({})
      const user = await User.findById(reviewBefore.user)
      const token = await usersShowsTestHelper.getValidTokenForUser(user)
      const patchBody = { content: 'updated content', rating: 4 }
      const response = await api
        .patch(`/api/reviews/${reviewBefore.id}`)
        .send(patchBody)
        .set('Authorization', `bearer ${token}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
      //check response has updated
      expect(response.body.rating).toEqual(patchBody.rating)
      expect(response.body.content).toEqual(patchBody.content)
      expect(response.body.date_modified).not.toEqual(
        reviewBefore.date_modified
      )
      //check data updated in server
      const reviewAfter = await Review.findById(reviewBefore.id)
      expect(reviewAfter.rating).toEqual(patchBody.rating)
      expect(reviewAfter.content).toEqual(patchBody.content)

      expect(reviewAfter.date_modified).toEqual(
        new Date(response.body.date_modified)
      )
      //check only the content and date_modified have changed
      expect({
        ...reviewAfter.toJSON(),
        rating: null,
        content: null,
        date_modified: null,
      }).toEqual({
        ...reviewBefore.toJSON(),
        rating: null,
        content: null,
        date_modified: null,
      })
    })

    describe('moderating a review', () => {
      test('moderting unmoderted review', async () => {
        const reviewBefore = await Review.findOne({})
        const user = await usersShowsTestHelper.getTestUserIsModerator()
        const token = await usersShowsTestHelper.getValidTokenForUser(user)
        const body = { moderator_comment: 'i dont like this review' }
        const response = await api
          .post(`/api/reviews/${reviewBefore.id}/moderation`)
          .send(body)
          .set('Authorization', `bearer ${token}`)
          .expect('Content-Type', /application\/json/)
          .expect(200)

        expect(response.body.moderation.moderator_comment).toEqual(
          body.moderator_comment
        )
      })
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
