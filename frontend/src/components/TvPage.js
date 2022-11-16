import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tvService from '../services/tv'
import SeasonAccordion from './SeasonAccordion'
import { useDispatch, useSelector } from 'react-redux'
import { setShow } from '../reducers/userReducer'
import imdbService from '../services/imdb'
import ImdbRating from './ImdbRating'
import WatchedIconButton from './WatchedIconButton'
import userShowsService from '../services/userShows'
//this component is the page for a specific tv show, it takes the tv id from the URL
const TvPage = () => {
  const params = useParams()
  const tvId = params.id
  //this hold the data pulled from the server for this show
  const [tv, setTv] = useState()
  const [imdbRating, setImdbRating] = useState()
  //user data fro currently logged in user
  const user = useSelector((state) => state.user)
  useEffect(() => {
    //tv data with external id (imdb id used to get imdb rating)
    tvService.getTvWithExternalIds(tvId).then((tv) => {
      setTv({ ...tv, seasons: tv.seasons.reverse() })
      imdbService
        .getRating(tv.external_ids.imdb_id)
        .then((r) => setImdbRating(r['imdbRating']))
      // tvService.getTvWithAllSeasons(tv).then((tv) => {
      //   setTv({ ...tv, seasons: tv.seasons.reverse() })
      // })
    })
  }, [])
  //this will compare the shows episodes and the episodes in the users watchlist
  const checkAllEpisodesInUsersShow = () => {
    if (!user || !tv) return false
    const episodeCount = tv.seasons
      .filter((s) => s.season_number !== 0)
      .reduce((a, b) => a + b.episode_count, 0)
    if (episodeCount === 0) return false
    if (!user.shows[tv.id]) return false
    const episodeCountInUsersShows = user.shows[tv.id].episodes.filter(
      (s) => s.season_number !== 0
    ).length
    console.log({ episodeCountInUsersShows, episodeCount })
    return episodeCount === episodeCountInUsersShows
  }
  const isEntireShowInUserWatchlist = checkAllEpisodesInUsersShow()
  const dispatch = useDispatch()
  const handleAddShowToWatchlist = async () => {
    const updatedShow = await userShowsService.addShowEpisodes(user, tv.id)
    dispatch(setShow({ tvId, updatedShow }))
  }
  const handleRemoveShowFromWatchlist = async () => {
    await userShowsService.removeShowEpisodes(user, tv.id)
    const updatedShow = { ...user.shows[tv.id], episodes: [] }
    dispatch(setShow({ tvId, updatedShow }))
  }
  return tv ? (
    <Container maxWidth="md">
      <Card>
        <Box
          style={{ backGroundSize: 'cover' }}
          sx={{
            background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), white),url('https://image.tmdb.org/t/p/w1280/${tv.backdrop_path}') center / contain no-repeat`,
            paddingTop: '56.25%',
          }}
        ></Box>
        <CardHeader title={tv.name} subheader={tv.tagline} />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {tv.overview}
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <WatchedIconButton
              handleClick={
                isEntireShowInUserWatchlist
                  ? handleRemoveShowFromWatchlist
                  : handleAddShowToWatchlist
              }
              isInWatchlist={isEntireShowInUserWatchlist}
            />
            <Box sx={{ marginRight: 0, marginLeft: 'auto' }}>
              <ImdbRating
                rating={imdbRating}
                imdbId={tv.external_ids.imdb_id}
              />
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant="h6" color="text.primary">
            Episodes
          </Typography>
          {tv.seasons.map((season) => (
            <SeasonAccordion
              tvId={tv.id}
              seasonNumber={season.season_number}
              key={season.id}
              season={season}
            />
          ))}
        </CardContent>
      </Card>
    </Container>
  ) : null
}

export default TvPage
