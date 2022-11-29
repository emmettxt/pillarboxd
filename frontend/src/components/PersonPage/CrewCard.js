import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material'

const CreditCard = ({ credit, isCast }) => {
  const isMovie = credit.media_type === 'movie'
  return (
    <Card>
      <CardActionArea
        href={
          isMovie ? `//letterboxd.com/tmdb/${credit.id}` : `/tv/${credit.id}`
        }
        target={isMovie ? '_blank' : null}
      >
        <Box
          sx={{
            // height: '100%',
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            maxHeight: '1cqw',
          }}
        >
          <CardMedia
            component="img"
            image={`https://image.tmdb.org/t/p/w185/${credit.poster_path}`}
            alt={credit.title + 'poster'}
          />
          <CardContent sx={{ padding: '8px', paddingBottom: 0 }}>
            <Typography variant="body1" fontSize="0.8rem">
              {isMovie ? credit.title : credit.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="0.75rem"
            >
              {credit.job}
            </Typography>
            {!isMovie ? (
              <Typography
                variant="body2"
                fontSize="0.75rem"
              >{`Episodes: ${credit.episode_count}`}</Typography>
            ) : null}
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default CreditCard
