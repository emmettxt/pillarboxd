const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const axios = require('axios')
const api_key = process.env.TMDB_API_KEY_V3
test.only('TV search works', async () => {
  const query = 'language=en-US&page=1&query=simpsons&include_adult=false'
  const directResponse = await axios.get(
    `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&${query}`
  )
  const apiResponse = await api.get(`/tmdb/search/tv?${query}`).expect(200)
  console.log(apiResponse.body)
  expect(apiResponse.body).toEqual(directResponse.data)
})
