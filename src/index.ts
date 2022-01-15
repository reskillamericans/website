import { signInWithEmailAndPassword, signInWithPopup, linkWithPopup,
         EmailAuthProvider, GoogleAuthProvider, GithubAuthProvider,
         sendEmailVerification,
         sendPasswordResetEmail }
    from "firebase/auth";
import type { User, AuthProvider } from "firebase/auth";
import { addDoc, collection, query, getDocs, where, orderBy, Timestamp } from "firebase/firestore";

import { carousel } from './carousel.js';

import { bindButtons } from './dom-utils.js';
import { db, auth, user } from "./setup.js";
import { linkLinkedIn, continueLinkedIn } from "./linkedin.js";

export { main, continueLinkedIn, carousel };

const googleProvider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

interface Enrollment {
    created: Timestamp;
    email: string,
    name: string,
    uid: string,
    state: string,
    education: string,
    workStatus: string,
    ethnicity: string,
    ageGroup: string,
    gender: string,
    track: string,
    timeCommitment: string
}

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

function main() {
    // const signIn = document.querySelector('#sign-in')!;
    const body = document.querySelector('body')!;
    const linkedIn = document.querySelector('#linkedin-button');
    const signInBlock = document.querySelector('#sign-in-block');
    const signOut = document.querySelector('#sign-out');
    const enrollmentForm = document.querySelector('#enrollment-form') as HTMLFormElement;
    const volunteerForm = document.querySelector('#volunteer-form') as HTMLFormElement;

    auth.onAuthStateChanged((user: User | null) => {
        if (user) {
            // signIn.textContent = 'Sign Out';
            if (signInBlock) {
                const nameSpan = document.querySelector('#signed-in-name')!;
                const emailSpan = document.querySelector('#signed-in-email')!;
                nameSpan.textContent = user.displayName;
                emailSpan.textContent = user.email;
            }
            body.setAttribute('data-signed-in', 'true');
        } else {
            body.setAttribute('data-signed-in', 'false');
            // signIn.textContent = 'Sign In';
        }
    });

    if (signOut) {
        signOut.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut();
        });
    }

    // signIn.addEventListener('click', (e) => {
    //     // Signing out
    //     if (user) {
    //         e.preventDefault();
    //         auth.signOut();
    //     }
    //     // Otherwise - go to our sign in page to
    //     // explain sign in options.
    // });

    if (linkedIn) {
        linkedIn.addEventListener('click', (e) => {
            e.preventDefault();
            linkLinkedIn();
        });
    }

    if (enrollmentForm) {
        auth.onAuthStateChanged(async (user: User | null) => {
            if (user) {
                checkUserForm(enrollmentForm, 'enrollments');
            }
        });

        enrollmentForm.addEventListener('form-submit', async (e: CustomEventInit) => {
            await submitUserForm(e.detail, "enrollments");
            // Refresh the page.
            location.reload();
        });
    }

    if (volunteerForm) {
        auth.onAuthStateChanged(async (user: User | null) => {
            if (user) {
                checkUserForm(volunteerForm, 'volunteers');
            }
        });

        volunteerForm.addEventListener('form-submit', async (e: CustomEventInit) => {
            await submitUserForm(e.detail, "volunteers");
            // Refresh the page.
            location.reload();
        });
    }
}

async function submitUserForm(
    data: Record<string, string | string[] | Timestamp>,
    collectionName: string) {

    console.log(`Ready to submit ${collection} form: ${JSON.stringify(data)}`);

    if (user === null) {
        console.error("Form submitted without user authentication?");
        throw new Error("Can't submit unauthenticated form.");
    }

    data.created = Timestamp.now();
    data.email = user.email!;
    data.uid = user.uid;
    data.name = user.displayName!;

    const ref = await addDoc(collection(db, collectionName), data);
    console.log(`Submitted at: ${ref.id}`);
}

async function checkUserForm(form: HTMLFormElement, collectionName: string) {
    const q = query(collection(db, collectionName),
        where("uid", "==", user?.uid),
        orderBy("created", "desc")
        );

    const querySnapshot = await getDocs(q).catch(e => {
        console.error(`Error getting form data: ${e}`);
    });

    if (querySnapshot && !querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as Enrollment;
        console.log(`Found (${querySnapshot.size}) Data: ${JSON.stringify(data)}`);

        const message = document.getElementById('message-box');
        if (message) {
            message.textContent = `We received the form you submitted on ${data.created.toDate().toLocaleString()}.`;
            message.style.display = 'block'
        } else {
            console.error("Page is missing message-box.");
        }
        form.style.display = 'none';
    } else {
        console.log("No form submissions found.");
    }
}
