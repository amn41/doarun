import React, { useEffect, useState} from 'react'
import api from '../utils/api'
import isLocalHost from '../utils/isLocalHost'
import { groupBy, orderBy, sumBy, maxBy, toPairs, find, partition, reject } from 'lodash'

import { Grid, Table, TableBody, TableRow, TableCell, Typography, Avatar, Paper} from '@material-ui/core'
import { fonts } from '../theme/fonts'
import { withStyles } from '@material-ui/core/styles'
import { colors } from '../theme/colors'
import { styled } from '@material-ui/core/styles';
import theme from '../theme/themed'

const StyledLeaderboard = styled('div')({
  width: '100%',
  fontFamily: fonts.main,
})

const StyledGrid = withStyles({
  root: {
    margin: '0 1rem',
  },
})(Grid)

const StyledTarget = withStyles({
  root: {
    fontSize: '1em',
  },
})(Typography)

const StyledTypography = withStyles({
  root: {
    fontSize: '1.5em',
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

const StyledMap = withStyles({
  root: {
    width: '100%',
  },
})(Paper)


export const Leaderboard: React.FC = () => {
  const targetDistance = 10
  const [athletes, setAthletes] = useState([])
  const [latestAthlete, setLatestAthlete] = useState<any>(null)
  const [activities, setActivities] = useState([])
  const [latestActivity, setLatestActivity] = useState<any>(null)
  const lazyAthletes: object[] = activities.length > 0 ?
    reject(athletes, (a: any) => find(activities, ((act: any) => a.id === act.data.athlete.id))) :
    athletes

  useEffect(() => {
    if (activities?.length > 0) {
      setLatestActivity(maxBy(activities, ((a: any) => a.data.start_date)).data)
      if (latestActivity) {
        setLatestAthlete(find(athletes, ((u: any) => u.id === latestActivity.athlete.id)))
      }
    }
  }, [activities, athletes, latestActivity, latestAthlete,])

  
  useEffect(() => {
    if (athletes.length === 0) {
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
  }, [athletes])

  useEffect(() => {
    if (activities.length === 0 && lazyAthletes?.length === 0) {
      api.readAll().then((activities) => {
        setActivities(activities.data)
      })
    }
  }, [activities, lazyAthletes])

  const renderDistance = (distance: number) => {
    return ((Math.round(distance * 10) / 10).toString() + " km")
  }

  const renderLatestActivity = () => {
    if (!activities) {
      return
    }
    if (! (latestActivity && latestAthlete) ) {
      return (
      	<>
      	  <Typography variant="h1">{'NO ONE HAS RUN YET'}</Typography>
          <StyledTypography variant="h1">{'WHAT ARE YOU WAITING FOR?'}</StyledTypography>
      	</>
      )
    }
    const polyline = latestActivity.map.polyline.setOptions({ strokeColor: colors.puma })
    const key = "AIzaSyCfT_9slhBvAyhomLgFk4OGiiZFvUaAYrs"
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?path=enc:${polyline}&key=${key}&size=600x300`
    return (
      <>
        <Typography variant="h1">{`LATEST RUN: ${latestAthlete.firstname} put in ${renderDistance(latestActivity.distance / 1000)}`}</Typography>
        <StyledMap elevation={0}><img alt="map of latest run" src={mapUrl} /></StyledMap>
      </>
    )
  }

  const renderPartialLeaderboardTable = (leaders: object[], offset: number) => {
    if (leaders.length > 0) {
      return leaders.map((athlete: any, index: number) => {
        const position = (index + 1 + offset).toString() + "."
        if (athlete) {
          return (
            <TableRow key={index}>
              <MuiTableCell><Typography variant={"h4"}>{position}</Typography></MuiTableCell>
              <MuiTableCell><StyledAvatar alt="profile" src={athlete.profile_medium} /></MuiTableCell>
              <MuiTableCell>
                <Typography variant={"body2"}>{`${athlete.firstname} ${athlete.lastname}`}</Typography>
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
            <MuiTableCell><Typography variant={"h4"}>&#128564;</Typography></MuiTableCell>
          <MuiTableCell><StyledAvatar alt="profile" src={athlete.profile_medium} /></MuiTableCell>
          <MuiTableCell>
              <Typography variant={"body2"}>{`${athlete.firstname} ${athlete.lastname}`}</Typography>
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
    const [above, below] = partition(weeklyLeaderboard, ((a: any) => a && a.distance > targetDistance))
    return (
      <>
        <Typography variant="h1">THIS WEEK</Typography>
      <Table>
        <TableBody>
          {renderPartialLeaderboardTable(above, 0)}
          <TableRow>
            <TableCellNoPadding align='right'>
              <StyledTarget noWrap variant={"h4"}>{targetDistance} KM TARGET</StyledTarget>
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
        <StyledGrid item>
          {renderWeeklyLeaderboard()}
        </StyledGrid>
        <StyledGrid item>
          {renderLatestActivity()}
        </StyledGrid>
      </Grid>
    </StyledLeaderboard>
  )
}

export default Leaderboard

