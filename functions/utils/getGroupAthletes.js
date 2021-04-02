const faunadb = require('faunadb')
const q = faunadb.query

module.exports = function getGroupAthletes(context, groupId) { 
  const {identity, user} = context.clientContext;
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(
    q.Map(
      q.Select(["data", "members"], q.Get(q.Ref(q.Collection("groups"), groupId))),
      q.Lambda('x', q.Select(["data", "athlete", "id"], q.Get(q.Var('x'))))
    )
  )
}
