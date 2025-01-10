import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBMVS43aQMDdPThtoyvuoEpI_2eaN1W0eM",
  authDomain: "dashboard-santiago-limpio-auth.firebaseapp.com",
  projectId: "dashboard-santiago-limpio-auth",
  storageBucket: "dashboard-santiago-limpio-auth.firebasestorage.app",
  messagingSenderId: "196984954506",
  appId: "1:196984954506:web:2da8063c6d7f48d54bd773",
  measurementId: "G-8F74B5YTBM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
