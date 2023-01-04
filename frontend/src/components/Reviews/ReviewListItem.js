import {
  Divider,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Rating,
} from '@mui/material'
import DeleteReviewButton from './DeleteReviewButton'
import ReactShowMoreText from 'react-show-more-text'
import { useSelector } from 'react-redux'
import EditReviewModal from './EditReviewModal'
import ReportReviewModal from './ReportReviewModal'

const ReviewListItem = ({ review, handleRemoveReview, handleUpdateReview }) => {
  const user = useSelector((s) => s.user)

  return (
    <>
      <ListItem>
        <ListItemText
          disableTypography
          primary={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: true,
              }}
            >
              <Typography>{review.user.username}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                }}
              >
                <Box sx={{ display: 'flex', alignContent: 'center' }}>
                  <Typography
                    color={'text.secondary'}
                    fontSize={'0.875rem'}
                    component="div"
                    sx={{ margin: 'auto' }}
                  >
                    {review.season_number
                      ? `Season ${review.season_number}`
                      : null}
                    {review.episode_number
                      ? ` - Episode ${review.episode_number}`
                      : null}
                  </Typography>

                  {user && review.user.id === user.id ? (
                    <>
                      <DeleteReviewButton
                        reviewId={review.id}
                        handleRemoveReview={() => handleRemoveReview(review.id)}
                      />
                      <EditReviewModal
                        review={review}
                        handleUpdateReview={handleUpdateReview}
                      />
                      <ReportReviewModal
                        review={review}
                        handleUpdateReview={handleUpdateReview}
                      />
                    </>
                  ) : null}
                </Box>
                <Rating
                  value={review.rating}
                  readOnly
                  precision={0.5}
                  max={Math.ceil(review.rating)}
                  size="small"
                />
              </Box>
            </Box>
          }
          secondary={
            review?.moderation.isModerated ? (
              <>
                <Typography
                  color={'text.secondary'}
                  variant="caption"
                  paragraph
                >
                  This review has been moderated for the following reason:
                </Typography>
                <Typography
                  color={'text.secondary'}
                  variant="body2"
                  sx={{ fontStyle: 'italic' }}
                >
                  {review.moderation.moderator_comment}
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  color={'text.secondary'}
                  variant="body2"
                  sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                  component={ReactShowMoreText}
                >
                  {review.content}
                </Typography>
              </>
            )
          }
        />
      </ListItem>
      <Divider variant="middle" key={`${review.id}-divider`} />
    </>
  )
}
export default ReviewListItem
