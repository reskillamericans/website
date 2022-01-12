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
};

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
                checkEnrollment(enrollmentForm);
            }
        });

        enrollmentForm.addEventListener('form-submit', async (e: CustomEventInit<Enrollment>) => {
            console.log(`Ready to submit form: ${JSON.stringify(e.detail)}`);
            if (user === null) {
                console.error("Form submitted without user authentication?");
                return;
            }

            const enrollment = e.detail!;
            enrollment.created = Timestamp.now();
            enrollment.email = user.email!;
            enrollment.uid = user.uid;
            enrollment.name = user.displayName!;

            const ref = await addDoc(collection(db, "enrollments"), enrollment);
            console.log(`Submitted enrollment: ${ref.id}`);

            // Refresh the page.
            location.reload();
        });
    }
}

async function checkEnrollment(form: HTMLFormElement) {
    const q = query(collection(db, "enrollments"),
        where("uid", "==", user?.uid),
        orderBy("created", "desc")
        );


    const querySnapshot = await getDocs(q).catch(e => {
        console.error(`Error getting enrollment: ${e}`);
    });

    if (querySnapshot && !querySnapshot.empty) {
        const enrollment = querySnapshot.docs[0].data() as Enrollment;
        console.log(`Found (${querySnapshot.size}) Enrollments: ${JSON.stringify(enrollment)}`);

        const message = document.getElementById('message-box');
        if (message) {
            message.textContent = `We received the enrollment form you submitted on ${enrollment.created.toDate().toLocaleString()}.`;
            message.style.display = 'block'
        } else {
            console.error("Page is missing mesage-box.");
        }
        form.style.display = 'none';
    } else {
        console.log("No enrollments found");
    }
}
