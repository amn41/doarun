/* Api methods to call /functions */

const readAll = () => {
  return fetch('/.netlify/functions/activities-read-all').then((response) => {
    return response.json()
  })
}

const readAllAthletes = () => {
  return fetch('/.netlify/functions/athletes-read-all').then((response) => {
    return response.json()
  })
}

const readLatestActivity = () => {
  return fetch('/.netlify/functions/activities-read-latest').then((response) => {
    return response.json()
  })
}

const readLeaderboard = () => {
  return fetch('/.netlify/functions/leaderboard-read').then((response) => {
    return response.json()
  })
}    

const readWeeklyLeaderboard = () => {
  return fetch('/.netlify/functions/weekly-leaderboard-read').then((response) => {
    return response.json()
  })
}    

const readProfile = (token) => {
  const header = { Authorization: `Bearer ${token}` }
  return fetch('/.netlify/functions/profile-read', {headers: header}).then((response) => {
    return response.json()
  })
}


export default {
  readAll: readAll,
  readAllAthletes: readAllAthletes,
  readLatestActivity: readLatestActivity,
  readLeaderboard: readLeaderboard,
  readWeeklyLeaderboard: readWeeklyLeaderboard,
  readProfile: readProfile
}
