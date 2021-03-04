const faunadb = require('faunadb')
const q = faunadb.query
const fetch = require("node-fetch")
const stravaApi = require('strava-v3')

const STRAVA_API = "https://www.strava.com/api/v3/activities/";

exports.handler = async function(event, context) {

    if (event.httpMethod == "POST") {
        const client = new faunadb.Client({
          secret: process.env.FAUNADB_SERVER_SECRET
        })  
        /* parse the string body into a useable JS object */
        const data = JSON.parse(event.body)
        console.log('Strava event hook received', data)
        const eventItem = {
          data: data
        }
        return client.query(q.Create(q.Ref('classes/stravaevents'), eventItem))
        .then((x) => 
          console.log("event persisted")
          client.query(q.Get(q.Ref('classes/stravaauths/291790587532673540')))
        )
        .then((response) => {
           console.log('fetched auth', response)
           const refreshToken = responses.data.refresh_token
           console.log('refresh token', refreshToken)
           const strava = new stravaApi.client("")
           return strava.oauth.refreshToken(refreshToken)
        })
        .then((response) => {
           console.log(response)
           const { access_token, refresh_token } = response
           console.log("new access token", access_token)
           client.query(q.Update('classes/stravaauths/291790587532673540', 
                                 {data: { access_token: access_token, refresh_token: refresh_token }}
                        ))
           return new stravaApi.client(access_token)
        })
        .then((strava) => {
          console.log("fetching activity", data.object_id)
          strava.activities.get(data.object_id)
        })
        .then((activity) => { 
          console.log("fetched activity", activity)
          const activityItem = { data : activity }
	  client.query(q.Create(q.Ref('classes/activities'), activityItem))
          return {
            statusCode: 200,
            body: "ok"
          }
        })
        /*
	export interface RefreshTokenResponse {
	    token_type: string;
	    access_token: string;
	    expires_at: number;
	    expires_in: number;
	    refresh_token: string;
        */       
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
