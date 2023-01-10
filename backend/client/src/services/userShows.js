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
const addShowEpisodes = async (user, tvId) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.post(
    `/api/users/${user.id}/shows/${tvId}/episodes`,
    null,
    authConfig
  )
  return response.data
}
const removeShowEpisodes = async (user, tvId) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.delete(
    `/api/users/${user.id}/shows/${tvId}/episodes`,
    authConfig
  )
  return response.data
}
const addSeasonEpisodes = async (user, tvId, seasonNumber) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.post(
    `/api/users/${user.id}/shows/${tvId}/episodes/season/${seasonNumber}`,
    null,
    authConfig
  )
  return response.data
}
const removeSeasonEpisodes = async (user, tvId, seasonNumber) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.delete(
    `/api/users/${user.id}/shows/${tvId}/episodes/season/${seasonNumber}`,
    authConfig
  )
  return response.data
}
const addEpisode = async (user, tvId, seasonNumber, episode_number) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.post(
    `/api/users/${user.id}/shows/${tvId}/episodes/season/${seasonNumber}/episode/${episode_number}`,
    null,
    authConfig
  )
  return response.data
}
const removeEpisode = async (user, tvId, seasonNumber, episode_number) => {
  const authConfig = getAuthConfig(user)
  const response = await axios.delete(
    `/api/users/${user.id}/shows/${tvId}/episodes/season/${seasonNumber}/episode/${episode_number}`,
    authConfig
  )
  return response.data
}
const setShowIsSaved = async (user, tv, isSaved) => {
  const body = { tmdb: tv, isSaved }
  const authConfig = getAuthConfig(user)
  const response = await axios.patch(
    `/api/users/${user.id}/shows/${tv.id}`,
    body,
    authConfig
  )
  return response.data
}
const addShow = async (user, tv) => setShowIsSaved(user, tv, true)
const removeShow = async (user, tv) => setShowIsSaved(user, tv, false)

const userShowsService = {
  addShowEpisodes,
  removeShowEpisodes,
  addSeasonEpisodes,
  removeSeasonEpisodes,
  addEpisode,
  removeEpisode,
  addShow,
  removeShow,
}

export default userShowsService
