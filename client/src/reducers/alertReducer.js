import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'alerts',
  initialState: [],
  reducers: {
    addAlert(state, action) {
      state.push(action.payload)
    },
    removeAlert(state, action) {
      return state.filter((a) => a.id !== action.payload)
    },
    clearAllAlerts() {
      return []
    },
  },
})

export const { addAlert, clearAllAlerts, removeAlert } = userSlice.actions

export const addTimeoutAlert = (alert, timeout) => {
  return async (dispatch) => {
    const id = Date.now
    await dispatch(addAlert({ ...alert, id }))
    setTimeout(() => dispatch(removeAlert(id)), timeout)
  }
}

export default userSlice.reducer
