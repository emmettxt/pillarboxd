import Navbar from './components/Navigation/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeUser } from './reducers/userReducer'
import { ThemeProvider } from '@mui/material/styles'
import linkTheme from './themes/linkTheme'
import TvPage from './components/TvPage/TvPage'
import Alerts from './components/Alerts'
import HomePage from './components/HomePage'
import UserShowsPage from './components/UserShowsPage'
import PersonPage from './components/PersonPage/PersonPage'
import SearchResults from './components/SearchResults'
import { Container } from '@mui/system'
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUser())
  }, [])
  return (
    <ThemeProvider theme={linkTheme}>
      <CssBaseline>
        <Router>
          <Navbar />
          <Alerts />
          <Container sx={{ padding: { xs: 0 } }}>
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/search/:query" element={<SearchResults />}></Route>
              <Route path="/tv/:id" element={<TvPage />}></Route>
              <Route
                path="/users/:userid/shows"
                element={<UserShowsPage />}
              ></Route>
              <Route path="/people/:personId" element={<PersonPage />}></Route>
            </Routes>
          </Container>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
