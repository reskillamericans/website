// This file is to centralize importing the Firebase SDK

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, User } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCpNW4y3jENwllOQqAxPdImKYbUhz5VMew",
  authDomain: "reskill-learning.firebaseapp.com",
  projectId: "reskill-learning",
  storageBucket: "reskill-learning.appspot.com",
  messagingSenderId: "218617641258",
  appId: "1:218617641258:web:cc1deba78b31e3b3328653",
  measurementId: "G-R7HQTDDETY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

let user: User | null = null;

export { app, auth, db, functions, user };

auth.onAuthStateChanged((userT: User | null) => {
  user = userT;
  if (user) {
    console.log(`Current user: ${user?.email} (${user?.uid})`);
  } else {
    console.log("No current user signed in.");
  }
});
