import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import { DeleteForeverOutlined } from '@mui/icons-material'
import reviewService from '../../services/reviews'
import { useSelector } from 'react-redux'
import { useState } from 'react'
const DeleteReviewButton = ({ reviewId, handleRemoveReview }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const user = useSelector((s) => s.user)

  const handleConfirm = (event) => {
    event.preventDefault()
    try {
      reviewService.removeReview(user, reviewId)
      handleRemoveReview()
    } catch (err) {
      console.log(err)
    }
    handleClose()
  }
  const handleOpen = () => setDialogOpen(true)
  const handleClose = () => setDialogOpen(false)

  return (
    <div>
      <Tooltip title="Delete Reivew">
        <IconButton  onClick={handleOpen}>
          <DeleteForeverOutlined />
        </IconButton>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{'Delete this Review?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirm}>Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DeleteReviewButton
