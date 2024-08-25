// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "le-gallerie.firebaseapp.com",
  projectId: "le-gallerie",
  storageBucket: "le-gallerie.appspot.com",
  messagingSenderId: "807957578621",
  appId: "1:807957578621:web:48159df5e465565d3f0214",
  measurementId: "G-1ZKGW4LES5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
    
export const db = getFirestore()
export const storage = getStorage()