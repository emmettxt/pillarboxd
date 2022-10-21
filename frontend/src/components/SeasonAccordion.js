import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import tvService from '../services/tv'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/system'
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
const EpisodeAccordion = ({ tvId, seasonNumber, episode }) => (
  <Accordion
    key={`${tvId}.${seasonNumber}.${episode.episode_number}`}
    sx={{ background: 'rgba(255,255,255,0.7)' }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography varient="subtitle1">{`${episode.episode_number}: ${episode.name}`}</Typography>
      <Typography
        variant="subtitle2"
        sx={{ marginLeft: 'auto', textAlign: 'end' }}
      >
        {formatEpisodeDate(episode.air_date)}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <Avatar
          alt={episode.name}
          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
          sx={{ width: 150, height: 84 }}
          variant="rounded"
        />
        <Typography sx={{ flexShrink: 2 }}>{episode.overview}</Typography>
      </Box>
    </AccordionDetails>
  </Accordion>
)

const SeasonAccordion = ({ tvId, seasonNumber }) => {
  const [season, setSeason] = useState({ episodes: [] })
  useEffect(() => {
    tvService
      .getTvSeason(tvId, seasonNumber)
      .then((season) =>
        setSeason({ ...season, episodes: season.episodes.reverse() })
      )
  }, [])
  return season ? (
    <Accordion key={season.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{season.name}</Typography>
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
