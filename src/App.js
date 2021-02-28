import React, { Component } from 'react'
import './App.css'
import Leaderboard from './Leaderboard';
import netlifyIdentity from 'netlify-identity-widget';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';


const netlifyAuth = {
  isAuthenticated: false,
  user: null,
    authenticate(callback) {
    console.log("authenticate called")
    this.isAuthenticated = true;
    console.log("going to open")
    netlifyIdentity.open();
    netlifyIdentity.on('login', user => {
      this.user = user;
      callback(user);
    });
  },
  signout(callback) {
    this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.user = null;
      callback();
    });
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    netlifyAuth.isAuthenticated ? (
      <p>
        Welcome!{' '}
        <button
          onClick={() => {
            netlifyAuth.signout(() => history.push('/'));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        netlifyAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class Login extends React.Component {
  state = { redirectToReferrer: false };

  login = () => {
    netlifyAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}


export default class App extends Component {
  render() {
      return (
    	<Router>
    	  <div>
    	    <AuthButton />
    	    <ul>
    	      <li>
    	        <Link to="/login">Login Screen</Link>
    	      </li>
    	      <li>
    	        <Link to="/leaderboard">Leaderboard</Link>
    	      </li>
    	    </ul>
    	    <Route path="/login" component={Login} />
    	    <PrivateRoute path="/leaderboard" component={Leaderboard} />
    	  </div>
    	</Router>
    )
  }
}

