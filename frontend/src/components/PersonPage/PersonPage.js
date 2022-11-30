import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import peopleService from '../../services/people'
import Credits from './Credits'
const PersonPage = () => {
  const [person, setPerson] = useState()
  const params = useParams()
  const personId = params.personId
  useEffect(() => {
    peopleService
      .getPersonWithCredits(personId)
      .then((person) => setPerson(person))
  }, [])
  return person ? (
    <Container>
      <Card>
        <CardHeader title={person.name} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              md: '25% 75%',
              sm: '37.5% 1fr',
              xs: '40% 60%',
            },
          }}
        >
          <CardContent>
            <img
              src={`https://image.tmdb.org/t/p/h632/${person.profile_path}`}
              style={{ aspectRatio: '2/3', width: '100%' }}
            />
          </CardContent>
          <CardContent sx={{ width: '100%' }}>
            <Typography variant="body2" overflow={'auto'} maxHeight="60ex">
              {person.biography}
            </Typography>
          </CardContent>
        </Box>
        <Divider variant="middle" />
        <CardContent>
          <Credits
            crew={person?.combined_credits?.crew}
            combinedCredits={person?.combined_credits}
          />
        </CardContent>
      </Card>
    </Container>
  ) : null
}
export default PersonPage
