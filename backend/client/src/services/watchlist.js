import axios from 'axios'

const getAuthConfig = (user) => {
  if (user) {
    const auth = {
      headers: { Authorization: `bearer ${user.token}` },
    }
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

const addSeasonToWatchList = async (user, tvId, seasonNumber) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.post(
    `/api/users/${user.id}/watchlist/${tvId}/season/${seasonNumber}`,
    null,
    authConfig
  )
  return response.data
}
const removeSeasonFromWatchList = async (user, tvId, seasonNumber) => {
  const authConfig = getAuthConfig(user)

  const response = await axios.delete(
    `/api/users/${user.id}/watchlist/${tvId}/season/${seasonNumber}`,
    authConfig
  )
  return response.data
}

const addEpidsodeToWatchList = async (
  user,
  tvId,
  seasonNumber,
  episode_number
) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.post(
    `/api/users/${user.id}/watchlist/${tvId}/season/${seasonNumber}/episode/${episode_number}`,
    null,
    authConfig
  )
  return response.data
}
const removeEpisodeFromWatchList = async (
  user,
  tvId,
  seasonNumber,
  episode_number
) => {
  const authConfig = getAuthConfig(user)

  const response = await axios.delete(
    `/api/users/${user.id}/watchlist/${tvId}/season/${seasonNumber}/episode/${episode_number}`,
    authConfig
  )
  return response.data
}

const watchlistService = {
  addShowToWatchList,
  removeShowFromWatchList,
  addSeasonToWatchList,
  removeSeasonFromWatchList,
  addEpidsodeToWatchList,
  removeEpisodeFromWatchList,
}

export default watchlistService
