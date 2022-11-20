import { Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../reducers/userReducer'

const Logout = () => {
  const dispatch = useDispatch()
  return <Button onClick={() => dispatch(logoutUser())}>log out</Button>
}

export default Logout
