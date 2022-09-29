const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
// const helper = require('./test_helper')
const bcrypt = require('bcrypt')

//set DB to have exactly one user
beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('SECRET', 10)
  const user = new User({ username: 'test_user', passwordHash })
  await user.save()
})

describe('there is one user in the DB', () => {
  describe('logging in', () => {
    test('valid credentials works', async () => {
      const credentials = { username: 'test_user', password: 'SECRET' }
      const resposne = await api.post('/login').send(credentials).expect(200)
      expect(resposne.body.username).toEqual(credentials.username)
      expect(resposne.body.token).toBeDefined()
    })
    test('wrong password fails with 401', async () => {
      const credentials = { username: 'test_user', password: 'WRONGPassword' }
      await api.post('/login').send(credentials).expect(401)
    })
    test('non existent username fails with 401', async () => {
      const credentials = { username: 'doesNotExist', password: 'password' }
      await api.post('/login').send(credentials).expect(401)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
