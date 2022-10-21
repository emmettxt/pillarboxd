import { getAuthConfig } from './watchlist'

test('with user', () => {
  const user = { token: 'blahbalabla' }
  const returned = getAuthConfig(user)
  console.log(returned)
})
