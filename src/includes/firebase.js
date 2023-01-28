import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "music-app-7e67f.firebaseapp.com",
  projectId: "music-app-7e67f",
  storageBucket: "music-app-7e67f.appspot.com",
  appId: "1:134144614256:web:151019518e8cd42bfb79b5",
  measurementId: "G-DT4K79P6CF",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");

export { auth, db, usersCollection, songsCollection, storage };
