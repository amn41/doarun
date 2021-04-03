import React, { Component } from 'react'
import Leaderboard from './containers/Leaderboard'
import Profile from './components/Profile'
import AppHeader from './components/AppHeader'
import netlifyIdentity from 'netlify-identity-widget'
import api from './utils/api'
import {
  BrowserRouter as Router,
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
              pathname: '/',
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
    profile: null,
    groups: null,
    jwt: null,
  }
  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.signout = this.signout.bind(this);
  } 
  authenticate() {
    netlifyIdentity.open();
    netlifyIdentity.on('login', user => {
       user.jwt().then((jwt) => {
         return api.readGroups(jwt)
       }).then((groups) => {
    	 this.setState({
    	   groups: groups,
           isAuthenticated: true,
           user: user
         })
       })      
    })
  }
  signout() {
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.setState({
        isAuthenticated: false,
        user: null,
        groups: null
      })
    });
  }
  componentDidMount() {
    const { user } = this.state
    if (user) {
       user.jwt().then((jwt) => {
         this.setState({
           jwt: jwt
         })
         return Promise.all([api.readProfile(jwt), jwt])
       }).then(([profile, jwt]) => {
    	 this.setState({
    	   profile: profile
         })
         return (jwt)
       }).then((jwt) => {
         return api.readGroups(jwt)
       }).then((groups) => {
    	 this.setState({
    	   groups: groups
         })
       })
       .catch((error) => console.error(error))
    }
  }
  render() {
      return (
      <ThemeProvider theme={theme}>
          <Router>
            <AppHeader profile={this.state.profile} />
            <Switch>
              <PrivateRoute exact path="/:groupId" isAuthenticated={this.state.isAuthenticated}>
                <Leaderboard groups={this.state.groups} jwt={this.state.jwt} />
              </PrivateRoute>
              <Route path="/" >
                <Profile isAuthenticated={this.state.isAuthenticated} user={this.state.user} groups={this.state.groups} profile={this.state.profile} authenticate={this.authenticate} signout={this.signout} />
              </Route>
            </Switch>
          </Router>
      </ThemeProvider>
    )
  }
}

