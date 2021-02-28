/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

const page = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>DOARUN</title></head><body><h1>hi</h1></body></html>'

exports.handler = function (event, context, callback) {
  console.log('Function `oauth-complete` invoked')
  callback(null, {
    statusCode: 200,
    body: page,
  });
};
