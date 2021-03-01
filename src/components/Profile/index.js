import React, { Component } from 'react'
import stravaButton from '../../assets/btn_strava_connectwith_orange.svg'
import { Link } from 'react-router-dom';

const oauthUrl = "https://www.strava.com/oauth/authorize?client_id=62285&response_type=code&redirect_uri=https://amazing-jang-8a41ee.netlify.app/.netlify/functions/oauth-complete&approval_prompt=force&scope=activity:read_all"


//exchange_token?state=&code=a4039294d0f6534e9bd97fa75e2f7368d3329868&scope=read,activity:read_all


class AuthButton extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return (
        <p>
          Welcome!{' '}
          <button onClick={this.props.signout}>Sign out</button>
        </p>
      )
    } else {
      return (
        <button onClick={this.props.authenticate}>Log in</button>
      )
    }
  }
}


export default class Profile extends Component {
    render() {
	return (
      <div>
        <AuthButton isAuthenticated={this.props.isAuthenticated} authenticate={this.props.authenticate} signout={this.props.signout}/>
        <p>My Profile</p>
        <Link to="/">Leaderboard</Link>
        <a href={oauthUrl}>
          <img src={stravaButton} alt='log in with strava'/>
        </a>
      </div>
    )
  }
}
