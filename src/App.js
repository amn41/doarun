import React, { Component } from 'react'
import api from './utils/api'
import isLocalHost from './utils/isLocalHost'
import './App.css'

export default class App extends Component {
  state = {
    activities: []
  }
  componentDidMount() {

    // Fetch all activities
    api.readAll().then((activities) => {
      if (activities.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }

      console.log('all activities', activities)
      this.setState({
        activities: activities
      })
    })
  }
  renderActivities() {
    const { activities } = this.state

    if (!activities || !activities.length) {
      // Loading State here
      return null
    }

    return activities.map((activity, i) => {
      const { data, ref } = activity
      const id = getActivityId(activity)
      return (
        <div key={i} className='activity-item'>
          <label className="activity">
            <div className='activity-list-title'>
	      {data.name}
            </div>
          </label>
        </div>
      )
    })
  }
  render() {
    return (
      <div className='app'>
        <div className='activity-list'>
          {this.renderActivities()}
        </div>
      </div>
    )
  }
}


function getActibityId(activity) {
  if (!activity.ref) {
    return null
  }
  return activity.ref['@ref'].id
}
