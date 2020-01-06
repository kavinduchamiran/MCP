import firebase from 'firebase/app';

const firebaseCredentials = require("./firebase-credentials.json");


export const app = firebase.initializeApp(firebaseCredentials);
