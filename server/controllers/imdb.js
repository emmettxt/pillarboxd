const imdbRouter = require('express').Router()
const baseUrl = 'https://www.imdb.com/title'
const axios = require('axios')
const cheerio = require('cheerio')

imdbRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    console.log('imdb requet with id:', id)
    const imdbResponse = await axios.get(`${baseUrl}/${id}`, {
      headers: {
        'User-Agent': request.headers['user-agent']
          ? request.headers['user-agent']
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0 ',
      },
    })
    console.log('imdbResponse')
    const $ = cheerio.load(imdbResponse.data)
    const selection = $(
      "[data-testid='hero-rating-bar__aggregate-rating'] [data-testid='hero-rating-bar__aggregate-rating__score']"
    )
    return response
      .status(imdbResponse.status)
      .send({ imdbRating: selection.children().first().text() })
  } catch (error) {
    next(error)
  }
})

module.exports = imdbRouter
