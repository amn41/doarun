import React, { Component } from 'react'
import AppHeader from './components/AppHeader'
import api from './utils/api'
import './App.css'
import { groupBy, sumBy, toPairs } from 'lodash';

export default class Leaderboard extends Component {
  state = {
      latestActivity: {
        "athlete": "Alan Nichol",
        "distance": 1000,
        "id": 4861036852,
        "start_date": "2021-02-27T18:50:00Z",
        "start_date_local": "2021-02-27T18:50:00Z",
      },
      athletes: {
        "296399" : "Alan Nichol",
        "0": "Brian Daly",
      },
      activities: []
  }
  componentDidMount() {
    // Fetch data
    /*
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
    })*/
    api.readAll().then((activities) => {
      console.log('activites', activities)
      this.setState({
        activities: activities
      })
    })
  }
  renderDistance(distance) {
    return ((distance).toString() + " km")
  }
  renderLatestActivity() {
    const { latestActivity } = this.state
    if (!latestActivity) {
      // Loading State here
      return null
    }
      return (
      <div>
         {this.renderDistance(latestActivity.distance/1000)}
      </div>
      )
  }
  renderPartialLeaderboardTable(athletes, offset) {

    if (!athletes || !athletes.length) {
      // Loading State here
      return null
    }

      return athletes.map((athlete, index) => {
	  const position = (index + 1 + offset).toString() + "."
       
       return (
         <tr key={index}>
            <td><span className="position">{position}</span></td>
            <td><img alt="profile" className="avatar" src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/296399/461322/2/medium.jpg"/></td>
            <td>
	       <p className="athlete-name">{athlete.name}</p>
	       <p className="athlete-distance">{this.renderDistance(athlete.distance)}</p>
            </td>
            <td></td>
         </tr>
       )
    })
  }
  renderPaceMaker() {
      const { targetDistance } = this.state
      return (	
         <tr className="target-text-row">
            <td></td>
            <td></td>
            <td></td>
            <td>
              <h1 className="target-text">
                <span className="target-distance">{targetDistance} KM TARGET </span>
              </h1>
            </td>
         </tr>  
      )
  }
  calculateWeeklyLeaderboard() {
    const { activities, athletes } = this.state
    const grouped = groupBy(activities,((a) => a.data.athlete.id))
    const pairs = toPairs(grouped)
    const totals = pairs.map(pair => { 
                     return  { 
                       "name": athletes[pair[0]],
                       "distance": sumBy(pair[1], ((a) => a.data.distance )) / 1000
                     }})
    return totals
  }
  renderWeeklyLeaderboard() {
    const weeklyLeaderboard = this.calculateWeeklyLeaderboard()
    return (
      <table id='weekly-leaderboard'>
        <tbody>
          {this.renderPartialLeaderboardTable(weeklyLeaderboard.slice(0,1),0)}
  	  {this.renderPaceMaker()}
          <tr className="pacemaker-row">
            <td colSpan="4"><hr className="pacemaker-line"/></td>
          </tr>
          {this.renderPartialLeaderboardTable(weeklyLeaderboard.slice(2,10),2)}
        </tbody>
      </table>
    )
  }	
  render() {
    return (
      <div className='app'>
	<div className='container'>    
	  <div className="item weekly-leaderboard-section">
	    <h1 className='weekly-leaderboard-title'>THIS WEEK</h1> 
            <div className='leaderboard-list'>
              {this.renderWeeklyLeaderboard()}
            </div>
          </div>
          <div className="item latest-run-section">
            <h1 className='leaderboard-title'>LATEST RUN: BRIAN</h1> 
            <div className='activity-list'>
              {this.renderLatestActivity()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

