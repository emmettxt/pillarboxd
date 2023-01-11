import { styled, alpha } from '@mui/material/styles'
import { InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'

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

const SearchBar = () => {
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/search/${encodeURIComponent(event.target.search.value)}`)
  }
  return (
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
  )
}

export default SearchBar
