import { useNavigate } from 'react-router-dom'
import Login from './Login'
import {
  AppBar,
  Box,
  Link,
  Slide,
  Toolbar,
  Typography,
  InputBase,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { logoutUser } from '../reducers/userReducer'
import useScrollTrigger from '@mui/material/useScrollTrigger'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  [theme.breakpoints.up('xs')]: {
    margin: 'auto',
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('xs')]: {
      width: '8ch',
      '&:focus': {
        width: '12ch',
      },
    },
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))
const Navigation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/search/${encodeURIComponent(event.target.search.value)}`)
  }
  const user = useSelector((state) => state.user)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Slide appear={false} direction="down" in={!useScrollTrigger()}>
        <AppBar position="fixed" color="transparent">
          <Toolbar>
            <Link
              href="/"
              variant="h6"
              underline="none"
              color="inherit"
            >
              Pillarboxd
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <form onSubmit={handleSearch}>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search', name: 'search' }}
                />
              </form>
            </Search>
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
