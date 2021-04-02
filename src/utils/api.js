/* Api methods to call /functions */

const readActivities = (groupId) => {
  return fetch(`/.netlify/functions/activities-read-group?groupId=${groupId}`).then((response) => {
    return response.json()
  })
}

const readAthletes = (groupId) => {
  return fetch(`/.netlify/functions/athletes-read-group?groupId=${groupId}`).then((response) => {
    return response.json()
  })
}

const readProfile = (token) => {
  const header = { Authorization: `Bearer ${token}` }
  return fetch('/.netlify/functions/profile-read', {headers: header}).then((response) => {
    return response.json()
  })
}

const readGroups = (token) => {
  const header = { Authorization: `Bearer ${token}` }
  return fetch('/.netlify/functions/groups-read', {headers: header}).then((response) => {
    return response.json()
  })
}


export default {
  readActivities: readActivities,
  readAthletes: readAthletes,
  readProfile: readProfile,
  readGroups: readGroups
}
