import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import {
  Box,
  Link,
  Card,
  CardContent,
  CardMedia,
  Typography,
  MobileStepper,
  Button,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { Container } from '@mui/system'
import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import tvService from '../services/tv'

const ShowCard = ({ tv }) => {
  return (
    <Card sx={{ width: { md: '25%', sm: '50%' } }}>
      <CardContent>
        <Link
          // <Link
          href={`/tv/${tv.id}`}
        >
          <CardMedia
            component="img"
            // height="140"
            image={`https://image.tmdb.org/t/p/w185/${tv.poster_path}`}
            alt={tv.name + 'poster'}
          />
          <Typography textAlign="center">{tv.name}</Typography>
        </Link>
      </CardContent>
    </Card>
  )
}

const Trending = () => {
  const [trending, setTrending] = useState([])
  const [timeWindow, setTimeWindow] = useState('week')
  const handleTimeWindowChange = (event) => {
    setTimeWindow(event.target.value)
  }
  useEffect(() => {
    tvService.getTrendingTv(timeWindow).then((popular) => setTrending(popular))
  }, [timeWindow])
  const [activeStep, setActiveStep] = useState(0)
  const handleNext = () => setActiveStep(activeStep + 1)
  const handleBack = () => setActiveStep(activeStep - 1)

  return (
    <Box>
      <Box sx={{ display: 'flex' ,justifyContent:'space-between'}}>
        <Typography variant="h6" sx={{ alignItems: 'center' ,display:'flex'}}>
          Trending
        </Typography>
        <FormControl>
          <Select value={timeWindow} onChange={handleTimeWindowChange}>
            <MenuItem value={'week'}>this week</MenuItem>
            <MenuItem value={'day'}>today</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <MobileStepper
          variant="dots"
          steps={trending.length / 4}
          activeStep={activeStep}
          position="static"
          sx={{ width: '100%' }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === trending.length / 4 - 1}
            >
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
            </Button>
          }
        ></MobileStepper>
        {trending
          ? trending
              .slice(activeStep * 4, activeStep * 4 + 4)
              .map((tv) => <ShowCard tv={tv} key={tv.id} />)
          : null}
      </Box>
    </Box>
  )
}
const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Trending />
    </Container>
  )
}

export default HomePage
