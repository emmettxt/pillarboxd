import CreditCard from './CreditCard'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardContent,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import { ExpandMore } from '@mui/icons-material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const Credits = ({ combinedCredits }) => {
  const [isSortedDescending, setIsSortedDescending] = useState(true)
  const descendingMultiplier = isSortedDescending ? 1 : -1
  const sort = [
    {
      title: 'Default',
      sortFunction: (a, b) =>
        (a.default_order - b.default_order) * descendingMultiplier,
    },
    {
      title: 'Release Date',
      sortFunction: (a, b) => {
        const aDate = Date.parse(a.release_date || a.first_air_date)
        const bDate = Date.parse(b.release_date || b.first_air_date)
        return (
          ((isNaN(bDate) ? 0 : bDate) - (isNaN(aDate) ? 0 : aDate)) *
          descendingMultiplier
        )
      },
    },
    {
      title: 'Title',
      sortFunction: (a, b) =>
        (a.title || a.name) < (b.title || b.name)
          ? descendingMultiplier
          : -1 * descendingMultiplier,
    },
    {
      title: 'Popularity',
      sortFunction: (a, b) =>
        (b.popularity - a.popularity) * descendingMultiplier,
    },
  ]
  const [selecetedSortIndex, setSelectedSort] = useState(0)
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value)
  }
  const [jobs, setJobs] = useState([])
  const [credits, setCredits] = useState([])
  const [showFilms, setShowFilms] = useState(false)
  useEffect(() => {
    const ActingCredits = combinedCredits.cast.map((c, i) => ({
      ...c,
      job: 'Actor',
      default_order: i,
    }))
    const crewCredits = combinedCredits.crew.map((c, i) => ({
      ...c,
      default_order: i,
    }))
    const credits = [...crewCredits, ...ActingCredits]
      .sort(sort[selecetedSortIndex].sortFunction)
      .filter((c) => (showFilms ? true : c.media_type !== 'movie'))
    setCredits(credits)
    const jobs = Object.entries(
      credits
        .map((c) => c.job) //get not unique list of jobs
        .reduce((prev, cur) => ({ ...prev, [cur]: 1 + prev[cur] || 1 }), {}) //reduce to object with count of jobs
    )
      .map((e) => ({ job: e[0], count: e[1] })) //convert object to array of objects
      .sort((a, b) => b.count - a.count) //sort array by count
    setJobs(jobs)
  }, [combinedCredits, showFilms])
  return (
    <Box>
      <CardContent sx={{ display: 'flex ', justifyContent:'space-between' }}>
        <FormControlLabel
          control={
            <Switch
              onChange={() => setShowFilms(!showFilms)}
              checked={showFilms}
            />
          }
          label="Include Films"
        />
        <FormControl>
          <InputLabel id="sort-label">Sort by</InputLabel>

          <Select
          variant='outlined'
            labelId="sort-label"
            id="sort-select"
            value={selecetedSortIndex}
            onChange={handleSortChange}
            label="Sort by"
            sx={{ padding: 0 }}
            startAdornment={
              <IconButton
                onClick={() => setIsSortedDescending(!isSortedDescending)}
              >
                {isSortedDescending ? (
                  <ArrowDownwardIcon
                    sx={{
                      animation: 'spin 0.2s linear 1',
                      '@keyframes spin': {
                        from: {
                          transform: 'rotate(180deg)',
                        },
                        to: {
                          transform: 'rotate(0deg)',
                        },
                      },
                    }}
                  ></ArrowDownwardIcon>
                ) : (
                  <ArrowUpwardIcon
                    sx={{
                      animation: 'spin 0.2s linear 1',
                      '@keyframes spin': {
                        from: {
                          transform: 'rotate(180deg)',
                        },
                        to: {
                          transform: 'rotate(0deg)',
                        },
                      },
                    }}
                  ></ArrowUpwardIcon>
                )}
              </IconButton>
            }
          >
            {sort.map((s, i) => (
              <MenuItem value={i} key={i}>
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
      {jobs.map((j) => (
        <Accordion
          key={j.job}
          elevation={5}
          defaultExpanded={j.job === jobs[0]}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography color="text.primary">{j.job}</Typography>
            <Typography color="text.secondary" sx={{ marginLeft: 'auto' }}>
              ({j.count})
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3,1fr)',
                sm: 'repeat(4,1fr)',
                md: 'repeat(5,1fr)',
                lg: 'repeat(6,1fr)',
                xl: 'repeat(7,1fr)',
              },
              gap: 1,
            }}
          >
            {credits
              .sort(sort[selecetedSortIndex].sortFunction)
              .filter((c) => j.job === c.job)
              .map((c) => (
                <CreditCard
                  key={c.credit_id}
                  credit={c}
                  isCast={false}
                  elevation={5}
                />
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default Credits
