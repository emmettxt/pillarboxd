import { Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'

const Person = ({ person, creditAttribute }) => {
  return (
    <Box>
      <Avatar
        src={`https://image.tmdb.org/t/p/w45/${person.profile_path}`}
        sx={{ margin: 'auto' }}
      />
      <Typography variant={'body2'} align="center">
        {person.name}
      </Typography>
      <Typography variant={'body2'} color={'text.secondary'} align="center">
        {person[creditAttribute]}
      </Typography>
    </Box>
  )
}

const PeopleCarousel = ({ people, title, creditAttribute }) => {
  return (
    <Box>
      <Typography variant="subtitle1">{title}</Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: {
            md: '10%',
            sm: '12.5%',
            xs: '20%',
          },
          columnGap: '5px',
          overflow: 'auto',
        }}
      >
        {people?.map((person) => (
          <Person
            key={person.id}
            person={person}
            creditAttribute={creditAttribute}
          ></Person>
        ))}
      </Box>
    </Box>
  )
}
export default PeopleCarousel