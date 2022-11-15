import AddToQueueIcon from '@mui/icons-material/AddToQueue'
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue'
const MyShowsIcon = (isInMyShows) => {
  return isInMyShows ? <AddToQueueIcon /> : <RemoveFromQueueIcon />
}

export default MyShowsIcon
