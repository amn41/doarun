const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = (event, context) => {
  const {identity, user} = context.clientContext;
  const data = { "identity": identity, "user": user }  
  console.log("identity", identity)
  console.log("user", user)
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(
    q.Paginate(q.Match(
      q.Ref('indexes/auths_by_email')
    ))
  ).then((ret) => {
    data.strava = ret
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    } 
  })
}
