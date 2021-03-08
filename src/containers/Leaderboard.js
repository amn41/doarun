import React, { Component } from 'react'
import api from '../utils/api'
import isLocalHost from '../utils/isLocalHost'

import { groupBy, orderBy, sumBy, maxBy, toPairs, find, partition } from 'lodash';


export default class Leaderboard extends Component {
  state = {
      athletes: [],
      targetDistance: 10,
      activities: []
  }
  componentDidMount() {
    api.readAllAthletes().then((athletes) => {
      if (athletes.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not authorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not authorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }
      this.setState({
        athletes: athletes
      })
    })
    api.readAll().then((activities) => {
      console.log('activites', activities)
      this.setState({
        activities: activities.data
      })
    })
  }
  renderDistance(distance) {
    return ((Math.round(distance * 10) / 10).toString() + " km")
  }
  renderLatestActivity() {
    const { activities, athletes } = this.state
    if (!activities || !activities.length) {
      return (
      <div>
        <h1 className='leaderboard-title'>NO ONE HAS RUN YET</h1> 
        <div className='latest-activity-placeholder'>
         WHAT ARE YOU WAITING FOR?
        </div>
      </div>
      )
    }
    const latest = maxBy(activities, ((a) => a.data.start_date))
    const athlete = find(athletes, ((u) => u.id == latest.data.athlete.id)) // eslint-disable-line
    const title = `LATEST RUN: ${athlete.firstname}`
      return (
      <div>
        <h1 className='leaderboard-title'>{title}</h1> 
        <div className='latest-activity'>
         {this.renderDistance(latest.data.distance/1000)}
        </div>
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
          console.log(JSON.stringify(athlete))
       return (
         <tr key={index}>
            <td><span className="position">{position}</span></td>
            <td><img alt="profile" className="avatar" src={athlete.profile_medium}/></td>
            <td>
	       <p className="athlete-name">{`${athlete.firstname} ${athlete.lastname}`}</p>
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
    console.log("grouped", grouped)
    const pairs = toPairs(grouped)
    console.log("pairs", pairs)
    const totals = pairs.map(pair => { 
                     const athlete = find(athletes, ((u) => u.id == pair[0])) // eslint-disable-line
                     if ( athlete != null ) {
                       athlete.distance = sumBy(pair[1], ((a) => a.data.distance )) / 1000
                     }
                     return (athlete)
                   })
    return orderBy(totals, ['distance'], ['desc'])
  }
  renderWeeklyLeaderboard() {
    const { targetDistance } = this.state
    const weeklyLeaderboard = this.calculateWeeklyLeaderboard()
    const [above, below] = partition(weeklyLeaderboard, ((a) => a.distance > targetDistance))
    return (
      <table id='weekly-leaderboard'>
        <tbody>
          {this.renderPartialLeaderboardTable(above,0)}
  	  {this.renderPaceMaker()}
          <tr className="pacemaker-row">
            <td colSpan="4"><hr className="pacemaker-line"/></td>
          </tr>
          {this.renderPartialLeaderboardTable(below,above.length)}
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
            {this.renderLatestActivity()}
          </div>
        </div>
      </div>
    )
  }
}

