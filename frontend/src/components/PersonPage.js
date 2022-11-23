import { Box, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import peopleService from '../services/people'

const PersonPage = () => {
  const [person, setPerson] = useState()
  const params = useParams()
  const personId = params.personId
  useEffect(() => {
    peopleService.getPerson(personId).then((person) => setPerson(person))
  }, [])
  return person ? (
    <Container>
      <Box sx={{ height: '400px', aspectRatio: '2/3', border: 1 }}>
        <img
          src={`https://image.tmdb.org/t/p/h632/${person.profile_path}`}
          style={{ height: '100%', width: '100%' }}
        ></img>
      </Box>
      <Typography variant="h6">{person.name}</Typography>
    </Container>
  ) : null
}
export default PersonPage
