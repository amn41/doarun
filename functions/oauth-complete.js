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
  const code = event.queryStringParameters.code
  //console.log(event.queryStringParameters.scope)
  stravaApi.oauth.getToken(code)
  .then((response) =>  {
    console.log("got response from requesting token")
    console.log(response.status)
    data = response.json()
    console.log(JSON.stringify(data))
    //strava = new stravaApi.client(access_token);
    //const payload = await strava.athlete.get({})
    return {
      statusCode: 200,
      body: page,
    } 
  });
};
