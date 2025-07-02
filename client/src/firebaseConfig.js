import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHz-ZkBVtOde6tI0c70PONA5DSjbW4AtY",
  authDomain: "app-familia-beta.firebaseapp.com",
  projectId: "app-familia-beta",
  storageBucket: "app-familia-beta.firebasestorage.app",
  messagingSenderId: "938199526420",
  appId: "1:938199526420:web:0e0298ac7a5274146a8b01",
  measurementId: "G-S1NZBV12N5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };