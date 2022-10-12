import { useState } from 'react'
import loginService from '../services/login'
const Login = () => {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()
    const credentials = {
      username: event.target.username.value,
      password: event.target.password.value,
    }
    console.log('login call with credentials: ', credentials)
    try {
      const response = await loginService.login(credentials)
      setUser(response)
    } catch (error) {
      setNotification(
        error.response.data.error
      )
      console.error(error.response.data.error)
    }
  }
  return user ? (
    <div>
      {user.username} logged in{' '}
      <button onClick={() => setUser(null)}>logout</button>
    </div>
  ) : isFormVisible ? (
    <form
      style={{ display: 'flex', flexDirection: 'column' }}
      onSubmit={handleLogin}
    >
      <input type="text" name="username"></input>
      <input type="password" name="password"></input>
      <button type="submit">login</button>
      <div>{notification}</div>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>cancel</button>
    </form>
  ) : (
    <button onClick={() => setIsFormVisible(!isFormVisible)}>login</button>
  )
}

export default Login
