const axios = require('axios')
const config = require('./config')
const api_key = config.TMDB_API_KEY_V3
const baseUrl = 'https://api.themoviedb.org/3'

//this function maps a season from tmdb to its watchlist form
const mapSeasonToWatchlist = (tv_id, season) =>
  Array.from({ length: season.episode_count }, (_, i) => ({
    tv_id,
    season_number: season.season_number,
    episode_number: i + 1,
  }))
const mapSeasonsToWatchlist = (tv_id, seasons) =>
  seasons.reduce(
    (arr, season) => arr.concat(mapSeasonToWatchlist(tv_id, season)),
    []
  )

//this function will get an entire season of a show for a users watchlist
const getSeasonWatchlist = async (tv_id, season_number) => {
  try {
    const response = await axios.get(
      `${baseUrl}/tv/${tv_id}?api_key=${api_key}`
    )
    const season = response.data.seasons.find(
      (season) => season.season_number === season_number
    )
    return mapSeasonToWatchlist(tv_id, season)
  } catch (error) {
    console.log('Axios Error: ', error.response)
    console.log(`getSeasonWatchlist({${tv_id},${season_number}})`)
    console.log(`types({${typeof tv_id},${typeof season_number}})`)
    throw error
  }
}

// this function will make the required calls to TMDB and return a object with an entire shows watchlist
const getShowWatchlist = async (tvId) => {
  const response = await axios.get(`${baseUrl}/tv/${tvId}?api_key=${api_key}`)
  return mapSeasonsToWatchlist(tvId, response.data.seasons)
}

//this function maps a season from tmdb to its watchlist form
const mapSeasonToEpisodes = (tv_id, season) =>
  Array.from({ length: season.episode_count }, (_, i) => ({
    season_number: season.season_number,
    episode_number: i + 1,
  }))
const mapSeasonsToEpisodes = (tv_id, seasons) =>
  seasons.reduce(
    (arr, season) => arr.concat(mapSeasonToEpisodes(tv_id, season)),
    []
  )

//this function will get an entire season of a show for a users watchlist
const getSeasonEpisodes = async (tv_id, season_number) => {
  try {
    const response = await axios.get(
      `${baseUrl}/tv/${tv_id}?api_key=${api_key}`
    )
    const season = response.data.seasons.find(
      (season) => season.season_number === season_number
    )
    return mapSeasonToEpisodes(tv_id, season)
  } catch (error) {
    console.log('Axios Error: ', error.response)
    console.log(`getSeasonWatchlist({${tv_id},${season_number}})`)
    console.log(`types({${typeof tv_id},${typeof season_number}})`)
    throw error
  }
}

// this function will make the required calls to TMDB and return a object with an entire shows watchlist
const getShowEpisodes = async (tvId) => {
  const response = await axios.get(`${baseUrl}/tv/${tvId}?api_key=${api_key}`)
  return mapSeasonsToEpisodes(tvId, response.data.seasons)
}

module.exports = {
  getShowWatchlist,
  getSeasonWatchlist,
  getShowEpisodes,
  getSeasonEpisodes,
}
