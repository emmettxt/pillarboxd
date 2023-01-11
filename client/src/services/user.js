import axios from 'axios'

const createAccount = async (credentials) => {
  const response = await axios.post('/api/users', credentials)
  return response.data
}
const getUser = async (userId) => {
  const response = await axios.get(`/api/users/${userId}`)
  return response.data
}

const userService = { createAccount, getUser }
export default userService
