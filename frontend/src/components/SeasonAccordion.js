import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import tvService from '../services/tv'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import watchlistService from '../services/watchlist'
import { setUser } from '../reducers/userReducer'
import WatchedIconButton from './WatchedIconButton'

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

  const isEpisodeInWatchlist =
    user &&
    user.watchlist.filter(
      (w) =>
        w.tv_id === tvId &&
        w.season_number === episode.season_number &&
        w.episode_number === episode.episode_number
    ).length > 0
  const dispatch = useDispatch()
  const handleWatchlist = async (event) => {
    event.stopPropagation()

    if (isEpisodeInWatchlist) {
      await watchlistService.removeEpisodeFromWatchList(
        user,
        tvId,
        episode.season_number,
        episode.episode_number
      )
      const updatedWatchlist = user.watchlist.filter(
        (w) =>
          w.tv_id !== tvId ||
          w.season_number !== episode.season_number ||
          w.episode_number !== episode.episode_number
      )
      await dispatch(setUser({ ...user, watchlist: updatedWatchlist }))
    } else {
      const updatedWatchlist = await watchlistService.addEpidsodeToWatchList(
        user,
        tvId,
        episode.season_number,
        episode.episode_number
      )
      await dispatch(setUser({ ...user, watchlist: updatedWatchlist }))
    }
  }
  return (
    <Accordion
      key={`${tvId}.${episode.season_number}.${episode.episode_number}`}
      sx={{ background: 'rgba(255,255,255,0.7)' }}
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
    user &&
    season &&
    season.episode_count ===
      user.watchlist.filter(
        (w) => w.tv_id === tvId && w.season_number === season.season_number
      ).length
  const dispatch = useDispatch()
  //for adding or removing entire season from user's watchlist
  const handleWatchlist = async (event) => {
    //prevent clicking the button from closing/opening the accordion
    event.stopPropagation()
    //removing from watchlist
    if (isSeasonInWatchList) {
      await watchlistService.removeSeasonFromWatchList(
        user,
        tvId,
        season.season_number
      )
      const updatedWatchlist = user.watchlist.filter(
        (w) => !(w.tv_id === tvId && w.season_number === season.season_number)
      )
      await dispatch(setUser({ ...user, watchlist: updatedWatchlist }))
    } else {
      //adding to watchlist
      const updatedWatchlist = await watchlistService.addSeasonToWatchList(
        user,
        tvId,
        season.season_number
      )
      await dispatch(setUser({ ...user, watchlist: updatedWatchlist }))
    }
  }
  return season ? (
    //mountOnEnter:true means that data for season is only loaded when accorion expanded
    <Accordion key={season.id} TransitionProps={{ mountOnEnter: true }}>
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
