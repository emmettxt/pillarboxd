import { Accordion, AccordionSummary, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import tvService from '../services/tv'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
const SeasonAccordion = ({ tvId, seasonNumber }) => {
  const [season, setSeason] = useState([])
  useEffect(() => {
    tvService
      .getTvSeason(tvId, seasonNumber)
      .then((response) => setSeason(response))
  }, [])
  return season.episodes
    ? season.episodes.map((episode) => (
        <Accordion
          key={`${tvId}.${seasonNumber}.${episode.episode_number}`}
          sx={{ background: 'rgba(0,0,0,0)' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            
            <Typography>{`${episode.episode_number}: ${episode.name} ${episode.air_date}`}</Typography>
          </AccordionSummary>
        </Accordion>
      ))
    : null
}

export default SeasonAccordion
