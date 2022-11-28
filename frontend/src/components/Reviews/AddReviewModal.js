import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
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
const AddReviewModal = ({
  initalSeasonNumber,
  initialEpisode,
  initalSeason,
  seasons,
  tv_id,
  handleNewReview,
}) => {
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setEpisodeNumber(initialEpisode)
    setSeasonNumber(initalSeasonNumber)
    setSelectedSeason(initalSeason)
    setOpen(true)
  }
  const [episodeNumber, setEpisodeNumber] = useState(initialEpisode)
  const [selectedSeason, setSelectedSeason] = useState(initalSeason)
  const [seasonNumber, setSeasonNumber] = useState(initalSeasonNumber)
  const handleSeasonChange = (event) => {
    setSelectedSeason(
      seasons.find((s) => s.season_number === event.target.value)
    )
    setSeasonNumber(event.target.value)
  }
  const handleEpisodeChange = (event) => {
    setEpisodeNumber(event.target.value || '')
  }
  const clearSelectedSeason = () => {
    setSelectedSeason('')
    setSeasonNumber('')
    setEpisodeNumber('')
  }
  const user = useSelector((s) => s.user)
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
  const handleAddReview = async (event) => {
    event.preventDefault()
    try {
      const newReview = await reviewService.addReview(
        user,
        tv_id,
        seasonNumber,
        episodeNumber,
        event.target.content.value
      )
      handleNewReview(newReview)
      setAlert('Review Added', 'success')
      setTimeout(() => handleClose(), 5000)
    } catch (error) {
      if (
        error.response?.data?.message?.includes(
          'E11000 duplicate key error collection'
        )
      ) {
        setAlert('It appears you have already reviewed this.', 'error')
      } else {
        setAlert(error.response?.data, 'error')
      }
    }
  }
  return (
    <Box>
      <Tooltip title="Add a Review" disableFocusListener>
        <IconButton onClick={handleOpen}>
          <RateReviewIcon />
        </IconButton>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {alertMessage ? (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          ) : null}
          <Typography variant="h6">Add a review</Typography>
          <form onSubmit={handleAddReview}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '47.5% 47.5%',
                columnGap: '5%',
              }}
            >
              <FormControl variant="standard">
                <InputLabel id="reviews-season-label">Season</InputLabel>
                <Select
                  labelId="reviews-season-label"
                  id="reviews-season"
                  value={seasonNumber}
                  label="Season"
                  onChange={handleSeasonChange}
                  startAdornment={
                    selectedSeason ? (
                      <IconButton
                        onClick={clearSelectedSeason}
                        sx={{ padding: 0 }}
                      >
                        <ClearIcon></ClearIcon>
                      </IconButton>
                    ) : null
                  }
                >
                  {seasons.map((season) => (
                    <MenuItem
                      value={season.season_number}
                      key={season.season_number}
                    >
                      {`Season ${season.season_number}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                // margin="normal"
                variant="standard"
                disabled={selectedSeason === ''}
              >
                <InputLabel id="reviews-episode-label">Episode</InputLabel>

                <Select
                  labelId="reviews-episode-label"
                  id="reviews-episode"
                  value={episodeNumber}
                  label="Episode"
                  onChange={handleEpisodeChange}
                  startAdornment={
                    episodeNumber ? (
                      <IconButton
                        onClick={() => setEpisodeNumber('')}
                        sx={{ padding: 0 }}
                      >
                        <ClearIcon></ClearIcon>
                      </IconButton>
                    ) : null
                  }
                >
                  {selectedSeason
                    ? Array.from(
                        Array(selectedSeason.episode_count).keys(),
                        (i) => i + 1
                      ).map((episode_number) => (
                        <MenuItem value={episode_number} key={episode_number}>
                          {`Episode ${episode_number}`}
                        </MenuItem>
                      ))
                    : null}
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
            />
            <Button type="submit">Submit Review</Button>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}

export default AddReviewModal
