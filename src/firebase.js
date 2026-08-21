import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyCtFvP9rwGj_bOY9HqTDW3_aHxGxubUTsk",
    authDomain: "lang--app.firebaseapp.com",
    databaseURL: "https://lang--app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lang--app",
    storageBucket: "lang--app.appspot.com",
    messagingSenderId: "291050190408",
    appId: "1:291050190408:web:b2d5db1edf7a885aa3ca7d",
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
