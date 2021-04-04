/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  const groupId = event.queryStringParameters.groupId
  console.log('Function `athletes-read-group` invoked with group id',groupId)
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(
    q.Map(
      q.Select(["data", "members"], q.Get(q.Ref(q.Collection("groups"), groupId))),
      q.Lambda('x', q.Get(q.Var('x')))
    )
  ).then((rawAthletes) => {
     const athletes = rawAthletes.map((a) => { return {
           username: a.data.athlete.username,
           id: a.data.athlete.id,
           firstname: a.data.athlete.firstname,
           lastname: a.data.athlete.lastname,
           profile: a.data.athlete.profile,
           profile_medium: a.data.athlete.profile_medium
     }})
     return {
       statusCode: 200,
       body: JSON.stringify(athletes)
     }
  }).catch((error) => {
     console.log('error', error)
     return {
       statusCode: 400,
       body: JSON.stringify(error)
     }
  })
}
