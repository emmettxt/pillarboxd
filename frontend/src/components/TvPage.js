import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tvService from '../services/tv'
import SeasonAccordion from './SeasonAccordion'

const TvPage = () => {
  const params = useParams()
  const tvId = params.id
  const [tv, setTv] = useState()
  useEffect(() => {
    tvService.getTv(tvId).then((tv) => {
      setTv(tv)
    })
  }, [])
  return tv ? (
    <Container>
      <Card>
        <div
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), white),url('https://image.tmdb.org/t/p/w1280/${tv.backdrop_path}')`,
            // objectPosition: 'bottom',
            // backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            // paddingTop: 30,
            top: 0,
            // zIndex: '-1',
            minHeight: '500px',
            position: 'relative',
            display: 'Block',
          }}
        ></div>
        <CardHeader title={tv.name} subheader={tv.tagline} />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {tv.overview}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant="h6" color="text.primary">
            Episodes
          </Typography>
          {tv.seasons.reverse().map((season) => (
            <Accordion key={season.id} sx={{ background: 'rgba(0,0,0,0)' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{season.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SeasonAccordion
                  tvId={tv.id}
                  seasonNumber={season.season_number}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Container>
  ) : null
}

export default TvPage
