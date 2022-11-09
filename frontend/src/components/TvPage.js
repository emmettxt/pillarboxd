import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tvService from '../services/tv'
import SeasonAccordion from './SeasonAccordion'
import MoreTimeIcon from '@mui/icons-material/MoreTime'
import { useDispatch, useSelector } from 'react-redux'
import watchlistService from '../services/watchlist'
import { setUser } from '../reducers/userReducer'

const TvPage = () => {
  const user = useSelector((state) => state.user)
  const params = useParams()
  const tvId = params.id
  const [tv, setTv] = useState()
  useEffect(() => {
    tvService.getTv(tvId).then((tv) => {
      setTv({ ...tv, seasons: tv.seasons.reverse() })
      tvService.getTvWithAllSeasons(tv).then((tv) => {
        setTv({ ...tv, seasons: tv.seasons.reverse() })
        // setIsEntireShowInUserWatchlist(checkEntireShowInUserWatchlist())
      })
    })
  }, [])
  //this will compare the shows episodes and the episodes in the users watchlist
  const checkEntireShowInUserWatchlist = () => {
    if (!user || !tv) return false
    const episodeCount = tv.seasons
      .filter((s) => s.season_number !== 0)
      .reduce((a, b) => a + b.episode_count, 0)
    console.log({ episodeCount })
    const episodeCountInWatchlist = user.watchlist.filter(
      (s) => s.season_number !== 0 && s.tv_id === tv.id
    ).length
    console.log({ episodeCountInWatchlist })
    return episodeCount === episodeCountInWatchlist
  }
  const isEntireShowInUserWatchlist = checkEntireShowInUserWatchlist()
  const dispatch = useDispatch()
  const handleAddShowToWatchlist = async () => {
    const updatedUser = await watchlistService.addShowToWatchList(user, tv.id)

    await dispatch(setUser({ ...updatedUser, token: user.token }))
  }
  const handleRemoveShowFromWatchlist = async () => {
    await watchlistService.removeShowFromWatchList(user, tv.id)
    const updatedWatchlist = user.watchlist.filter((w) => w.tv_id !== tv.id)
    const updatedUser = { ...user, watchlist: updatedWatchlist }
    await dispatch(setUser(updatedUser))
  }
  return tv ? (
    <Container>
      <Card>
        <CardContent
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), white),url('https://image.tmdb.org/t/p/w1280/${tv.backdrop_path}')`,
            // objectPosition: 'bottom',
            // backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            // paddingTop: 30,
            backgroundPositionY: 0,
            backgroundPositionX: '50%',

            // zIndex: '-1',
            minHeight: { md: '450px', xs: '200px', sm: '300px' },
            position: 'relative',
            display: 'Block',
          }}
        ></CardContent>
        <CardHeader title={tv.name} subheader={tv.tagline} />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {tv.overview}
          </Typography>
          <Button
            onClick={
              isEntireShowInUserWatchlist
                ? handleRemoveShowFromWatchlist
                : handleAddShowToWatchlist
            }
          >
            <MoreTimeIcon
              color={isEntireShowInUserWatchlist ? 'success' : 'primary'}
            ></MoreTimeIcon>
          </Button>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant="h6" color="text.primary">
            Episodes
          </Typography>
          {tv.seasons.map(
            (season) => (
              <SeasonAccordion
                tvId={tv.id}
                seasonNumber={season.season_number}
                key={season.id}
                season={tv[`season/${season.season_number}`]}
              />
            )
            // <Accordion key={season.id}>
            //   <AccordionSummary
            //     expandIcon={<ExpandMoreIcon />}
            //     aria-controls="panel1a-content"
            //     id="panel1a-header"
            //   >
            //     <Typography>{season.name}</Typography>
            //   </AccordionSummary>
            //   <AccordionDetails
            //     sx={{
            //       backgroundImage: `url(
            //         https://image.tmdb.org/t/p/w780/${season.poster_path})`,
            //       // minHeight: '500px',
            //       backgroundRepeat: 'no-repeat',
            //       backgroundPositionX: '50%',
            //       backgroundPositionY: 0,
            //       backgroundSize: 'cover',
            //     }}
            //   >
            //     <SeasonAccordion
            //       tvId={tv.id}
            //       seasonNumber={season.season_number}
            //     />
            //   </AccordionDetails>
            // </Accordion>
          )}
        </CardContent>
      </Card>
    </Container>
  ) : null
}

export default TvPage
