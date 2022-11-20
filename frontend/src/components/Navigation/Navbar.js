import { AppBar, Box, Link, Slide, Toolbar } from '@mui/material'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import SearchBar from './SearchBar'
import Navigation from './Navigation'
const Navbar = () => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Slide appear={false} direction="down" in={!useScrollTrigger()}>
        <AppBar position="fixed" color="transparent">
          <Toolbar>
            <Link href="/" variant="h6" underline="none" color="inherit">
              Pillarboxd
            </Link>
            <SearchBar />
            <Navigation/>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </Box>
  )
}

export default Navbar
