import AddIcon from '@mui/icons-material/AddTask'
import AddedIcon from '@mui/icons-material/TaskAlt'
import { IconButton } from '@mui/material'

const WatchedIconButton = ({ isInWatchlist, handleClick }) => (
  <IconButton onClick={handleClick} sx={{padding:0}}>
    {isInWatchlist ? <AddedIcon color="success" /> : <AddIcon />}
  </IconButton>
)

export default WatchedIconButton
