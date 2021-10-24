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

function linkLinkedIn() {
    let req = new OAuthRequest(linkedInOAuthParams);
    req.start();
}

function continueLinkedIn() {
    let req = new OAuthRequest(linkedInOAuthParams);
    req.continue();
}
