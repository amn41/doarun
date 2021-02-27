/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `activities-read-all` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_activities'))))
    .then((response) => {
      const activityRefs = response.data
      console.log('Activity refs', activityRefs)
      console.log(`${activityRefs.length} activitys found`)
      // create new query out of activity refs. http://bit.ly/2LG3MLg
      const getAllActivityDataQuery = activityRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllActivityDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
