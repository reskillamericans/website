import * as functions from "firebase-functions";
import fetch from "node-fetch";
import { corsBuilder } from "./cors.js";

export {getLinkedInAuthCode};

const ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const ME_URL =
  "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)";
const EMAIL_URL =
  "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";

type LinkedInMe = {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
};

type LinkedInAuth = {
  access_token: string;
  expires_in: number;
}

const cors = corsBuilder(['https://reskill-learning.web.app', 'http://192.168.4.68:5500']);

// Keep this function simple by having all the params (except the secret)
// stored in the browser code.  So this function just adds the secret and
// forwards the request.
const requiredParams: string[] = ["grant_type", "code", "client_id", "redirect_uri"];

// Do I really want to use onCall here?  A simple REST request might have been
// easier.
const getLinkedInAuthCode = functions.https.onRequest(cors(async (request, response) => {
  const badParams = [];
  const params: { [key: string]: string } = {};
  const secret = process.env.LINKEDIN_CLIENT_SECRET;

  if (secret === undefined) {
    functions.logger.error("Missing LINKEDIN_CLIENT_SECRET environment variable");
    throw new functions.https.HttpsError('internal',
        "Missing LINKEDIN_CLIENT_SECRET environment variable");
  }

  for (const param of requiredParams) {
    if (!request.query[param]) {
      badParams.push(param);
    } else {
      // @ts-ignore - Type issue with Express request query?
      params[param] = request.query[param];
    }
  }

  if (badParams.length !== 0) {
    const message = `Missing parameter(s) in request: ${badParams.join(", ")}`;
    functions.logger.error(message);
    throw new functions.https.HttpsError('invalid-argument', message);
  }

  // Add the linkedin client secret.
  params.client_secret = secret;

  // Get code from linkedin.
  const resp = await fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString()
  });

  // Contains access_token and expires_in.
  const auth = await resp.json() as LinkedInAuth;

  // Now add in the other linkedin identity fields.
  const meResp = await fetch(ME_URL, {
    headers: {
      "Authorization": `Bearer ${auth.access_token}`
    }
  });
  const me = await meResp.json() as LinkedInMe;

  const emailResp = await fetch(EMAIL_URL, {
    headers: {
      "Authorization": `Bearer ${auth.access_token}`
    }
  });
  const email = await emailResp.json();

  // @ts-ignore
  response.json({
    ...auth,
    firstName: me.localizedFirstName,
    lastName: me.localizedLastName,
    id: me.id,
    // @ts-ignore
    email: email.elements[0]['handle~'].emailAddress
  });
}));
