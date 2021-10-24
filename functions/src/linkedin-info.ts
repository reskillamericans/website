import * as functions from "firebase-functions";

export { extractLinkedInInfo };

const requiredParams: string[] = ['code', 'redirect_uri', 'user_id'];

const extractLinkedInInfo = functions.https.onRequest((request, response) => {
    let badParams = [];
    let params: {[key: string]: string} = {};

    for (let param of requiredParams) {
        if (!request.query[param]) {
            badParams.push(param);
        } else {
            // @ts-ignore - Type issue with Express request query?
            params[param] = request.query[param];
        }
    }

    if (badParams.length !== 0) {
        const message = `Missing parameter(s) in request: ${badParams.join(', ')}`;
        functions.logger.error(message);
        response.status(400).send(message);
        return;
    }

    response.send(`Well formed request.`);
  });