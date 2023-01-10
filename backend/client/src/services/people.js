import axios from 'axios'
const baseUrl = '/api/tmdb/person'

const getPersonWithCredits = async (personId) => {
  const response = await axios.get(`${baseUrl}/${personId}?append_to_response=combined_credits`)
  return response.data
}
const peopleService = { getPersonWithCredits }
export default peopleService
