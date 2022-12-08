import { Divider, ListItem, ListItemText, Typography, Box } from '@mui/material'
import DeleteReviewButton from './DeleteReviewButton'
import ReactShowMoreText from 'react-show-more-text'
import { useSelector } from 'react-redux'

const ReviewListItem = ({review, handleRemoveReview}) => {
  const user = useSelector((s) => s.user)

  return (
    <ListItem>
      <ListItemText
        disableTypography
        primary={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{review.user.username}</Typography>
            <Box sx={{ display: 'flex' }}>
              <Typography color={'text.secondary'} fontSize={'0.875rem'}>
                {review.season_number ? `Season ${review.season_number}` : null}
                {review.episode_number
                  ? ` - Episode ${review.episode_number}`
                  : null}
              </Typography>
              {user && review.user.id === user.id ? (
                <DeleteReviewButton
                  reviewId={review.id}
                  handleRemoveReview={() => handleRemoveReview(review.id)}
                />
              ) : null}
            </Box>
          </Box>
        }
        secondary={
          <Typography
            color={'text.secondary'}
            variant="body2"
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            component={ReactShowMoreText}
          >
            {review.content}
          </Typography>
        }
      />
      <Divider variant="middle" key={`${review.id}-divider`} />
    </ListItem>
  )
}
export default ReviewListItem
