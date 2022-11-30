import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import tvService from '../../services/tv'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setShow } from '../../reducers/userReducer'
import WatchedIconButton from '../WatchedIconButton'
import userShowsService from '../../services/userShows'
import { alpha } from '@mui/system'
//used for formating the episode release date
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
        {/* <MoreTimeIcon
          onClick={handleWatchlist}
          color={isEpisodeInWatchlist ? 'success' : 'primary'}
          sx={{ paddingRight: '5px' }}
        ></MoreTimeIcon> */}
        <WatchedIconButton
          handleClick={handleWatchlist}
          isInWatchlist={isEpisodeInWatchlist}
        />

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
          {episode.still_path ? (
            <img
              width="150"
              height="84"
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
              alt={episode.name}
            ></img>
          ) : null}
          <Typography sx={{ flexShrink: 2 }}>{episode.overview}</Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
//this is the details for each season accordion, is seperate component as data is only loaded when expanded
const SeasonAccordionDetails = ({ tvId, season }) => {
  //tmdb gives episode details with call for get season
  const [seasonData, setSeasonData] = useState(season)
  useEffect(() => {
    tvService
      .getTvSeason(tvId, season.season_number)
      .then((s) => setSeasonData(s))
  }, [])
  return (
    <AccordionDetails
      sx={{
        backgroundImage: `url(
      https://image.tmdb.org/t/p/w780/${season.poster_path})`,
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: '50%',
        backgroundPositionY: 0,
        backgroundSize: 'cover',
      }}
    >
      <>
        {seasonData.episodes
          ? seasonData.episodes.map((episode) => (
              <EpisodeAccordion
                tvId={tvId}
                episode={episode}
                key={`${tvId}.${season.season_number}.${episode.episode_number}`}
              />
            ))
          : null}
      </>
    </AccordionDetails>
  )
}
//this componenet returns an accordion for en entire season
const SeasonAccordion = ({ tvId, season }) => {
  const user = useSelector((s) => s.user)
  //checks if the entire season is in the users watchlist
  const isSeasonInWatchList =
    season.episode_count !== 0 &&
    season.episode_count ===
      user?.shows?.[tvId]?.episodes.filter(
        (e) => e.season_number === season.season_number
      ).length
  const dispatch = useDispatch()
  //for adding or removing entire season from user's watchlist
  const handleWatchlist = async (event) => {
    //prevent clicking the button from closing/opening the accordion
    event.stopPropagation()
    //removing from watchlist
    if (isSeasonInWatchList) {
      await userShowsService.removeSeasonEpisodes(
        user,
        tvId,
        season.season_number
      )
      const updatedEpisodes = user.shows[tvId].episodes.filter(
        (e) => e.season_number !== season.season_number
      )
      const updatedShow = { ...user.shows[tvId], episodes: updatedEpisodes }
      dispatch(setShow({ tvId, updatedShow }))
    } else {
      //adding to watchlist
      const updatedShow = await userShowsService.addSeasonEpisodes(
        user,
        tvId,
        season.season_number
      )
      dispatch(setShow({ tvId, updatedShow }))
    }
  }
  return season ? (
    //mountOnEnter:true means that data for season is only loaded when accorion expanded
    <Accordion
      key={season.id}
      TransitionProps={{ mountOnEnter: true }}
      elevation={5}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          <WatchedIconButton
            handleClick={handleWatchlist}
            isInWatchlist={isSeasonInWatchList}
          />
          {season.name}
        </Typography>
      </AccordionSummary>
      <SeasonAccordionDetails
        tvId={tvId}
        seasonNumber={season.season_number}
        season={season}
      />
    </Accordion>
  ) : null
}
export default SeasonAccordion
