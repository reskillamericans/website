import * as functions from "firebase-functions";
import {getLinkedInAuthCode} from "./linkedin.js";

export {
  helloWorld as hello,
  getLinkedInAuthCode as linkedIn,
};

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const name = request.query.name;

  if (!name) {
    response.status(400).send("Missing name parameter.");
    return;
  }

  response.send(`Hello ${name}, from Firebase!`);
});
