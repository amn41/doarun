const faunadb = require('faunadb')
const q = faunadb.query
const getUser = require('./utils/getUser')

exports.handler = (event, context) => {
  const {identity, user} = context.clientContext;
  const data = { "identity": identity, "user": user }  
  return getUser(context).then((ret) => {
    data.strava = ret
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  })
}
