// LinkedIn OAuth described here:
// https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow

import { OAuthParams, OAuthRequest } from "./oauth.js";

export { linkLinkedIn, continueLinkedIn };

const linkedInOAuthParams: OAuthParams = {
    type: "linkedin",
    authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
    authorizationParams: {
        response_type: 'code',
        client_id: '86mi0x9lihqp6v',
    },
    scopes: ['r_liteprofile', 'r_emailaddress'],
    returnURL: "/linkedin-signin",
    accessTokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
};

// Better way to get this - esp if we want to test with local functions impl.
const LINKEDIN_WRAPPER_URL = 'https://us-central1-reskill-learning.cloudfunctions.net/linkedIn';

function linkLinkedIn() {
    let req = new OAuthRequest(linkedInOAuthParams);
    req.start();
}

async function continueLinkedIn() {
    let req = new OAuthRequest(linkedInOAuthParams);
    const code = await req.continue();

    console.log("Calling Firebase Function");

    // These are the LinkedIn Auth params
    // @ts-ignore - TypeScript does not have proper type for args
    const authParams = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: linkedInOAuthParams.authorizationParams.client_id,
        // client_secret will be added on server pass-through
        redirect_uri: req.redirect_uri
    });

    const linkedIn = await fetch(LINKEDIN_WRAPPER_URL + '?' + authParams.toString());
    const json = await linkedIn.json();

    console.log(`Successful return from function: ${JSON.stringify(json)}`);
}
