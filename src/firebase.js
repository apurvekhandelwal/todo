import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAAchVS1kt4-NlzxtsxEDXqqF2DD7lKeyw",
    authDomain: "todoapp-253d8.firebaseapp.com",
    projectId: "todoapp-253d8",
    storageBucket: "todoapp-253d8.appspot.com",
    messagingSenderId: "393993934565",
    appId: "1:393993934565:web:335c1a647b70841991e60c"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };