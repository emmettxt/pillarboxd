import { Box, SvgIcon, Typography, IconButton } from '@mui/material'
import { ReactComponent as ImdbStar } from '../assets/imdbStar.svg'
import { ReactComponent as ImdbLogo } from '../assets/IMDB_Logo.svg'

const ImdbRating = ({ rating, imdbId }) => {
  return rating ? (
    <IconButton
      href={imdbId ? `https://www.imdb.com/title/${imdbId}` : null}
      LinkComponent={'a'}
      target="_blank"
    >
      <Box sx={{ display: 'inline-flex' }}>
        <SvgIcon component={ImdbLogo} inheritViewBox></SvgIcon>
        <Typography>{rating}/10</Typography>
        <SvgIcon component={ImdbStar}></SvgIcon>
      </Box>
    </IconButton>
  ) : null
}

export default ImdbRating
