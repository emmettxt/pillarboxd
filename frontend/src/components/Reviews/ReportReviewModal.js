import ReportIcon from '@mui/icons-material/Report'
import {
  Alert,
  Button,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { sm: 400, xs: '80%' },
  heigth: 100,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}
import { useSelector } from 'react-redux'
import reviewService from '../../services/reviews'
const ReportReviewModal = ({ review, handleUpdateReview }) => {
  const user = useSelector((state) => state.user)
  if (!user.isModerator) return null

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleModerate = async (event) => {
    event.preventDefault()
    try {
      const updatedReview = await reviewService.moderateReview(
        user,
        review.id,
        event.target.comment.value
      )
      handleUpdateReview(updatedReview)
      setAlert('Review has been moderated', 'success')
      setTimeout(() => handleClose(), 2500)
    } catch (error) {
      setAlert(error.response.data, 'error')
    }
  }

  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [alertTimeoutId, setAlertTimeoutid] = useState()
  const setAlert = (message, severity) => {
    clearTimeout(alertTimeoutId)
    setAlertMessage(message)
    setAlertSeverity(severity)
    setAlertTimeoutid(
      setTimeout(() => {
        setAlertMessage(null)
      }, 5000)
    )
  }
  return (
    <Box>
      <Tooltip title="Report Review" disableFocusListener>
        <IconButton onClick={handleOpen}>
          <ReportIcon />
        </IconButton>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {alertMessage ? (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          ) : null}
          <Typography variant="h6">Moderate Review</Typography>

          <TextField
            id="review-content"
            name="content"
            // label="Your Review"
            type="text"
            fullWidth
            required
            margin="normal"
            multiline
            minRows={4}
            disabled
            defaultValue={review.content}
          />
          <form onSubmit={handleModerate}>
            <TextField
              id="review-moderator-comment"
              name="comment"
              label="Moderator Comment"
              type="text"
              fullWidth
              required
              margin="normal"
              multiline
              minRows={4}
            />
            <Button type="submit">Moderate Review</Button>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}

export default ReportReviewModal
