require('dotenv').config()

const TMDB_API_KEY_V3 = process.env.TMDB_API_KEY_V3
const PORT = process.env.PORT
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
  TMDB_API_KEY_V3,
}
