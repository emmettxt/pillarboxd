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
import { Button } from '@mui/material'
import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdbService from '../services/search'

const SearchResult = ({ object }) => {
  const isTv = object.media_type === 'tv'
  const handleAddToWatchlist = async () => {
    // todo
    // const response = await axios.post(`/api/user/wacthlist`)
  }
  return (
    <ListItem
      componentsProps={{ key: object.id }}
      key={object.id}
      sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
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
      <ListItemButton
        component={Link}
        to={`/tv/${object.id}`}
        sx={{ order: { xs: 2, sm: 1 } }}
      >
        <ListItemText
          primary={
            isTv
              ? `${object.name} (${object.first_air_date.split('-')[0]})`
              : object.name
          }
          secondary={object.overview}
        />
      </ListItemButton>
      {isTv ? (
        <Button
          onClick={handleAddToWatchlist}
          variant="contained"
          sx={{ minWidth: '7em', order: { xs: 1, sm: 2 } }}
        >
          add to watchlist
        </Button>
      ) : null}
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
    <Container>
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
    </Container>
  )
}

export default SearchResults
