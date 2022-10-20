import axios from 'axios'

const createAccount = async (credentials) => {
  const response = await axios.post('/api/users', credentials)
  return response.data
}

const userService = { createAccount }
export default userService
