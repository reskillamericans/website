import { signInWithEmailAndPassword, signInWithPopup, linkWithPopup,
         EmailAuthProvider, GoogleAuthProvider, GithubAuthProvider,
         sendEmailVerification,
         sendPasswordResetEmail }
    from "firebase/auth";
import type { User, AuthProvider } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { carousel } from './carousel.js';

import { bindButtons } from './dom-utils.js';
import { db, auth } from "./setup.js";
import { linkLinkedIn, continueLinkedIn } from "./linkedin.js";

export { main, continueLinkedIn, carousel };

const googleProvider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

async function signInWith(provider: AuthProvider) {
    try {
        const user = (await signInWithPopup(auth, provider)).user;
        console.log(`User: ${user}`);
        if (!user.emailVerified) {
            await sendEmailVerification(user);
        }
        const docRef = await addDoc(collection(db, "users"), {
            uid: user.uid,
            email: user.email
        });
        console.log(`Document written with id: ${docRef.id}`);
    } catch (e) {
        console.log(`Error adding document: ${e}`);
    }
}

async function linkWith(provider: AuthProvider) {
    try {
        const user = (await linkWithPopup(auth.currentUser as User, provider)).user;
        console.log(`Account linked to ${provider.providerId}`);
    } catch (e) {
        console.log(`Error linking user to provider ${provider.providerId}: ${e}`);
    }
}

const authButtonHandlers: Map<string, () => void> = new Map([
    ['sign-in-google', () => signInWith(googleProvider)],
    // ['sign-in-email', () => signInWith(emailProvider)],
    ['link-to-github', () => linkWith(githubProvider)],
    ['sign-out', () => auth.signOut()],
    ['reset-password', () => sendPasswordResetEmail(auth, auth.currentUser!.email!)],
    ['link-to-linkedin', linkLinkedIn],
]);

function main() {
    bindButtons(authButtonHandlers);
}
