const getAuthConfig = (user) => {
  if (!user) {
    return null
  }
  const auth = {
    headers: { Authorization: `bearer ${user.token}` },
  }
  return auth
}

export default getAuthConfig
