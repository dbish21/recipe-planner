import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAjjSAMhZPaClqeBrBqDcILfp_OPSLgek0",
    authDomain: "capstone-cc632.firebaseapp.com",
    projectId: "capstone-cc632",
    storageBucket: "capstone-cc632.firebasestorage.app",
    messagingSenderId: "130223391242",
    appId: "1:130223391242:web:41332b28f36812759fd5f3",
    measurementId: "G-XTJQLVL55V"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 