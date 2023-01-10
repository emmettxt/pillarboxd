import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'

const CreditCard = ({ credit }) => {
  if (!credit) return null
  const isMovie = credit.media_type === 'movie'
  const year = (isMovie ? credit.release_date : credit.first_air_date).split(
    '-'
  )[0]
  return (
    <Card elevation={6}>
      <CardActionArea
        href={
          isMovie ? `//letterboxd.com/tmdb/${credit.id}` : `/tv/${credit.id}`
        }
        target={isMovie ? '_blank' : null}
        sx={{ minHeight: '100%' }}
      >
        <CardMedia
          component="img"
          image={
            credit.poster_path
              ? `https://image.tmdb.org/t/p/w185/${credit.poster_path}`
              : null
          }
          alt={isMovie ? credit.title : credit.name}
          sx={{ aspectRatio: '2/3' }}
        />
        <CardContent sx={{ padding: '8px' }}>
          <Typography variant="body1" fontSize="0.8rem">
            {isMovie ? credit.title : credit.name} {year ? `(${year})` : null}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            {credit.job === 'Actor' ? credit.character : credit.job}
          </Typography>
          {!isMovie ? (
            <Typography
              variant="body2"
              fontSize="0.75rem"
            >{`Episodes: ${credit.episode_count}`}</Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default CreditCard
