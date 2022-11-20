import { Alert, Modal, TextField } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../reducers/userReducer'
import userService from '../../services/user'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { sm: 400, xs: '80%' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}
const Login = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const [alertMessage, setAlertMessage] = useState(null)
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [isLogin, setIsLogin] = useState(true)
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
      setAlertSeverity('error')
      setAlertMessage(error.response.data.error)
      console.error(error.response.data.error)
    }
  }
  const handleCreateAccount = async (event) => {
    event.preventDefault()
    const credentials = {
      username: event.target.username.value,
      password: event.target.password.value,
      email: event.target.email.value,
    }
    try {
      await userService.createAccount(credentials)
      setAlertSeverity('success')
      setAlertMessage('account created successfully')
    } catch (error) {
      console.error(error.response.data.error)
      setAlertSeverity('error')

      setAlertMessage(error.response.data.error)
    }
  }
  const handleClose = () => {
    setOpen(false)
    setIsLogin(true)
  }
  const handleOpen = () => {
    setOpen(true)
    setIsLogin(true)
  }
  return (
    <Button onClick={handleOpen}>
      <Typography>login</Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-login"
        aria-describedby="modal-login"
      >
        <Box sx={style}>
          {alertMessage ? (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          ) : null}
          {isLogin ? (
            <>
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
                  id="loginForm-password"
                  label="password"
                  type="password"
                  variant="outlined"
                  required
                  name="password"
                  margin="normal"
                  fullWidth
                  autoComplete="password"
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
              <Typography>No account?</Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setIsLogin(false)
                  setAlertMessage(null)
                }}
              >
                create account
              </Button>
              {/* <CreateAccount /> */}
            </>
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Account
              </Typography>
              <form onSubmit={handleCreateAccount}>
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
                  id="loginForm-email"
                  label="email"
                  type="email"
                  variant="outlined"
                  required
                  name="email"
                  margin="normal"
                  fullWidth
                  autoComplete="email"
                />
                <TextField
                  id="loginForm-password"
                  label="password"
                  type="password"
                  variant="outlined"
                  required
                  name="password"
                  margin="normal"
                  fullWidth
                  autoComplete="password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  create account
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    setIsLogin(true)
                    setAlertMessage(null)
                  }}
                >
                  cancel
                </Button>
              </form>
            </>
          )}
        </Box>
      </Modal>
    </Button>
  )
}

export default Login
