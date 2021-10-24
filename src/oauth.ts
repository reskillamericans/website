import { addDoc, setDoc, doc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "./setup.js";

export { OAuthParams, OAuthRequest };

const SESSION_KEY = 'oauth-linkedin-code';
const REQUEST_COLLECTION = 'oauth_requests';

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
    requestID: string | null = null;

    constructor(params: OAuthParams) {
        this.params = params;
    }

    buildURL(): string {
        let params = new URLSearchParams();
        for (let [param, value] of Object.entries(this.params.authorizationParams)) {
            params.set(param, value);
        }
        params.set('redirect_uri', `${location.protocol}//${location.host}${this.params.returnURL}`);
        params.set('scope', this.params.scopes.join(' '));
        params.set('state', this.requestID!);

        params.forEach((value, param) => console.log(`${param}: ${value}`));

        return `${this.params.authorizationURL}?${params.toString()}`;
    }

    async start() {
        // Write our request to the database, and remember the key
        // in local storage.

        const ref = await addDoc(collection(db, REQUEST_COLLECTION), {
            created: serverTimestamp(),
            type: this.params.type,
        });
        this.requestID = ref.id;
        sessionStorage.setItem(SESSION_KEY, ref.id);

        console.log(`Redirecting to ${this.buildURL()}`);
        location.href = this.buildURL();
    }

    async continue() {
        // Check out URL params to see what LinkedIn has sent us!

        const params = new URLSearchParams(location.search.slice(1));

        params.forEach((value, param) => console.log(`${param}: ${value}`));

        this.requestID = sessionStorage.getItem(SESSION_KEY);

        if (this.requestID === null) {
            console.error("Redirecting linkedin but we are not in OAuth process now");
            return;
        }

        if (this.requestID !== params.get('state')) {
            console.error("Mis-matched LinkedIn state values.");
            return;
        }

        let code = params.get('code');

        const ref = doc(db, REQUEST_COLLECTION, this.requestID);

        // This is the code we need to exchange it for a bearer token.
        // This must happen on the server, though - since we don't want
        // to reveal our client secret in the browser.
        await setDoc(ref, { code }, { merge: true });

        console.log("Wrote LinkedIn authorization code to server.");

        // Make sure not to write the code more than once.
        sessionStorage.removeItem(SESSION_KEY);
    }
}