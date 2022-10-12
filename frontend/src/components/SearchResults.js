// import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdbService from '../services/search'
const SearchResultPerson = ({ personObject }) => {
  return (
    <div>
      <img
        src={`https://image.tmdb.org/t/p/w185/${personObject.profile_path}`}
        alt={`picture of ${personObject.name}`}
      />
      {personObject.name}
    </div>
  )
}
const SearchResultTv = ({ TvObject }) => {
  const handleAddToWatchlist = async () => {
    // todo
    // const response = await axios.post(`/api/user/wacthlist`)
  }
  return (
    <div>
      <img
        src={`https://image.tmdb.org/t/p/w185/${TvObject.poster_path}`}
        alt={`poster for ${TvObject.name}`}
      />
      {TvObject.name}
      <button onClick={handleAddToWatchlist}>add to watchlist</button>
    </div>
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
    <div>
      {results.map((resultObject) =>
        resultObject.media_type === 'tv' ? (
          <SearchResultTv key={resultObject.id} TvObject={resultObject} />
        ) : (
          <SearchResultPerson
            key={resultObject.id}
            personObject={resultObject}
          />
        )
      )}
    </div>
  )
}

export default SearchResults
