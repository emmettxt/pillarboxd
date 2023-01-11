import axios from 'axios'
const baseUrl = '/api/tmdb/search'

const searchTv = async (query) => {
  const response = await axios.get(`${baseUrl}/tv?query=${query}`)
  return response.data.results
}
const searchMulti = async (query) => {
  const response = await axios.get(`${baseUrl}/multi?query=${query}`)
  return response.data.results.filter(
    (object) => object.media_type === 'tv' || object.media_type === 'person'
  )
}
const tmdbService = { searchTv, searchMulti }
export default tmdbService
