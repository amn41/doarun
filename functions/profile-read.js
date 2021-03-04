
exports.handler = (event, context, callback) => {
  const {identity, user} = context.clientContext;
  const data = { "identity": identity, "user": user }  
  console.log("identity", identity)
  console.log("user", user)
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(data),
  });
}
