import Login from '../Login'
import { AppBar, Box, Link, Slide, Toolbar, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { logoutUser } from '../../reducers/userReducer'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import SearchBar from './SearchBar'
const Navigation = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Slide appear={false} direction="down" in={!useScrollTrigger()}>
        <AppBar position="fixed" color="transparent">
          <Toolbar>
            <Link href="/" variant="h6" underline="none" color="inherit">
              Pillarboxd
            </Link>
            <SearchBar />
            {user ? (
              <Typography component="div" variant="subtitle1">
                {user.username} logged in
                <Button
                  variant="contained"
                  onClick={() => dispatch(logoutUser())}
                >
                  log out
                </Button>
              </Typography>
            ) : (
              <Login />
            )}
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </Box>
  )
}

export default Navigation
