import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Typography,
  Button,
} from '@mui/material'
import { useEffect, useState } from 'react'
import tvService from '../services/tv'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import MoreTimeIcon from '@mui/icons-material/MoreTime'
import watchlistService from '../services/watchlist'
import { setUser } from '../reducers/userReducer'

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
const EpisodeAccordion = ({ tvId, seasonNumber, episode }) => {
  const user = useSelector((state) => state.user)

  const isEpisodeInWatchlist =
    user &&
    user.watchlist.filter(
      (w) =>
        w.tv_id === tvId &&
        w.season_number === seasonNumber &&
        w.episode_number === episode.episode_number
    ).length > 0
  const dispatch = useDispatch()
  const handleWatchlist = async (event) => {
    event.stopPropagation()

    if (isEpisodeInWatchlist) {
      await watchlistService.removeEpisodeFromWatchList(
        user,
        tvId,
        seasonNumber,
        episode.episode_number
      )
      const updatedWatchlist = user.watchlist.filter(
        (w) =>
          w.tv_id !== tvId ||
          w.season_number !== seasonNumber ||
          w.episode_number !== episode.episode_number
      )
      await dispatch(setUser({ ...user, watchlist: updatedWatchlist }))
    } else {
      const updatedUser = await watchlistService.addEpidsodeToWatchList(
        user,
        tvId,
        seasonNumber,
        episode.episode_number
      )
      await dispatch(setUser({ ...user, watchlist: updatedUser.watchlist }))
    }
  }
  return (
    <Accordion
      key={`${tvId}.${seasonNumber}.${episode.episode_number}`}
      sx={{ background: 'rgba(255,255,255,0.7)' }}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MoreTimeIcon
          onClick={handleWatchlist}
          color={isEpisodeInWatchlist ? 'success' : 'primary'}
          sx={{ paddingRight: '5px' }}
        ></MoreTimeIcon>
        <Typography varient="subtitle1">
          {`${episode.episode_number}: ${episode.name}`}{' '}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ marginLeft: 'auto', textAlign: 'end' }}
        >
          {formatEpisodeDate(episode.air_date)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          {/* <Avatar
            alt={episode.name}
            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
            sx={{ width: 150, height: 84, loading: 'lazy' }}
            variant="rounded"
          /> */}
          <img
            width="150"
            height="84"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
            alt={episode.name}

          ></img>
          <Typography sx={{ flexShrink: 2 }}>{episode.overview}</Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

const SeasonAccordion = ({ tvId, seasonNumber, season }) => {
  // const [season, setSeason] = useState({ episodes: [] })
  // useEffect(() => {
  //   tvService
  //     .getTvSeason(tvId, seasonNumber)
  //     .then((season) =>
  //       setSeason({ ...season, episodes: season.episodes.reverse() })
  //     )
  // }, [])
  const user = useSelector((s) => s.user)
  const isSeasonInWatchList =
    user &&
    season &&
    season.episodes.length ===
      user.watchlist.filter(
        (w) => w.tv_id === tvId && w.season_number === seasonNumber
      ).length
  const dispatch = useDispatch()
  const handleWatchlist = async (event) => {
    event.stopPropagation()
    if (isSeasonInWatchList) {
      await watchlistService.removeSeasonFromWatchList(user, tvId, seasonNumber)
      const updatedWatchlist = user.watchlist.filter(
        (w) => !(w.tv_id === tvId && w.season_number === seasonNumber)
      )
      await dispatch(setUser({ ...user, watchlist: updatedWatchlist }))
    } else {
      const updatedUser = await watchlistService.addSeasonToWatchList(
        user,
        tvId,
        seasonNumber
      )
      await dispatch(setUser({ ...updatedUser, token: user.token }))
    }
  }
  return season ? (
    <Accordion key={season.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {season.name}
          <Button onClick={handleWatchlist}>
            <MoreTimeIcon
              color={isSeasonInWatchList ? 'success' : 'primary'}
            ></MoreTimeIcon>
          </Button>
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundImage: `url(
          https://image.tmdb.org/t/p/w780/${season.poster_path})`,
          // minHeight: '500px',
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: '50%',
          backgroundPositionY: 0,
          backgroundSize: 'cover',
        }}
      >
        <>
          {season.episodes.map((episode) => (
            <EpisodeAccordion
              tvId={tvId}
              seasonNumber={seasonNumber}
              episode={episode}
              key={`${tvId}.${seasonNumber}.${episode.episode_number}`}
            />
          ))}
        </>
      </AccordionDetails>
    </Accordion>
  ) : null
}
export default SeasonAccordion
