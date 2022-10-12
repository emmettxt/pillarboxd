// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import Login from './Login'
import {
  AppBar,
  Box,
  // IconButton,
  Toolbar,
  Typography,
  InputBase,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
// import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

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
  // const [searchInput, setSearchInput] = useState('')
  // setSearchInput('')
  const navigate = useNavigate()
  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/search/${event.target.search.value}`)
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Pillarboxd
          </Typography>
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
        </Toolbar>
      </AppBar>
      {/* <AppBar position="static"></AppBar> */}
    </Box>
    // <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    //   <Link to="/">home</Link>
    //   <form onSubmit={handleSearch}>
    //     Search
    //     <input
    //       name="search"
    //       onChange={() => setSearchInput(searchInput)}
    //     ></input>
    //   </form>
    //   <Login />
    // </div>
  )
}

export default Navigation
