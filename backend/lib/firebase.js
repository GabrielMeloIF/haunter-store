import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaY1caYWCcmdyDPRl2GcoUQCmOSGg3OmU",
  authDomain: "hauntstore-60b85.firebaseapp.com",
  projectId: "hauntstore-60b85",
  storageBucket: "hauntstore-60b85.firebasestorage.app",
  messagingSenderId: "304813938071",
  appId: "1:304813938071:web:84974db39e7ac19b4da0d2"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);