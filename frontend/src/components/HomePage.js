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
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const ShowCard = ({ tv }) => {
  return (
    <Card>
      <CardContent>
        <Link
          // <Link
          href={`/tv/${tv.id}`}
          underline="none"
        >
          <CardMedia
            component="img"
            // height="140"
            image={`https://image.tmdb.org/t/p/w342/${tv.poster_path}`}
            alt={tv.name + 'poster'}
          />
          <Typography textAlign="center" color={'text.primary'}>
            {tv.name}
          </Typography>
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

  const handleStepChange = (step) => {
    setActiveStep(step)
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ alignItems: 'center', display: 'flex' }}>
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
      </Box>
      {/* <Box
        sx={{
          display: 'grid',
          // gridAutoFlow: 'column',
          gridTemplateColumns: {
            xs: 'repeat(2,1fr)',
            sm: 'repeat(4,1fr)',
          },
          //'repeat(auto-fit, minmax(185px,1fr))',
        }}
      > */}
      <AutoPlaySwipeableViews
        axis="x"
        index={activeStep}
        onChange={handleStepChange}
        enableMouseEvents
      >
        {Array.from(Array(trending?.length / 4)).map((x, i) => (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2,1fr)',
                sm: 'repeat(4,1fr)',
              },
            }}
            key={i}
          >
            {trending?.slice(i * 4, i * 4 + 4).map((tv) => (
              <ShowCard tv={tv} key={tv.id} />
            ))}
          </Box>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  )
}
const HomePage = () => {
  return (
    <Container>
      <Trending />
    </Container>
  )
}

export default HomePage
