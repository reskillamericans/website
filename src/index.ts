import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged,
         signInWithEmailAndPassword,
         sendEmailVerification,
         sendPasswordResetEmail }
    from "firebase/auth";
import type { User } from "firebase/auth";

import { app, db, auth } from "./setup.js";

async function main() {
    try {
        const cred = await signInWithEmailAndPassword(auth, "mike@mckoss.com", "foobar");
        const user = cred.user as User;
        console.log(`User: ${user}`);
        if (!user.emailVerified) {
            await sendEmailVerification(user);
        } else {
            if (user.email !== null) {
                // await sendPasswordResetEmail(auth, user.email);
            }
        }
        const docRef = await addDoc(collection(db, "users"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815
        });
        console.log(`Document written with id: ${docRef.id}`);
    } catch (e) {
        console.log(`Error adding document: ${e}`);
    }
}

onAuthStateChanged(auth, (user) => {
    console.log(`Auth user: ${JSON.stringify(user)}`);
});

main();
