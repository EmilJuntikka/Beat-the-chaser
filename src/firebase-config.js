// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4wiiL1XZ__Ak8-6fOHPd_6B6LD_h8-18",
  authDomain: "quiz-app-898b9.firebaseapp.com",
  databaseURL: "https://quiz-app-898b9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quiz-app-898b9",
  storageBucket: "quiz-app-898b9.firebasestorage.app",
  messagingSenderId: "520315406850",
  appId: "1:520315406850:web:c47ec05c248a172fb0b51b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);