import React, { useEffect, useState} from 'react'
import api from '../utils/api'
import isLocalHost from '../utils/isLocalHost'
import { groupBy, orderBy, sumBy, maxBy, toPairs, find, partition } from 'lodash'

import { Grid, Table, TableBody, TableRow, TableCell, Typography, Avatar} from '@material-ui/core'
import { fonts } from '../theme/fonts'
import { withStyles } from '@material-ui/core/styles'
import { colors } from '../theme/colors'
import { styled } from '@material-ui/core/styles';
import theme from '../theme/themed'

const StyledLeaderboard = styled('div')({
  width: '100%',
  fontFamily: fonts.main,
})

const StyledTypography = withStyles({
  root: {
    color: colors.mizuno,
    fontFamily: fonts.main,
  },
})(Typography)

const MuiTableCell = withStyles({
  root: {
    borderBottom: "none",
  }
})(TableCell)

const TableCellNoPadding = withStyles({
  root: {
    borderBottom: "none",
    padding: 0,
  }
})(TableCell)

const StyledAvatar = withStyles({
  root: {
    height: theme.spacing(7),
    width: theme.spacing(7),
  },
})(Avatar)


export const Leaderboard: React.FC = () => {
  const targetDistance = 10
  const [athletes, setAthletes] = useState([])
  const [latestAthlete, setLatestAthlete] = useState<any>(null)
  const [activities, setActivities] = useState([])
  const [latestActivity, setLatestActivity] = useState<any>(null)
  const lazyAthletes: object[] = activities.length > 0
    ? athletes.filter((a: any) => activities.some((activity: any) => activity.data.athlete.id !== a.id)) 
    : athletes

  useEffect(() => {
    if (activities?.length > 0) {
      setLatestActivity(maxBy(activities, ((a: any) => a.data.start_date)).data)
      if (latestActivity) {
        setLatestAthlete(find(athletes, ((u: any) => u.id === latestActivity.athlete.id)))
      }
    }
  }, [activities, athletes, latestActivity, latestAthlete,])

  
  useEffect(() => {
    if (athletes === []) {
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
    }
  })

  useEffect(() => {
    if (activities === []) {
      api.readAll().then((activities) => {
        console.log('activites', activities)
        setActivities(activities.data)
      })
    }
  })

  const renderDistance = (distance: number) => {
    return ((Math.round(distance * 10) / 10).toString() + " km")
  }

  const renderLatestActivity = () => {
    if (!activities) {
      return
    }
    return (
      <>
        <h1>{latestAthlete ? `LATEST RUN: ${latestAthlete.firstname}` : 'NO ONE HAS RUN YET'}</h1>
        <>
          {latestActivity ? renderDistance(latestActivity.distance / 1000) : 'WHAT ARE YOU WAITING FOR?'}
        </>
      </>
    )
  }

  const renderPartialLeaderboardTable = (leaders: object[], offset: number) => {
    if (leaders.length > 0) {
      return leaders.map((athlete: any, index: number) => {
        const position = (index + 1 + offset).toString() + "."
        console.log(JSON.stringify(athlete))
        if (athlete) {
          return (
            <TableRow key={index}>
              <MuiTableCell><StyledTypography variant={"h4"}>{position}</StyledTypography></MuiTableCell>
              <MuiTableCell><StyledAvatar alt="profile" src={athlete.profile_medium} /></MuiTableCell>
              <MuiTableCell>
                <p>{`${athlete.firstname} ${athlete.lastname}`}</p>
                <p>{renderDistance(athlete.distance)}</p>
              </MuiTableCell>
              <MuiTableCell></MuiTableCell>
            </TableRow>
          )
        }
        return null
      })
    }
    return
  }

  const renderLazyAthletes = () => {
    if (athletes && lazyAthletes?.length > 0) {
      return lazyAthletes.map((athlete: any, index: number) => {
        return (
        <TableRow key={index}>
            <MuiTableCell><StyledTypography variant={"h4"}>&#128564;</StyledTypography></MuiTableCell>
          <MuiTableCell><StyledAvatar alt="profile" src={athlete.profile_medium} /></MuiTableCell>
          <MuiTableCell>
            <p>{`${athlete.firstname} ${athlete.lastname}`}</p>
            <p>0 km</p>
          </MuiTableCell>
          <MuiTableCell></MuiTableCell>
        </TableRow>
      )
      })
    }
    return
  }

  const calculateWeeklyLeaderboard = () => {
    const grouped = groupBy(activities, ((a: any) => a.data.athlete.id))
    const pairs = toPairs(grouped)
    const totals = pairs.map((pair: any) => {
      const athlete = find(athletes, ((u: any) => u.id == pair[0])) // eslint-disable-line
      if (athlete) {
        athlete.distance = sumBy(pair[1], ((a: any) => a.data.distance)) / 1000
      }
      return (athlete)
    })
    return orderBy(totals, ['distance'], ['desc'])
  }

  const renderWeeklyLeaderboard = () => {
    const weeklyLeaderboard = calculateWeeklyLeaderboard()
    console.log("weekly leaderboard", weeklyLeaderboard)
    const [above, below] = partition(weeklyLeaderboard, ((a: any) => a && a.distance > targetDistance))
    return (
      <>
      <h1>THIS WEEK</h1>
      <Table>
        <TableBody>
          {renderPartialLeaderboardTable(above, 0)}
          <TableRow>
            <TableCellNoPadding colSpan={3}/>
            <TableCellNoPadding>
                <StyledTypography variant={"h5"}>{targetDistance} KM TARGET</StyledTypography>
            </TableCellNoPadding>
          </TableRow>
          <TableRow>
              <TableCellNoPadding colSpan={4}><hr color={colors.mizuno} /></TableCellNoPadding>
          </TableRow>
            {renderPartialLeaderboardTable(below, above.length)}
            {renderLazyAthletes()}
        </TableBody>
      </Table>
      </>
    )
  }

  return (
    <StyledLeaderboard>
      <Grid container justify='space-around'>
        <Grid item>
          {renderWeeklyLeaderboard()}
        </Grid>
        <Grid item>
          {renderLatestActivity()}
        </Grid>
      </Grid>
    </StyledLeaderboard>
  )
}

export default Leaderboard

