import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
  useTheme,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setShow } from '../../reducers/userReducer'
import WatchedIconButton from '../WatchedIconButton'
import userShowsService from '../../services/userShows'
import { alpha } from '@mui/system'
import { useEffect, useState } from 'react'
import tvService from '../../services/tv'
import PeopleCarousel from './PeopleCarousel'
//used for formating the episode release date
const formatEpisodeDate = (dateAsString) => {
  const date = new Date(dateAsString)
  if (!dateAsString || date.toString === 'Invalid Date') {
    return null
  }
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return date.toLocaleDateString(undefined, options)
}

const EpisodeAccordionDetails = ({ tv_id, episode }) => {
  const [credits, setCredits] = useState()

  useEffect(() => {
    tvService
      .getEpisodeCredits(tv_id, episode.season_number, episode.episode_number)
      .then((credits) => setCredits(credits))
  }, [])
  return (
    <AccordionDetails>
      <Box
        sx={{
          // display: 'flex',
          gap: '1rem',
        }}
      >
        {episode.still_path ? (
          <Box
            sx={{
              border: 1,
              width: '100',
              maxWidth: { xs: '50%', sm: '40%', md: '30%' },
              aspectRatio: '1.78/1',
              margin: '0.5rem',
              float: 'left',
            }}
            component="img"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
            alt={episode.name}
          />
        ) : null}
        <Typography variant="body2" sx={{ margin: 'auto' }}>
          {episode.overview}
        </Typography>
      </Box>
      <Divider sx={{ clear: 'both' }} />
      {credits ? (
        <>
          <PeopleCarousel
            people={[...credits.cast, ...credits.guest_stars]}
            title="Cast"
            creditAttribute={'character'}
          />
          <PeopleCarousel
            people={credits.crew}
            title="Crew"
            creditAttribute={'job'}
          />
        </>
      ) : null}
    </AccordionDetails>
  )
}

const EpisodeAccordion = ({ tvId, episode }) => {
  const user = useSelector((state) => state.user)

  const isEpisodeInWatchlist = user?.shows?.[tvId]?.episodes.some(
    (w) =>
      w.season_number === episode.season_number &&
      w.episode_number === episode.episode_number
  )
  const dispatch = useDispatch()
  const handleWatchlist = async (event) => {
    event.stopPropagation()

    if (isEpisodeInWatchlist) {
      await userShowsService.removeEpisode(
        user,
        tvId,
        episode.season_number,
        episode.episode_number
      )
      const updatedShow = {
        ...user.shows[tvId],
        episodes: user.shows[tvId].episodes.filter(
          (e) =>
            e.episode_number !== episode.episode_number ||
            e.season_number !== episode.season_number
        ),
      }
      dispatch(setShow({ tvId, updatedShow }))
    } else {
      const updatedShow = await userShowsService.addEpisode(
        user,
        tvId,
        episode.season_number,
        episode.episode_number
      )
      dispatch(setShow({ tvId, updatedShow }))
    }
  }
  const theme = useTheme()
  return (
    <Accordion
      key={`${tvId}.${episode.season_number}.${episode.episode_number}`}
      sx={{ background: alpha(theme.palette.background.paper, 0.7) }}
      TransitionProps={{ mountOnEnter: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <WatchedIconButton
          handleClick={handleWatchlist}
          isInWatchlist={isEpisodeInWatchlist}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexGrow: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography varient="body2" color="text.primary">
            {`${episode.episode_number}: ${episode.name}`}{' '}
          </Typography>
          <Typography varient="body2" color="text.secondary">
            {formatEpisodeDate(episode.air_date)}
          </Typography>
        </Box>
      </AccordionSummary>
      <EpisodeAccordionDetails tv_id={tvId} episode={episode} />
    </Accordion>
  )
}

export default EpisodeAccordion
