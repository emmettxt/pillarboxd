import { Alert, AlertTitle } from '@mui/material'
import { useSelector } from 'react-redux'

const Alerts = () => {
  const alerts = useSelector((state) => state.alerts)
  return alerts.map((alert) => (
    <Alert key={alert.id} severity={alert.severity}>
      <AlertTitle>{alert.title}</AlertTitle>
      {alert.message}
    </Alert>
  ))
}

export default Alerts
