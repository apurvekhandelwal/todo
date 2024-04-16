import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBuXBUvC0QT-Z3JkWGBb1KG96sZKa5SYF4",
    authDomain: "todoapp-76cd9.firebaseapp.com",
    projectId: "todoapp-76cd9",
    storageBucket: "todoapp-76cd9.appspot.com",
    messagingSenderId: "621143175819",
    appId: "1:621143175819:web:5c1dfec434a27bf28eda8e"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };