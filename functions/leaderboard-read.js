/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `leaderboard-read` invoked')
    return [
	{"name": "Alan Nichol", "points": 3},
	{"name": "Brian Daly", "points": 1},
	{"name": "Shit Muncher", "points": 0}
    ]
}
