/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

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
  window.location.replace("https://amazing-jang-8a41ee.netlify.app");
</script>
</html>`

exports.handler = function (event, context, callback) {
  console.log('Function `oauth-complete` invoked')
  console.log(event.queryStringParameters.code)
  console.log(event.queryStringParameters.scope)
  callback(null, {
    statusCode: 200,
    body: page,
  });
};
