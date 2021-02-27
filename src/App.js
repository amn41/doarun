import React, { Component } from 'react'
import AppHeader from './components/AppHeader'
import api from './utils/api'
import isLocalHost from './utils/isLocalHost'
import './App.css'

export default class App extends Component {
  state = {
      latestActivity: {
        "athlete": "Alan Nichol",
        "distance": 1000,
        "id": 4861036852,
        "start_date": "2021-02-27T18:50:00Z",
        "start_date_local": "2021-02-27T18:50:00Z",
      },
      weeklyLeaderboard: [{
	"name": "Alan Nichol",
	"distance": 15.6,
	"city": "Berlin"
      }, {
	"name": "Brian Daly",
	"distance": 12.8,
	"city": "Berlin"
      }, {
	"name": "Suzi B",
	"distance": 11.5,
	"city": "Berlin"
      }]  
  }
  componentDidMount() {

    // Fetch data
    api.readLatestActivity().then((latestActivity) => {
      if (latestActivity.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not authorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not authorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }

      console.log('latest activity', latestActivity)
      this.setState({
        latestActivity: latestActivity
      })
    })
    api.readWeeklyLeaderboard().then((leaderboard) => {
      console.log('weeklyleaderboard', leaderboard)
      this.setState({
        weeklyLeaderboard: leaderboard
      })
    })
  }
  renderLatestActivity() {
    const { latestActivity } = this.state

    if (!latestActivity) {
      // Loading State here
      return null
    }
      return (
      <div>
        latestActivity.distance
      </div>
      )
  }
  renderWeeklyLeaderboardTable() {
    const { weeklyLeaderboard } = this.state

    if (!weeklyLeaderboard || !weeklyLeaderboard.length) {
      // Loading State here
      return null
    }

      return weeklyLeaderboard.map((athlete, index) => {
       const position = (index + 1).toString() + "."
       return (
         <tr key={index}>
            <td><span className="position">{position}</span></td>
            <td>{athlete.name}</td>
            <td>{athlete.distance}</td>
            <td>{athlete.city}</td>
         </tr>
       )
    })
  }	  
  renderWeeklyLeaderboard() {
    return (
      <table id='weekly-leaderboard'>
        <tbody>
          {this.renderWeeklyLeaderboardTable()}
        </tbody>
      </table>
    )
  }	
  render() {
    return (
      <div className='app'>
        <AppHeader />
	<div>
	  <h1 classname='weekly-leaderboard-title'>THIS WEEK</h1> 
          <div className='leaderboard-list'>
            {this.renderWeeklyLeaderboard()}
          </div>
        </div>
        <div>
          <h1 classname='leaderboard-title'>LATEST RUN: BRIAN</h1> 
          <div className='activity-list'>
            {this.renderLatestActivity()}
          </div>
        </div>
      </div>
    )
  }
}

