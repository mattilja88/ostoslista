import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, onSnapshot, getDocs, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {
    firestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    onSnapshot,
    getDocs,
    doc,
    setDoc,
    getDoc,
    deleteDoc
};
