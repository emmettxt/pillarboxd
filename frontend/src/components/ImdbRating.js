import { Box, SvgIcon, Typography } from '@mui/material'
import { ReactComponent as ImdbStar } from '../assest/imdbStar.svg'
import { ReactComponent as ImdbLogo } from '../assest/IMDB_Logo.svg'

const ImdbRating = ({ rating }) => {
  return rating?(
    <Box sx={{display:'inline-flex'}}>
      <SvgIcon component={ImdbLogo} inheritViewBox></SvgIcon>
      <Typography>{rating}/10</Typography>
      <SvgIcon component={ImdbStar}></SvgIcon>
    </Box>
  ):null
}

export default ImdbRating
