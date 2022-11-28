import AddIcon from '@mui/icons-material/AddTask'
import AddedIcon from '@mui/icons-material/TaskAlt'
import { IconButton, Tooltip } from '@mui/material'

const WatchedIconButton = ({ isInWatchlist, handleClick }) => (
  <Tooltip
    title={isInWatchlist ? 'Remove from Watched' : 'Mark as Watched'}
    disableFocusListener
  >
    <IconButton onClick={handleClick} sx={{ padding: 0 }}>
      {isInWatchlist ? <AddedIcon color="success" /> : <AddIcon />}
    </IconButton>
  </Tooltip>
)

export default WatchedIconButton
