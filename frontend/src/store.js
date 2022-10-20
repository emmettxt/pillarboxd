import userReducer from './reducers/userReducer'
import alertReducer from './reducers/alertReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    user: userReducer,
    alerts: alertReducer,
  },
})

export default store
