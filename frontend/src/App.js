import Navigation from './components/Navigation'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SearchResults from './components/SearchResults'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/"></Route>
        <Route path="/search/:query" element={<SearchResults />}></Route>
      </Routes>
    </Router>
  )
}

export default App
