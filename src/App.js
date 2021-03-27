import React, { Component } from 'react'
import Leaderboard from './containers/Leaderboard'
import Profile from './components/Profile'
import AppHeader from './components/AppHeader'
import netlifyIdentity from 'netlify-identity-widget'
import api from './utils/api'
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme/themed'


function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/profile',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}


export default class App extends Component {
  state = {
    isAuthenticated: netlifyIdentity.currentUser() != null,
    user: netlifyIdentity.currentUser(),
    profile: null
  }
  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.signout = this.signout.bind(this);
  } 
  authenticate() {
    netlifyIdentity.open();
    netlifyIdentity.on('login', user => {
      this.setState({
        isAuthenticated: true,
        user: user
      })
    });
  }
  signout() {
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.setState({
        isAuthenticated: false,
        user: null
      })
    });
  }
  componentDidMount() {
    const { user } = this.state
    if (user) {
       user.jwt().then((jwt) => {
         return api.readProfile(jwt)
       }).then((profile) => {
    	 this.setState({
    	   profile: profile
         })
       }) 
    }
  }
  render() {
      return (
      <ThemeProvider theme={theme}>
          <Router>
            <AppHeader profile={this.state.profile} />
            <Switch>
              <PrivateRoute exact path="/" component={Leaderboard} isAuthenticated={this.state.isAuthenticated} />
              <Route path="/profile" >
                <Profile isAuthenticated={this.state.isAuthenticated} user={this.state.user} profile={this.state.profile} authenticate={this.authenticate} signout={this.signout} />
              </Route>
            </Switch>
          </Router>
      </ThemeProvider>
    )
  }
}

