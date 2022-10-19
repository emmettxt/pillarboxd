import { Modal, TextField } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {sm:400,xs:'80%'},
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}
const Login = () => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  // const [isFormVisible, setIsFormVisible] = useState(false)
  // const [user, setUser] = useState(null)
  // const [notification, setNotification] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    const credentials = {
      username: event.target.username.value,
      password: event.target.password.value,
    }
    console.log('login call with credentials: ', credentials)
    try {
      await dispatch(loginUser(credentials))
    } catch (error) {
      // setNotification(error.response.data.error)
      console.error(error.response.data.error)
    }
  }
  return (
    <div>
      <Button onClick={toggleOpen} variant="contained">
        login
      </Button>
      <Modal
        open={open}
        onClose={toggleOpen}
        aria-labelledby="modal-login"
        aria-describedby="modal-login"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Log In
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              id="loginForm-username"
              label="username"
              variant="outlined"
              required
              name="username"
              margin="normal"
              fullWidth
              autoComplete="email"
              autoFocus
            />
            <TextField
              id="loginForm-username"
              label="password"
              type="password"
              variant="outlined"
              required
              name="password"
              margin="normal"
              fullWidth
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              log in
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  )
  // return user ? (
  //   <div>
  //     {user.username} logged in{' '}
  //     <button onClick={() => setUser(null)}>logout</button>
  //   </div>
  // ) : isFormVisible ? (
  //   <form
  //     style={{ display: 'flex', flexDirection: 'column' }}
  //     onSubmit={handleLogin}
  //   >
  //     <input type="text" name="username"></input>
  //     <input type="password" name="password"></input>
  //     <button type="submit">login</button>
  //     <div>{notification}</div>
  //     <button onClick={() => setIsFormVisible(!isFormVisible)}>cancel</button>
  //   </form>
  // ) : (
  //   <button onClick={() => setIsFormVisible(!isFormVisible)}>login</button>
  // )
}

export default Login
