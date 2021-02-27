/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = function (event, context, callback) {
  console.log('Function `weekly-leaderboard-read` invoked')
  const leaderboard = [
      {"name": "Alan Nichol", "distance": 15.6, "city": "Berlin"},
	{"name": "Brian Daly", "distance": 12.8, "city": "Berlin"},
	{"name": "Suzi B", "distance": 11.5, "city": "Berlin"}
  ]
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(leaderboard),
  });
};
