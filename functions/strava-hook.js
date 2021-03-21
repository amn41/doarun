const faunadb = require('faunadb')
const q = faunadb.query
const fetch = require("node-fetch")
const stravaApi = require('strava-v3')

const STRAVA_API = "https://www.strava.com/api/v3/activities/";

function fetchActivity(client, eventData) {
    if ( eventData.aspect_type != 'create' ) {
      console.log("not a creation invent, aspect_type: ", eventData.aspect_type)
      return {
        statusCode: 200,
        body: "ok"
      }
    }
    const athlete = eventData.owner_id
    console.log("new activity created, fetching")
    return client.query(q.Get(q.Match(q.Index('auths_by_athlete'), athlete)))
    .then((response) => {
       console.log('fetched auth', response)
       const refreshToken = response.data.refresh_token
       console.log('refresh token', refreshToken)
       //const strava = new stravaApi.client("")
       return stravaApi.oauth.refreshToken(refreshToken)
    })
    .then((response) => {
       console.log(response)
       const { access_token, refresh_token } = response
       console.log("new access token", access_token)
       client.query(q.Update(
                      q.Select(['ref'], q.Get(q.Match(q.Index('auths_by_athlete'), athlete))), 
                      {data: { access_token: access_token, refresh_token: refresh_token }}
                    ))
       return new stravaApi.client(access_token)
    })
    .then((strava) => {
      console.log("fetching activity", eventData.object_id)
      return strava.activities.get({id: eventData.object_id})
    })
    .then((activity) => { 
      console.log("fetched activity", activity)
      if (activity.type !== "Run") {
        console.log("activity was not a run! ignoring activity of type: ", activity.type)
        return Promise.resolve(null)
      } else {
        const activityItem = { data : activity }
        return client.query(q.Create(q.Ref('classes/activities'), activityItem))
      }
    }).then(() => {
      return {
        statusCode: 200,
        body: "ok"
      }
    })
}

exports.handler = async function(event, context) {

    if (event.httpMethod == "POST") {
        const client = new faunadb.Client({
          secret: process.env.FAUNADB_SERVER_SECRET
        })  
        const data = JSON.parse(event.body)
        console.log('Strava event hook received', data)
        const eventItem = {
          data: data
        }
        return client.query(q.Create(q.Ref('classes/stravaevents'), eventItem))
        .then(() => fetchActivity(client, data))
        .catch((error) => {
           console.log('error', error)
           return {
             statusCode: 200,
             body: "ok"
           }
        })
    } else {
    	return {
    	    statusCode: 200,
    	    body: JSON.stringify({"hub.challenge":event.queryStringParameters["hub.challenge"]})
      };
    }	
}
