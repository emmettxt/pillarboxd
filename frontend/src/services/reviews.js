import axios from 'axios'
import getAuthConfig from './getAuthConfig'
const baseUrl = '/api/reviews'
const getReviews = async (tv_id, season_number, episode_number) => {
  //this will only set season_number and epsiode_number params if theyre truthy or 0
  const params = {
    tv_id,
    ...((season_number || season_number === 0) && { season_number }),
    ...(episode_number && { episode_number }),
  }

  const response = await axios.get(`${baseUrl}`, {
    params,
  })
  return response.data
}

const addReview = async (
  user,
  tv_id,
  season_number,
  episode_number,
  content
) => {
  const data = {
    tv_id,
    ...((season_number || season_number === 0) && { season_number }),
    ...(episode_number && { episode_number }),
    content,
  }
  const authconfig = getAuthConfig(user)

  const response = await axios.post(`${baseUrl}`, data, authconfig)
  return response.data
}
const reviewService = { getReviews, addReview }
export default reviewService
