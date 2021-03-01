import React, { Component } from 'react'
import './App.css'
import Leaderboard from './Leaderboard';
import Profile from './components/Profile';
import netlifyIdentity from 'netlify-identity-widget';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';


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
    user: netlifyIdentity.currentUser()
  }
  authenticate(callback) {
    netlifyIdentity.open();
    netlifyIdentity.on('login', user => {
      this.setState({
        isAuthenticated: true,
        user: user
      })
      callback(user);
    });
  }
  signout(callback) {
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.setState({
        isAuthenticated: false,
        user: null
      })
      callback();
    });
  }

  render() {
      return (
    	<Router>
            <Switch>
    	      <PrivateRoute exact path="/" component={Leaderboard} isAuthenticated={this.state.isAuthenticated} />
    	      <Route path="/profile" >
                <Profile isAuthenticated={this.state.isAuthenticated} user={this.state.user} authenticate={this.authenticate} signout={this.signout}/>
              </Route>
            </Switch>
    	</Router>
    )
  }
}

