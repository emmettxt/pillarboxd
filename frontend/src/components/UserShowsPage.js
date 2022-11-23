import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/system'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Divider,
  CardActions,
  Box,
} from '@mui/material'
import tvService from '../services/tv'
import { useEffect, useState } from 'react'
import userShowsService from '../services/userShows'
import { setShow } from '../reducers/userReducer'
import WatchedIconButton from './WatchedIconButton'
const formatEpisodeDate = (dateAsString) => {
  const date = new Date(dateAsString)
  if (!dateAsString || date.toString === 'Invalid Date') {
    return null
  }
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString(undefined, options)
}
const ShowCard = ({ tv }) => {
  const getNextEpisode = async () => {
    const season = tv.tmdb.seasons
      .filter((season) => season.season_number !== 0)
      .sort((a, b) => a.season_number - b.season_number)
      .find(
        (season) =>
          season.episode_count >
          tv.episodes.filter((x) => x.season_number === season.season_number)
            .length
      )
    if (!season) return null
    const episode_number = Array.from(
      Array(season?.episode_count).keys(),
      (i) => i + 1
    ).find(
      (episode_number) =>
        tv.episodes.filter(
          (x) =>
            x.season_number === season.season_number &&
            x.episode_number === episode_number
        ).length === 0
    )
    const episode = tvService.getEpisode(
      tv.tmdb.id,
      season.season_number,
      episode_number
    )
    return episode
  }
  const [nextEpisode, setNextEpisode] = useState()
  useEffect(() => {
    getNextEpisode().then((e) => setNextEpisode(e))
  }, [tv])
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const handleAddEpisode = async () => {
    const updatedShow = await userShowsService.addEpisode(
      user,
      tv.tmdb.id,
      nextEpisode.season_number,
      nextEpisode.episode_number
    )
    dispatch(setShow({ tvId: tv.tmdb.id, updatedShow }))
  }
  return (
    // >
    <Card
      sx={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 2fr' }}
    >
      <CardActionArea href={`/tv/${tv.tmdb.id}`}>
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w185/${tv.tmdb.poster_path}`}
          alt={tv.name + 'poster'}
        />
      </CardActionArea>
      <CardContent>
        <CardActionArea href={`/tv/${tv.tmdb.id}`}>
          <Typography variant="h6" textAlign="center">
            {tv.tmdb.name}
          </Typography>
        </CardActionArea>

        <Divider />
        {nextEpisode ? (
          <Box>
            <Typography varient="body2" color={'text.secondary'}>
              {`Next Episode: S:${nextEpisode.season_number} E:${nextEpisode.episode_number} -  ${nextEpisode.name}`}
            </Typography>
            <Typography varient="body2" color={'text.secondary'}>
              {new Date(nextEpisode.air_date) > new Date()
                ? formatEpisodeDate(nextEpisode.air_date)
                : null}
            </Typography>

            <WatchedIconButton
              handleClick={handleAddEpisode}
              isInWatchlist={false}
            />
          </Box>
        ) : (
          <Typography varient="body2" color={'text.secondary'}>
            All Episodes Watched
          </Typography>
        )}
      </CardContent>
    </Card>
    // </Link>
  )
}

const UserShowsPage = () => {
  const user = useSelector((state) => state.user)
  const shows = user?.shows
    ? Object.entries(user.shows)
        .filter((a) => a[1].isSaved)
        .map((a) => a[1])
    : []
  return (
    <Container
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1,1fr)',
          sm: 'repeat(2,1fr)',
          md: 'repeat(3,1fr)',
        },
      }}
    >
      {shows.map((tv) => (
        <ShowCard tv={tv} key={tv.tmdb.id} />
      ))}
    </Container>
  )
}
export default UserShowsPage
