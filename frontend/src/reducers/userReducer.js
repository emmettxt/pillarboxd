import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedInPillarboxdUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }
}
export const loginUser = (credentials) => {
  return async (dispatch) => {
    // try {
      const user = await loginService.login(credentials)
      console.log('logged in user:', user)
      window.localStorage.setItem('loggedInPillarboxdUser', JSON.stringify(user))
      dispatch(setUser(user))
    // } catch (error) {
    //   dispatch(
    //     console.log(
    //       'There was an error logging in, ' + error.response.data.error
    //     )
    //   )
    // }
  }
}
export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedInPillarboxdUser')
    dispatch(clearUser())
  }
}
export default userSlice.reducer
