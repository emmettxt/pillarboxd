import axios from 'axios'

const getRating = async (id) => {
  const response = await axios.get(`/api/imdb/${id}`)
  return response.data
}

const imdbService = { getRating }
export default imdbService
