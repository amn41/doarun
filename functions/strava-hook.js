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
        client.query(q.Create(q.Ref('classes/stravaevents'), eventItem))
        strava = new stravaApi.client("")
        strava.activities.get(data.object_id)
        .then((activity) => { 
           console.log("fetched activity", activity)
           return {
             statusCode: 200,
             body: "ok"
           }
        })
          /* 		   
          const activityItem = { data : activity }
	  client.query(q.Create(q.Ref('classes/activities'), activityItem)) */
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
