const sgMail = require('@sendgrid/mail')
const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async function(event, context) {

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'alan.nichol@gmail.com',
    from: 'alan.nichol@gmail.com',
    subject: 'Go DOARUN!',
    text: 'The weekend is about to start',
    html: 'What are you waiting for?',
  }
  return sgMail
    .send(msg)
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
