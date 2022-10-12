import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login'

const Navigation = () => {
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/search/${event.target.search.value}`)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/">home</Link>
      <form onSubmit={handleSearch}>
        Search
        <input
          name="search"
          onChange={() => setSearchInput(searchInput)}
        ></input>
      </form>
      <Login />
    </div>
  )
}

export default Navigation
