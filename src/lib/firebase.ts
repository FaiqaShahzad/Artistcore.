import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCiUCZrS14aPfAujZ-Z5A-KY6a031Hueo0",
  authDomain: "crucial-guard-z2t1j.firebaseapp.com",
  projectId: "crucial-guard-z2t1j",
  storageBucket: "crucial-guard-z2t1j.firebasestorage.app",
  messagingSenderId: "169320839843",
  appId: "1:169320839843:web:244da58f02ad53e90c1d16"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, "ai-studio-artistcorecroche-92a5b85a-05d5-46af-b619-6d68f72a9f71");
export const auth = getAuth(app);

