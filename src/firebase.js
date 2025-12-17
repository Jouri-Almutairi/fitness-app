import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHVWt1aI9OUZSGmPhHeIBIHwwyTuimH5c",
  authDomain: "fitzone-app-7a044.firebaseapp.com",
  projectId: "fitzone-app-7a044",
  storageBucket: "fitzone-app-7a044.firebasestorage.app",
  messagingSenderId: "312625451932",
  appId: "1:312625451932:web:f14a60ab28d00848536e59",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
