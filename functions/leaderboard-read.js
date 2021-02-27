/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = function (event, context, callback) {
  console.log('Function `leaderboard-read` invoked')
  const leaderboard = [
	{"name": "Alan Nichol", "points": 3},
	{"name": "Brian Daly", "points": 1},
	{"name": "Shit Muncher", "points": 0}
  ]
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(leaderboard),
  });
};
