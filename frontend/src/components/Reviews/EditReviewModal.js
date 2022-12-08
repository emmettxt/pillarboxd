import {
  IconButton,
  Modal,
  Tooltip,
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Button,
} from '@mui/material'
import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import reviewService from '../../services/reviews'
import { useSelector } from 'react-redux'
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
const EditReviewModal = ({ review, handleUpdateReview }) => {
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }
  const user = useSelector((s) => s.user)
  const handleSubmit = async (event) => {
    event.preventDefault()
    const updatedReview = await reviewService.updateReview(
      user,
      review.id,
      event.target.content.value
    )
    handleUpdateReview(updatedReview)
  }
  return (
    <>
      <Tooltip title="Edit Review">
        <IconButton sx={{ padding: 0 }} onClick={handleOpen}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Edit Review</Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '47.5% 47.5%',
                columnGap: '5%',
              }}
            >
              <FormControl variant="standard" disabled>
                <InputLabel id="reviews-season-label">Season</InputLabel>
                <Select
                  labelId="reviews-season-label"
                  id="reviews-season"
                  value={review.season_number}
                  label="Season"
                >
                  <MenuItem value={review.season_number}>
                    {`Season ${review.season_number}`}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" disabled>
                <InputLabel id="reviews-episode-label">Episode</InputLabel>

                <Select
                  labelId="reviews-episode-label"
                  id="reviews-episode"
                  value={review.episode_number}
                  label="Episode"
                >
                  <MenuItem value={review.episode_number}>
                    {`Episode ${review.episode_number}`}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              id="review-content"
              name="content"
              label="Your Review"
              type="text"
              fullWidth
              required
              margin="normal"
              multiline
              minRows={4}
              // value={review.content}

              defaultValue={review.content}
            />
            <Button type="submit">Update Review</Button>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default EditReviewModal
