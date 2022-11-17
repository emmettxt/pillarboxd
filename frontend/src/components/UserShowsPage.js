import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/system'
import { Link, Card, CardContent, CardMedia, Typography } from '@mui/material'
const ShowCard = ({ tv }) => {
  return (
    <Card>
      <CardContent>
        <Link
          // <Link
          href={`/tv/${tv.id}`}
        >
          <CardMedia
            component="img"
            // height="140"
            image={`https://image.tmdb.org/t/p/w185/${tv.poster_path}`}
            alt={tv.name + 'poster'}
          />
          <Typography textAlign="center">{tv.name}</Typography>
        </Link>
      </CardContent>
    </Card>
  )
}

const UserShowsPage = () => {
  const user = useSelector((state) => state.user)
  const shows = user
    ? Object.entries(user?.shows)
        .filter((a) => a[1].isSaved)
        .map((a) => a[1].tmdb)
    : []
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
      }}
    >
      {shows.map((tv) => (
        <ShowCard tv={tv} key={tv.id} />
      ))}
    </Container>
  )
}
export default UserShowsPage
