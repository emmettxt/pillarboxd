import CreditCard from './CreditCard'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'
import { ExpandMore } from '@mui/icons-material'

const Credits = ({ combinedCredits }) => {
  // if (crew?.length === 0 && cast?.length === 0) return null
  const [jobs, setJobs] = useState([])
  const [credits, setCredits] = useState([])
  useEffect(() => {
    const ActingCredits = combinedCredits.cast.map((c) => ({
      ...c,
      job: 'Actor',
    }))
    const credits = [...combinedCredits.crew, ...ActingCredits].sort(
      (a, b) => b.popularity - a.popularity
    )
    setCredits(credits)
    const jobs = Object.entries(
      credits
        .map((c) => c.job) //get not unique list of jobs
        .reduce((prev, cur) => ({ ...prev, [cur]: 1 + prev[cur] || 1 }), {}) //reduce to object with count of jobs
    )
      .map((e) => ({ job: e[0], count: e[1] })) //convert object to array of objects
      .sort((a, b) => b.count - a.count) //sort array by count
    setJobs(jobs)
  }, [combinedCredits])
  return (
    <Box>
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
