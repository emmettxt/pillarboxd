const tmdbUtil = require('./tmdb')
describe('getShowWatchlist',()=>{
  test('works for valid id',async()=>{
    const result = await tmdbUtil.getShowWatchlist(1398)
    console.log(result)
  })
})