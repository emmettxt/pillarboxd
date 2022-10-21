import axios from 'axios'

const getAuthConfig = (user) => {
  if (user) {
    const auth = {
      headers: { Authorization: `bearer ${user.token}` },
    }
    console.log(auth)
    return auth
  }
  return null
}
const addShowToWatchList = async (user, tvId) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.post(
    `/api/users/${user.id}/watchlist/${tvId}`,
    null,
    authConfig
  )
  return response.data
}
const removeShowFromWatchList = async (user, tvId) => {
  const authConfig = getAuthConfig(user)

  const response = await axios.delete(
    `/api/users/${user.id}/watchlist/${tvId}`,
    authConfig
  )
  return response.data
}

const watchlistService = { addShowToWatchList, removeShowFromWatchList }

export default watchlistService
