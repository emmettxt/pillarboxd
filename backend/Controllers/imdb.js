const imdbRouter = require('express').Router()
const baseUrl = 'https://www.imdb.com/title'
const axios = require('axios')
const cheerio = require('cheerio')

imdbRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  try {
    const imdbResponse = await axios.get(`${baseUrl}/${id}`)
    const $ = cheerio.load(imdbResponse.data)
    const selection = $("[data-testid='hero-rating-bar__aggregate-rating'] [data-testid='hero-rating-bar__aggregate-rating__score']")
    return response.status(imdbResponse.status).send({imdbRating: selection.children().first().text()})
  } catch (error) {
    return response.status(500)
  }
})

module.exports = imdbRouter
