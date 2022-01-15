import { addDoc, setDoc, doc, collection, serverTimestamp } from "firebase/firestore";

import { generateId } from './util.js';

export { OAuthParams, OAuthRequest };

const SESSION_KEY = 'oauth-linkedin-code';
const REQUEST_COLLECTION = 'oauth_requests';

// Linkedin OAuth sequence:
// https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
// 1. User clicks "Sign In" button
// 2. User is redirected to LinkedIn's authorization page
//    Request includes our appid (client_id), and state (to ensure redirection
//    comes from a real request we just made.
// 3. LinkedIn redirects to returnURL with code and state in URL params.
//    Confirm state matches our stored state - otherwise this is a falsified request.
// 4. We exchange the code for an access token.
//    This is  done in a firebase function "linkedIn".  We pass it our
//    code, and it adds client_secret to the request and forwards to /oauth/v2/accessToken.
// 5. LinkedIn sends us a user profile

type OAuthParams = {
    type: string,
    authorizationURL: string,
    authorizationParams: {
        client_id: string,
        [extra: string]: string
    },
    scopes: string[],
    returnURL: string,
    accessTokenURL: string
};

class OAuthRequest {
    params: OAuthParams;
    requestID: string;
    redirect_uri: string;

    constructor(params: OAuthParams) {
        this.params = params;
        this.requestID = generateId(8);
        this.redirect_uri = `${location.protocol}//${location.host}${this.params.returnURL}`;
    }

    buildURL(): string {
        let params = new URLSearchParams();
        for (let [param, value] of Object.entries(this.params.authorizationParams)) {
            params.set(param, value);
        }
        params.set('redirect_uri', this.redirect_uri);
        params.set('scope', this.params.scopes.join(' '));
        params.set('state', this.requestID!);

        return `${this.params.authorizationURL}?${params.toString()}`;
    }

    async start() {
        sessionStorage.setItem(SESSION_KEY, this.requestID);

        location.href = this.buildURL();
    }

    async continue(): Promise<string | undefined> {
        // Check out URL params to see what LinkedIn has sent us!

        const params = new URLSearchParams(location.search.slice(1));

        this.requestID = sessionStorage.getItem(SESSION_KEY)!;

        if (this.requestID === null) {
            console.error("Redirecting linkedin but we are not in OAuth process now");
            return;
        }

        if (this.requestID !== params.get('state')) {
            console.error("Mis-matched LinkedIn state values.");
            return;
        }

        let code = params.get('code')!;

        sessionStorage.removeItem(SESSION_KEY);

        return code;
    }
}