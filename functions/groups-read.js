/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query
const getUser = require('./utils/getUser')

exports.handler = (event, context) => {

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })
  
  return getUser(context)
  .then((user) => {
     console.log("looking for groups for user: ", JSON.stringify(user))
     return client.query(
       q.Map(
         q.Paginate(
           q.Match(
             q.Index("groups_by_user"),
             user.ref
           )
         ),
         q.Lambda('groupRef', q.Get(q.Var('groupRef')))
       )
     )
   }).then((response) => {
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        }
   }).catch((error) => {
     console.log('error', error)
     return {
       statusCode: 400,
       body: JSON.stringify(error)
     }
   })
}
