import {
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import reviewService from '../../services/reviews'
import AddReviewModal from './AddReviewModal'
import ReviewListItem from './ReviewListItem'
const Reviews = ({ tv_id, seasons }) => {
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [seasonNumber, setSeasonNumber] = useState('')
  const [reviews, setReviews] = useState()
  useEffect(() => {
    reviewService
      .getReviews(tv_id, seasonNumber, episodeNumber)
      .then((reviews) => setReviews(reviews))
  }, [seasonNumber, episodeNumber])

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
  const handleNewReview = (newReview) => {
    setReviews([newReview, ...reviews])
  }
  const handleRemoveReview = (reviewId) => {
    setReviews(reviews.filter((r) => r.id !== reviewId))
  }
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant="h6">Reviews</Typography>
        <AddReviewModal
          initalSeasonNumber={seasonNumber}
          initialEpisode={episodeNumber}
          initalSeason={selectedSeason}
          seasons={seasons}
          tv_id={tv_id}
          handleNewReview={handleNewReview}
        />
      </Box>
      <ListSubheader sx={{ backgroundColor: 'transparent' }}>
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
                  <IconButton onClick={clearSelectedSeason} sx={{ padding: 0 }}>
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
      </ListSubheader>
      <List>
        {reviews?.length ? (
          reviews.map((review) => (
            <ReviewListItem
              review={review}
              handleRemoveReview={handleRemoveReview}
              key={review.id}
            />
          ))
        ) : (
          <ListItem>
            <Typography margin={'auto'}>
              No reviews yet, why dont you add one?
            </Typography>
          </ListItem>
        )}
      </List>
    </Box>
  )
}

export default Reviews
