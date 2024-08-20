// Import the functions you need from the SDKs needed
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration and initialise connection
const app = firebase.initializeApp ({
  apiKey: process.env.REACT_APP_PROD_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_PROD_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROD_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_PROD_FIREBASE_APP_ID
});

const firestore = app.firestore();

const database = {
  usersRef: firestore.collection('user'),
  loginRef: firestore.collection('loginData'),
  bookingRef: firestore.collection('venueBooking'),
  customLayoutRef:firestore.collection('customLayout'),
};

const auth = getAuth(app);
const storage = getStorage(app)

export {database, app, auth, storage};