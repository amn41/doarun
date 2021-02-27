const faunadb = require('faunadb')
const q = faunadb.query
const fetch = require("node-fetch")

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
        /* construct the fauna query */
	const url = STRAVA_API + eventItem.data.object_id;
	const tokenHeader = 'Bearer ' + process.env.STRAVA_TOKEN;
        return fetch(url, {headers : { 'Authorization': tokenHeader }})
           .then((response) => response.json())
           .then((activity) => {
   	        console.log('fetched activity', activity)	
	       if (eventItem.data.aspect_type === "create") {
		   const activityItem = { data : activity }
	  	      client.query(q.Create(q.Ref('classes/activities'), activityItem))
                }})
          .then(() => client.query(q.Create(q.Ref('classes/stravaevents'), eventItem)))
          .then((response) => {
            console.log('success', response)
            /* Success! return the response with statusCode 200 */
            return {
              statusCode: 200,
              body: JSON.stringify(response)
            }
          }).catch((error) => {
            console.log('error', error)
            /* Error! return the error with statusCode 400 */
            return {
              statusCode: 400,
              body: JSON.stringify(error)
            }
          }) 	
    } else {
    	return {
    	    statusCode: 200,
    	    body: JSON.stringify({"hub.challenge":event.queryStringParameters["hub.challenge"]})
      };
    }	
}
