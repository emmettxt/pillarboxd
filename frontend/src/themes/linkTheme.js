import * as React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink, MemoryRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import { createTheme } from '@mui/material/styles'

const LinkBehavior = React.forwardRef(function LinkBehavior(props, ref) {
  const { href, ...other } = props
  // Map href (MUI) -> to (react-router)
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
})

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
}

function Router(props) {
  const { children } = props
  if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>
  }

  return <MemoryRouter>{children}</MemoryRouter>
}

Router.propTypes = {
  children: PropTypes.node,
}

const linkTheme = createTheme({
  // palette: {
  //   mode: 'dark',
  // },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})
export default linkTheme
