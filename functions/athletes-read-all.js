/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `athletes-read-all` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_auths'))))
    .then((response) => {
      const authRefs = response.data
      console.log('Authrefs', authRefs)
      console.log(`${authRefs.length} auths found`)
      // create new query out of athlete refs. http://bit.ly/2LG3MLg
      const getAllAthleteDataQuery = authRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllAthleteDataQuery).then((ret) => {
        const athletes = ret.map((a) => { return {
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
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
