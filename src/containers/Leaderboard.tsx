import React, { Fragment, useEffect, useState} from 'react'
import api from '../utils/api'
import isLocalHost from '../utils/isLocalHost'

import { groupBy, orderBy, sumBy, maxBy, toPairs, find, partition } from 'lodash'
import { fonts } from '../theme/fonts'
import { withStyles } from '@material-ui/core/styles'

const StyledLeaderboard = withStyles({
  root: {
    width: '100%',
    fontFamily: fonts.main,
  },
})(Fragment)


export const Leaderboard: React.FC = () => {
  const targetDistance = 10
  const [athletes, setAthletes] = useState([])
  const [latestAthlete, setLatestAthlete] = useState<any>(null)
  const [activities, setActivities] = useState([])
  const [latestActivity, setLatestActivity] = useState<any>(null)

  useEffect(() => {
    if (activities?.length > 0) {
      setLatestActivity(maxBy(activities, ((a: any) => a.data.start_date)).data)
      if (latestActivity) {
        setLatestAthlete(find(athletes, ((u: any) => u.id === latestActivity.athlete.id)))
      }
    }
  }, [activities, athletes, latestActivity, latestAthlete,])

  useEffect(() => {
    api.readAllAthletes().then((athletes) => {
      if (athletes.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not authorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not authorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }
      setAthletes(athletes)
    })
    api.readAll().then((activities) => {
      console.log('activites', activities)
      setActivities(activities.data)
    })
  })

  const renderDistance = (distance: number) => {
    return ((Math.round(distance * 10) / 10).toString() + " km")
  }

  const renderLatestActivity = () => {
    if (!activities) {
      return null
    }
    return (
      <div>
        <h1>{latestAthlete ? `LATEST RUN: ${latestAthlete.firstname}` : 'NO ONE HAS RUN YET'}</h1>
        <div>
          {latestActivity ? renderDistance(latestActivity?.distance / 1000) : "WHAT ARE YOU WAITING FOR?"}
        </div>
      </div>
    )
  }

  const renderPartialLeaderboardTable = (leaders: object[], offset: number) => {
    if (leaders.length > 0) {
      return leaders.map((athlete: any, index: number) => {
        const position = (index + 1 + offset).toString() + "."
        console.log(JSON.stringify(athlete))
        return (
          <tr key={index}>
            <td>{position}</td>
            <td><img alt="profile" src={athlete.profile_medium} /></td>
            <td>
              <p>{`${athlete.firstname} ${athlete.lastname}`}</p>
              <p>{renderDistance(athlete.distance)}</p>
            </td>
            <td></td>
          </tr>
        )
      })
    }
    return
  }

  const renderPaceMaker = () => {
    return (
      <tr>
        <td>
          <h1>
            <span>{targetDistance} KM TARGET </span>
          </h1>
        </td>
      </tr>
    )
  }

  const calculateWeeklyLeaderboard = () => {
    const grouped = groupBy(activities, ((a: any) => a.data.athlete.id))
    console.log("grouped", grouped)
    const pairs = toPairs(grouped)
    console.log("pairs", pairs)
    const totals = pairs.map((pair: any) => {
      const athlete = find(athletes, ((u: any) => u.id == pair[0])) // eslint-disable-line
      if (athlete !== null) {
        athlete.distance = sumBy(pair[1], ((a: any) => a.data.distance)) / 1000
      }
      return (athlete)
    })
    return orderBy(totals, ['distance'], ['desc'])
  }

  const renderWeeklyLeaderboard = () => {
    const weeklyLeaderboard = calculateWeeklyLeaderboard()
    const [above, below] = partition(weeklyLeaderboard, ((a: any) => a.distance > targetDistance))
    return (
      <table id='weekly-leaderboard'>
        <tbody>
          {renderPartialLeaderboardTable(above, 0)}
          {renderPaceMaker()}
          <tr>
            <td colSpan={4}><hr/></td>
          </tr>
          {renderPartialLeaderboardTable(below, above.length)}
        </tbody>
      </table>
    )
  }

  return (
    <StyledLeaderboard>
      <h1>THIS WEEK</h1>
      {renderWeeklyLeaderboard()}
      {renderLatestActivity()}
    </StyledLeaderboard>
  )
}

export default Leaderboard

