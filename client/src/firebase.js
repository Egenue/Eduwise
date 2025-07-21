import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDgNRGu8m8vVd8hp2u-L877IEuQw2pP2a8",
    authDomain: "eduwise-962f3.firebaseapp.com",
    projectId: "eduwise-962f3",
    storageBucket: "eduwise-962f3.firebasestorage.app",
    messagingSenderId: "600806460836",
    appId: "1:600806460836:web:81cf3b9a3e614c0f13c531",
    measurementId: "G-EY2WXQ28PP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);