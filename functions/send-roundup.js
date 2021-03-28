const sgMail = require('@sendgrid/mail')
const faunadb = require('faunadb')
const q = faunadb.query
const formatISO = require('date-fns/formatISO')
const startOfWeek = require('date-fns/startOfWeek')
const subHours = require('date-fns/subHours')


function computePersonalizations(activities, users) {
  //console.log("activities", JSON.stringify(activities))
  var totals = Object.fromEntries(users.data.map(function(u){ return [u.athlete.id, 0] }))
  activities.data.forEach(function(a) {
    totals[a.data.athlete.id] += a.data.distance
  })  
  var data = users.data.map(function(user) { return { to: user.email, dynamicTemplateData: { name: user.athlete.firstname, distance: Math.round(totals[user.athlete.id]/100) /10 }}} )
  console.log("data", data)
  //const partial = data.filter(function(a){ return a.to === "alan.nichol@gmail.com"})
  return data
}

exports.handler = async function(event, context) {

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  // subtract a few hours so it's still the previous week
  const startTime = formatISO(startOfWeek(subHours(new Date(), 10), {weekStartsOn: 1}))
  var users = []
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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
    ).then((activities) => {
      return Promise.all([
        activities,
        client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('all_auths'))),
            q.Lambda("X", q.Select(["data"], q.Get(q.Var("X"))))
          )
        )
      ])
    }).then(([activities, users]) => {
      console.log("users", users)
      const personalizations = computePersonalizations(activities, users)
      const winner = "GP"
      const msg = {
        personalizations: personalizations,
        from: 'alan.nichol@gmail.com',
        templateId: 'd-3dd0ed9fc1474710a3cb42e1fd01466b',
      }
      return sgMail.send(msg)
    })
    .then(() => {
      console.log('Email sent')
      return {
        statusCode: 200,
        body: "email sent!"
      }
    })
    .catch((error) => {
      console.error(error)
    })
    
}
