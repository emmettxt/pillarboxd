// import blogReducer from './reducers/blogReducer'
// import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import { configureStore } from '@reduxjs/toolkit'
// import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    user: userReducer
  },
})

export default store
