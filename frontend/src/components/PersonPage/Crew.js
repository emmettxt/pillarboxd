import CreditCard from './CrewCard'
import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { Box } from '@mui/system'
import { useState } from 'react'

const Crew = ({ crew }) => {
  if (!crew?.length) return null
  const jobs = Object.entries(
    crew
      .map((c) => c.job) //get not unique list of jobs
      .reduce((prev, cur) => ({ ...prev, [cur]: 1 + prev[cur] || 1 }), {}) //reduce to object with count of jobs
  )
    .map((e) => ({ job: e[0], count: e[1] })) //convert object to array of objects
    .sort((a, b) => b.count - a.count) //sort array by count
  console.log(jobs)
  const [selectedJobs, setSelectedJobs] = useState([jobs[0].job])
  const handleJobChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedJobs(typeof value === 'string' ? value.split(',') : value)
  }
  return (
    <Box>
      <FormControl sx={{ m: 1, width: 300, maxWidth: '100%' }}>
        <InputLabel labelId="crew-job-selector">Credit</InputLabel>
        <Select
          labelId="crew-job-selector"
          label="Credit"
          onChange={handleJobChange}
          multiple
          value={selectedJobs}
          renderValue={(selected) => selected.join(', ')}
        >
          {jobs.map((job) => (
            <MenuItem key={job.job} value={job.job} dense>
              <Checkbox
                checked={selectedJobs.indexOf(job.job) > -1}
                sx={{ padding: 0, paddingRight: '6px' }}
              />
              <Typography color="text.primary">{job.job}</Typography>
              <Typography color="text.secondary" sx={{ marginLeft: 'auto' }}>
                ({job.count})
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2,1fr)',
            sm: 'repeat(3,1fr)',
            md: 'repeat(4,1fr)',
            lg: 'repeat(5,1fr)',

          },
        }}
      >
        {crew
          .filter((c) => selectedJobs.indexOf(c.job) > -1)
          .map((c) => (
            <CreditCard key={c.credit_id} credit={c} isCast={false} />
          ))}
      </Box>
    </Box>
  )
}

export default Crew
