/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query
const formatISO = require('date-fns/formatISO')
const startOfWeek = require('date-fns/startOfWeek')


exports.handler = (event, context) => {
  console.log('Function `activities-read-all` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  const startTime = formatISO(startOfWeek(new Date(), {weekStartsOn: 1}))
  return client.query(
      q.Map(
        q.Filter(
          q.Paginate(q.Match(q.Index("all_activities_by_time"))),
          q.Lambda(
            ["date", "ref"],
            q.GTE(
              q.ToTime( q.Select(["data", "start_date"], q.Get(q.Var("ref")))),
              q.Time(startTime)
            )
          )
        ),
        q.Lambda(["date", "ref"], q.Get(q.Var("ref")))
      ) 
    ).then((response) => {
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
