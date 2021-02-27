exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({"hub.challenge":event.queryStringParameters["hub.challenge"]})
    };
}
