import Navigation from './components/Navigation'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SearchResults from './components/SearchResults'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeUser } from './reducers/userReducer'
import { ThemeProvider } from '@mui/material/styles'
import linkTheme from './themes/linkTheme'
import TvPage from './components/TvPage'
import Alerts from './components/Alerts'
import HomePage from './components/HomePage'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUser())
  }, [])
  return (
    <ThemeProvider theme={linkTheme}>
      <Router>
        <Navigation />
        <Alerts/>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/search/:query" element={<SearchResults />}></Route>
          <Route path="/tv/:id" element={<TvPage />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
