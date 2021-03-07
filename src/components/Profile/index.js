import React, { Component } from 'react'
import stravaButton from '../../assets/btn_strava_connectwith_orange.svg'
import { Link } from 'react-router-dom';
import api from '../../utils/api'

const oauthUrl = "https://www.strava.com/oauth/authorize?client_id=62285&response_type=code&redirect_uri=https://amazing-jang-8a41ee.netlify.app/.netlify/functions/oauth-complete&approval_prompt=force&scope=activity:read_all"


class AuthButton extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return (
        <button onClick={this.props.signout}>Sign out</button>
      )
    } else {
      return (
        <button onClick={this.props.authenticate}>Log in</button>
      )
    }
  }
}


export default class Profile extends Component {
    renderProfile() {
      if (this.props.isAuthenticated) {
        return (
          <div>
            <br/>
            <Link to="/">View Leaderboard</Link>
            <br/>
            <br/>
            <div>
              <a href={`${oauthUrl}&state=${this.props.user.email}`}>
                <img src={stravaButton} alt='log in with strava'/>
              </a>
            </div>
          </div>
        )
      } else {
        return (null)
      }
    }
    render() {
      return (
      <div>
        {this.renderProfile()}
        <div>
          <p>{this.props.user?.email}</p>
          <AuthButton isAuthenticated={this.props.isAuthenticated} authenticate={this.props.authenticate} signout={this.props.signout}/>
        </div>
      </div>
    )
  }
}
