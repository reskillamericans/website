import * as functions from "firebase-functions";

export { extractLinkedInInfo };

const extractLinkedInInfo = functions.https.onRequest((request, response) => {
    const code = request.query.code;
    const redirect_uri = request.query.redirect_uri;
    const user_id = request.query.user_id;

    functions.logger.info("Hello logs!", {structuredData: true});
    const name = request.query.name;

    if (!code || !redirect_uri || !user_id ) {
        response.status(400).send(`Missing parameter.`);
        return;
    }

    response.send(`Hello ${name}, from Firebase!`);
  });