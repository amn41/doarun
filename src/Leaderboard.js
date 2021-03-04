import React, { Component } from 'react'
import AppHeader from './components/AppHeader'
import api from './utils/api'
import './App.css'
import { groupBy, map, sumBy, toPairs } from 'lodash';

export default class Leaderboard extends Component {
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
      }],
      activities: [
         {
           "ref": {
             "@ref": {
               "id": "291705383749157382",
               "collection": {
                 "@ref": {
                   "id": "activities",
                   "collection": {
                     "@ref": {
                       "id": "collections"
                     }
                   }
                 }
               }
             }
           },
           "ts": 1614450782515000,
           "data": {
             "resource_state": 3,
             "athlete": {
               "id": 296399,
               "resource_state": 1
             },
             "name": "test5",
             "distance": 1000,
             "moving_time": 240,
             "elapsed_time": 240,
             "total_elevation_gain": 0,
             "type": "Run",
             "id": 4860748329,
             "start_date": "2021-02-27T17:50:00Z",
             "start_date_local": "2021-02-27T17:50:00Z",
             "timezone": "(GMT+00:00) Europe/London",
             "utc_offset": 0,
             "location_country": "United Kingdom",
             "achievement_count": 0,
             "kudos_count": 0,
             "comment_count": 0,
             "athlete_count": 1,
             "photo_count": 0,
             "map": {
               "id": "a4860748329",
               "resource_state": 3
             },
             "trainer": false,
             "commute": false,
             "manual": true,
             "private": false,
             "visibility": "everyone",
             "flagged": false,
             "average_speed": 4.167,
             "max_speed": 0,
             "has_heartrate": false,
             "heartrate_opt_out": false,
             "display_hide_heartrate_option": false,
             "pr_count": 0,
             "total_photo_count": 0,
             "has_kudoed": false,
             "description": "",
             "calories": 87.2,
             "segment_efforts": [],
             "best_efforts": [],
             "photos": {
               "count": 0
             },
             "embed_token": "e77761060416f2378e3183b30ea8fa282bdc767d",
             "similar_activities": {
               "effort_count": 0,
               "average_speed": 0,
               "min_average_speed": 0,
               "mid_average_speed": 0,
               "max_average_speed": 0,
               "trend": {
                 "speeds": [],
                 "min_speed": 0,
                 "mid_speed": 0,
                 "max_speed": 0,
                 "direction": 0
               },
               "resource_state": 2
             },
             "available_zones": [
               "pace"
             ]
           }
         },
         {
           "ref": {
             "@ref": {
               "id": "291707100238709251",
               "collection": {
                 "@ref": {
                   "id": "activities",
                   "collection": {
                     "@ref": {
                       "id": "collections"
                     }
                   }
                 }
               }
             }
           },
           "ts": 1614452419450000,
           "data": {
             "resource_state": 3,
             "athlete": {
               "id": 296399,
               "resource_state": 1
             },
             "name": "test6",
             "distance": 1000,
             "moving_time": 3600,
             "elapsed_time": 3600,
             "total_elevation_gain": 0,
             "type": "Run",
             "id": 4861036852,
             "start_date": "2021-02-27T18:50:00Z",
             "start_date_local": "2021-02-27T18:50:00Z",
             "timezone": "(GMT+00:00) Europe/London",
             "utc_offset": 0,
             "location_country": "United Kingdom",
             "achievement_count": 0,
             "kudos_count": 0,
             "comment_count": 0,
             "athlete_count": 1,
             "photo_count": 0,
             "map": {
               "id": "a4861036852",
               "resource_state": 3
             },
             "trainer": false,
             "commute": false,
             "manual": true,
             "private": false,
             "visibility": "everyone",
             "flagged": false,
             "average_speed": 0.278,
             "max_speed": 0,
             "has_heartrate": false,
             "heartrate_opt_out": false,
             "display_hide_heartrate_option": false,
             "pr_count": 0,
             "total_photo_count": 0,
             "has_kudoed": false,
             "description": "",
             "calories": 87.2,
             "segment_efforts": [],
             "best_efforts": [],
             "photos": {
               "count": 0
             },
             "embed_token": "96fb38acea0eead87be66a1bd359a689b1cf891f",
             "similar_activities": {
               "effort_count": 0,
               "average_speed": 0,
               "min_average_speed": 0,
               "mid_average_speed": 0,
               "max_average_speed": 0,
               "trend": {
                 "speeds": [],
                 "min_speed": 0,
                 "mid_speed": 0,
                 "max_speed": 0,
                 "direction": 0
               },
               "resource_state": 2
             },
             "available_zones": [
               "pace"
             ]
           }
         }
       ]
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
    })
    api.readAll().then((activities) => {
      console.log('activites', activities)
      this.setState({
        activities: activities
      })
    )}*/
    api.readAll().then((result) => {
      console.log(result)
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
    const { activities } = this.state
    const grouped = groupBy(activities,((a) => a.data.athlete.id))
    const pairs = toPairs(grouped)
    const totals = pairs.map(pair => { 
                     return  { 
                       "name": pair[0], 
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
        <AppHeader />
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

