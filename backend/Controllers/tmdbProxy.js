//this router is a proxy for the tmdb api
//only works with get requests
//request should be formed exactly like tmdb but with api_key removed from the query
//e.g. https://api.themoviedb.org/3/search/tv?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
//would be made to /tmdb/search/tv?language=en-US&page=1&include_adult=false

const url = require('url')
const tmdbProxyRouter = require('express').Router()
const api_key = process.env.TMDB_API_KEY_V3
const axios = require('axios')
//regex to get all routes starting with "/"
tmdbProxyRouter.get(/\/.+/, async (request, response, next) => {
  const urlParsed = url.parse(request.url, true)
  const params = new URLSearchParams({
    api_key,
    ...urlParsed.query,
  })
  try {
    const apiResponse = await axios.get(
      `https://api.themoviedb.org/3${urlParsed.pathname}`,
      {
        params,
      }
    )

    response.status(200).json(apiResponse.data)
  } catch (err) {
    if (err.name === 'AxiosError') {
      console.log(err.response.status)
      return response.status(err.response.status).json(err.response.data)
    }
      next(err)
    
  }
})

module.exports = tmdbProxyRouter
