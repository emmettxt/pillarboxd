// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './Login'
import {
  AppBar,
  Box,
  Link,
  // IconButton,
  Toolbar,
  Typography,
  InputBase,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
// import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { logoutUser } from '../reducers/userReducer'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
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
      <AppBar position="sticky">
        <Toolbar>
          <Link
            href="/"
            variant="h6"
            sx={{ display: { xs: 'none', sm: 'block' } }}
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
            // <div style={{ display: 'flex' }}>
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
            // </div>
            <Login />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navigation
