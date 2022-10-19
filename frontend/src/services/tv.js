import axios from 'axios'
const baseUrl = '/api/tmdb/tv'

const getTv = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}
const getTvSeason = async (id, seasonNumber) => {
  const response = await axios.get(`${baseUrl}/${id}/season/${seasonNumber}`)
  return response.data
}
const tvService = { getTv, getTvSeason }
export default tvService
