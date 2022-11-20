import { Box, Button, Drawer, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Login from './Login'
import Logout from './Logout'
import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

const Navigation = () => {
  const user = useSelector((state) => state.user)
  const items = user
    ? [
        <Button key="0" disabled>
          {user.username} logged in
        </Button>,
        <Logout key="1" />,
        <Button key="2" href={`/users/${user.id}/shows`}>
          <Typography>My Shows</Typography>
        </Button>,
      ]
    : [<Login key="0" />]
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: { sm: 'block', xs: 'none' } }}>
        {items.map((x) => x)}
      </Box>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        // container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(handleDrawerToggle)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {items}
      </Drawer>
    </Box>
  )
}

export default Navigation
