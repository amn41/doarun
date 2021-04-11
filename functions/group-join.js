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
  .then((user) => {
    return Promise.all([
      user, 
      client.query(
        q.Select(
          ["data", "members"],
          q.Get(q.Ref(q.Collection("groups"), groupId))
        )
      )
    ])
  }).then(([user, members]) => {
     const ids = members.map((m) => m.id)     
     if (ids.includes(user.ref.id)) {
       return Promise.resolve(null)
     } else {
       const newMembers = [user.ref].concat(members)
       return client.query(
         q.Update(
           q.Ref(q.Collection("groups"), groupId),
           {
             data: { 
               members: newMembers
             }
           }
         )     
       )
     }
  }).then(() => { 
    return {
      statusCode: 200,
      body: "ok"
    }
  }).catch((error) => {
     console.log('error', error)
     return {
       statusCode: 400,
       body: JSON.stringify(error)
     }
  })
}
