/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query
const stravaApi = require('strava-v3')

const page = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DOARUN</title>
</head>
<body>
  <h3>authentication successful</h3>
</body>
<script type="text/javascript">
  //window.location.replace("https://amazing-jang-8a41ee.netlify.app");
</script>
</html>`

exports.handler = function (event, context) {
  console.log('Function `oauth-complete` invoked')
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })  
  const code = event.queryStringParameters.code
  //console.log(event.queryStringParameters.scope)
  stravaApi.config({"client_id": process.env.STRAVA_CLIENT_ID, "client_secret": process.env.STRAVA_CLIENT_SECRET})
  return stravaApi.oauth.getToken(code)
  .then((payload) =>  {
    console.log("got response from requesting token")
    console.log(payload)
    console.log(JSON.stringify(payload))
    return ( 
      client.query(q.Create(q.Ref('classes/stravaauths'), payload)))
    )
  })
  .then(() => {
    //strava = new stravaApi.client(access_token);
    //const payload = await strava.athlete.get({})
    return {
      statusCode: 200,
      body: page,
    } 
  }).catch((error) => {
      console.log('error', error)
      /* Error! return the error with statusCode 400 */
    return {
      statusCode: 200,
      body: page,
    } 
  })
};
