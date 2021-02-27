const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async function(event, context) {

    if (event.httpMethod == "POST") {
        const client = new faunadb.Client({
          secret: process.env.FAUNADB_SERVER_SECRET
        })  
        /* parse the string body into a useable JS object */
        const data = JSON.parse(event.body)
        console.log('Strava event hook received', data)
        const todoItem = {
          data: data
        }
        /* construct the fauna query */
        return client.query(q.Create(q.Ref('classes/events'), todoItem))
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
