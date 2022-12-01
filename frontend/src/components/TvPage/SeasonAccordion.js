import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import tvService from '../../services/tv'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useDispatch, useSelector } from 'react-redux'
import { setShow } from '../../reducers/userReducer'
import WatchedIconButton from '../WatchedIconButton'
import userShowsService from '../../services/userShows'
import EpisodeAccordion from './EpisodeAccordion'

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
