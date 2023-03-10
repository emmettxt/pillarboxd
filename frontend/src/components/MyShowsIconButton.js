import AddToQueueIcon from '@mui/icons-material/AddToQueue'
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue'
import { IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setShow } from '../reducers/userReducer'
import userShowsService from '../services/userShows'
const MyShowsIconButton = ({ tv }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const isInMyShows = user?.shows?.[tv?.id]?.isSaved
  const handleClick = async () => {
    if (!user) return
    let updatedShow
    if (isInMyShows) {
      updatedShow = await userShowsService.removeShow(user, tv)
    } else {
      updatedShow = await userShowsService.addShow(user, tv)
    }
    dispatch(setShow({ tvId: tv.id, updatedShow }))
  }
  return (
    <Tooltip title={isInMyShows?'Remove from Your Shows':'Add to Your Shows'}>
      <IconButton onClick={handleClick}>
        {isInMyShows ? (
          <RemoveFromQueueIcon color="success" />
        ) : (
          <AddToQueueIcon />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default MyShowsIconButton
