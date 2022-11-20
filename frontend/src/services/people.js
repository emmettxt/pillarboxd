import axios from 'axios'
const baseUrl = '/api/tmdb/person'

const getPerson = async (personId) => {
  const response = await axios.get(`${baseUrl}/${personId}`)
  return response.data
}

const peopleService = { getPerson }
export default peopleService