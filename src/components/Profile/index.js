import React, { Component } from 'react'
import stravaButton from '../../assets/btn_strava_connectwith_orange.svg'

const oauthUrl = "https://www.strava.com/oauth/authorize?client_id=62285&response_type=code&redirect_uri=https://amazing-jang-8a41ee.netlify.app/profile&approval_prompt=force&scope=activity:read_all"

export default class Profile extends Component {
  componentDidMount() {
    console.log("mounted")
  }
    render() {
	return (
      <div>
        <p>My Profile</p>
        <a href={oauthUrl}>
          <img src={stravaButton} alt='log in with strava'/>
        </a>
      </div>
    )
  }
}
