// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "blogproject-221c3.firebaseapp.com",
  projectId: "blogproject-221c3",
  storageBucket: "blogproject-221c3.appspot.com",
  messagingSenderId: "335815702280",
  appId: "1:335815702280:web:1037e2541922c4ee679ebd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);