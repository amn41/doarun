import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/doarun-logo.svg'
import {
  AppBar,
  Avatar,
  Grid,
  Toolbar,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import theme from '../../theme/themed'

const StyledAppBar = withStyles({
  root: {
    backgroundColor: theme.palette.secondary.main,
    width: '100%',
  },
})(AppBar)

const StyledToolbar = withStyles({
  root: {
    height: theme.spacing(10),
  },
})(Toolbar)

const StyledAvatar = withStyles({
  root: {
    height: theme.spacing(7),
    width: theme.spacing(7),
  },
})(Avatar)

export const AppHeader: React.FC = (props: any) => {
  const defaultProfileUrl = "https://www.gravatar.com/avatar/?d=identicon"
  const profileUrl = props?.profile?.strava?.data?.athlete?.profile_medium || defaultProfileUrl
  return (
    <header>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <img width="160px" src={logo} alt='logo' aria-label="logo" />
            </Grid>
            <Grid item>
              <Link to="/profile">
                <StyledAvatar alt="profile" title="View Profile" src={profileUrl} />
              </Link>
            </Grid>
          </Grid>
        </StyledToolbar>
      </StyledAppBar>
    </header>
  )
}

export default AppHeader
