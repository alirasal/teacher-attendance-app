// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,collection,addDoc,onSnapshot,updateDoc,doc ,deleteDoc} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwQatbCFFwxL45hcYcUk_SBrgyWkVbQkQ",
  authDomain: "attendance-d0215.firebaseapp.com",
  projectId: "attendance-d0215",
  storageBucket: "attendance-d0215.appspot.com",
  messagingSenderId: "346582512723",
  appId: "1:346582512723:web:6b0fc9c2911ca0e3e4c2a6",
  measurementId: "G-TLF384WH1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore, collection, addDoc, onSnapshot,updateDoc,doc,deleteDoc };