const faunadb = require('faunadb')
const q = faunadb.query

module.exports = function getUser(context) { 
  const {identity, user} = context.clientContext;
  const email = user.email
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(
    q.Get(q.Match(
      q.Index('auths_by_email'), user.email
    ))
  )
}
