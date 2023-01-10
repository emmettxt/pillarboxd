import {
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Link,
} from '@mui/material'
import { List } from '@mui/material'
import { Avatar } from '@mui/material'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdbService from '../services/search'
const firstAirDateYear = (firstAirDate) => {
  if (!firstAirDate) return ''
  return `(${firstAirDate.split('-')[0]})`
}
const SearchResult = ({ object }) => {
  const isTv = object.media_type === 'tv'
  return (
    <ListItem
      componentsProps={{ key: object.id }}
      key={object.id}
      sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
    >
      <ListItemButton
        component={Link}
        to={isTv ? `/tv/${object.id}` : `/people/${object.id}`}
        sx={{ order: { xs: 2, sm: 1 } }}
      >
        <ListItemAvatar>
          <Avatar
            alt={object.name}
            src={
              isTv
                ? `https://image.tmdb.org/t/p/w185/${object.poster_path}`
                : `https://image.tmdb.org/t/p/w185/${object.profile_path}`
            }
            variant="square"
            sx={{ width: 100, height: 150, padding: 1, order: 0 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            isTv
              ? `${object.name} ${firstAirDateYear(object.first_air_date)}`
              : object.name
          }
          secondary={object.overview}
        />
      </ListItemButton>
    </ListItem>
  )
}
const SearchResults = () => {
  const params = useParams()
  const [results, setResults] = useState([])
  const query = params.query
  useEffect(() => {
    tmdbService.searchMulti(query).then((data) => setResults(data))
  }, [query])
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        margin: 'auto',
      }}
    >
      {results.map((resultObject) => (
        <div key={resultObject.id}>
          <Divider variant="inset" component="li" />
          <SearchResult object={resultObject} />
        </div>
      ))}
    </List>
  )
}

export default SearchResults
