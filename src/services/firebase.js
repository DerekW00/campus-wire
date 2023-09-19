import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBQuajsrx45sb5okKF0UHDF7wSE6wwD4BM",
  authDomain: "cs160-final-project-394603.firebaseapp.com",
  databaseURL: "https://cs160-final-project-394603-default-rtdb.firebaseio.com",
  projectId: "cs160-final-project-394603",
  storageBucket: "cs160-final-project-394603.appspot.com",
  messagingSenderId: "194794314914",
  appId: "1:194794314914:web:30d5e27cbd235e2639cbfb",
  measurementId: "G-0S04MEYWK3",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const database = getDatabase(app);

export { auth, database };


// source: https://css-tricks.com/user-registration-authentication-firebase-react/