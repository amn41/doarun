const faunadb = require('faunadb')
const validate = require('jsonschema').validate
const getUser = require('./utils/getUser')
const q = faunadb.query


const groupSchema = { 
  "type" :"object",
  "properties": {
    "name": {"type": "string"},
    "weekly_target_km": {"type": "number"}
  },
  "required": ["name", "weekly_target_km"],
  "additionalProperties": false
}

exports.handler = async function(event, context) {

    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })  
    const data = JSON.parse(event.body)
    console.log('request to create a group', data)
    console.log(validate(data, groupSchema),validate(data, groupSchema).valid)
    if ( !validate(data, groupSchema).valid ) {
      return {
        statusCode: 400,
        body: "invalid JSON"
      }
    }

    return getUser(context)
    .then((user) => {
      console.log("fetched user, ",JSON.stringify(user))
      data.members = [ user.ref ]
      const groupItem = {
        data: data
      }
      return (client.query(q.Create(q.Ref('classes/groups'), groupItem)))
    }).then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      }
    }).catch((error) => {
       console.log('error', error)
       return {
         statusCode: 400,
         body: "bad request"
       }
    })
}
