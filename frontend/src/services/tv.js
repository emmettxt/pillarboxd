import axios from 'axios'
const baseUrl = '/api/tmdb/tv'

const getTv = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}
const getTvWithExternalIds = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}?append_to_response=external_ids`)
  return response.data
}
const getTvSeason = async (id, seasonNumber) => {
  const response = await axios.get(`${baseUrl}/${id}/season/${seasonNumber}`)
  return response.data
}
//this will use the append_to_response paramter of TMDB api to get each season of a show in the minimal numebr of calls
const getTvWithAllSeasons = async (tv) => {
  var Updatedtv = tv
  //limit of 20 appends on each call
  for (var i = 0; i < tv.seasons.length; i += 20) {
    const appendQuery = tv.seasons
      .slice(i, i + 20)
      .reduce((a, b) => `${a}season/${b.season_number},`, '')
    const uri = `${baseUrl}/${tv.id}?append_to_response=${appendQuery}`
    const appendResonse = await axios.get(uri)

    Updatedtv = { ...Updatedtv, ...appendResonse.data }
  }
  return Updatedtv
}

const getPopularTv = async () => {
  const response = await axios.get(`${baseUrl}/popular`)
  return response.data.results
}
const getTrendingTv = async (timeWindow) => {
  const response = await axios.get(`api/tmdb/trending/tv/${timeWindow}`)
  return response.data.results
}
const getImdbId = async(tvId) =>{
  const response = await axios.get(`${baseUrl}/${tvId}/external_ids`)
  return response.data.imdb_id
}
const tvService = {
  getTv,
  getTvSeason,
  getTvWithAllSeasons,
  getPopularTv,
  getTrendingTv,
  getImdbId,
  getTvWithExternalIds,
}
export default tvService
