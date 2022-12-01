import { Avatar, Link, Typography } from '@mui/material'
import { Box } from '@mui/system'

const Person = ({ person, creditAttribute }) => {
  return (
    <Box>
      <Link href={`/people/${person.id}`} underline="none">
        <Avatar
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w45/${person.profile_path}`
              : null
          }
          sx={{ margin: 'auto' }}
        />
        <Typography variant={'body2'} color={'text.primary'} align="center">
          {person.name}
        </Typography>
        <Typography variant={'body2'} color={'text.secondary'} align="center">
          {person[creditAttribute]}
        </Typography>
      </Link>
    </Box>
  )
}

const PeopleCarousel = ({ people, title, creditAttribute }) => {
  if (people.length<1) return null
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: {
            lg: '80px',
            md: '100px',
            sm: '90px',
            xs: '80px',
          },
          columnGap: '5px',
          overflow: 'auto',
        }}
      >
        {people?.map((person) => (
          <Person
            key={person.credit_id}
            person={person}
            creditAttribute={creditAttribute}
          ></Person>
        ))}
      </Box>
    </Box>
  )
}
export default PeopleCarousel
