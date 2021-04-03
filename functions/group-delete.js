/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query
const getUser = require('./utils/getUser')

exports.handler = (event, context) => {
  const groupId = event.queryStringParameters.groupId
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return getUser(context)
  .then(() => client.query(
    q.Delete(
      q.Ref(q.Collection("groups"), groupId)
    )
  )).catch((error) => {
     console.log('error', error)
     return {
       statusCode: 400,
       body: JSON.stringify(error)
     }
  })
}
