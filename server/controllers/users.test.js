const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app/app')
const api = supertest(app)
const User = require('../models/user')
// const helper = require('./test_helper')
const bcrypt = require('bcryptjs')

//set DB to have exactly one user
beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('SECRET', 10)
  const email = 'test@test.test'
  const user = new User({ username: 'test_user', passwordHash, email })
  await user.save()
})

describe('there is one user in the DB', () => {
  describe('getting users works', () => {
    test('getting all users works', async () => {
      const response = await api.get('/api/users').expect(200)
      expect(response.body).toHaveLength(1)
    })
    test('getting a specific user works', async () => {
      const user = await User.findOne({})
      const response = await api.get(`/api/users/${user.id}`).expect(200)
      expect(response.body.username).toEqual(user.username)
    })
  })
  describe('adding users', () => {
    test('if username exist response 400 failure', async () => {
      const user = await User.findOne({})
      const userToAdd = { username: user.username, password: 'newPassword' }
      const response = await api.post('/api/users').send(userToAdd).expect(400)
      expect(response.body.error).toEqual('username must be unique')
    })
    test('works with valid details', async () => {
      const userToAdd = {
        username: 'testUser2',
        password: 'password',
        email: 'test1@test.test',
      }
      const response = await api.post('/api/users').send(userToAdd).expect(200)
      expect(response.body.username).toEqual(userToAdd.username)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
